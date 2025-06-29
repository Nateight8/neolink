"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellSimpleIcon, UserIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";

export function AppBar() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const handleRoute = (route: string) => {
    router.push(route);
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const scrollPosition = window.scrollY;
      const direction = current! - scrollYProgress.getPrevious()!;

      // Always show when at the top of the page
      if (scrollPosition <= 5) {
        setVisible(true);
      } else {
        // Show when scrolling up, hide when scrolling down
        setVisible(direction < 0);
      }
    }
  });

  // Initial check for page load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setVisible(window.scrollY <= 5);
    }
  }, []);

  const pathname = usePathname();

  const hideBottomNavRoutes = [""];

  if (
    hideBottomNavRoutes.includes(pathname) ||
    pathname.startsWith("/chats/")
  ) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex w-full fixed md:hidden h-14 bg-background top-0 inset-x-0 mx-auto shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000]  items-center justify-between"
        )}
      >
        <div className="flex flex-1 pl-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRoute("/profile")}
            className="rounded-full h-8 w-8"
            aria-label="User profile"
          >
            <Avatar className="size-6">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-black text-cyan-400 font-bold">
                <UserIcon size={32} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {/* Center content can be added here if needed */}
          <p className="font-mono text-xl">N</p>
        </div>
        <div className="flex flex-1 pr-4 items-center justify-end">
          {/* Right side content can be added here if needed */}
          <button
            onClick={() => handleRoute("/alerts")}
            className={cn(
              "flex flex-col items-center justify-center transition-colors"
            )}
          >
            <BellSimpleIcon className="size-6 text-muted-foreground" />
            {/* <span className="text-xs text-muted-foreground">{name}</span> */}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
