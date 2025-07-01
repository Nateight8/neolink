"use client";

import { useEffect, useRef, useState } from "react";
import { OTPInput, SlotProps } from "input-otp";
import { Terminal, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios-instance";

interface OtpInputProps {
  email: string;
  sessionId: string;
  onSuccess: () => void;
  onResendCode?: () => Promise<void>;
}

export default function OtpInput({
  email,
  sessionId,
  onSuccess,
  onResendCode,
}: OtpInputProps) {
  const [value, setValue] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVerified) {
      onSuccess();
    }
  }, [isVerified, onSuccess]);

  const verifyOTP = async (otp: string) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axiosInstance.post("/auth/verify-otp", {
        sessionId,
        otp,
      });

      const data = await response.data;

      if (response.status !== 200) {
        throw new Error(data.message || "Verification failed");
      }

      setIsVerified(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid or expired verification code";
      setError(errorMessage);
      setValue("");
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (otp: string) => {
    if (otp.length === 4) {
      verifyOTP(otp);
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    try {
      setIsResending(true);
      if (onResendCode) {
        await onResendCode();
      }
    } catch (error) {
      console.error("Failed to resend code:", error);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-black text-white">
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        {/* Neon header */}
        <div className="w-full max-w-md h-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_15px_rgba(0,255,255,0.7)] animate-pulse"></div>

        {/* OTP card */}
        <div className="w-full max-w-md bg-black border border-cyan-900 rounded-sm p-6 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

          {/* Animated circuit lines in background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-cyan-400 mb-2 font-mono tracking-wide">
                VERIFICATION_REQUIRED
              </h1>
              <p className="text-gray-400 text-sm">
                Code sent to: <span className="text-cyan-300">{email}</span>
              </p>
            </div>

            <div className={cn("space-y-6")}>
              <div className="flex justify-center">
                <OTPInput
                  id="confirmation-code"
                  ref={inputRef}
                  value={value}
                  onChange={setValue}
                  containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                  maxLength={4}
                  onFocus={() => setIsVerified(false)}
                  render={({ slots }) => (
                    <div className="flex gap-3">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  )}
                  onComplete={onSubmit}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-sm text-red-400 text-sm font-mono flex items-center">
                  <Terminal className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={() => onSubmit(value)}
                  disabled={isLoading || value.length !== 4}
                  className={cn(
                    "w-full py-3 px-4 rounded-sm font-mono tracking-wider",
                    "bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500",
                    "text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center",
                    "transition-all duration-200"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      VERIFYING...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      VERIFY IDENTITY
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-mono hover-glitch disabled:opacity-50 inline-flex items-center"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1.5" />
                        RESEND CODE
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "bg-black border border-cyan-700 text-white flex size-12 items-center justify-center font-mono text-xl transition-all duration-200",
        {
          "border-cyan-400 bg-cyan-950/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]":
            props.isActive,
          "border-cyan-900": !props.isActive,
          "animate-pulse": props.isActive && !props.char,
        }
      )}
    >
      {props.char !== null ? (
        <div className="text-cyan-400">{props.char}</div>
      ) : (
        <div className="w-1 h-1 bg-cyan-900 rounded-full"></div>
      )}
    </div>
  );
}
