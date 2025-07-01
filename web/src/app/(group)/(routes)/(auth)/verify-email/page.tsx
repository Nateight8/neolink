"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OtpInput from "../init-sequence/_components/otp-input";
import { LoadingScreen } from "@/components/loading-screen";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const sessionId = searchParams.get("sessionId");

  // Redirect if no sessionId is provided
  useEffect(() => {
    if (!sessionId) {
      router.push("/init-sequence");
    }
  }, [sessionId, router]);

  const handleSuccess = () => {
    if (!sessionId) {
      console.error("No sessionId available for redirect");
      router.push("/password");
      return;
    }
    router.push(`/password?sessionId=${encodeURIComponent(sessionId)}`);
  };

  if (!sessionId) {
    return <LoadingScreen />; // Show loading while redirecting
  }

  return (
    <>
      <>
        <OtpInput
          email={email || ""}
          sessionId={sessionId || ""}
          onSuccess={handleSuccess}
        />
      </>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
