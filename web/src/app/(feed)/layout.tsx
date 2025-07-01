import type React from "react";
import "@/app/globals.css";
import { GameRoomsSidebar } from "@/components/feed/layout/right-sidebar";
import LeftPannel from "@/components/feed/layout/left-pannel";
import AppbarTabs from "@/components/navigation/app-tabs";

export const metadata = {
  title: "Social Media App",
  description: "A social media app for young users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen  relative md:py-16 bg-gradient-to-b  from-black/40 to-gray-900/60">
      {/* Main container */}
      <div className="relative">
        {/* Main content */}
        <main className=" container max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <LeftPannel />
          <div className="md:col-span-2 lg:col-span-2 relative">
            <AppbarTabs />
            {children}
          </div>
          {/* Right sidebar - Chess Rooms */}

          <GameRoomsSidebar />
        </main>
      </div>
    </div>
  );
}
