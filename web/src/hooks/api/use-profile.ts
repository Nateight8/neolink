import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { User } from "@/contexts/auth-context";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import type { Post } from "@/types/chat";

export interface Achievement {
  name: string;
  icon: string;
  color: "cyan" | "fuchsia";
}

export interface Stats {
  posts: number;
  allies: number;
  power: number;
}

export interface ProfileResponse {
  user: User;
  stats: Stats;
  achievements: Achievement[];
  allies: User[];
  posts: Post[];
}

export interface ProfileError {
  message: string;
  status: number;
}

export interface ProfileEditInput {
  handle: string;
  bio: string;
}

/**
 * Hook to fetch a user's profile data
 * @param username - The username of the profile to fetch
 * @returns Query result with profile data and strongly typed error
 */
export function useProfile(
  username: string | undefined
): UseQueryResult<ProfileResponse, AxiosError<ProfileError>> {
  return useQuery<ProfileResponse, AxiosError<ProfileError>>({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const { data } = await axiosInstance.get<ProfileResponse>(
        `/profiles/${username}`
      );
      return data;
    },
    enabled: !!username,
  });
}

export function useProfileEdit(): UseMutationResult<
  ProfileResponse,
  AxiosError<ProfileError>,
  ProfileEditInput
> {
  return useMutation<
    ProfileResponse,
    AxiosError<ProfileError>,
    ProfileEditInput
  >({
    mutationFn: async (input) => {
      const { data } = await axiosInstance.patch("/profiles/me", input);
      return data;
    },
  });
}
