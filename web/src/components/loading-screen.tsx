"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Zap, Shield, Cpu, Radio } from "lucide-react";
import { GlitchText } from "@/components/feed/glitch-text";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  showProgress?: boolean;
}

export function LoadingScreen({
  message = "INITIALIZING NEURAL INTERFACE",
  fullScreen = true,
  showProgress = true,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("ESTABLISHING CONNECTION");
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);

  const icons = useMemo(() => [
    <Brain key="brain" className="h-full w-full text-cyan-400" />,
    <Zap key="zap" className="h-full w-full text-fuchsia-400" />,
    <Shield key="shield" className="h-full w-full text-cyan-400" />,
    <Cpu key="cpu" className="h-full w-full text-fuchsia-400" />,
    <Radio key="radio" className="h-full w-full text-cyan-400" />,
  ], []);

  const statusMessages = useMemo(() => [
    "ESTABLISHING CONNECTION",
    "SCANNING NEURAL PATHWAYS",
    "SYNCHRONIZING DATA STREAMS",
    "CALIBRATING NEURAL INTERFACE",
    "OPTIMIZING BANDWIDTH",
    "ENCRYPTING NEURAL LINK",
    "LOADING CYBERNETIC ASSETS",
    "INITIALIZING GRID ACCESS",
  ], []);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 5 + 1;
        const newProgress = Math.min(prev + increment, 100);

        // If we're done loading, clear the interval
        if (newProgress >= 100) {
          clearInterval(interval);
        }

        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Cycle through status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusText(
        statusMessages[Math.floor(Math.random() * statusMessages.length)]
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [statusMessages]);

  // Cycle through icons
  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [icons]);

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div
      className={`bg-black flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[300px]"
      }`}
    >
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
        {/* Neural network animation */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-sm animate-pulse"></div>
          <div className="relative h-32 w-32 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center overflow-hidden">
            {/* Neural network nodes and connections */}
            <div className="absolute inset-0">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                className="absolute inset-0"
              >
                <g className="nodes">
                  {[...Array(12)].map((_, i) => {
                    const x = 15 + Math.random() * 70;
                    const y = 15 + Math.random() * 70;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={1 + Math.random() * 2}
                        fill={i % 2 === 0 ? "#00FFFF" : "#FF00FF"}
                        className="animate-pulse"
                        style={{
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      />
                    );
                  })}
                </g>
                <g className="connections">
                  {[...Array(15)].map((_, i) => {
                    const x1 = 10 + Math.random() * 80;
                    const y1 = 10 + Math.random() * 80;
                    const x2 = 10 + Math.random() * 80;
                    const y2 = 10 + Math.random() * 80;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={i % 2 === 0 ? "#00FFFF" : "#FF00FF"}
                        strokeWidth="0.5"
                        strokeOpacity="0.6"
                        className="animate-pulse"
                        style={{
                          animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Central icon */}
            <AnimatePresence mode="wait">
              <motion.div
                key={iconIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 h-12 w-12"
              >
                {icons[iconIndex]}
              </motion.div>
            </AnimatePresence>

            {/* Scan lines */}
            <div className="absolute inset-0 scan-lines pointer-events-none"></div>
          </div>
        </div>

        {/* Loading message */}
        <div className="relative mb-6">
          <GlitchText
            text={message}
            className="text-2xl font-bold text-cyan-400 text-center"
          />
        </div>

        {/* Status text */}
        <div
          className={`text-sm text-fuchsia-400 font-mono mb-6 text-center ${
            glitchEffect ? "animate-[glitch_0.2s_ease_forwards]" : ""
          }`}
        >
          {statusText}
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="w-full max-w-xs mb-8">
            <div className="relative h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500 font-mono">
                NEURAL SYNC: {Math.round(progress)}%
              </span>
              <span className="text-xs text-cyan-400 font-mono">
                {Math.round(progress) >= 100 ? "COMPLETE" : "IN PROGRESS"}
              </span>
            </div>
          </div>
        )}

        {/* Digital noise animation */}
        <div className="digital-noise absolute inset-0 opacity-10 pointer-events-none"></div>

        {/* Loading dots */}
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <div
            className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Terminal-like footer text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-mono text-xs">
            <span className="text-cyan-500">sys:</span>{" "}
            loading_neural_interface.exe
          </p>
          <p className="text-gray-600 font-mono text-xs animate-pulse">
            <span className="text-fuchsia-500">{">"}</span>{" "}
            establishing_connection...
          </p>
        </div>
      </div>
    </div>
  );
}
