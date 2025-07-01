import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";

export default function GlobalChat({
  chatMessages,
  chatMessage,
  setChatMessage,
}: {
  chatMessages: {
    id: number;
    username: string;
    message: string;
    time: string;
    avatar: string;
  }[];
  chatMessage: string;
  setChatMessage: (message: string) => void;
}) {
  return (
    <>
      <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

        <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Neural Network Chat
        </h3>

        <ScrollArea className="h-48 mb-3">
          <div className="space-y-2">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={msg.avatar || "/placeholder.svg"}
                    alt={msg.username}
                  />
                  <AvatarFallback className="bg-black text-cyan-400 text-xs">
                    {msg.username.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 text-sm font-medium">
                      {msg.username}
                    </span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            placeholder="Enter neural message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-1 bg-black/50 border-cyan-900 text-white placeholder-gray-500"
          />
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
