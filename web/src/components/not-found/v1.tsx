"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundClient() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-300 p-4 text-center">
      <div className="max-w-md w-full space-y-6 p-8 border border-cyan-900/50 rounded-lg bg-black/50 backdrop-blur-sm">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            404
          </h1>
          <h2 className="text-2xl font-mono tracking-wider">
            TARGET NOT FOUND
          </h2>
          <p className="text-cyan-200/70">
            The node you&apos;re trying to access doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <Link href="/" className="block">
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-mono tracking-wider py-6 rounded-sm border border-cyan-400/20">
              RETURN TO HOMEPAGE
            </Button>
          </Link>

          <div className="text-sm text-cyan-400/60">
            <span>Or try </span>
            <Link href="/discover" className="text-cyan-300 hover:underline">
              discovering new connections
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 text-xs text-cyan-900/50 font-mono">
        <p>ERROR: 0x7E57E1</p>
      </div>
    </div>
  );
}
