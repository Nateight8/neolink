import type { ReactNode } from "react";

interface CyberPanelProps {
  title: string;
  children: ReactNode;
}

export function CyberPanel({ title, children }: CyberPanelProps) {
  return (
    <div className="bg-black border border-cyan-900 rounded-sm p-4 relative">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10"></div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-cyan-400 font-mono">{title}</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"></div>
      </div>

      {children}
    </div>
  );
}
