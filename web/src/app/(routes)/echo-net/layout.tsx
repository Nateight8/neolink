"use client";

import { PropsWithChildren } from "react";
import Conversations from "./_components/conversations";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex-1 container max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-6">
      <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] md:rounded-sm overflow-hidden border border-cyan-900 relative">
        {/* <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-30 blur-[1px] -z-10 hidden md:block"></div> */}

        <div className="hidden w-1/3 md:block">
          <Conversations />
        </div>
        {/* Chat area */}
        <div className="flex-1 bg-black ">{children}</div>
      </div>
    </main>
  );
}
