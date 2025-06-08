"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";

interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  isOnboarder: boolean;
  username: string;
  handle: string;
  bio: string;
  avatar?: string;
  friends?: User[];
  rating?: number;
  level?: number;
  title?: string;
  status?: "online" | "offline" | "playing";
  xp?: number;
  maxXp?: number;
}

type User = AuthUser;

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  const fetchUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data.user;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return null;
    }
  }, []);

  const { 
    data: userData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<AuthUser | null, Error>({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true,
    initialData: null
  });

  // Update user state when query data changes
  useEffect(() => {
    if (userData !== undefined) {
      setUser(userData);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [userData, isInitialized]);

  // Handle query errors and initial loading
  useEffect(() => {
    if (isError && !isInitialized) {
      setUser(null);
      setIsInitialized(true);
    }
  }, [isError, isInitialized]);

  // Initial data loading
  useEffect(() => {
    if (!isInitialized) {
      refetch().catch(console.error);
    }
  }, [isInitialized, refetch]);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      // Clear all queries except for the auth user query
      queryClient.removeQueries({ queryKey: ["authUser"] });
      queryClient.clear();
      // Force a hard refresh to ensure all states are reset
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [queryClient]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoading: !isInitialized || isLoading,
    isError,
    isAuthenticated: !!user,
    refetch: async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
        return userData;
      } catch (err) {
        console.error("Failed to refetch user:", err);
        setUser(null);
        return null;
      }
    },
    logout,
  }), [user, isInitialized, isLoading, isError, fetchUser, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
