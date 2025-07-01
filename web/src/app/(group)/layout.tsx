import { FloatingDock } from "@/components/navigation/floating-dock";

import { BottomNav } from "@/components/navigation/mobile/bottom-nav";
import { AppBarWithTabs } from "@/components/navigation/mobile/app-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative ">
      <AppBarWithTabs />
      <BottomNav />
      <div className="">{children}</div>
      <FloatingDock
        desktopClassName="fixed bottom-6 right-6 z-50"
        mobileClassName="fixed bottom-6 right-6 z-50"
      />
    </main>
  );
}
