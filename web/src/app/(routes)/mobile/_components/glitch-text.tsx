"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number;
}

export function GlitchText({
  text,
  className,
  glitchInterval = 0,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (glitchInterval <= 0) return;

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, glitchInterval);

    return () => clearInterval(interval);
  }, [glitchInterval]);

  return (
    <span
      className={cn(
        className,
        isGlitching && "animate-[glitch_0.2s_ease_forwards]"
      )}
    >
      {text}
    </span>
  );
}
