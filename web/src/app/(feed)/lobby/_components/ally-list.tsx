import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gamepad2, MessageCircle, Users } from "lucide-react";

export default function AllyList({
  friends,
}: {
  friends: {
    id: number;
    username: string;
    avatar: string;
    status: string;
    rating: number;
    lastSeen: string;
  }[];
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-cyan-400";
      case "playing":
        return "bg-fuchsia-400";
      case "away":
        return "bg-yellow-400";
      default:
        return "bg-gray-600";
    }
  };
  return (
    <>
      <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

        <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Neural Allies ({
            friends.filter((f) => f.status === "online").length
          }{" "}
          online)
        </h3>

        <ScrollArea className="h-64">
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center space-x-3 p-2 rounded-sm bg-black/30 hover:bg-cyan-950/20 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-cyan-500">
                    <AvatarImage
                      src={friend.avatar || "/placeholder.svg"}
                      alt={friend.username}
                    />
                    <AvatarFallback className="bg-black text-cyan-400 text-xs">
                      {friend.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(
                      friend.status
                    )}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {friend.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {friend.rating} • {friend.lastSeen}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300"
                  >
                    <Gamepad2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
