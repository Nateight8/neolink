"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  User,
  Plus,
  ArrowBigLeftDashIcon,
} from "lucide-react";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDoorTransition } from "@/hooks/use-page-transition";

import { Button } from "../ui/button";
import { CreatePostDialog } from "@/components/navigation/create-post-modal";
import { useIsMobile } from "@/hooks/use-mobile";

export const FloatingDock = ({
  desktopClassName,
  mobileClassName,
}: {
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  // const isMobile = useMediaQuery("(max-width: 768px)");
  const isMobile = useIsMobile();
  const navItemsTOUse = pathname.startsWith("/echo-net")
    ? [
        {
          title: "HOME",
          icon: <ArrowBigLeftDashIcon className="w-full h-full" />,
          href: "/",
          action: () => router.back(),
        },
      ]
    : navItems;

  if (isMobile && !pathname.startsWith("/echo-net")) {
    return null;
  }

  return (
    <>
      <FloatingDockDesktop items={navItemsTOUse} className={desktopClassName} />
      <FloatingDockMobile items={navItemsTOUse} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    action?: () => void;
  }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const pathname = usePathname();
  const { navigateWithTransition, isTransitioning } = useDoorTransition();

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    if (!isTransitioning) {
      navigateWithTransition(href);
    }
  };

  // Beveled edge clip path
  const clipPath =
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))";
  const clipPathLarge =
    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))";

  return (
    <div className={cn("relative block md:hidden", className)}>
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2 items-end"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Button
                  onClick={() => item.href && handleNavigation(item.href)}
                  key={item.title}
                  className={cn(
                    "relative flex h-14 w-14 items-center justify-center bg-[#121212] shadow-[0_0_10px_rgba(0,0,0,0.5)] group",
                    isActive(item.href)
                      ? "text-cyan-400"
                      : "text-gray-400 hover:text-cyan-300",
                    isTransitioning && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isTransitioning}
                  style={{
                    clipPath,
                  }}
                >
                  {/* Gradient border */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                    style={{ clipPath }}
                  />

                  {/* Background with beveled edge */}
                  <div
                    className="absolute inset-[1px] bg-[#121212]"
                    style={{ clipPath }}
                  />

                  {/* Icon */}
                  <div className="h-6 w-6 relative z-10">{item.icon}</div>

                  {/* Active/Hover state background */}
                  <div
                    className={cn(
                      "absolute inset-[1px] bg-cyan-500/10 transition-opacity duration-300",
                      isActive(item.href)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                    style={{
                      clipPath,
                      zIndex: 5,
                    }}
                  />

                  {/* Scan line effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ zIndex: 6 }}
                  />
                </Button>
              </motion.div>
            ))}
            <motion.div>
              <Button
                onClick={() => setIsCreatePostOpen(true)}
                className="relative flex h-14 w-14 items-center justify-center bg-[#121212] shadow-[0_0_10px_rgba(0,0,0,0.5)] group text-gray-400 hover:text-cyan-300"
                style={{ clipPath }}
              >
                {/* Gradient border */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                  style={{ clipPath }}
                />

                {/* Background with beveled edge */}
                <div
                  className="absolute inset-[1px] bg-[#121212]"
                  style={{ clipPath }}
                />

                {/* Icon */}
                <div className="h-6 w-6 relative z-10">
                  <Plus className="w-full h-full" />
                </div>

                {/* Hover state background */}
                <div
                  className="absolute inset-[1px] bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    clipPath,
                    zIndex: 5,
                  }}
                />

                {/* Scan line effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ zIndex: 6 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        onClick={() => setOpen(!open)}
        disabled={isTransitioning}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center bg-[#121212] shadow-[0_0_15px_rgba(0,0,0,0.7)] group",
          isTransitioning && "opacity-50 cursor-not-allowed"
        )}
        style={{ clipPath: clipPathLarge }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
          style={{ clipPath: clipPathLarge }}
        />

        {/* Background with beveled edge */}
        <div
          className="absolute inset-[1px] bg-[#121212]"
          style={{ clipPath: clipPathLarge }}
        />

        <IconLayoutNavbarCollapse className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 relative z-10" />

        {/* Hover state background */}
        <div
          className="absolute inset-[1px] bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            clipPath: clipPathLarge,
            zIndex: 5,
          }}
        />

        {/* Scan line effect */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ zIndex: 6 }}
        />
      </Button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    action?: () => void;
  }[];
  className?: string;
}) => {
  const pathname = usePathname();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const clipPath =
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";

  return (
    <>
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
      />
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "mx-auto hidden h-16 items-end gap-4 px-4 pb-3 md:flex relative bg-[#121212] ",
          className
        )}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
          style={{ clipPath }}
        />

        {/* Background with beveled edge */}
        <div
          className="absolute inset-[1px] bg-[#121212]"
          style={{ clipPath }}
        />

        <>
          {items.map((item) => (
            <IconContainer mouseX={mouseX} key={item.title} {...item} />
          ))}
          {pathname.startsWith("/echo-net") ? null : (
            <IconContainer
              mouseX={mouseX}
              title="Post"
              icon={<Plus className="w-full h-full" />}
              href="#"
              action={() => setIsCreatePostOpen(true)}
            />
          )}
        </>
      </motion.div>
    </>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  action,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  action?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { navigateWithTransition, isTransitioning } = useDoorTransition();

  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  const clipPath =
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))";
  const tooltipClipPath =
    "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))";

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40]);

  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 30, 20]
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 30, 20]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const handleAction = () => {
    if (isTransitioning) return;

    if (action) {
      action();
    } else if (href) {
      navigateWithTransition(href);
    }
  };

  return (
    <motion.button
      className={cn(
        "hover:cursor-pointer",
        isTransitioning && "pointer-events-none"
      )}
      onClick={handleAction}
      disabled={isTransitioning}
    >
      <motion.div
        ref={ref}
        style={{ width, height, clipPath }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center bg-[#121212] group",
          isActive ? "text-cyan-400" : "text-gray-400 hover:text-gray-300",
          isTransitioning && "opacity-50"
        )}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
          style={{ clipPath }}
        />

        {/* Background with beveled edge */}
        <div
          className="absolute inset-[1px] bg-[#121212]"
          style={{ clipPath }}
        />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 5, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 5, x: "-50%" }}
              className="absolute -top-12 left-1/2 w-fit px-2 py-0.5 text-xs whitespace-pre text-cyan-300 z-[60] font-mono"
              style={{ clipPath: tooltipClipPath }}
            >
              {/* Tooltip gradient border */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                style={{ clipPath: tooltipClipPath }}
              />

              {/* Tooltip background */}
              <div
                className="absolute inset-[1px] bg-[#121212]"
                style={{ clipPath: tooltipClipPath }}
              />

              <span className="relative z-10">{title}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center relative z-10"
        >
          {icon}
        </motion.div>

        {/* Active/Hover state background */}
        <div
          className={cn(
            "absolute inset-[1px] bg-cyan-500/10 transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{
            clipPath,
            zIndex: 5,
          }}
        />

        {/* Scan line effect */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ zIndex: 6 }}
        />

        {/* Glow effect on hover */}
        <div
          className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-300"
          style={{ zIndex: -1 }}
        />
      </motion.div>
    </motion.button>
  );
}

const navItems = [
  {
    title: "HOME",
    icon: <Home className="w-full h-full" />,
    href: "/",
  },
  {
    title: "SEARCH",
    icon: <Search className="w-full h-full" />,
    href: "/search",
    action: () => {},
  },
  {
    title: "ALERTS",
    icon: <Bell className="w-full h-full" />,
    href: "/alerts",
  },
  {
    title: "MESSAGES",
    icon: <MessageSquare className="w-full h-full" />,
    href: "/echo-net",
  },
  {
    title: "PROFILE",
    icon: <User className="w-full h-full" />,
    href: "/biochip",
  },
];
