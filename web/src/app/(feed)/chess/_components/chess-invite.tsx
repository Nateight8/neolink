"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface ChessInviteProps {
  gameId: string;
  timeControl: string;
  rated: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export default function ChessInvite({
  // gameId,
  timeControl,
  rated,
  onClick,
  disabled = false,
}: ChessInviteProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 p-0 rounded-full bg-black hover:bg-black/80 border-2 border-fuchsia-500 group relative"
              onClick={onClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={disabled}
            >
              <Avatar className="w-full h-full border-0">
                <AvatarFallback className="bg-transparent text-3xl font-bold text-fuchsia-400 group-hover:text-fuchsia-300 relative">
                  <span className={isHovered ? "glitch" : ""}>?</span>
                </AvatarFallback>
              </Avatar>
              {/* Glitch border effect */}
              <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/50 glitch-border"></div>
            </Button>
          </TooltipTrigger>
          <TooltipContent variant="production">
            <div className="space-y-1">
              <p className="font-bold">Accept Challenge</p>
              <p className="text-sm text-gray-400">
                {timeControl} • {rated ? "Rated" : "Casual"}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <style jsx>{`
        .glitch {
          position: relative;
          animation: glitch 0.5s infinite;
        }

        .glitch::before,
        .glitch::after {
          content: "?";
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        .glitch::before {
          animation: glitch-left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both
            infinite;
          color: #0ff;
          left: -2px;
        }

        .glitch::after {
          animation: glitch-right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            reverse both infinite;
          color: #f0f;
          left: 2px;
        }

        @keyframes glitch-left {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes glitch-right {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(2px, -2px);
          }
          40% {
            transform: translate(2px, 2px);
          }
          60% {
            transform: translate(-2px, -2px);
          }
          80% {
            transform: translate(-2px, 2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .glitch-border {
          opacity: 0;
          transition: opacity 0.2s;
        }

        :hover .glitch-border {
          opacity: 1;
          animation: border-glitch 1s infinite;
        }

        @keyframes border-glitch {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          25% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 0.5;
          }
          75% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
