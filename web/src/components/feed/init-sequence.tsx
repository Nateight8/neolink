"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Gamepad2, Shield } from "lucide-react";

export default function InitSequence() {
  const [avatarHover, setAvatarHover] = useState(false);
  const [shifuHover, setShifuHover] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const [chessHover, setChessHover] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center py-12 px-4 relative">
      {/* Neon grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 32px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 32px)",
        }}
      />

      {/* Floating Hexagon Avatar with ? */}
      <div className="relative z-10 flex flex-col items-center mb-10 mt-2">
        <div
          className={`relative flex items-center justify-center avatar-float ${
            avatarHover ? "avatar-hover-glow" : ""
          }`}
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
        >
          <div className="absolute w-24 h-24 bg-cyan-400/30 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-cyan-500 clip-hexagon shadow-lg avatar-border-glow" />
            <div className="absolute inset-1 bg-black clip-hexagon" />
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full clip-hexagon">
              <span className="text-cyan-200 font-mono text-4xl font-bold select-none avatar-qmark-glow">
                ?
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INIT SEQUENCE Section */}
      <div className="z-10 w-full flex flex-col items-center mb-10">
        <span className="text-cyan-300 font-mono font-bold text-2xl tracking-wide text-center mb-6 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
          INIT SEQUENCE
        </span>
        <Button
          className={`w-full max-w-xs py-4 text-lg font-mono font-bold rounded-lg border-2 border-cyan-400 text-cyan-200 bg-black/70 hover:bg-cyan-950/30 shadow-cyan-500/30 shadow-md transition-all duration-200 ${
            loginHover ? "btn-hover-glow" : ""
          }`}
          onMouseEnter={() => setLoginHover(true)}
          onMouseLeave={() => setLoginHover(false)}
        >
          LOG IN
        </Button>
      </div>

      {/* Separator */}
      <div className="z-10 w-full flex items-center justify-center mb-10">
        <div className="flex items-center w-full gap-3">
          <span className="flex-1 h-px bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-fuchsia-500 opacity-60" />
          <span className="px-2 text-cyan-300 font-mono font-bold text-lg tracking-widest text-center select-none">
            OR
          </span>
          <span className="flex-1 h-px bg-gradient-to-l from-cyan-500 via-fuchsia-500 to-fuchsia-500 opacity-60" />
        </div>
      </div>

      {/* PLAY CHESS WITH MASTER SHIFU Section */}
      <div className="z-10 w-full flex flex-col items-center mb-10">
        <span className="text-fuchsia-300 font-mono font-bold text-2xl tracking-wide text-center mb-6 drop-shadow-[0_0_12px_rgba(232,121,249,0.7)]">
          PLAY CHESS WITH MASTER SHIFU
        </span>
        {/* Shifu's Avatar */}
        <div
          className={`relative flex flex-col items-center mb-4 avatar-float ${
            shifuHover ? "avatar-hover-glow" : ""
          }`}
          onMouseEnter={() => setShifuHover(true)}
          onMouseLeave={() => setShifuHover(false)}
        >
          <div className="absolute w-24 h-24 bg-fuchsia-400/30 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-cyan-500 clip-hexagon shadow-lg avatar-border-glow" />
            <div className="absolute inset-1 bg-black clip-hexagon" />
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full clip-hexagon">
              <Crown className="w-8 h-8 text-amber-300 mb-1" />
              <span className="text-cyan-200 font-mono text-xl font-bold">
                MS
              </span>
            </div>
          </div>
        </div>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-white font-bold text-xl tracking-wide">
              MASTER SHIFU
            </span>
            <Shield className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-cyan-400 font-mono text-base">@master_shifu</div>
        </div>
        <Button
          className={`w-full max-w-xs py-4 text-lg font-mono font-bold rounded-lg border-2 border-fuchsia-400 text-fuchsia-200 bg-black/70 hover:bg-fuchsia-950/30 shadow-fuchsia-500/30 shadow-md transition-all duration-200 ${
            chessHover ? "btn-hover-glow-fuchsia" : ""
          }`}
          onMouseEnter={() => setChessHover(true)}
          onMouseLeave={() => setChessHover(false)}
        >
          <Gamepad2 className="w-5 h-5 mr-2" /> PLAY CHESS
        </Button>
      </div>

      <style jsx>{`
        .clip-hexagon {
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
        }
        .avatar-float {
          animation: floatAvatar 3.5s ease-in-out infinite alternate;
        }
        @keyframes floatAvatar {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-12px);
          }
        }
        .avatar-border-glow {
          animation: borderGlow 2.2s infinite alternate;
        }
        @keyframes borderGlow {
          0% {
            opacity: 1;
            filter: drop-shadow(0 0 8px #67e8f9) drop-shadow(0 0 2px #e879f9);
          }
          100% {
            opacity: 0.8;
            filter: drop-shadow(0 0 16px #e879f9) drop-shadow(0 0 8px #67e8f9);
          }
        }
        .avatar-qmark-glow {
          text-shadow: 0 0 12px #67e8f9, 0 0 8px #e879f9;
        }
        .avatar-hover-glow {
          filter: drop-shadow(0 0 24px #67e8f9) drop-shadow(0 0 16px #e879f9);
          transition: filter 0.2s;
        }
        .btn-hover-glow {
          box-shadow: 0 0 24px #67e8f9, 0 0 12px #e879f9;
        }
        .btn-hover-glow-fuchsia {
          box-shadow: 0 0 24px #e879f9, 0 0 12px #67e8f9;
        }
      `}</style>
    </div>
  );
}
