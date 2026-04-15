import { AxiosResponse } from 'axios';
import { myApi } from '../../api/myApi';

export interface RecoverPasswordResponse {
  message: string;
}

const postRecoverPassword = async (
  email: string,
): Promise<AxiosResponse<RecoverPasswordResponse>> => {
  const response = await myApi.post<RecoverPasswordResponse>(
    '/api/auth/recover-password',
    { email },
  );
  return response;
};

export default postRecoverPassword;
