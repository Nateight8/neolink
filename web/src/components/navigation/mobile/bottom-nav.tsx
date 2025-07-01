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
import { CreatePostDialog } from "@/components/navigation/create-post-modal";
import { useAuth } from "@/contexts/auth-context";

export const BottomNav = ({ className }: { className?: string }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const profileUrl = `/@${user?.username}`;

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

  // Disable the create post button if not on home, feed, or profile pages
  const isCreatePostDisabled = ["/", profileUrl].includes(pathname);
  const segments = pathname.split("/").filter(Boolean);

  // Hide BottomNav on /[username]/status/[postid]
  const isStatusPage =
    segments.length === 3 &&
    typeof segments[0] === "string" &&
    segments[1] === "status" &&
    typeof segments[2] === "string";

  if (isStatusPage) return null;

  // const userName = username && typeof username === "string";

  const hideBottomNavRoutes = [`/login`, "/init-sequence"];

  if (
    hideBottomNavRoutes.includes(pathname) ||
    pathname.startsWith("/chats/") ||
    pathname.startsWith("/room")
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
              <HouseSimpleIcon
                className={cn(
                  "size-6",
                  pathname === "/" ? "text-cyan-500" : "text-muted-foreground"
                )}
              />
              {/* <span className="text-xs text-muted-foreground">{name}</span> */}
            </Link>
          </div>
          {/* Search */}
          <div className="flex-1">
            <Link
              href="/explore"
              className={cn(
                "flex flex-col items-center justify-center transition-colors"
              )}
            >
              <MagnifyingGlassIcon
                className={cn(
                  "size-6",
                  pathname === "/search"
                    ? "text-cyan-500"
                    : "text-muted-foreground"
                )}
              />
              {/* <span className="text-xs text-muted-foreground">{name}</span> */}
            </Link>
          </div>
          {/* Add */}
          <div className="flex-1 flex justify-center">
            <BeveledButton
              variant="cyan"
              size="icon"
              disabled={!isCreatePostDisabled}
              onClick={() => setIsCreatePostOpen(true)}
            >
              <PlusIcon size={24} className="text-cyan-500/40" />
            </BeveledButton>
            <CreatePostDialog
              open={isCreatePostOpen}
              onOpenChange={setIsCreatePostOpen}
            />
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
              <ChatCenteredIcon
                className={cn(
                  "size-6",
                  pathname.startsWith("/chats")
                    ? "text-cyan-500"
                    : "text-muted-foreground"
                )}
              />
              {/* <span className="text-xs text-muted-foreground">{name}</span> */}
            </Link>
          </div>

          {/* {navItems.map((item) => (
            <NavItem key={item.name} {...item} />
          ))} */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
