import { useMutation } from '@tanstack/react-query';
import { sendVoiceChat } from '../actions/ai.actions';

export const useVoiceChat = () => {
  return useMutation({
    mutationFn: (formData: FormData) => sendVoiceChat(formData),
  });
};
