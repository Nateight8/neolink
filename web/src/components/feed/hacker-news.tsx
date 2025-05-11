"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Cpu, Radio, Shield, Skull, Siren } from "lucide-react";
import { CyberPanel } from "./cyber-pannel";

// Mock news data
const NEWS = [
  {
    id: 1,
    title: "NEURAL LINK BREACH DETECTED IN SECTOR 7",
    source: "CYBER_SENTINEL",
    time: "2 HOURS AGO",
    icon: <Cpu className="h-3 w-3" />,
  },
  {
    id: 2,
    title: "GHOST PROTOCOL ACTIVATED IN NEON DISTRICT",
    source: "DIGITAL_WATCH",
    time: "5 HOURS AGO",
    icon: <Skull className="h-3 w-3" />,
  },
  {
    id: 3,
    title: "CORPORATE FIREWALLS COMPROMISED BY UNKNOWN ENTITY",
    source: "HACK_WIRE",
    time: "YESTERDAY",
    icon: <Shield className="h-3 w-3" />,
  },
  {
    id: 4,
    title: "CYBER RIOTS CONTINUE IN DOWNTOWN GRID SECTOR",
    source: "NET_PULSE",
    time: "2 DAYS AGO",
    icon: <Siren className="h-3 w-3" />,
  },
];

export function HackerNews() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    if (isAutoScrolling) {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % NEWS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoScrolling]);

  return (
    <CyberPanel title="HACKER_NEWS">
      <div className="h-[120px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={NEWS[currentNewsIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-sm bg-black border border-fuchsia-500 flex items-center justify-center text-fuchsia-400">
                {NEWS[currentNewsIndex].icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">
                  {NEWS[currentNewsIndex].title}
                </h4>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="text-fuchsia-400 mr-2">
                    {NEWS[currentNewsIndex].source}
                  </span>
                  <span>• {NEWS[currentNewsIndex].time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* News navigation */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-1">
          {NEWS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentNewsIndex(index);
                setIsAutoScrolling(false);
              }}
              className={`h-1 w-6 rounded-full ${
                index === currentNewsIndex ? "bg-fuchsia-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          className={`text-xs ${
            isAutoScrolling
              ? "text-fuchsia-400 hover:text-fuchsia-300"
              : "text-gray-500 hover:text-fuchsia-400"
          }`}
        >
          <Radio
            className={`h-3 w-3 mr-1 ${isAutoScrolling ? "animate-pulse" : ""}`}
          />
          {isAutoScrolling ? "LIVE" : "PAUSED"}
        </Button>
      </div>
    </CyberPanel>
  );
}
