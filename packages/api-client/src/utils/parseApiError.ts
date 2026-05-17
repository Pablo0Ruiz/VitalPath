export interface ApiError {
  status: number;
  message: string;
}

export function parseApiError(error: unknown): ApiError {
  const err = error as {
    response?: { status?: number; data?: { message?: string } };
  };
  return {
    status: err?.response?.status ?? 500,
    message: err?.response?.data?.message ?? 'Error inesperado',
  };
}
