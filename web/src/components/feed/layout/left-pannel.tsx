"use client";
import { Button } from "@/components/ui/button";
import { HackerNews } from "../hacker-news";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cpu, Radio, Shield, Skull, Siren } from "lucide-react";
import { CyberPanel } from "../cyber-pannel";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

// Mock data for trending topics
const TRENDING = [
  {
    id: 1,
    tag: "NEURAL_LINK",
    count: "24.5K",
    icon: <Cpu className="h-3 w-3" />,
  },
  {
    id: 2,
    tag: "CYBER_RIOT",
    count: "18.2K",
    icon: <Siren className="h-3 w-3" />,
  },
  {
    id: 3,
    tag: "NEON_DISTRICT",
    count: "12.7K",
    icon: <Radio className="h-3 w-3" />,
  },
  {
    id: 4,
    tag: "DATA_BREACH",
    count: "9.3K",
    icon: <Shield className="h-3 w-3" />,
  },
  {
    id: 5,
    tag: "GHOST_PROTOCOL",
    count: "7.1K",
    icon: <Skull className="h-3 w-3" />,
  },
];

export default function LeftPannel() {
  const router = useRouter();

  const { user } = useAuth();

  return (
    <aside className="hidden md:block">
      <div className="sticky top-20 space-y-6">
        {/* User profile card */}
        <CyberPanel title={user ? "IDENTITY" : "GHOST"}>
          <div className="flex items-center gap-2 w-full justify-center flex-col mb-4">
            <Avatar className="h-12 w-12 border border-cyan-500 relative">
              <AvatarImage
                src="/placeholder.svg?height=50&width=50&text=JD"
                alt="Profile"
              />
              <AvatarFallback className="bg-black text-cyan-400 font-bold">
                {user?.handle
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center flex flex-col items-center justify-center">
              <h3 className="font-bold text-white">
                {user?.handle || "Neural Drifter"}
              </h3>
              <p className="text-xs text-cyan-400 font-mono">
                @
                {user?.username ||
                  `Neural_Guest_${Math.floor(1000 + Math.random() * 9000)}`}
              </p>
              <div className="flex items-center gap-3 mt-4 text-xs">
                <span className="text-cyan-400">
                  <span className="text-cyan-500">RATING:</span>{" "}
                  {user?.rating || 1200}
                </span>
                <span className="text-fuchsia-400">
                  <span className="text-fuchsia-500">LVL:</span>{" "}
                  {user?.level || 1}
                </span>
              </div>
              <div className="w-full mt-2 flex flex-col justify-center items-center px-2">
                <div className="h-1.5 w-full bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/20">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        user?.xp ? (user.xp / (user.maxXp || 1000)) * 100 : 0
                      }%`,
                      boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)",
                    }}
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-cyan-300 font-mono">
                    {user?.xp || 0}
                    <span className="text-cyan-500/80">
                      /{user?.maxXp || 1000} XP
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div>
              <p className="text-lg font-bold text-cyan-400">0</p>
              <p className="text-xs text-gray-400">POSTS</p>
            </div>
            <div>
              <p className="text-lg font-bold text-fuchsia-400">
                {user?.friends?.length || 0}
              </p>
              <p className="text-xs text-gray-400">ALLIES</p>
            </div>
            <div>
              <p className="text-lg font-bold text-cyan-400">0</p>
              <p className="text-xs text-gray-400">POWER</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push("/biochip")}
            className="w-full rounded-sm border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300"
          >
            VIEW_PROFILE.SYS
          </Button>
        </CyberPanel>

        {/* Trending topics */}
        <CyberPanel title="TRENDING_TOPICS">
          <ul className="space-y-3">
            {TRENDING.map((topic) => (
              <li key={topic.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-between rounded-sm text-left hover:bg-fuchsia-950/30 group"
                >
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-black border-fuchsia-500 text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:text-fuchsia-300"
                    >
                      {topic.icon}
                    </Badge>
                    <span className="text-white group-hover:text-fuchsia-300">
                      #{topic.tag}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-fuchsia-300">
                    {topic.count}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            className="w-full mt-2 text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
          >
            VIEW_ALL_TRENDS.SYS
          </Button>
        </CyberPanel>

        {/* Hacker news */}
        <HackerNews />
      </div>
    </aside>
  );
}
