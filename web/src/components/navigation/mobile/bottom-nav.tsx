"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BeveledButton } from "@/components/ui/beveled-button";
import {
  ChatCenteredIcon,
  HouseSimpleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import GameButton from "./game-button";
import { usePathname } from "next/navigation";
import { CreatePostDialog } from "../create-post-modal";

export const BottomNav = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const scrollPosition = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const direction = current! - scrollYProgress.getPrevious()!;

      // Always show when at the bottom of the page or when scrolling up
      if (scrollPosition >= scrollHeight - 10 || direction < 0) {
        setVisible(true);
      } else {
        // Hide when scrolling down (unless near bottom)
        setVisible(false);
      }
    }
  });

  // Initial check for page load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY >= scrollHeight - 10);
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
          opacity: 0,
          y: 100,
        }}
        animate={{
          y: visible ? 0 : 100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "w-full fixed md:hidden bg-background bottom-0 inset-x-0 mx-auto border-t shadow-[0px_-2px_10px_1px_rgba(0,0,0,0.1)] z-[5000] ",
          className
        )}
      >
        <div className="relative overflow-hidden w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/90 to-transparent" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-ping" /> */}
        </div>
        <div className="flex items-center h-14 w-full">
          {/* Home */}
          <div className="flex-1">
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center justify-center transition-colors"
              )}
            >
              <HouseSimpleIcon className="size-6 text-muted-foreground" />
              {/* <span className="text-xs text-muted-foreground">{name}</span> */}
            </Link>
          </div>
          {/* Search */}
          <div className="flex-1">
            <Link
              href="#"
              className={cn(
                "flex flex-col items-center justify-center transition-colors"
              )}
            >
              <MagnifyingGlassIcon className="size-6 text-muted-foreground" />
              {/* <span className="text-xs text-muted-foreground">{name}</span> */}
            </Link>
          </div>
          {/* Add */}
          <div className="flex-1 flex justify-center">
            <BeveledButton 
              variant="cyan" 
              size="icon"
              onClick={() => setIsCreatePostOpen(true)}
            >
              <PlusIcon size={24} className="text-cyan-500/40" />
            </BeveledButton>
          </div>
          {/* Notification */}
          {/* Game */}
          <GameButton />

          <div className="flex-1">
            <Link
              href="/chats"
              className={cn(
                "flex flex-col items-center justify-center transition-colors"
              )}
            >
              <ChatCenteredIcon className="size-6 text-muted-foreground" />
              {/* <span className="text-xs text-muted-foreground">{name}</span> */}
            </Link>
          </div>

          {/* {navItems.map((item) => (
            <NavItem key={item.name} {...item} />
          ))} */}
        </div>
      </motion.div>
      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen} 
      />
    </AnimatePresence>
  );
};
