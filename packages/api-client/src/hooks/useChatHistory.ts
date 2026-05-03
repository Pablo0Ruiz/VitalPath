import { useQuery } from '@tanstack/react-query';
import { getChatHistory } from '../actions/ai.actions';

export const useChatHistory = (chatId: string) => {
  return useQuery({
    queryKey: ['chat-history', chatId],
    queryFn: () => getChatHistory(chatId),
    enabled: !!chatId,
  });
};
