import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

export interface PlayerData {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
}

interface PlayerProps {
  player: PlayerData;
  isCurrentPlayer: boolean;
  timeRemaining: number;
  capturedPieces: string[];
  color: "white" | "black";
  isLoggedIn?: boolean;
}

export default function Player({
  player,
  isCurrentPlayer,
  timeRemaining,
  capturedPieces,
  color,
  isLoggedIn,
}: PlayerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const borderColor =
    color === "black" ? "border-fuchsia-500" : "border-cyan-500";
  const textColor = color === "black" ? "text-fuchsia-400" : "text-cyan-400";
  const bgGradient =
    color === "black"
      ? "from-fuchsia-500/30 to-fuchsia-500/10"
      : "from-cyan-500/30 to-cyan-500/10";

  return (
    <div className="w-full">
      {isLoggedIn && (
        <div className="border w-full">
          {capturedPieces.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className={`${textColor} text-xs font-cyber mr-2`}>
                CAPTURED:
              </span>
              <div className="flex space-x-1">
                {capturedPieces.map((piece, index) => (
                  <span
                    key={index}
                    className={`${textColor} text-lg`}
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(0, 255, 255, 0.6))",
                    }}
                  >
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div
        className={`w-full max-w-[600px] bg-black/80 border ${borderColor} rounded-sm p-4 py-2 relative`}
      >
        <div
          className={`absolute -inset-[1px] bg-gradient-to-r ${bgGradient} rounded-sm opacity-30 blur-[1px] -z-10`}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={`h-12 w-12 border-2 ${borderColor}`}>
              <AvatarImage
                src={player.avatar || "/placeholder.svg"}
                alt={player.username}
              />
              <AvatarFallback className={`bg-black ${textColor}`}>
                {player.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-white font-cyber">
                {player.username}
              </h3>
              <p className={`${textColor} text-sm`}>
                NEURAL RATING: {player.rating}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className={`h-4 w-4 ${textColor}`} />
              <span
                className={`font-mono text-lg ${
                  isCurrentPlayer ? textColor : "text-gray-400"
                } ${timeRemaining <= 60 ? "animate-pulse" : ""}`}
              >
                {formatTime(timeRemaining)}
              </span>
              {isCurrentPlayer && (
                <div
                  className={`w-2 h-2 ${textColor} rounded-full animate-pulse`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {!isLoggedIn && (
        <div className="border w-full">
          {capturedPieces.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className={`${textColor} text-xs font-cyber mr-2`}>
                CAPTURED:
              </span>
              <div className="flex space-x-1">
                {capturedPieces.map((piece, index) => (
                  <span
                    key={index}
                    className={`${textColor} text-lg`}
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(0, 255, 255, 0.6))",
                    }}
                  >
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
