import { apiClient, attachAuthAdapter, wireRefresh } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';

export const setupApiInterceptors = () => {
  apiClient.defaults.baseURL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  // Tell the server this is a native mobile client so login/register
  // responses include the refresh token in the body instead of a cookie.
  apiClient.defaults.headers.common['x-client-platform'] = 'mobile';

  // Register the mobile adapter — enables the request interceptor to
  // attach Authorization headers and the refresh interceptor to
  // read/write tokens from SecureStore.
  attachAuthAdapter(mobileTokenAdapter);

  // Register the body-based refresh interceptor for mobile.
  // This wires both apiClient and aiApi with the /auth/refresh-mobile flow.
  wireRefresh('body');
};
