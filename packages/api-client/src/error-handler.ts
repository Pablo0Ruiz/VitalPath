export interface ApiError {
  message: string;
  statusCode?: number;
}

export function handleApiError(
  error: unknown,
  onError?: (e: ApiError) => void,
): void {
  const apiError = normalizeError(error);
  onError?.(apiError);
}

function normalizeError(error: unknown): ApiError {
  const axiosLike = error as {
    response?: { status?: number; data?: unknown };
  };

  if (axiosLike?.response !== undefined) {
    const status = axiosLike.response.status;
    const data = axiosLike.response.data;

    if (typeof data === 'string') {
      return { message: data, statusCode: status };
    }

    if (data && typeof data === 'object') {
      const dataObj = data as { message?: unknown };
      const msg =
        typeof dataObj.message === 'string'
          ? dataObj.message
          : 'Unexpected error';
      return { message: msg, statusCode: status };
    }

    return { message: 'Unexpected error', statusCode: status };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Unexpected error' };
}
