import { apiClient } from '../client';
import type { UserSession } from '@repo/types';

export const patchMe = async (
  data: Partial<UserSession>,
): Promise<UserSession> => {
  const { data: responseData } = await apiClient.patch<UserSession>(
    '/api/user/me',
    data,
  );
  return responseData;
};
