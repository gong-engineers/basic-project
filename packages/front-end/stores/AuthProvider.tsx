'use client';

import { useEffect } from 'react';
import { useAuthStore } from './authStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isInitialized) {
    return <></>;
  }

  return <>{children}</>;
}
