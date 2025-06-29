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
  Icon,
  IconProps,
  MagnifyingGlassIcon,
  PlusIcon,
  GameControllerIcon,
} from "@phosphor-icons/react";

const navItems = [
  {
    name: "Home",
    link: "/",
    Icon: HouseSimpleIcon,
  },
  {
    name: "Search",
    link: "/",
    Icon: MagnifyingGlassIcon,
  },
  {
    name: "Chess",
    link: "/",
    Icon: PlusIcon,
  },
  {
    name: "Notification",
    link: "/",
    Icon: GameControllerIcon,
  },

  {
    name: "Profile",
    link: "/",
    Icon: ChatCenteredIcon,
  },
];

interface NavItem {
  name: string;
  link: string;
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}

export const BottomNav = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

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
          <NavItem {...navItems[0]} />
          <NavItem {...navItems[1]} />
          <div className="flex-1 flex justify-center">
            <BeveledButton variant="cyan" size="icon">
              <PlusIcon size={24} className="text-cyan-500/40" />
            </BeveledButton>
          </div>
          <NavItem {...navItems[3]} />
          <NavItem {...navItems[4]} />
          {/* {navItems.map((item) => (
            <NavItem key={item.name} {...item} />
          ))} */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

function NavItem({ Icon, link, name }: NavItem) {
  return (
    <div className="flex-1">
      <Link
        key={`link-${name}`}
        href={link}
        className={cn(
          "flex flex-col items-center justify-center transition-colors"
        )}
      >
        <Icon className="size-6 text-muted-foreground" />
        {/* <span className="text-xs text-muted-foreground">{name}</span> */}
      </Link>
    </div>
  );
}
