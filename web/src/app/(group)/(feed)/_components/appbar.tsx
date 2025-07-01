"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppBarTabs() {
  const pathname = usePathname();
  return (
    <>
      {" "}
      <ScrollArea className="w-full border bg-black   whitespace-nowrap mb-4 border-cyan-900">
        <nav className="rounded-sm  flex items-center justify-start gap-1 p-[3px] min-w-max">
          <Link href="/">
            <Button
              variant="ghost"
              className={`rounded-none px-4 md:px-6 text-sm md:text-base text-cyan-300 hover:bg-cyan-950 ${
                pathname === "/" ? "bg-cyan-950 text-cyan-300" : ""
              }`}
              data-state={pathname === "/" ? "active" : undefined}
            >
              FOR_YOU.SYS
            </Button>
          </Link>
          <Link href="/following">
            <Button
              variant="ghost"
              className={`rounded-none px-4 md:px-6 text-sm md:text-base text-fuchsia-300 hover:bg-fuchsia-950 ${
                pathname === "/following"
                  ? "bg-fuchsia-950 text-fuchsia-300"
                  : ""
              }`}
              data-state={pathname === "/following" ? "active" : undefined}
            >
              FOLLOWING.SYS
            </Button>
          </Link>
          <Link href="/book-marks">
            <Button
              variant="ghost"
              className={`rounded-none px-4 md:px-6 text-sm md:text-base text-amber-300 hover:bg-amber-950 ${
                pathname === "/book-marks" ? "bg-amber-950 text-amber-300" : ""
              }`}
              data-state={pathname === "/book-marks" ? "active" : undefined}
            >
              BOOK_MARKS.SYS
            </Button>
          </Link>
          <Link href="/chess">
            <Button
              variant="ghost"
              className={`rounded-none px-4 md:px-6 text-sm md:text-base text-amber-300 hover:bg-amber-950 ${
                pathname === "/chess" ? "bg-amber-950 text-amber-300" : ""
              }`}
              data-state={pathname === "/chess" ? "active" : undefined}
            >
              CHESS.SYS
            </Button>
          </Link>
        </nav>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </>
  );
}
