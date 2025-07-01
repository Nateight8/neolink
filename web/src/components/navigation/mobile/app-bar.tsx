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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  ArrowFatLineLeftIcon,
  BellIcon,
  UserIcon,
} from "@phosphor-icons/react";

// Mock GlitchText component for demo
const GlitchText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => <span className={className}>{text}</span>;

export function AppBarWithTabs() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [tabsOffset, setTabsOffset] = useState(0);
  const [tabsVisible, setTabsVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { username: encodedUsername } = useParams();
  // Decode the username and remove the '@' symbol if present
  const username = encodedUsername
    ? decodeURIComponent(encodedUsername as string).replace(/^@/, "")
    : null;

  const handleRoute = (route: string) => {
    router.push(route);
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const scrollPosition = window.scrollY;
      const direction = current! - scrollYProgress.getPrevious()!;

      // Calculate tabs offset based on scroll position
      const tabsSlideStart = 20;
      const tabsSlideDistance = 48; // Height of tabs section
      const mainBarHideStart = tabsSlideStart + tabsSlideDistance + 50; // Add buffer

      // Check if user is scrolling up
      const isScrollingUp = direction < 0;

      if (scrollPosition <= tabsSlideStart) {
        // Both visible, tabs at normal position
        setTabsOffset(0);
        setTabsVisible(true);
        setVisible(true);
      } else if (
        scrollPosition <= tabsSlideStart + tabsSlideDistance &&
        !isScrollingUp
      ) {
        // Tabs sliding under main bar (only when scrolling down)
        const progress = (scrollPosition - tabsSlideStart) / tabsSlideDistance;
        setTabsOffset(-progress * tabsSlideDistance);
        setTabsVisible(true);
        setVisible(true);
      } else if (scrollPosition <= mainBarHideStart && !isScrollingUp) {
        // Tabs fully hidden under main bar, main bar still visible (only when scrolling down)
        setTabsOffset(-tabsSlideDistance);
        setTabsVisible(false);
        setVisible(true);
      } else if (isScrollingUp) {
        // User is scrolling up - show both AppBar and tabs
        if (scrollPosition <= tabsSlideStart) {
          setTabsOffset(0);
        } else {
          setTabsOffset(
            -Math.min(tabsSlideDistance, scrollPosition - tabsSlideStart)
          );
        }
        setTabsVisible(true);
        setVisible(true);
      } else {
        // Scrolling down past threshold - hide both
        setTabsOffset(-tabsSlideDistance);
        setTabsVisible(false);
        setVisible(direction < 0);
      }
    }
  });

  // Initial check for page load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const initialScroll = window.scrollY;
      setVisible(initialScroll <= 56);
      setTabsOffset(0);
      setTabsVisible(true);
    }
  }, []);

  const { user } = useAuth();
  const profileUrl = user?.username;

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean);
  const isUsernamePage =
    segments.length === 1 &&
    typeof segments[0] === "string" &&
    segments[0] !== "explore" &&
    segments[0] !== "notifications" &&
    segments[0] !== "messages" &&
    segments[0] !== "bookmarks" &&
    segments[0] !== "lists" &&
    segments[0] !== "topics" &&
    segments[0] !== "settings" &&
    segments[0] !== "privacy";

  // Check if current route matches /[username]/status/[postid] pattern
  const isPostPage =
    segments.length === 3 &&
    segments[1] === "status" &&
    typeof segments[2] === "string";

  const hideAppNavRoutes = ["/chess", `/login`, "/init-sequence", "/chats"];
  const profileRoute = pathname !== `/@${profileUrl}`;
  const alertsRoute = pathname !== "/alerts";

  if (
    hideAppNavRoutes.includes(pathname) ||
    pathname.startsWith("/chats/") ||
    pathname.startsWith("/room") ||
    !alertsRoute
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
          "flex flex-col w-full fixed md:hidden top-0 inset-x-0 mx-auto z-50 overflow-hidden"
        )}
      >
        {/* Main AppBar */}
        <div className="flex h-14 bg-background items-center justify-between relative z-10 border-b border-foreground/10">
          <div className="flex flex-1 pl-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (pathname === `/@${profileUrl}`) {
                  router.back();
                } else {
                  handleRoute(`/@${profileUrl}`);
                }
              }}
              className="rounded-full h-8 w-8"
              aria-label="User profile"
            >
              {pathname === "/profile" ||
              pathname.startsWith("/chats") ||
              isUsernamePage ||
              isPostPage ? (
                <ArrowFatLineLeftIcon size={24} />
              ) : (
                <Avatar className="size-6">
                  <AvatarImage
                    src="/placeholder.svg?height=24&width=24"
                    alt="User"
                  />
                  <AvatarFallback className="bg-black text-cyan-400 font-bold">
                    <UserIcon size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <p className="font-mono text-xl text-center tracking-wider">
              {(() => {
                switch (true) {
                  case pathname === "/profile":
                    return "PROFILE";
                  case isUsernamePage:
                    return (
                      <GlitchText
                        text={decodeURIComponent(username as string).replace(
                          /^@/,
                          ""
                        )}
                        className="text-cyan-400"
                      />
                    );
                  default:
                    return "NOE";
                }
              })()}
            </p>
          </div>

          <div className="flex flex-1 pr-4 items-center justify-end">
            <button
              onClick={() => handleRoute("/alerts")}
              className={cn(
                "flex flex-col items-center justify-center transition-colors"
              )}
            >
              <BellIcon className="size-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs Section - slides under main bar */}
        {profileRoute ||
          (isPostPage && (
            <AnimatePresence>
              {tabsVisible && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: 1,
                    transform: `translateY(${tabsOffset}px)`,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    transform: { duration: 0 },
                    opacity: { duration: 0.1 },
                  }}
                  className="bg-background relative z-0"
                >
                  <ScrollArea className="w-full border-b border-foreground/10">
                    <nav className="flex items-center justify-start h-9 w-max">
                      <Link href="/" className="h-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            "group relative h-full px-3 text-xs font-mono tracking-tight",
                            "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                            "data-[active=true]:text-foreground"
                          )}
                          data-active={pathname === "/"}
                        >
                          <span className="relative">
                            FOR_YOU
                            <span
                              className={cn(
                                "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                                "group-data-[active=true]:scale-x-100"
                              )}
                            />
                          </span>
                        </Button>
                      </Link>

                      <Link href="/following" className="h-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            "group relative h-full px-3 text-xs font-mono tracking-tight",
                            "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                            "data-[active=true]:text-foreground"
                          )}
                          data-active={pathname === "/following"}
                        >
                          <span className="relative">
                            FOLLOWING
                            <span
                              className={cn(
                                "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                                "group-data-[active=true]:scale-x-100"
                              )}
                            />
                          </span>
                        </Button>
                      </Link>

                      <Link href="/book-marks" className="h-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            "group relative h-full px-3 text-xs font-mono tracking-tight",
                            "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                            "data-[active=true]:text-foreground"
                          )}
                          data-active={pathname === "/book-marks"}
                        >
                          <span className="relative">
                            BOOKMARKS
                            <span
                              className={cn(
                                "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                                "group-data-[active=true]:scale-x-100"
                              )}
                            />
                          </span>
                        </Button>
                      </Link>

                      <Link href="/chess" className="h-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            "group relative h-full px-3 text-xs font-mono tracking-tight",
                            "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                            "data-[active=true]:text-foreground"
                          )}
                          data-active={pathname === "/chess"}
                        >
                          <span className="relative">
                            CHESS
                            <span
                              className={cn(
                                "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                                "group-data-[active=true]:scale-x-100"
                              )}
                            />
                          </span>
                        </Button>
                      </Link>
                    </nav>
                    <ScrollBar
                      orientation="horizontal"
                      className="h-0"
                      forceMount
                    />
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
      </motion.div>
    </AnimatePresence>
  );
}
