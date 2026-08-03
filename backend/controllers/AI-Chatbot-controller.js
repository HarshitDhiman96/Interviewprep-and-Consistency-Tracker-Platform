const ChatModel = require("../models/AI-Chat-model");
const EmbedModel = require("../models/embed-model");
const { generateLLMResponse, generateSummaryEmbeddingWithGroq, findRelevantMemories } = require("../utils/llm-utils");

const aiChatbotController = async (req, res) => {

    try {

        const userMessage =req.body?.message || req.body?.userProblem;

        const conversationId = req.body?.conversationId;

        if (!userMessage) {
            return res.status(400).json({
                message: "Please provide a message."
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized user."
            });
        }

        let conversation;

        if (conversationId) {
            conversation = await ChatModel.findOne({
                conversationId: conversationId,
                userId: userId
            });

            if (!conversation) {
                return res.status(404).json({
                    message: "Conversation not found."
                });
            }
        } else {
            conversation = await ChatModel.create({
                userId: userId,
                fullChat: []
            });
        }

        conversation.fullChat.push({
            role: "user",
            text: userMessage
        });

        let memoryContext = "";

        try {
            const queryEmbedding = await generateSummaryEmbeddingWithGroq(userMessage);
            const memories = await EmbedModel.find({ userId })
                .sort({ createdAt: -1 })
                .limit(20)
                .lean();
                console.log("[AI Coach] Retrieved memories:", memories.length);

            const relevantMemories = findRelevantMemories(queryEmbedding, memories, 3);

            if (relevantMemories.length) {
                memoryContext = relevantMemories
                    .map((memory) => `- ${memory.summary}`)
                    .join("\n");
            }
        } catch (memoryError) {
            console.warn("[AI Coach] Memory retrieval failed:", memoryError.message);
        }

        const result = await generateLLMResponse(conversation.fullChat, memoryContext);
        const modelReply = result?.text || "I could not generate a response.";

        conversation.fullChat.push({
            role: "model",
            text: modelReply
        });

        conversation.lastActivityAt = new Date();

        await conversation.save();

        return res.status(200).json({
            message: modelReply,
            conversationId: conversation.conversationId || conversation._id,
            provider: result.provider,
            history: conversation.fullChat,
            summary: conversation.summary || "",
            summaryGenerated: Boolean(conversation.isSummaryGenerated)
        });

    } catch (error) {
        console.error(
            "AI chatbot controller error:",
            error
        );
        return res.status(500).json({
            message: "Failed to process chatbot request.",
            error: error.message
        });
    }
};

module.exports = { aiChatbotController };