import { apiClient, attachAuthAdapter, wireRefresh } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';

export const setupApiInterceptors = () => {
  apiClient.defaults.baseURL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  apiClient.defaults.headers.common['x-client-platform'] = 'mobile';

  attachAuthAdapter(mobileTokenAdapter);
  wireRefresh('body');
};
