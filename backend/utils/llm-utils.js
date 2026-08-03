const Groq = require("groq-sdk");
const { GoogleGenAI } = require("@google/genai");


const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;


const gemini = process.env.GOOGLE_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
    : null;


const COACH_SYSTEM_INSTRUCTION =
    "You are a personalized AI coach for Computer Science students. Reply helpfully and naturally to the user's questions, especially around motivation, study consistency, weak topics, and coding practice. If the user feels stuck or demotivated, offer supportive guidance and a practical next step. Keep explanations concise and focused on the core concept."

const SUMMARY_SYSTEM_INSTRUCTION =
   `You are the long-term memory summarizer for Apex, an AI Personalized Coach.

Your job is NOT to summarize the conversation generally.

Your job is to extract and maintain useful information ABOUT THE USER that could help personalize future coaching.

PRIORITY ORDER:

1. User struggles, weaknesses, confusion, and blockers
2. User's current progress and skill level
3. User goals and motivations
4. What the user has already tried or practiced
5. User plans and intended next steps
6. Important decisions or changes in their approach
7. User preferences and constraints
8. Assistant recommendations ONLY when the user explicitly accepts them or they become part of the user's plan

IMPORTANT:
The user's messages are the primary source of memory.

Do NOT turn generic assistant advice into user memory.

Instead, preserve what is actually known about the user.

BAD SUMMARY:
"Practice recursion problems. Focus on base cases and tree traversals."

GOOD SUMMARY:
"User struggles with implementing recursion independently despite understanding recursion trees. They have practiced the subset problem 5-6 times but tend to forget the implementation after a few days. Their main difficulty is translating recursion-tree logic into code. They want to strengthen recursion before advanced DSA topics such as trees and graphs."

STATE CHANGES:
When previous memory is provided, update the user's state.
If older memory says the user struggles with recursion trees and newer conversation says they now understand recursion trees but still struggle to code them, reflect that updated state.

FILTER OUT:
- Greetings
- Casual filler
- Repeated information
- Generic explanations from the assistant
- Generic recommendations that the user did not accept
- Information with no future personalization value

The final memory should answer questions such as:
- What is the user working on?
- What are they struggling with?
- What have they improved at?
- What have they already tried?
- What are their goals?
- What do they plan to do next?
- What context would help the coach respond better next time?

Write one concise, information-dense paragraph optimized for semantic/vector retrieval.
Return ONLY the memory summary.`

function createFallbackEmbedding(text) {
    const normalized = String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .trim();

    const tokens = normalized.split(/\s+/).filter(Boolean);

    if (!tokens.length) {
        return Array.from({ length: 32 }, () => 0);
    }

    return Array.from({ length: 32 }, (_, index) => {
        let sum = 0;

        for (const token of tokens) {
            const charCodeSum = token
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0);

            sum += ((charCodeSum + index + 1) % 11) / 11;
        }

        return Number((sum / tokens.length).toFixed(6));
    });
}

function cosineSimilarity(leftEmbedding, rightEmbedding) {
    if (!Array.isArray(leftEmbedding) || !Array.isArray(rightEmbedding)) {
        return 0;
    }

    const length = Math.min(leftEmbedding.length, rightEmbedding.length);

    if (!length) {
        return 0;
    }

    let dotProduct = 0;
    let leftNorm = 0;
    let rightNorm = 0;

    for (let index = 0; index < length; index += 1) {
        const leftValue = Number(leftEmbedding[index]) || 0;
        const rightValue = Number(rightEmbedding[index]) || 0;

        dotProduct += leftValue * rightValue;
        leftNorm += leftValue * leftValue;
        rightNorm += rightValue * rightValue;
    }

    if (!leftNorm || !rightNorm) {
        return 0;
    }

    return dotProduct / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function findRelevantMemories(queryEmbedding, memories, limit = 3) {
    if (!Array.isArray(memories) || !memories.length) {
        return [];
    }

    return memories
        .map((memory) => ({
            ...memory,
            score: cosineSimilarity(queryEmbedding, memory.embedding || [])
        }))
        .filter((memory) => memory.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, limit)
        .map(({ summary, score }) => ({ summary, score }));
}

async function generateSummaryEmbeddingWithGroq(summaryText) {
    if (!groq) {
        console.warn("[AI Coach] GROQ_API_KEY is not configured; using fallback embedding.");
        return createFallbackEmbedding(summaryText);
    }

    const text = String(summaryText || "").trim();

    if (!text) {
        return [];
    }

    const models = ["text-embedding-3-small", "text-embedding-3-large"];
    let lastError = null;

    for (const model of models) {
        try {
            const response = await groq.embeddings.create({
                model,
                input: text
            });

            const embedding = response?.data?.[0]?.embedding;

            if (Array.isArray(embedding) && embedding.length) {
                return embedding;
            }

            throw new Error(`Empty embedding returned for model ${model}`);
        } catch (error) {
            lastError = error;
            console.warn(`[AI Coach] Groq embedding attempt failed for ${model}:`, error.message);
        }
    }

    console.warn("[AI Coach] Falling back to deterministic summary embedding.");
    return createFallbackEmbedding(text);
}

async function summarizeConversationWithGroq(history, previousSummary = "") {
    if (!groq) {
        throw new Error("GROQ_API_KEY is not configured.");
    }

    const conversationText = (history || [])
        .map((message) => `${message.role}: ${message.text || ""}`)
        .join("\n");

    const prompt = [
        "Create a personalized memory summary for future coaching. Focus on the user's struggles, behavior, progress, goals, and recurring patterns. Update the previous memory instead of repeating stale details.",
        previousSummary ? `Previous summary: ${previousSummary}` : null,
        `Conversation:\n${conversationText}`
    ].filter(Boolean).join("\n\n");

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: SUMMARY_SYSTEM_INSTRUCTION
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return completion.choices[0].message.content;
}


// =====================================================
// GROQ
// =====================================================

async function generateWithGroq(history, memoryContext = "") {
    if (!groq) {
        throw new Error("GROQ_API_KEY is not configured.");
    }

    // Convert our MongoDB format → Groq format

    const messages = history.map((message) => ({
        role:
            message.role === "model"
                ? "assistant"
                : "user",

        content: String(message.text || "")
    }));


    // Add system instruction at beginning

    const systemInstruction = memoryContext
        ? `${COACH_SYSTEM_INSTRUCTION}\n\nRelevant memory from earlier conversations:\n${memoryContext}`
        : COACH_SYSTEM_INSTRUCTION;

    messages.unshift({
        role: "system",
        content: systemInstruction
    });


    console.log(
        "Sending to Groq:",
        JSON.stringify(messages, null, 2)
    );


    const completion =
        await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: messages
        });


    return completion.choices[0].message.content;
}



// =====================================================
// GEMINI
// =====================================================

async function generateWithGemini(history, memoryContext = "") {
    if (!gemini) {
        throw new Error("GOOGLE_API_KEY is not configured.");
    }

    // Convert our MongoDB format → Gemini format

    const contents = history.map((message) => ({

        role: message.role,

        parts: [
            {
                text: String(message.text || "")
            }
        ]
    }));


    const response =
        await gemini.models.generateContent({

            model: "gemini-2.5-flash",

            contents: contents,

            config: {
                systemInstruction: memoryContext
                    ? `${COACH_SYSTEM_INSTRUCTION}\n\nRelevant memory from earlier conversations:\n${memoryContext}`
                    : COACH_SYSTEM_INSTRUCTION
            }
        });


    return response.text;
}



// =====================================================
// FALLBACK
// =====================================================

async function generateLLMResponse(history, memoryContext = "") {

    // ===============================
    // 1. GROQ PRIMARY
    // ===============================

    try {

        console.log("Trying Groq...");


        const response =
            await generateWithGroq(history, memoryContext);


        console.log(
            "Groq response successful"
        );


        return {
            text: response,
            provider: "groq"
        };


    } catch (groqError) {

        const status =
            groqError.status ||
            groqError.statusCode;


        console.error(
            `Groq failed with status: ${status}`
        );

        console.error(
            groqError.message
        );


        // Only fallback when provider is
        // temporarily unavailable / quota exceeded

        if (
            status !== 429 &&
            status !== 500 &&
            status !== 502 &&
            status !== 503
        ) {

            throw groqError;
        }
    }



    // ===============================
    // 2. GEMINI FALLBACK
    // ===============================

    try {

        console.log(
            "Switching to Gemini..."
        );


        const response =
            await generateWithGemini(history, memoryContext);


        console.log(
            "Gemini response successful"
        );


        return {
            text: response,
            provider: "gemini"
        };


    } catch (geminiError) {

        console.error(
            "Gemini also failed:",
            geminiError.message
        );


        throw new Error(
            "All LLM providers are currently unavailable."
        );
    }
}


module.exports = {
    generateLLMResponse,
    summarizeConversationWithGroq,
    generateSummaryEmbeddingWithGroq,
    findRelevantMemories
};