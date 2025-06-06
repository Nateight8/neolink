"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, CircuitBoardIcon as Circuit, Brain } from "lucide-react";

interface DoorPageTransitionProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onTransitionComplete?: () => void;
}

export function PageTransition({
  children,
  isOpen = true,
  onTransitionComplete,
}: DoorPageTransitionProps) {
  const [showContent, setShowContent] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Delay showing content until door opens
      const timer = setTimeout(() => {
        setShowContent(true);
        onTransitionComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen, onTransitionComplete]);

  return (
    <div className="relative h-screen overflow-scroll">
      {/* Page content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Door overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex"
          >
            {/* Left door */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
              }}
              className="w-1/2 h-full bg-black relative overflow-hidden"
            >
              {/* Door surface with cyberpunk details */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-gray-800">
                {/* Circuit patterns */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-8 w-32 h-px bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                  <div className="absolute top-1/4 left-8 w-px h-16 bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                  <div className="absolute top-1/2 left-16 w-24 h-px bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
                  <div className="absolute top-3/4 left-12 w-20 h-px bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                </div>

                {/* Neural interface panel */}
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                  <div className="w-24 h-32 bg-black/50 border border-cyan-500 rounded-sm p-3">
                    <div className="flex flex-col items-center space-y-3">
                      <Brain className="h-6 w-6 text-cyan-400" />
                      <div className="w-full h-1 bg-cyan-950 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glowing edge */}
                <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-fuchsia-500 to-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
              </div>
            </motion.div>

            {/* Right door */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
              }}
              className="w-1/2 h-full bg-black relative overflow-hidden"
            >
              {/* Door surface with cyberpunk details */}
              <div className="absolute inset-0 bg-gradient-to-l from-black via-gray-900 to-gray-800">
                {/* Circuit patterns */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/3 right-8 w-28 h-px bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
                  <div className="absolute top-1/3 right-8 w-px h-12 bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
                  <div className="absolute top-1/2 right-16 w-20 h-px bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                  <div className="absolute top-2/3 right-12 w-24 h-px bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
                </div>

                {/* Security panel */}
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                  <div className="w-20 h-28 bg-black/50 border border-fuchsia-500 rounded-sm p-2">
                    <div className="flex flex-col items-center space-y-2">
                      <Circuit className="h-5 w-5 text-fuchsia-400" />
                      <div className="space-y-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-12 h-1 bg-fuchsia-950 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-fuchsia-400 shadow-[0_0_8px_rgba(255,0,255,0.5)]"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                delay: i * 0.3,
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <Zap className="h-4 w-4 text-fuchsia-400" />
                    </div>
                  </div>
                </div>

                {/* Glowing edge */}
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-fuchsia-500 via-cyan-500 to-fuchsia-500 shadow-[0_0_20px_rgba(255,0,255,0.8)]" />
              </div>
            </motion.div>

            {/* Center seam with energy effect */}
            <div className="absolute left-1/2 top-0 w-1 h-full transform -translate-x-1/2 z-10">
              <motion.div
                className="w-full h-full bg-gradient-to-b from-cyan-400 via-white to-fuchsia-400"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  boxShadow:
                    "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(0,255,255,0.4), 0 0 90px rgba(255,0,255,0.4)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
