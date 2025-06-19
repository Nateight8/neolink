"use client";

import { PropsWithChildren } from "react";
import Conversations from "./_components/conversations";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex-1 max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-6 min-h-0">
      <div className="flex h-[99dvh] md:h-[85dvh] md:rounded-sm md:border border-cyan-900 relative overflow-hidden">
        {/* Optional gradient background */}
        {/* <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-30 blur-[1px] -z-10 hidden md:block"></div> */}

        {/* Conversations sidebar - hidden on mobile, 1/3 width on desktop */}
        <div className="hidden w-1/3 md:block min-w-0">
          <Conversations />
        </div>

        {/* Chat area - full width, flexible */}
        <div className="flex-1 bg-black min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </main>
  );
}
