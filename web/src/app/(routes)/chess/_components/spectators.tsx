import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Spectator {
  id: string;
  username: string;
  avatar?: string;
}

interface SpectatorsProps {
  spectators: Spectator[];
  moveHistory: string[];
}

export default function Spectators({
  spectators,
  moveHistory,
}: SpectatorsProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="bg-black/80 border border-gray-800 rounded-sm p-4 relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-gray-700/20 to-gray-700/10 rounded-sm opacity-30 blur-[1px] -z-10" />
        <div className="flex items-center space-x-2 mb-3">
          <Users className="h-4 w-4 text-gray-400" />
          <h4 className="text-gray-400 font-cyber text-sm">
            SPECTATORS ({spectators.length})
          </h4>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {spectators.map((spectator) => (
            <div key={spectator.id} className="flex items-center space-x-2">
              <Avatar className="h-6 w-6 border border-gray-600">
                <AvatarImage
                  src={spectator.avatar || "/placeholder.svg"}
                  alt={spectator.username}
                />
                <AvatarFallback className="bg-black text-gray-400 text-xs">
                  {spectator.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-300 text-sm">
                {spectator.username}
              </span>
            </div>
          ))}
        </div>

        {/* Move History */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-gray-400 font-cyber text-sm mb-3">
            MOVE HISTORY
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {moveHistory.length > 0 ? (
              moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="text-xs font-mono text-gray-300 flex"
                >
                  <span className="w-8 text-gray-500">
                    {Math.floor(index / 2) + 1}.
                  </span>
                  <span
                    className={
                      index % 2 === 0 ? "text-cyan-400" : "text-fuchsia-400"
                    }
                  >
                    {move}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs">AWAITING FIRST MOVE</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
