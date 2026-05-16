import { apiClient } from '../client';

export interface CreateMoodPayload {
  mood: string;
  date: string;
}

export interface MoodRecord {
  _id: string;
  userId: string;
  mood: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const postMood = async (
  payload: CreateMoodPayload,
): Promise<MoodRecord> => {
  const { data } = await apiClient.post<MoodRecord>('/api/mood', payload);
  return data;
};
