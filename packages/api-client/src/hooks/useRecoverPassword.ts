import { useMutation } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import {
  postRecoverPassword,
  RecoverPasswordResponse,
} from '../actions/auth.actions';

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
