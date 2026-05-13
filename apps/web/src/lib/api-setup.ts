import { apiClient, attachAuthAdapter } from '@repo/api-client';
import { webTokenAdapter } from '../adapters/webTokenAdapter';

export const setupWebApi = () => {
  apiClient.defaults.baseURL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Register the web adapter so the interceptors in client.ts can:
  //   1. attach Authorization headers from cookie storage on every request
  //   2. update the access_token cookie after a silent refresh
  //   3. navigate to /login on hard logout (refresh token expired / revoked)
  attachAuthAdapter(webTokenAdapter);
};
