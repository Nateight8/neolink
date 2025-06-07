"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PageTransition } from "../page-transition";
import { ErrorBoundary } from "../error-boundary";

interface TransitionContextType {
  isTransitioning: boolean;
  navigateWithTransition: (path: string) => void;
}

// Export the context so it can be used directly in useDoorTransition
export const TransitionContext = createContext<
  TransitionContextType | undefined
>(undefined);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDoorsOpen, setIsDoorsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navigateWithTransition = useCallback(
    (path: string) => {
      try {
        // Prevent multiple transitions and self-navigation
        if (isTransitioning || path === pathname) return;

        // Don't attempt to transition to the same path
        if (path === window.location.pathname) return;

        setIsTransitioning(true);
        setIsDoorsOpen(false);

        // Wait for doors to close, then navigate
        const transitionTimer = setTimeout(() => {
          try {
            router.push(path);

            // Set a timer to reset the transition state in case navigation fails
            const resetTimer = setTimeout(() => {
              setIsDoorsOpen(true);
              setIsTransitioning(false);
            }, 2000); // 2 seconds should be enough for most navigations

            // Cleanup timer on unmount
            return () => clearTimeout(resetTimer);
          } catch (error) {
            console.error("Navigation error:", error);
            // If navigation fails, reset the transition state
            setIsDoorsOpen(true);
            setIsTransitioning(false);
            // Fall back to regular navigation
            window.location.href = path;
          }
        }, 800);

        // Cleanup timer on unmount or if navigation is interrupted
        return () => clearTimeout(transitionTimer);
      } catch (error) {
        console.error("Transition error:", error);
        // If anything goes wrong, ensure we don't get stuck in a transitioning state
        setIsTransitioning(false);
        // Fall back to regular navigation
        window.location.href = path;
      }
    },
    [isTransitioning, pathname, router]
  );

  const contextValue = useMemo(
    () => ({
      isTransitioning,
      navigateWithTransition,
    }),
    [isTransitioning, navigateWithTransition]
  );

  return (
    <ErrorBoundary>
      <TransitionContext.Provider value={contextValue}>
        <PageTransition
          isOpen={isDoorsOpen}
          onTransitionComplete={() => {
            // Transition complete callback if needed
          }}
        >
          {children}
        </PageTransition>
      </TransitionContext.Provider>
    </ErrorBoundary>
  );
}

const defaultTransitionContext = {
  isTransitioning: false,
  navigateWithTransition: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  },
};

export function useTransition() {
  const context = useContext(TransitionContext);
  return context || defaultTransitionContext;
}
