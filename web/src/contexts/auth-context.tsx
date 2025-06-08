'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios-instance';

interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  isOnboarder: boolean;
  username: string;
  handle: string;
  bio: string;
  friends: User[];
}

type User = AuthUser;

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data.user);
        return response.data;
      } catch (error) {
        setUser(null);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        refetch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
