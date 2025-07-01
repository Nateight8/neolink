"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, Brain, CheckCheck, Trash2, Settings } from "lucide-react";

import { AlertItem } from "@/components/alert/alert-item";
import { NeuralIndicator } from "@/components/chats/neural-indicator";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { NotificationProps } from "@/types/notis";

// Mock data for alerts
const ALERTS = [
  {
    id: 1,
    type: "like",
    user: {
      name: "CYBER_NOMAD",
      handle: "cyber_nomad",
      avatar: "/placeholder.svg?height=50&width=50&text=CN",
      verified: true,
    },
    content: "liked your post about neural implants",
    target: "Neural Implant X-7500 Review",
    time: "10 MINUTES AGO",
    isRead: false,
    isUrgent: false,
    neuralSignature: 0.85,
  },
  {
    id: 2,
    type: "mention",
    user: {
      name: "NEON_HUNTER",
      handle: "neon_hunter",
      avatar: "/placeholder.svg?height=50&width=50&text=NH",
      verified: true,
    },
    content: "mentioned you in a post",
    target:
      "Check out @n3on_runner's new cybernetic enhancements! #NEURAL_LINK",
    time: "25 MINUTES AGO",
    isRead: false,
    isUrgent: false,
    neuralSignature: 0.72,
  },
  {
    id: 3,
    type: "neural",
    user: {
      name: "DATA_WRAITH",
      handle: "data_wraith",
      avatar: "/placeholder.svg?height=50&width=50&text=DW",
      verified: true,
    },
    content: "sent you a neural sensation",
    target: "Neural sensation: Increased processing speed",
    time: "1 HOUR AGO",
    isRead: true,
    isUrgent: true,
    neuralSignature: 0.95,
  },
  {
    id: 4,
    type: "comment",
    user: {
      name: "GHOST_WIRE",
      handle: "ghost_wire",
      avatar: "/placeholder.svg?height=50&width=50&text=GW",
      verified: false,
    },
    content: "commented on your post",
    target:
      "The corporations are tracking our neural data. We need to be careful with these new implants.",
    time: "2 HOURS AGO",
    isRead: true,
    isUrgent: false,
    neuralSignature: 0.68,
  },
  {
    id: 5,
    type: "system",
    content: "SECURITY ALERT: Unusual neural activity detected in your account",
    target: "Suspicious login attempt from NEON_DISTRICT sector 7",
    time: "3 HOURS AGO",
    isRead: false,
    isUrgent: true,
    neuralSignature: 0.99,
  },
  {
    id: 6,
    type: "ar",
    user: {
      name: "PIXEL_PUNK",
      handle: "pixel_punk",
      avatar: "/placeholder.svg?height=50&width=50&text=PP",
      verified: true,
    },
    content: "shared an AR experience with you",
    target: "NEON_DISTRICT AR Map v2.0",
    time: "5 HOURS AGO",
    isRead: true,
    isUrgent: false,
    neuralSignature: 0.88,
    arPreview: "/placeholder.svg?height=300&width=400&text=NEON_DISTRICT_AR",
  },
  {
    id: 7,
    type: "follow",
    user: {
      name: "CHROME_REBEL",
      handle: "chrome_rebel",
      avatar: "/placeholder.svg?height=50&width=50&text=CR",
      verified: true,
    },
    content: "is now following you",
    time: "YESTERDAY",
    isRead: true,
    isUrgent: false,
    neuralSignature: 0.75,
  },
  {
    id: 8,
    type: "system",
    content: "NEURAL LINK UPDATE AVAILABLE",
    target: "Version 3.5.7 includes improved bandwidth and security patches",
    time: "YESTERDAY",
    isRead: true,
    isUrgent: true,
    neuralSignature: 0.92,
  },
  {
    id: 9,
    type: "like",
    user: {
      name: "VOID_RUNNER",
      handle: "void_runner",
      avatar: "/placeholder.svg?height=50&width=50&text=VR",
      verified: false,
    },
    content: "liked your AR post",
    target: "Cybernetic Vision Enhancement Demo",
    time: "2 DAYS AGO",
    isRead: true,
    isUrgent: false,
    neuralSignature: 0.65,
  },
  {
    id: 10,
    type: "neural",
    user: {
      name: "NEON_HUNTER",
      handle: "neon_hunter",
      avatar: "/placeholder.svg?height=50&width=50&text=NH",
      verified: true,
    },
    content: "shared a neural memory with you",
    target: "Memory: NEON_DISTRICT Rooftop Party",
    time: "3 DAYS AGO",
    isRead: true,
    isUrgent: false,
    neuralSignature: 0.91,
  },
];

export default function AlertsPage() {
  //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [alerts, setAlerts] = useState(ALERTS);
  const [neuralLinkActive, setNeuralLinkActive] = useState(false);
  const [neuralLinkStrength, setNeuralLinkStrength] = useState(0.85);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Filter alerts based on active tab
  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !alert.isRead;
    if (activeTab === "neural") return alert.type === "neural";
    if (activeTab === "mentions") return alert.type === "mention";
    if (activeTab === "system") return alert.type === "system";
    return true;
  });

  // Count unread alerts
  // const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  // Simulate neural link fluctuations
  useEffect(() => {
    const neuralInterval = setInterval(() => {
      setNeuralLinkStrength(0.7 + Math.random() * 0.3);
    }, 5000);
    return () => clearInterval(neuralInterval);
  }, []);

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 10000);

    return () => clearInterval(glitchInterval);
  }, []);

  const { data: NOTIFICATIONS } = useQuery<NotificationProps[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    },
  });

  // Handle marking alert as read
  const handleMarkAsRead = (id: number) => {
    setAlerts(
      alerts.map((alert) => {
        if (alert.id === id) {
          return { ...alert, isRead: true };
        }
        return alert;
      })
    );
  };

  // Handle dismissing an alert
  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    setAlerts(
      alerts.map((alert) => {
        return { ...alert, isRead: true };
      })
    );
  };

  // Handle clearing all alerts
  const handleClearAll = () => {
    setAlerts([]);
  };

  // Toggle neural link
  const toggleNeuralLink = () => {
    setNeuralLinkActive(!neuralLinkActive);
  };

  return (
    <div>
      {/* Main container */}
      <div className="z-10 flex flex-col min-h-screen relative bg-gradient-to-b from-black/40 to-gray-900/60">
        {/* Main content */}
        <main className="flex-1 container max-w-3xl mx-auto">
          {/* Page header */}
          <div className="p-4 md:border-b md:border-cyan-900/50 ">
            <h1 className="text-lg font-mono font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              ALERTS
            </h1>
          </div>
          <div className="hidden top-0 z-10 items-center justify-between p-4 bg-black/80 backdrop-blur-2xl border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex rounded-sm bg-cyan-950/50 border border-cyan-500 items-center justify-center">
                <Bell className="h-5 w-5 text-cyan-400" />
              </div>
              {/* <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  NEURAL ALERTS
                </h1>
                <p className="text-sm text-gray-400">
                  {unreadCount > 0
                    ? `${unreadCount} unread notifications`
                    : "No unread notifications"}
                </p>
              </div> */}
            </div>

            {/* Neural link toggle */}
            <div className="hidden md:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleNeuralLink}
                      className={`rounded-sm flex items-center space-x-2 ${
                        neuralLinkActive
                          ? "border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300"
                          : "border-gray-700 text-gray-500 hover:bg-gray-900 hover:text-gray-400"
                      }`}
                    >
                      <Brain className="h-4 w-4" />
                      <span>
                        {neuralLinkActive ? "NEURAL ACTIVE" : "NEURAL INACTIVE"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {neuralLinkActive
                        ? "Deactivate Neural Link"
                        : "Activate Neural Link"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Neural link status */}
          {neuralLinkActive && (
            <div className="p-4">
              <div className="mb-4 md:mb-6 p-3 bg-cyan-950/20 border border-cyan-900 rounded-sm flex items-center justify-between">
                <div className="flex items-center">
                  <NeuralIndicator strength={neuralLinkStrength} />
                  <span className="text-xs text-cyan-400 ml-2 font-mono">
                    NEURAL_LINK: {Math.round(neuralLinkStrength * 100)}%
                    STRENGTH
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    neuralLinkStrength > 0.8
                      ? "border-green-500 text-green-400"
                      : neuralLinkStrength > 0.5
                      ? "border-cyan-500 text-cyan-400"
                      : "border-red-500 text-red-400"
                  }`}
                >
                  {neuralLinkStrength > 0.8
                    ? "OPTIMAL"
                    : neuralLinkStrength > 0.5
                    ? "STABLE"
                    : "DEGRADED"}
                </Badge>
              </div>
            </div>
          )}

          {/* Tabs and actions */}
          <div className="flex p-4 flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <ScrollArea className="w-full">
                <TabsList className="bg-transparent p-0 w-max min-w-full space-x-2">
                  {["All", "Unread", "Mentions", "Neural", "System"].map(
                    (tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab.toLowerCase()}
                        className="px-3 py-1.5 text-xs data-[state=active]:border-cyan-400 data-[state=active]:text-cyan-400 whitespace-nowrap"
                      >
                        {tab.toUpperCase()}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
                <ScrollBar orientation="horizontal" className="h-1" />
              </ScrollArea>
            </Tabs>

            <div className="space-x-2 hidden md:flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={!filteredAlerts.some((alert) => !alert.isRead)}
                      className="rounded-sm border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark All as Read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={filteredAlerts.length === 0}
                      className="rounded-sm border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/50 hover:text-fuchsia-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear All</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-300"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Alert Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Alerts list */}
          <div className="space-y-4 px-4">
            <AnimatePresence initial={false}>
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500 flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    NO ALERTS FOUND
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    {activeTab === "all"
                      ? "Your alert feed is empty. Explore the network to generate new alerts."
                      : `No ${activeTab} alerts found. Try selecting a different category.`}
                  </p>
                </div>
              ) : (
                NOTIFICATIONS?.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertItem
                      alert={alert}
                      onMarkAsRead={handleMarkAsRead}
                      onDismiss={handleDismiss}
                      neuralLinkActive={neuralLinkActive}
                      neuralLinkStrength={neuralLinkStrength}
                      glitchEffect={glitchEffect}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
