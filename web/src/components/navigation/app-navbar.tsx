"use client";
import Link from "next/link";
import { GlitchText } from "../feed/glitch-text";
import { NeonButton } from "../feed/neon-button";
import { Bell, Flame, Menu, MessageSquare, User, X, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function AppNavbar() {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-cyan-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/feed" className="flex items-center">
                <GlitchText
                  text="ALERT_SYSTEM"
                  className="text-xl font-bold text-cyan-400"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <NeonButton onClick={() => router.push("/feed")}>
                <Zap className="h-4 w-4 mr-2" />
                FEED
              </NeonButton>
              <NeonButton onClick={() => router.push("/explore")}>
                <Flame className="h-4 w-4 mr-2" />
                EXPLORE
              </NeonButton>
              <NeonButton onClick={() => router.push("/messages")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                MESSAGES
              </NeonButton>
              <NeonButton onClick={() => router.push("/alerts")} active>
                <Bell className="h-4 w-4 mr-2" />
                ALERTS
              </NeonButton>
              <NeonButton onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 mr-2" />
                PROFILE
              </NeonButton>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 z-20 bg-black/95 backdrop-blur-md border-b border-cyan-900"
          >
            <nav className="flex flex-col p-4 space-y-3">
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/feed");
                  setMobileMenuOpen(false);
                }}
                className="justify-start text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              >
                <Zap className="h-4 w-4 mr-2" />
                FEED
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/explore");
                  setMobileMenuOpen(false);
                }}
                className="justify-start text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
              >
                <Flame className="h-4 w-4 mr-2" />
                EXPLORE
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/messages");
                  setMobileMenuOpen(false);
                }}
                className="justify-start text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                MESSAGES
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/alerts");
                  setMobileMenuOpen(false);
                }}
                className="justify-start bg-cyan-950/30 text-cyan-300 border-l-2 border-cyan-500"
              >
                <Bell className="h-4 w-4 mr-2" />
                ALERTS
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/profile");
                  setMobileMenuOpen(false);
                }}
                className="justify-start text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
              >
                <User className="h-4 w-4 mr-2" />
                PROFILE
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
