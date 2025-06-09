"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlitchText } from "../feed/glitch-text";
import { NeonButton } from "../feed/neon-button";
import { Button } from "../ui/button";
import { Bell, Flame, Menu, MessageSquare, User, X, Zap } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// 🧠 Nav config array
const navLinks = [
  { href: "/", label: "FEED", icon: Zap },
  { href: "/explore", label: "EXPLORE", icon: Flame },
  { href: "/echo-net", label: "MESSAGES", icon: MessageSquare },
  { href: "/alerts", label: "ALERTS", icon: Bell },
  { href: "/biochip", label: "PROFILE", icon: User },
];

export default function AppNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Optionally, you can show a loader here
  }

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  if (
    pathname === "/biochip" ||
    pathname === "/login" ||
    pathname.includes("/init-sequence") ||
    pathname.includes("/echo-net") ||
    user?.isOnboarder === false
  ) {
    return null; // Don't render the navbar on the root page
  }

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
              {navLinks.map(({ href, label, icon: Icon }) => (
                <NeonButton
                  key={href}
                  onClick={() => router.push(href)}
                  active={isActive(href)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </NeonButton>
              ))}
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
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Button
                  key={href}
                  variant="ghost"
                  onClick={() => {
                    router.push(href);
                    setMobileMenuOpen(false);
                  }}
                  className={`justify-start ${
                    isActive(href)
                      ? "bg-cyan-950/30 text-cyan-300 border-l-2 border-cyan-500"
                      : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
