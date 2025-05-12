"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { EmptyStoriesState } from "@/components/stories-empty";

export default function LoadingExamplePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingType, setLoadingType] = useState<"full" | "component">("full");

  // Simulate loading for 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Function to trigger loading again
  const triggerLoading = (type: "full" | "component") => {
    setLoadingType(type);
    setIsLoading(true);

    // Simulate loading for 5 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  if (isLoading && loadingType === "full") {
    return <LoadingScreen message="LOADING CYBERPUNK EXPERIENCE" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">
          Loading Components
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-black/50 border border-cyan-900 p-6 rounded-sm">
            <h2 className="text-xl text-fuchsia-400 mb-4">
              Full Screen Loading
            </h2>
            <p className="text-gray-300 mb-4">
              Use the full screen loading component when transitioning between
              major sections of your app or during initial load.
            </p>
            <Button
              onClick={() => triggerLoading("full")}
              className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white"
            >
              Show Full Screen Loading
            </Button>
          </div>

          <div className="bg-black/50 border border-cyan-900 p-6 rounded-sm">
            <h2 className="text-xl text-fuchsia-400 mb-4">Component Loading</h2>
            <p className="text-gray-300 mb-4">
              Use the component loading indicators when loading specific
              sections or data within your app.
            </p>
            <Button
              onClick={() => triggerLoading("component")}
              className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white"
            >
              Show Component Loading
            </Button>
          </div>
        </div>

        {isLoading && loadingType === "component" ? (
          <div className="bg-black/50 border border-cyan-900 p-8 rounded-sm flex flex-col items-center justify-center min-h-[300px]">
            <LoadingIndicator size="lg" text="LOADING COMPONENT DATA" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 border border-cyan-900 p-6 rounded-sm flex flex-col items-center">
              <h3 className="text-lg text-cyan-400 mb-4">Small Indicator</h3>
              <LoadingIndicator size="sm" text="SMALL" />
            </div>

            <div className="bg-black/50 border border-cyan-900 p-6 rounded-sm flex flex-col items-center">
              <h3 className="text-lg text-cyan-400 mb-4">Medium Indicator</h3>
              <LoadingIndicator size="md" text="MEDIUM" />
            </div>

            <div className="bg-black/50 border border-cyan-900 p-6 rounded-sm flex flex-col items-center">
              <h3 className="text-lg text-cyan-400 mb-4">Large Indicator</h3>
              <LoadingIndicator size="lg" text="LARGE" />
            </div>
            <div className="bg-black/50 border border-cyan-900 p-6 rounded-sm flex flex-col items-center">
              <h3 className="text-lg text-cyan-400 mb-4">Large Indicator</h3>
              <EmptyStoriesState />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
