import { apiClient } from '../client';

export interface VersionCheckResponse {
  status: 'ok' | 'blocked';
  minVersion: string;
  message?: string;
}

export const checkAppVersion = async (
  version: string,
): Promise<VersionCheckResponse> => {
  const { data } = await apiClient.get<VersionCheckResponse>(
    '/api/health/version-check',
    { params: { version } },
  );
  return data;
};
