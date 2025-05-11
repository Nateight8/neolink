"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

export function NeonButton({
  children,
  onClick,
  active = false,
  className,
}: NeonButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "relative rounded-sm font-mono",
        active
          ? "text-cyan-400 hover:text-cyan-300"
          : "text-gray-400 hover:text-gray-300",
        className
      )}
    >
      {active && (
        <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full shadow-[0_0_5px_rgba(0,255,255,0.7)]"></div>
      )}
      {children}
    </Button>
  );
}
