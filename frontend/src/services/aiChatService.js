import apiClient from './axiosConfig';

export const sendCoachMessage = async ({ message, conversationId }) => {
  const response = await apiClient.post('/api/AI/chatbot', {
    message,
    conversationId,
  });

  return response.data;
};

export const summarizeCoachConversation = async ({ conversationId }) => {
//   console.log('[AI Coach] summarizeCoachConversation called with:', { conversationId });

  const response = await apiClient.post('/api/AI/chatbot/summary', {
    conversationId,
  });

//   console.log('[AI Coach] summarizeCoachConversation response:', response?.data);

  return response.data;
};
