import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import postRecoverPassword, {
  RecoverPasswordResponse,
} from '../../core/actions/auth-actions/post-recover-password.action';

export const useRecoverPassword = () => {
  const { mutateAsync, isPending, isError, error } = useMutation<
    AxiosResponse<RecoverPasswordResponse>,
    AxiosError,
    string
  >({
    mutationFn: (email: string) => postRecoverPassword(email),
  });

  return { mutateAsync, isPending, isError, error };
};
