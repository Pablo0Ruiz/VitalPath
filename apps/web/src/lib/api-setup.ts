import { apiClient, attachAuthAdapter, wireRefresh } from '@repo/api-client';
import { webTokenAdapter } from '../adapters/webTokenAdapter';

export const setupWebApi = () => {
  apiClient.defaults.baseURL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  attachAuthAdapter(webTokenAdapter);
  wireRefresh('cookie');
};
