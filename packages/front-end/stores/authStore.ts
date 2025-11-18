import { client } from '@/lib/api';
import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: number;
  email: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  login: async (credentials: LoginDto) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken } = await client.post<
        LoginDto,
        { accessToken: string }
      >(`${API_URL}/auth/login`, credentials);
      localStorage.setItem('accessToken', accessToken);
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await response.json();
      set({ user });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await client.post(`${API_URL}/auth/logout`, {});
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isLoading: false });
    }
  },
  initializeAuth: async () => {
    if (localStorage.getItem('accessToken') === null) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response: User = await client.get(`${API_URL}/auth/me`);
      set({ user: response });
    } catch {
      localStorage.removeItem('accessToken');
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },
}));
