import { useMutation } from '@tanstack/react-query';
import { postMood, type CreateMoodPayload } from '../actions/mood.actions';

export const useMoodCheckIn = () => {
  return useMutation({
    mutationFn: (payload: CreateMoodPayload) => postMood(payload),
  });
};
