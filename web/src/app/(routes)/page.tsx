"use client";
import FeedClient from "@/components/feed/client";
import Loader from "@/components/loader";
import { useAuthUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import UsernameOnboardingPage from "./(auth)/username/page";

export default function Home() {
  const { user, isLoading } = useAuthUser();
  const router = useRouter();

  console.log("User data:", user);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    router.push("/login");
  }

  if (user && !user.isOnboarder) {
    return <UsernameOnboardingPage />;
  }

  return <FeedClient />;
}
