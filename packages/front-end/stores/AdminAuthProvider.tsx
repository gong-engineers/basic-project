'use client';

import { useEffect } from 'react';
import { useAuthStore } from './authStore';
import { useRouter } from 'next/navigation';

export default function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const role = useAuthStore((state) => state.user?.role);

  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized && role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isInitialized, role, router]);

  if (!isInitialized) {
    return <></>;
  }

  return <>{children}</>;
}
