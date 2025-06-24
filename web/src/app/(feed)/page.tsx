"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LoadingScreen } from "@/components/loading-screen";
import AlliesRecommendation from "@/components/alies/alies";
import FeedClient from "@/components/feed/client";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect to account setup if missing required profile info
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user &&
      (!user.handle || !user.username)
    ) {
      router.replace("/account-setup");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Prevent rendering if redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  if (!user.handle || !user.username) {
    return null;
  }

  if (!user.hasSeenSuggestions) {
    return <AlliesRecommendation />;
  }

  return <FeedClient />;
}
