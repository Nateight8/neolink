"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Search, Zap, RefreshCw } from "lucide-react";

interface EmptyAlliesStateProps {
  reason: "no-results" | "all-added" | "no-data";
  onClearSearch?: () => void;
}

export function EmptyAlliesState({
  reason,
  onClearSearch,
}: EmptyAlliesStateProps) {
  const [glitchText, setGlitchText] = useState(false);

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Get content based on reason
  const getContent = () => {
    switch (reason) {
      case "no-results":
        return {
          title: "NO NEURAL MATCHES FOUND",
          description:
            "Your search parameters did not match any available neural networks.",
          icon: <Search className="h-12 w-12 text-cyan-400" />,
          buttonText: "CLEAR SEARCH PARAMETERS",
          buttonAction: onClearSearch,
        };
      case "all-added":
        return {
          title: "NEURAL NETWORK COMPLETE",
          description:
            "You have connected with all available allies. Your network is at maximum capacity.",
          icon: <Zap className="h-12 w-12 text-fuchsia-400" />,
          buttonText: "SCAN FOR NEW ALLIES",
          buttonAction: () => window.location.reload(),
        };
      case "no-data":
        return {
          title: "NEURAL VOID DETECTED",
          description:
            "No potential allies found in the neural network. The system may be offline or under maintenance.",
          icon: <RefreshCw className="h-12 w-12 text-cyan-400" />,
          buttonText: "REINITIALIZE SCAN",
          buttonAction: () => window.location.reload(),
        };
    }
  };

  const content = getContent();

  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-6">
      <motion.div
        className="w-24 h-24 rounded-full bg-black/50 border border-cyan-900 flex items-center justify-center mb-6"
        animate={glitchText ? { x: [-2, 2, -2, 0], y: [1, -1, 1, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        {content.icon}
      </motion.div>

      <div className="relative">
        <motion.h2
          className="text-2xl font-bold text-white mb-3"
          animate={glitchText ? { x: [-2, 2, -2, 0] } : {}}
          transition={{ duration: 0.2 }}
        >
          {content.title}
        </motion.h2>
        {glitchText && (
          <>
            <motion.h2
              className="absolute top-0 left-0 text-2xl font-bold text-cyan-400 mb-3 opacity-70"
              animate={{ x: [2, -2, 2, 0] }}
              transition={{ duration: 0.2 }}
            >
              {content.title}
            </motion.h2>
            <motion.h2
              className="absolute top-0 left-0 text-2xl font-bold text-fuchsia-400 mb-3 opacity-70"
              animate={{ x: [-2, 2, -2, 0] }}
              transition={{ duration: 0.2 }}
            >
              {content.title}
            </motion.h2>
          </>
        )}
      </div>

      <p className="text-gray-400 max-w-md mb-8">{content.description}</p>

      <div className="w-full max-w-xs h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_15px_rgba(0,255,255,0.7)] animate-pulse"></div>

      <Button
        onClick={content.buttonAction}
        className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
      >
        {content.buttonText}
      </Button>

      {/* Decorative elements */}
      <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-xs mx-auto opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
            style={{
              opacity: 0.3 + Math.random() * 0.7,
              width: `${50 + Math.random() * 50}%`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
