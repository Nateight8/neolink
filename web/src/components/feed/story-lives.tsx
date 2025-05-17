"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { LiveSessionCard } from "./live-session";

interface User {
  id: string | number;
  username: string;
  avatar: string;
}

interface Highlight {
  type: "quote" | "hashtag";
  content: string;
  username?: string;
}

interface LiveSession {
  id: string | number;
  title: string;
  host: User;
  listeners: User[];
  listenersCount: number;
  highlights: Highlight[];
  isLive: boolean;
}

interface StoryLivesProps {
  sessions: LiveSession[];
}

export function StoryLives({ sessions }: StoryLivesProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update arrows visibility based on scroll position
  const updateArrows = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", updateArrows);
      return () => carousel.removeEventListener("scroll", updateArrows);
    }
  }, []);

  // Scroll to specific item
  const scrollToItem = (index: number) => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    const items = carousel.querySelectorAll(".carousel-item");

    if (items[index]) {
      const item = items[index] as HTMLElement;
      const leftPosition = item.offsetLeft - 16; // 16px for padding

      carousel.scrollTo({
        left: leftPosition,
        behavior: "smooth",
      });

      setActiveIndex(index);
    }
  };

  // Scroll left/right
  const scrollLeft = () => {
    if (activeIndex > 0) {
      scrollToItem(activeIndex - 1);
    }
  };

  const scrollRight = () => {
    if (activeIndex < sessions.length) {
      scrollToItem(activeIndex + 1);
    }
  };

  return (
    <div className="relative">
      {/* Navigation arrows - Desktop only */}
      {!isMobile && (
        <>
          <AnimatePresence>
            {showLeftArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className="h-8 w-8 rounded-full bg-black/80 border border-cyan-900 text-cyan-400 hover:bg-cyan-950/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRightArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:block"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className="h-8 w-8 rounded-full bg-black/80 border border-cyan-900 text-cyan-400 hover:bg-cyan-950/30"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={updateArrows}
      >
        <div className="flex space-x-4">
          {/* Create new live session button */}
          <div
            className="flex-shrink-0 carousel-item"
            style={{
              minWidth: isMobile ? "80vw" : "320px",
              scrollSnapAlign: "start",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-full overflow-hidden bg-black/80 backdrop-blur-sm border border-cyan-900 hover:border-cyan-500 transition-colors duration-300 p-2 flex items-center justify-center h-[72px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-fuchsia-900/20"></div>
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-30 blur-[2px] rounded-full"></div>
              <div className="relative z-10 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-cyan-950/30 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-sm text-cyan-300 font-mono">
                  START_SESSION
                </span>
              </div>
            </motion.div>
          </div>

          {/* Live session cards */}
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex-shrink-0 carousel-item"
              style={{
                minWidth: isMobile ? "80vw" : "320px",
                scrollSnapAlign: "start",
              }}
            >
              <LiveSessionCard
                title={session.title}
                host={session.host}
                listeners={session.listeners}
                listenersCount={session.listenersCount}
                highlights={session.highlights}
                isLive={session.isLive}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots - Mobile only */}
      <div className="flex justify-center space-x-1 mt-2 md:hidden">
        {[0, ...Array(sessions.length).keys()].map((index) => (
          <button
            key={index}
            onClick={() => scrollToItem(index)}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index
                ? "w-4 bg-cyan-400"
                : "w-1.5 bg-gray-600 hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
