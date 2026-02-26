'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { authLogoutCreate, usersMeRetrieve, User } from '@/api/generated';
import '@/lib/axiosInterceptor';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tokens: { access: string; refresh: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Helper to set cookie (for middleware to read)
function setAuthCookie(token: string | null) {
  if (token) {
    document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } else {
    document.cookie = 'access_token=; path=/; max-age=0';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setAuthCookie(null); // Clear any stale cookie left over from a previous session
        setIsLoading(false);
        return;
      }

      try {
        const user = await usersMeRetrieve();
        setAuthCookie(token); // Restore cookie so middleware allows protected routes
        setUser(user);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthCookie(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (tokens: { access: string; refresh: string }) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setAuthCookie(tokens.access);

    const user = await usersMeRetrieve();
    setUser(user);
  };

  const logout = async () => {
    try {
      await authLogoutCreate();
    } catch {
      // Continue with logout even if API call fails
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthCookie(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
