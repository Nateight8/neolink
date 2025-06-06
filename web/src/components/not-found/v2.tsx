import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundClient() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Cyberpunk 404 Design */}
        <div className="relative">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl font-bold text-cyan-400/20 animate-ping">
            404
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            <span className="text-red-500">ERROR:</span> Neural Link
            Disconnected
          </h2>
          <p className="text-gray-400">
            The requested data stream could not be located in the neural
            network.
          </p>
        </div>

        {/* Glitch Effect */}
        <div className="relative overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-ping" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
          >
            <Link href="/">Reconnect to Main Feed</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
          >
            <Link href="/feed">Access Neural Network</Link>
          </Button>
        </div>

        {/* System Info */}
        <div className="text-xs text-gray-500 font-mono space-y-1">
          <div>System Status: DISCONNECTED</div>
          <div>Error Code: 404_NEURAL_LINK_LOST</div>
          <div>Timestamp: {new Date().toISOString()}</div>
        </div>
      </div>
    </div>
  );
}
