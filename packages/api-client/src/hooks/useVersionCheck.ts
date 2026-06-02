import { useQuery } from '@tanstack/react-query';
import { checkAppVersion } from '../actions/health.actions';
import { healthKeys } from '../queryKeys';

export const useVersionCheck = (appVersion: string) => {
  const { data, isLoading } = useQuery({
    queryKey: healthKeys.versionCheck(appVersion),
    queryFn: () => checkAppVersion(appVersion),
    staleTime: Infinity,
    retry: false,
  });

  return {
    isBlocked: data?.status === 'blocked',
    isLoading,
    minVersion: data?.minVersion ?? null,
  };
};
