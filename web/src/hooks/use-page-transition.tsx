"use client";

import { useTransition } from "@/components/provider/page-transition-provider";

export function useDoorTransition() {
  const { isTransitioning, navigateWithTransition } = useTransition();

  return {
    isTransitioning,
    navigateWithTransition,
    // Alias for backward compatibility
    triggerTransition: navigateWithTransition,
  };
}
