"use client";

import { motion } from "motion/react";
import { Cpu } from "lucide-react";

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showText?: boolean;
}

export function LoadingIndicator({
  size = "md",
  text = "LOADING",
  showText = true,
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm`}
        ></div>
        <div
          className={`relative ${sizeClasses[size]} rounded-full bg-black border border-cyan-500 flex items-center justify-center`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="5"
                strokeDasharray="70 180"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#00FFFF" />
                  <stop offset="100%" stopColor="#FF00FF" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <Cpu className={`h-1/2 w-1/2 text-cyan-400`} />
        </div>
      </div>
      {showText && (
        <p className="mt-2 text-xs text-cyan-400 font-mono">{text}</p>
      )}
    </div>
  );
}
