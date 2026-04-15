import { myApi } from '../../api/myApi';
import type { userCredentials } from '@/src/context/AuthContext';
import type { RegisterFormValues } from '@/src/interfaces/auth';

export const postRegister = async (
  credentials: RegisterFormValues,
): Promise<userCredentials> => {
  const { data } = await myApi.post<userCredentials>(
    '/api/auth/register',
    credentials,
  );
  return data;
};
