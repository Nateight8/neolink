"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useMutation } from "@tanstack/react-query";
import Password from "../account-setup/_components/password";
import { axiosInstance } from "@/lib/axios-instance";
import { LoadingScreen } from "@/components/loading-screen";
import { toast } from "sonner";

function PasswordSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  const [password, setPassword] = useState("");

  const { refetch: refetchAuth } = useAuth();

  const {
    mutate: setupPassword,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (password: string) => {
      if (!sessionId) {
        throw new Error("No session ID");
      }
      const response = await axiosInstance.post(
        "/auth/password",
        { password, sessionId },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: async () => {
      try {
        // Invalidate and refetch the auth state
        await refetchAuth();
        toast.success("Password set successfully!");
        router.push("/account-setup");
      } catch (err) {
        console.error("Failed to update auth state:", err);
        toast.error("Password set, but there was an issue updating your session");
        router.push("/login");
      }
    },
    onError: (error: unknown) => {
      console.error("Password setup error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          router.push("/login");
        }
      }
    },
  });

  // Check session on component mount
  useEffect(() => {
    if (!sessionId) {
      toast.error("Invalid or expired setup link");
      router.push("/login");
    }
  }, [sessionId, router]);

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleSubmit = () => {
    if (!sessionId) {
      router.push("/account-setup");
      return;
    }
    setupPassword(password);
  };

  if (!sessionId || isPending) {
    return <LoadingScreen />;
  }

  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : error
      ? "Failed to set password"
      : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-black border border-cyan-900 rounded-sm p-6 relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Set Your Password
          </h2>
          <p className="text-gray-400">
            Create a secure password for your account
          </p>
        </div>

        <Password
          value={password}
          onChange={handlePasswordChange}
          onNext={handleSubmit}
          error={errorMessage}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}

export default function PasswordSetupPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PasswordSetupContent />
    </Suspense>
  );
}
