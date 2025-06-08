"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Cpu } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import Posts from "@/components/profile/posts";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen  relative">
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Scrollable content container */}
      <div className="relative z-10 h-screen bg-gradient-to-b from-black/40 to-gray-900/60 overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-8 text-center">
          {/* Fixed neon header bar */}
          <div className="sticky top-0 z-20 pt-4 pb-6 bg-black/80 backdrop-blur-sm">
            <div className="w-full h-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.7)] animate-pulse"></div>
          </div>

          {/* Profile Header - Centered with cyberpunk styling */}
          <div className="flex flex-col items-center justify-center gap-4 my-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-sm animate-pulse"></div>
              <Avatar className="h-32 w-32 border-2 border-cyan-500 relative shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                <AvatarImage
                  src="/placeholder.svg?height=128&width=128"
                  alt="Profile picture"
                />
                <AvatarFallback className="bg-black font-bold text-cyan-400 text-3xl">
                  {user?.fullName
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.username}
              </h1>
              <p className="text-cyan-400 font-mono">@{user?.handle}</p>
            </div>

            <div className="flex gap-3 mt-2">
              <EditProfileDialog />
              <Button
                size="sm"
                variant="default"
                className="rounded-sm bg-fuchsia-600 hover:bg-fuchsia-700 shadow-[0_0_10px_rgba(219,39,119,0.5)]"
              >
                CONNECT
              </Button>
            </div>
          </div>

          {/* Stats - Cyberpunk styled */}
          <div className="grid grid-cols-3 gap-4 mb-6 bg-black border border-cyan-900 rounded-sm p-4 max-w-md mx-auto relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400 font-mono">248</p>
              <p className="text-xs text-cyan-300 uppercase tracking-wider">
                Posts
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-fuchsia-400 font-mono">
                12.4K
              </p>
              <p className="text-xs text-fuchsia-300 uppercase tracking-wider">
                Allies
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400 font-mono">342</p>
              <p className="text-xs text-cyan-300 uppercase tracking-wider">
                Power
              </p>
            </div>
          </div>

          {/* Bio - Cyberpunk styled */}
          <div className="mb-8 max-w-md mx-auto bg-black/80 border border-fuchsia-900 p-4 rounded-sm relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

            <p className="mb-3 text-lg text-white">
              ⚡ EXPLORING THE DIGITAL FRONTIER ⚡
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                variant="outline"
                className="rounded-sm border-cyan-500 bg-cyan-950/50 text-cyan-300"
              >
                <Cpu className="h-3 w-3 mr-1" /> TECH WIZARD
              </Badge>
              <Badge
                variant="outline"
                className="rounded-sm border-fuchsia-500 bg-fuchsia-950/50 text-fuchsia-300"
              >
                <Zap className="h-3 w-3 mr-1" /> NEON GAMER
              </Badge>
              <Badge
                variant="outline"
                className="rounded-sm border-cyan-500 bg-cyan-950/50 text-cyan-300"
              >
                <Shield className="h-3 w-3 mr-1" /> CYBER DEFENDER
              </Badge>
            </div>
          </div>

          {/* Content Tabs - Cyberpunk styled */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 rounded-sm mb-6 bg-black border border-cyan-900">
              <TabsTrigger
                value="posts"
                className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300"
              >
                POSTS.SYS
              </TabsTrigger>
              <TabsTrigger
                value="allies"
                className="rounded-none data-[state=active]:bg-fuchsia-950 data-[state=active]:text-fuchsia-300"
              >
                ALLIES.SYS
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300"
              >
                ACHIEVEMENTS.SYS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0">
              <Posts />
            </TabsContent>

            <TabsContent value="allies" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                  <div key={item} className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm"></div>
                      <Avatar className="h-20 w-20 border border-cyan-500 relative">
                        <AvatarImage
                          src={`/placeholder.svg?height=80&width=80&text=ALLY_${item}`}
                          alt={`Ally ${item}`}
                        />
                        <AvatarFallback className="bg-black font-bold text-cyan-400">
                          {user?.fullName
                            ?.split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="font-bold text-sm text-white">CYBER_{item}</p>
                    <p className="text-xs text-cyan-400 font-mono">
                      @runner_{item}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {[
                  { name: "NEURAL HACKER", icon: "🧠", color: "cyan" },
                  { name: "GRID MASTER", icon: "🌐", color: "fuchsia" },
                  { name: "CODE BREAKER", icon: "⚡", color: "cyan" },
                  { name: "NEON ARTIST", icon: "🎨", color: "fuchsia" },
                  { name: "DATA MINER", icon: "💾", color: "cyan" },
                  { name: "CYBER DEFENDER", icon: "🛡️", color: "fuchsia" },
                  { name: "DIGITAL NOMAD", icon: "🚀", color: "cyan" },
                  { name: "CRYPTO WIZARD", icon: "🔮", color: "fuchsia" },
                  { name: "NETWORK GHOST", icon: "👻", color: "cyan" },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-4 bg-black border border-${achievement.color}-900 rounded-sm relative`}
                  >
                    <div
                      className={`absolute -inset-[1px] bg-gradient-to-r from-${
                        achievement.color
                      }-500 to-${
                        achievement.color === "cyan" ? "fuchsia" : "cyan"
                      }-500 rounded-sm opacity-50 blur-[2px] -z-10`}
                    ></div>

                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mb-3"></div>
                    <p
                      className={`font-bold text-${achievement.color}-400 font-mono text-sm tracking-wider`}
                    >
                      {achievement.name}
                    </p>
                    <p className="text-xs text-white/70 mt-1">LEVEL 3</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer space to ensure scrolling works well */}
          <div className="h-16 mt-12"></div>
        </div>
      </div>
    </div>
  );
}
