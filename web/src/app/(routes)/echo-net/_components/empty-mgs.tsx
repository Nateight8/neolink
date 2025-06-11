import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function EmptyMessages() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500 flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        NO ACTIVE NEURAL CONNECTION
      </h3>
      <p className="text-gray-400 max-w-md mb-6">
        Select a conversation from the list to establish a neural link or start
        a new connection.
      </p>
      <Button className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]">
        NEW_NEURAL_CONNECTION
      </Button>
    </div>
  );
}
