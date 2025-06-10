"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronUp, Cpu, Radio, Shield, Skull, Siren } from "lucide-react";
import { FeedPost } from "./feed-post";
// import { StoryLives } from "./story-lives";
import { HackerNews } from "./hacker-news";
import { CyberPanel } from "./cyber-pannel";
import { GameRoomsSidebar } from "./right-sidebar";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import type { Post } from "@/types/chat";

import { LoadingIndicator } from "@/components/loading-indicator";
import { useAuth } from "@/contexts/auth-context";

// Mock data for trending topics
const TRENDING = [
  {
    id: 1,
    tag: "NEURAL_LINK",
    count: "24.5K",
    icon: <Cpu className="h-3 w-3" />,
  },
  {
    id: 2,
    tag: "CYBER_RIOT",
    count: "18.2K",
    icon: <Siren className="h-3 w-3" />,
  },
  {
    id: 3,
    tag: "NEON_DISTRICT",
    count: "12.7K",
    icon: <Radio className="h-3 w-3" />,
  },
  {
    id: 4,
    tag: "DATA_BREACH",
    count: "9.3K",
    icon: <Shield className="h-3 w-3" />,
  },
  {
    id: 5,
    tag: "GHOST_PROTOCOL",
    count: "7.1K",
    icon: <Skull className="h-3 w-3" />,
  },
];

export default function FeedClient() {
  const router = useRouter();

  const { user } = useAuth();

  const [, setActiveTab] = useState("for-you");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // const [isARPostEnabled, setIsARPostEnabled] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        setShowScrollTop(feedRef.current.scrollTop > 500);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll);
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 10000);

    return () => clearInterval(glitchInterval);
  }, []);

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["post-feed"], // Add a unique query key
    queryFn: async () => {
      const response = await axiosInstance.get("/posts");
      return response.data;
    },
  });

  // Handle scroll to top
  const scrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  console.log("USER FROM FEED", posts);
  // Toggle AR post creation

  return (
    <div className="min-h-screen  relative md:py-16 bg-gradient-to-b  from-black/40 to-gray-900/60">
      {/* Main container */}
      <div className="relative z-10 flex flex-col  ">
        {/* Main content */}
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* User profile card */}
              <CyberPanel title="IDENTITY">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12 border border-cyan-500 relative">
                    <AvatarImage
                      src="/placeholder.svg?height=50&width=50&text=JD"
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-black text-cyan-400 font-bold">
                      {user?.handle
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-white">{user?.handle}</h3>
                    <p className="text-xs text-cyan-400 font-mono">
                      @{user?.username}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <p className="text-lg font-bold text-cyan-400">0</p>
                    <p className="text-xs text-gray-400">POSTS</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-fuchsia-400">0</p>
                    <p className="text-xs text-gray-400">ALLIES</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cyan-400">0</p>
                    <p className="text-xs text-gray-400">POWER</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => router.push("/biochip")}
                  className="w-full rounded-sm border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300"
                >
                  VIEW_PROFILE.SYS
                </Button>
              </CyberPanel>

              {/* Trending topics */}
              <CyberPanel title="TRENDING_TOPICS">
                <ul className="space-y-3">
                  {TRENDING.map((topic) => (
                    <li key={topic.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between rounded-sm text-left hover:bg-fuchsia-950/30 group"
                      >
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="mr-2 bg-black border-fuchsia-500 text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:text-fuchsia-300"
                          >
                            {topic.icon}
                          </Badge>
                          <span className="text-white group-hover:text-fuchsia-300">
                            #{topic.tag}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-fuchsia-300">
                          {topic.count}
                        </span>
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  VIEW_ALL_TRENDS.SYS
                </Button>
              </CyberPanel>

              {/* Hacker news */}
              <HackerNews />
            </div>
          </aside>

          {/* Main feed */}
          <div className="lg:col-span-2">
            {/* Feed tabs */}
            <Tabs
              defaultValue="for-you"
              className="w-full mb-4"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full md:w-fit grid grid-cols-2 rounded-sm bg-black border border-cyan-900">
                <TabsTrigger
                  value="for-you"
                  className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300 px-4 md:px-6 text-sm md:text-base"
                >
                  FOR_YOU.SYS
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="rounded-none data-[state=active]:bg-fuchsia-950 data-[state=active]:text-fuchsia-300 px-4 md:px-6 text-sm md:text-base"
                >
                  FOLLOWING.SYS
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingIndicator size="lg" text="LOADING NEURAL FEED" />
              </div>
            ) : (
              <div className="space-y-6 overflow-x-auto pb-2">
                <div className="flex space-x-4">
                  {/* Add story button */}
                  {/* <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm"></div>
                      <button className="relative h-16 w-16 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-cyan-400" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">ADD</span>
                  </div> */}

                  {/* Story lives */}

                  {/* <StoryLives sessions={LIVE_SESSIONS} /> */}
                </div>
              </div>
            )}

            {/* Feed posts */}
            {/* <ScrollArea className="h-[calc(100vh-220px)]" ref={feedRef}> */}
            <div className="space-y-6 ">
              <AnimatePresence initial={false}>
                {posts?.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FeedPost post={post} glitchEffect={glitchEffect} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* </ScrollArea> */}

            {/* Scroll to top button */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="fixed bottom-6 right-6 z-20"
                >
                  <Button
                    size="icon"
                    onClick={scrollToTop}
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar - Chess Rooms */}
          <aside className="hidden lg:block">
            <GameRoomsSidebar />
          </aside>
        </main>
      </div>
    </div>
  );
}
