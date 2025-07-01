"use client";

import { AppBarWithTabs } from "../../../components/navigation/mobile/app-bar";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppBarWithTabs />

      {/* Demo content to enable scrolling */}
      <div className="pt-24 px-4 space-y-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Twitter-Style Navigation Demo</h1>
          <p className="text-muted-foreground">
            Scroll down to see the tabs slide under the main app bar, just like
            Twitter&apos;s navigation.
          </p>

          {/* Generate content for scrolling */}
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="p-6 border rounded-lg bg-card">
              <h2 className="text-lg font-semibold mb-2">
                Content Block {i + 1}
              </h2>
              <p className="text-muted-foreground">
                This is some demo content to enable scrolling. Keep scrolling to
                see the navigation behavior. The tabs will slide up behind the
                main app bar as you scroll down, creating a smooth Twitter-like
                navigation experience.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
