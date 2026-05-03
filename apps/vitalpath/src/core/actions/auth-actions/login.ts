import { myApi } from '../../api/myApi';
import { userCredentials } from '@/src/context/AuthContext';
import { LoginFormValues } from '@/src/interfaces/auth';

const postLogin = async (
  credentials: LoginFormValues,
): Promise<userCredentials> => {
  const { data } = await myApi.post<userCredentials>(
    '/api/auth/login',
    credentials,
  );
  return data;
};

export default postLogin;
