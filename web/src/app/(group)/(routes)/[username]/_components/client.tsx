"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
// import FeedPost from "@/components/feed/post/feed-post";
import { useAuth } from "@/contexts/auth-context";
import {
  ChatCenteredIcon,
  UserPlusIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/api/use-profile";
import { LoadingIndicator } from "@/components/loading-indicator";
import { FormattedContent } from "@/components/shared/formatted-content";
import { cn } from "@/lib/utils";
// import { FeedPost } from "@/components/feed/feed-post";
import FeedPost from "@/components/feed/post/feed-post";

export default function ProfileClient({ username }: { username: string }) {
  const { user, logout } = useAuth();
  const { data, isLoading } = useProfile(username);

  const participantId = data?.user?.participantId;

  const isLoggedInUser = user?.username === username;
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingIndicator text="FETCHING PROFILE DATA" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 relative">
      {/* Fixed Cyberpunk background with grid lines */}
      {/* <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div> */}

      {/* Scrollable content container */}
      <div className="relative z-10 h-screen bg-gradient-to-b from-black/40 to-gray-900/60 overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-8 text-center">
          {/* Fixed neon header bar */}
          <div className="sticky hidden md:block top-0 z-20 pt-4 pb-6 bg-black/80 backdrop-blur-sm">
            <div className="w-full h-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.7)] animate-pulse"></div>
          </div>

          {/* Profile Header - Centered with cyberpunk styling */}
          <div className="flex flex-col items-center justify-center gap-4 my-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-sm animate-pulse"></div>
              <Avatar className="h-32 w-32 border-2 border-cyan-500 relative shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                <AvatarImage
                  src={
                    data?.user?.avatar ||
                    "/placeholder.svg?height=128&width=128"
                  }
                  alt="Profile picture"
                />
                <AvatarFallback className="bg-black font-bold text-cyan-400 text-3xl">
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold font-mono text-white mb-1">
                {data?.user?.username}
              </h1>
              <p className="text-cyan-400 font-mono">@{data?.user?.handle}</p>
            </div>

            <div className="flex gap-3 mt-2">
              {isLoggedInUser ? (
                <EditProfileDialog />
              ) : (
                <Button size="sm" variant="cyan">
                  <UserPlusIcon className="mr-2 size-4" />
                  FOLLOW.SYS
                </Button>
              )}
              {isLoggedInUser ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    logout();
                  }}
                  className="relative overflow-hidden group px-6 py-2 rounded-sm border border-fuchsia-500/50 bg-black/80 text-fuchsia-300 hover:bg-fuchsia-900/30 hover:border-fuchsia-400 transition-all duration-300
                           hover:shadow-[0_0_15px_rgba(219,39,119,0.6)] hover:translate-y-[-2px]"
                >
                  <span className="relative z-10 font-mono text-sm tracking-wider flex items-center">
                    <SignOutIcon className="mr-2 h-4 w-4" />
                    DISCONNECT
                  </span>
                  {/* Glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {/* Animated border - top-left corner */}
                  <span className="absolute border-t-2 border-l-2 border-fuchsia-400/70 w-3 h-3 -left-0.5 -top-0.5 animate-pulse"></span>
                  {/* Animated border - bottom-right corner */}
                  <span className="absolute border-b-2 border-r-2 border-fuchsia-400/50 w-3 h-3 -right-0.5 -bottom-0.5 animate-pulse"></span>
                  {/* Hover effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/0 via-fuchsia-500/20 to-fuchsia-900/0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-x-150"></span>
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    router.push(
                      `/chats/${user?.participantId}-${participantId}`
                    )
                  }
                  size="sm"
                  variant="fuchsia"
                >
                  <ChatCenteredIcon className="mr-2 size-4" />
                  MESSAGE.SYS
                </Button>
              )}
            </div>
          </div>

          {/* Stats - Cyberpunk styled */}
          <div className="grid grid-cols-3 gap-4 mb-6 bg-black border border-cyan-900 rounded-sm p-4 max-w-md mx-auto relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400 font-mono">
                {data?.posts.length}
              </p>
              <p className="text-xs text-cyan-300 uppercase tracking-wider">
                Posts
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-fuchsia-400 font-mono">
                {data?.allies.length}
              </p>
              <p className="text-xs text-fuchsia-300 uppercase tracking-wider">
                Allies
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400 font-mono">0</p>
              <p className="text-xs text-cyan-300 uppercase tracking-wider">
                Power
              </p>
            </div>
          </div>

          {/* Bio - Cyberpunk styled */}
          <div className="mb-8 max-w-xl mx-auto bg-black/80 border border-fuchsia-900 p-4 rounded-sm relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

            <div className="mb-3 text-lg text-white text-left">
              {data?.user?.bio && data.user.bio.trim() !== "" ? (
                <FormattedContent
                  content={data.user.bio}
                  className={cn("text-cyan-500")}
                />
              ) : (
                <span className="text-cyan-400 flex items-center justify-center gap-2 font-mono">
                  {isLoggedInUser ? "TODO: add bio" : "ERROR: BIO_NOT_FOUND]"}
                </span>
              )}
            </div>
            {/* <div className="flex flex-wrap justify-center gap-2">
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
            </div> */}
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

            <TabsContent value="posts" className="mt-0 text-left">
              {data?.posts.map((post) => (
                <FeedPost key={post._id} post={post} className="line-clamp-5" />
              ))}
            </TabsContent>

            <TabsContent value="allies" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {data?.allies?.length ? (
                  data.allies.map((ally) => (
                    <div key={ally._id} className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm"></div>
                        <Avatar className="h-20 w-20 border border-cyan-500 relative">
                          <AvatarImage
                            src={
                              ally.avatar ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={ally.username}
                          />
                          <AvatarFallback className="bg-black font-bold text-cyan-400">
                            <UserIcon />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="font-bold text-sm text-white">
                        {ally.fullName}
                      </p>
                      <p className="text-xs text-cyan-400 font-mono">
                        @{ally.handle}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-cyan-400">
                    No allies yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {data?.achievements?.length ? (
                  data.achievements.map((achievement, index) => (
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
                  ))
                ) : (
                  <p className="col-span-full text-center text-cyan-400">
                    No achievements yet.
                  </p>
                )}
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
