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

  useEffect(() => {
    // Only run redirect checks after auth is loaded
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && (!user.handle || !user.username)) {
        router.push("/account-setup");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If missing required profile info, we'll be redirected by the effect
  if (!user?.handle || !user?.username) {
    return router.push("/account-setup");
  }

  // Show Allies component only if user hasn't seen suggestions
  if (!user.hasSeenSuggestions) {
    return <AlliesRecommendation />;
  }

  return <FeedClient />;
}
