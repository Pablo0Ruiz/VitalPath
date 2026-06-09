import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useVersionCheck } from '@/src/hooks/useVersionCheck';
import { ForceUpdateScreen } from '../ForceUpdateScreen';

interface VersionGateProps {
  children: React.ReactNode;
  onResolved?: () => void;
}

export function VersionGate({ children, onResolved }: VersionGateProps) {
  const { isBlocked, isLoading } = useVersionCheck();

  useEffect(() => {
    if (!isLoading) onResolved?.();
  }, [isLoading, onResolved]);

  if (isLoading) {
    return (
      <View
        testID="version-gate-loading"
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (isBlocked) return <ForceUpdateScreen />;

  return <>{children}</>;
}
