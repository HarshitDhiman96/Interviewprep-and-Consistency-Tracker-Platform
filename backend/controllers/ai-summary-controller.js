const ChatModel = require("../models/AI-Chat-model");
const { summarizeConversationWithGroq } = require("../utils/llm-utils");

const summarizeConversation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const conversationId = req.body?.conversationId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required." });
    }

    console.log("[AI Coach] summarizeConversation called with:", { conversationId });

    const conversation = await ChatModel.findOne({
      conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const previousSummary = conversation.summary || "";
    const history = conversation.fullChat || [];

    if (!history.length) {
      return res.status(200).json({
        message: "No conversation content to summarize.",
        summary: previousSummary,
        summaryGenerated: false,
      });
    }

    const summaryText = await summarizeConversationWithGroq(history, previousSummary);

    conversation.summary = summaryText || previousSummary;
    conversation.lastSummarizedMessageCount = history.length;
    conversation.isSummaryGenerated = true;
    await conversation.save();

    console.log("[AI Coach] Summary response:", summaryText);

    return res.status(200).json({
      message: "Conversation summarized successfully.",
      summary: conversation.summary,
      summaryGenerated: true,
      conversationId: conversation.conversationId,
    });
  } catch (error) {
    console.error("[AI Coach] Summary failed:", error.message);
    return res.status(500).json({ message: "Failed to summarize conversation.", error: error.message });
  }
};

module.exports = { summarizeConversation };
