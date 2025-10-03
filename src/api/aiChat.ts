
import { apiClient } from './client';

/**
 * Fetches the user's entire chat history with the AI.
 */
export const getAIChatHistory = () => {
  return apiClient.get('/ai/chat/history');
};

/**
 * Sends a message from the user to the AI and gets the response.
 * @param message The user's message.
 */
export const sendAIMessage = (message: string) => {
  return apiClient.post('/ai/chat/send', { message });
};
