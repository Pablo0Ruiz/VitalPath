import { apiClient, getTokenAdapter } from './client';

export class SessionExpiredError extends Error {
  override name = 'SessionExpiredError';

  constructor(message = 'Session expired') {
    super(message);
  }
}

export async function refreshTokens(): Promise<string> {
  const adapter = getTokenAdapter();

  if (!adapter) {
    throw new SessionExpiredError('No token adapter registered');
  }

  const refreshToken = await adapter.getRefreshToken();

  if (!refreshToken) {
    throw new SessionExpiredError('No refresh token available');
  }

  const { data } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>('/api/auth/refresh-mobile', { refreshToken });

  await adapter.setToken(data.accessToken);
  await adapter.setRefreshToken(data.refreshToken);

  return data.accessToken;
}
