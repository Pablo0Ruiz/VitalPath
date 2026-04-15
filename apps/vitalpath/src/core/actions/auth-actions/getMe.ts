import { myApi } from '../../api/myApi';
import type { UserSession } from '@/src/context/AuthContext';

export const getMe = async (): Promise<UserSession> => {
  const { data } = await myApi.get<UserSession>('/api/user/me');
  return data;
};
