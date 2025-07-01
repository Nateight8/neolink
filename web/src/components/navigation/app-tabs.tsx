"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function AppbarTabs() {
  const pathname = usePathname();

  return (
    <>
      <>
        <div className="bg-background hidden md:block sticky top-0 backdrop-blur-3xl z-50 border-b border-cyan-600">
          <ScrollArea className="w-full border-b border-foreground/10">
            <nav className="flex items-center justify-start h-9 w-max">
              <Link href="/" className="h-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "group relative h-full px-3 text-xs font-mono tracking-tight",
                    "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                    "data-[active=true]:text-foreground"
                  )}
                  data-active={pathname === "/"}
                >
                  <span className="relative">
                    FOR_YOU
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                        "group-data-[active=true]:scale-x-100"
                      )}
                    />
                  </span>
                </Button>
              </Link>

              <Link href="/following" className="h-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "group relative h-full px-3 text-xs font-mono tracking-tight",
                    "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                    "data-[active=true]:text-foreground"
                  )}
                  data-active={pathname === "/following"}
                >
                  <span className="relative">
                    FOLLOWING
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                        "group-data-[active=true]:scale-x-100"
                      )}
                    />
                  </span>
                </Button>
              </Link>

              <Link href="/book-marks" className="h-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "group relative h-full px-3 text-xs font-mono tracking-tight",
                    "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                    "data-[active=true]:text-foreground"
                  )}
                  data-active={pathname === "/book-marks"}
                >
                  <span className="relative">
                    BOOKMARKS
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                        "group-data-[active=true]:scale-x-100"
                      )}
                    />
                  </span>
                </Button>
              </Link>

              <Link href="/chess" className="h-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "group relative h-full px-3 text-xs font-mono tracking-tight",
                    "text-foreground/60 hover:text-foreground/80 hover:bg-transparent",
                    "data-[active=true]:text-foreground"
                  )}
                  data-active={pathname === "/chess"}
                >
                  <span className="relative">
                    CHESS
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground scale-x-0 transition-transform duration-200",
                        "group-data-[active=true]:scale-x-100"
                      )}
                    />
                  </span>
                </Button>
              </Link>
            </nav>
            <ScrollBar orientation="horizontal" className="h-1" forceMount />
          </ScrollArea>
        </div>
      </>
    </>
  );
}
