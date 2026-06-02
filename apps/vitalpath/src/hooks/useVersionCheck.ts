import Constants from 'expo-constants';
import { useVersionCheck as useVersionCheckQuery } from '@repo/api-client';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export function useVersionCheck() {
  return useVersionCheckQuery(appVersion);
}
