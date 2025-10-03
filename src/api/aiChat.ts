import { apiClient } from './client';

// Based on AI_CHATBOT_API.md
export interface AIMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  _id?: string; // This field should be handled on the backend and not sent to the Gemini API
}

export interface GetHistoryResponse {
  data: {
    history: AIMessage[];
  }
}

export interface SendMessagePayload {
  message: string;
}

export interface SendMessageResponse {
  data: {
    response: AIMessage;
  }
}

/**
 * Retrieves the user's entire chat history.
 * @returns {Promise<GetHistoryResponse>} A promise that resolves to the chat history.
 */
export const getAIChatHistory = (): Promise<GetHistoryResponse> => {
  return apiClient.get('/ai/chat/history');
};

/**
 * Sends a new message to the chatbot and gets a response.
 * @param {string} content The message content to send.
 * @returns {Promise<SendMessageResponse>} A promise that resolves to the AI's response.
 */
export const sendAIMessage = (content: string): Promise<SendMessageResponse> => {
  const payload: SendMessagePayload = { message: content };
  return apiClient.post('/ai/chat/send', payload);
};
