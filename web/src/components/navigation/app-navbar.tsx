"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlitchText } from "../feed/glitch-text";
import { NeonButton } from "../feed/neon-button";
import { Button } from "../ui/button";
import { Bell, Flame, Menu, MessageSquare, User, X, Zap } from "lucide-react";

const navLinks = [
  { label: "FEED", icon: Zap, href: "/feed" },
  { label: "EXPLORE", icon: Flame, href: "/explore" },
  { label: "MESSAGES", icon: MessageSquare, href: "/messages" },
  { label: "ALERTS", icon: Bell, href: "/alerts" },
  { label: "PROFILE", icon: User, href: "/profile" },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-cyan-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/feed" className="flex items-center">
              <GlitchText
                text="ALERT_SYSTEM"
                className="text-xl font-bold text-cyan-400"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map(({ label, icon: Icon, href }) => (
                <NeonButton
                  key={href}
                  onClick={() => router.push(href)}
                  active={pathname.startsWith(href)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </NeonButton>
              ))}
            </nav>

            {/* Mobile menu toggle */}
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

      {/* Mobile Menu */}
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
              {navLinks.map(({ label, icon: Icon, href }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Button
                    key={href}
                    variant="ghost"
                    onClick={() => {
                      router.push(href);
                      setMobileMenuOpen(false);
                    }}
                    className={`justify-start ${
                      isActive
                        ? "bg-cyan-950/30 text-cyan-300 border-l-2 border-cyan-500"
                        : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
