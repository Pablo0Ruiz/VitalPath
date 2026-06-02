import React from 'react';
import { useVersionCheck } from '@/src/hooks/useVersionCheck';
import { ForceUpdateScreen } from '../ForceUpdateScreen';

interface VersionGateProps {
  children: React.ReactNode;
}

export function VersionGate({ children }: VersionGateProps) {
  const { isBlocked, isLoading } = useVersionCheck();

  if (isLoading) return null;

  if (isBlocked) return <ForceUpdateScreen />;

  return <>{children}</>;
}
