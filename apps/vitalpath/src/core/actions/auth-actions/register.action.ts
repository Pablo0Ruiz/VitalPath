import { myApi } from '../../api/myApi';
import type { userCredentials } from '@/src/context/AuthContext';
import type { RegisterFormValues } from '@/src/interfaces/auth';

export const postRegister = async (
  credentials: RegisterFormValues,
): Promise<userCredentials> => {
  const [day, month, year] = credentials.fechaNacimiento.split('/');
  const formattedDate = `${month}/${day}/${year}`;

  const payload = {
    ...credentials,
    fechaNacimiento: formattedDate,
  };
  const { data } = await myApi.post<userCredentials>(
    '/api/auth/register',
    payload,
  );
  return data;
};
