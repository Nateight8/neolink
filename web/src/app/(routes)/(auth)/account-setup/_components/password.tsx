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
  showConfirmPassword = true
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPasswordState, setShowConfirmPasswordState] = useState(false);
  
  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Include at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Include at least one number";
    if (!/[^A-Za-z0-9]/.test(password)) return "Include at least one special character";
    return "";
  };

  const passwordError = validatePassword(value);
  const passwordsMatch = !showConfirmPassword || value === confirmPassword;
  const confirmPasswordError = showConfirmPassword && !passwordsMatch ? 'Passwords do not match' : '';
  const isDisabled = !!passwordError || (showConfirmPassword && (!confirmPassword || !passwordsMatch)) || isLoading;

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
                onKeyDown={(e) => e.key === 'Enter' && !isDisabled && onNext()}
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
            <label className="text-xs font-mono text-cyan-400">CONFIRM PASSWORD</label>
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
                    confirmPasswordError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  onKeyDown={(e) => e.key === 'Enter' && !isDisabled && onNext()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPasswordState(!showConfirmPasswordState)}
                  className="absolute right-3 text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label={showConfirmPasswordState ? "Hide password" : "Show password"}
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

        <div className="pt-2">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  value.length >= i * 2 ? 
                    i <= 2 ? "bg-red-500" : 
                    i <= 3 ? "bg-amber-500" : "bg-green-500" : 
                    "bg-gray-800"
                )}
              />
            ))}
          </div>
          
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
