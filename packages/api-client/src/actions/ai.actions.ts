import { apiClient } from '../client';

export type SendVoiceChatResponse = {
  transcript: string;
  replyText: string;
};

export const sendVoiceChat = async (
  formData: FormData,
): Promise<SendVoiceChatResponse> => {
  const { data } = await apiClient.post<SendVoiceChatResponse>(
    '/api/ai/voice-chat',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

export type ChatHistoryResponse = {
  role: 'user' | 'model';
  parts: string;
}[];

export const getChatHistory = async (
  chatId: string,
): Promise<ChatHistoryResponse> => {
  const { data } = await apiClient.get<ChatHistoryResponse>(
    `/api/ai/chat-history/${chatId}`,
  );
  return data;
};

export type Conversation = {
  chatId: string;
  title: string;
  lastMessage?: string;
  updatedAt: string;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await apiClient.get<Conversation[]>('/api/ai/conversations');
  return data;
};
