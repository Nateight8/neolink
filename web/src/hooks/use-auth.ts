// hooks/useAuthUser.ts
import { axiosInstance } from "@/lib/axios-instance";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  isOnboarder: boolean;
}

interface AuthResponse {
  user: AuthUser;
}

export function useAuthUser() {
  const queryClient = useQueryClient();

  const query = useQuery<AuthResponse>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // optional: cache for 5 mins
    retry: false, // optional: disable retry if unauthenticated
  });

  const cachedUser = queryClient.getQueryData<AuthResponse>(["authUser"]);

  return {
    user: query.data?.user ?? cachedUser?.user,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
