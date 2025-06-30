"use client";
import { useRouter } from "next/navigation";
import { ArrowBigLeftDash } from "lucide-react";

export default function PostAppBar() {
  const router = useRouter();
  return (
    <div className="sticky hidden md:block top-0 pb-4 z-20 bg-background">
      <div className="h-0.5 border-b border-cyan-900 border-x "></div>
      <div className=" flex items-center gap-2 h-14 bg-black/80 backdrop-blur border-b border-cyan-900">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-cyan-950/40 transition cursor-pointer"
          aria-label="Back"
        >
          <ArrowBigLeftDash className="h-5 w-5 text-cyan-400" />
        </button>
        <span className="text-cyan-300 font-mono text-sm">Back</span>
      </div>
      <div className="h-0.5 border-t border-cyan-900 border-x "></div>
    </div>
  );
}
