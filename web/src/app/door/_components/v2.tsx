import { PlusIcon } from "lucide-react";

export default function V2() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#0f1113] z-[70]">
      <div className="w-8 flex flex-col items-center">
        {/* Top line */}
        <div className="relative w-full h-[76px]">
          <div className="absolute left-1/2 top-0 h-full w-px bg-slate-500 -translate-x-1/2"></div>
        </div>

        {/* Plus icon */}
        <div className="size-8 rounded-full border border-slate-500 flex items-center justify-center">
          <PlusIcon className="size-4" />
        </div>

        {/* Bottom curved line */}
        <div className="relative w-full h-[76px]">
          <div className="absolute left-1/2 top-0 h-full w-1/2 border-b border-l border-slate-500 rounded-bl-3xl"></div>
        </div>
      </div>
    </div>
  );
}
