"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? "opacity-0" : "opacity-100"}>{text}</span>
      {isGlitching && (
        <>
          <motion.span
            className="absolute left-0 top-0 text-cyan-400"
            animate={{ x: [-1, 1, 0], y: [0, -1, 0] }}
            transition={{ duration: 0.2, repeat: 2 }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute left-0 top-0 text-fuchsia-400"
            animate={{ x: [1, -1, 0], y: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: 2 }}
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}
