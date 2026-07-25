const express = require('express')
const authmiddleware=require('../middleware/auth-middleware')
const {aiChatbotController}=require('../controllers/AI-Chatbot-controller')
const {summarizeConversation}=require('../controllers/ai-summary-controller')

const AIchatbot = express.Router();

AIchatbot.post('/chatbot', authmiddleware, aiChatbotController);
AIchatbot.post('/chatbot/summary', authmiddleware, summarizeConversation);

module.exports = AIchatbot;