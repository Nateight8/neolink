"use client";
import FeedClient from "@/components/feed/client";

import { useAuthUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import UsernameOnboarding from "./(auth)/username/page";
import AlliesRecommendation from "@/components/alies/alies";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const { user, isLoading } = useAuthUser();
  const router = useRouter();

  const { data: onboardingStatus } = useQuery({
    queryKey: ["onboardStatus"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/status");
      return response.data;
    },
    enabled: !!user, // Only run if user exists
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    router.push("/login");
  }

  if (user && !user.isOnboarder) {
    return <UsernameOnboarding />;
  }

  // Show Allies component only if user has no friends and no pending requests
  if (user?.friends?.length === 0 && onboardingStatus?.pendingRequests === 0) {
    return <AlliesRecommendation />;
  }

  return <FeedClient />;
}
