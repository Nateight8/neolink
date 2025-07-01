"use client";
import AccountSetup from "./_components/account-setup";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return router.push("/login");
  }

  if (user.username && user.handle) {
    return router.push("/");
  }

  // Only render the AccountSetup component if we're sure the user is authenticated and needs setup
  return <AccountSetup />;
}
