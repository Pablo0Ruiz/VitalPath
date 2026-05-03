import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../actions/ai.actions';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
};
