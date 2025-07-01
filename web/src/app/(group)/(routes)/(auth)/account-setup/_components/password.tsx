"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  error?: string;
  isLoading?: boolean;
  showConfirmPassword?: boolean;
}

export default function Password({
  value,
  onChange,
  onNext,
  error,
  isLoading = false,
  showConfirmPassword = true,
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPasswordState, setShowConfirmPasswordState] =
    useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Include at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Include at least one number";
    if (!/[^A-Za-z0-9]/.test(password))
      return "Include at least one special character";
    return "";
  };

  const passwordError = validatePassword(value);
  const passwordsMatch = !showConfirmPassword || value === confirmPassword;
  const confirmPasswordError =
    showConfirmPassword && !passwordsMatch ? "Passwords do not match" : "";
  const isDisabled =
    !!passwordError ||
    (showConfirmPassword && (!confirmPassword || !passwordsMatch)) ||
    isLoading;

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">
          SECURE_ACCESS.SYS
        </h2>
        <p className="text-gray-400 text-sm">
          Create a strong password to protect your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-cyan-400">PASSWORD</label>
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-cyan-500" />
              <Input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "bg-black border-cyan-900 text-white font-mono pl-10 pr-10 relative focus-visible:ring-cyan-500",
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
                onKeyDown={(e) => e.key === "Enter" && !isDisabled && onNext()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {showConfirmPassword && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyan-400">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-cyan-500" />
                <Input
                  type={showConfirmPasswordState ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "bg-black border-cyan-900 text-white font-mono pl-10 pr-10 relative focus-visible:ring-cyan-500",
                    confirmPasswordError &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !isDisabled && onNext()
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPasswordState(!showConfirmPasswordState)
                  }
                  className="absolute right-3 text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label={
                    showConfirmPasswordState ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPasswordState ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {confirmPasswordError && (
              <div className="p-2 bg-amber-900/20 border border-amber-700/50 rounded-sm text-amber-400 text-xs font-mono">
                <div className="flex items-start">
                  <Terminal className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>{confirmPasswordError}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-sm text-red-400 text-sm font-mono flex items-start">
            <Terminal className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {passwordError && value && (
          <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-sm text-amber-400 text-xs font-mono">
            <div className="flex items-start">
              <Terminal className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          </div>
        )}

        <div className="pt-2 w-full relative group">
          <div className="relative h-3 w-full bg-gray-900 border border-cyan-900/50 mb-4 overflow-hidden">
            {/* Base glow layer */}
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                background: `linear-gradient(
                  90deg,
                  rgba(239, 68, 68, 0.2) 0%,
                  rgba(234, 179, 8, 0.2) 50%,
                  rgba(34, 197, 94, 0.2) 100%
                )`,
                filter: `blur(${value.length > 0 ? "4px" : "0px"})`,
                opacity: value.length > 0 ? 1 : 0.5,
              }}
            />

            {/* Main progress bar */}
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400",
                value.length === 0 && "w-0",
                value.length > 0 && value.length < 4 && "w-1/4",
                value.length >= 4 && value.length < 8 && "w-1/2",
                value.length >= 8 && value.length < 12 && "w-3/4",
                value.length >= 12 && "w-full"
              )}
              style={{
                width:
                  value.length > 0
                    ? `${Math.min(100, (value.length / 16) * 100)}%`
                    : "2px",
                boxShadow:
                  value.length > 0
                    ? `0 0 ${Math.min(20, value.length * 2)}px ${
                        value.length < 4
                          ? "rgba(34, 211, 238, 0.7)"
                          : value.length < 8
                          ? "rgba(217, 70, 239, 0.7)"
                          : "rgba(34, 211, 238, 0.7)"
                      }`
                    : "none",
                clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Scanline effect */}
              <div
                className="absolute inset-0 bg-white mix-blend-overlay opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "100% 3px",
                  animation: "scan 1.5s linear infinite",
                }}
              />
            </div>

            {/* Glitch effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  animation: "glitch 0.5s infinite",
                  filter: "blur(1px)",
                }}
              />
            </div>
          </div>

          {/* Strength indicator text */}
          <div className="flex justify-between text-xs font-mono mt-1 px-1">
            <span
              className={`transition-colors ${
                value.length < 4 ? "text-cyan-400" : "text-gray-500"
              }`}
            >
              WEAK
            </span>
            <span
              className={`transition-colors ${
                value.length >= 4 && value.length < 8
                  ? "text-fuchsia-500"
                  : "text-gray-500"
              }`}
            >
              MEDIUM
            </span>
            <span
              className={`transition-colors ${
                value.length >= 8 && value.length < 12
                  ? "text-cyan-400"
                  : "text-gray-500"
              }`}
            >
              STRONG
            </span>
            <span
              className={`transition-colors ${
                value.length >= 12 ? "text-cyan-400" : "text-gray-500"
              }`}
            >
              CYBER
            </span>
          </div>

          {/* Keyframes for animations */}
          <style jsx global>{`
            @keyframes scan {
              from {
                transform: translateY(-100%);
              }
              to {
                transform: translateY(100%);
              }
            }
            @keyframes glitch {
              0% {
                transform: translateX(-2px);
              }
              25% {
                transform: translateX(0);
              }
              50% {
                transform: translateX(2px);
              }
              75% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-2px);
              }
            }
          `}</style>

          <Button
            onClick={onNext}
            disabled={isDisabled}
            className={cn(
              "w-full rounded-sm font-mono tracking-wider transition-all duration-300",
              "bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500",
              "text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                SECURING...
              </div>
            ) : (
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                {value ? "SECURE_ACCOUNT" : "SET_PASSWORD"}
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
