import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import type { Post } from "@/types/chat";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronUp } from "lucide-react";

import { LoadingIndicator } from "@/components/loading-indicator";
import { FeedPost } from "../feed-post";

export default function MainFeed() {
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

  return (
    <>
      {" "}
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
    </>
  );
}
