import { apiClient } from '../client';
import type { StatsSummary } from '@repo/types';

export const getStatsSummary = async (): Promise<StatsSummary> => {
  const { data } = await apiClient.get<StatsSummary>('/api/stats/summary');
  return data;
};
