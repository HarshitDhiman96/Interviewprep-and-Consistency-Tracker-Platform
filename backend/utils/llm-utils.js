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

async function generateWithGroq(history) {
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

    messages.unshift({
        role: "system",
        content: COACH_SYSTEM_INSTRUCTION
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

async function generateWithGemini(history) {
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
                systemInstruction:
                    COACH_SYSTEM_INSTRUCTION
            }
        });


    return response.text;
}



// =====================================================
// FALLBACK
// =====================================================

async function generateLLMResponse(history) {

    // ===============================
    // 1. GROQ PRIMARY
    // ===============================

    try {

        console.log("Trying Groq...");


        const response =
            await generateWithGroq(history);


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
            await generateWithGemini(history);


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
    summarizeConversationWithGroq
};