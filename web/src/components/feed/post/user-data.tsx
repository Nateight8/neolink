"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BeveledButton } from "@/components/ui/beveled-button";
import { MessageSquare } from "lucide-react";
import { getCompactRelativeTime } from "@/lib/relative-time";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface UserDataProps {
  name: string;
  handle: string;
  timestamp: string;
  avatar: string;
  bio: string;
  mutualFriends?: {
    count: number;
    avatars: string[];
  };
  participantId: string;
}

export default function UserData({
  name,
  handle,
  timestamp,
  avatar,
  bio,
  mutualFriends,
  participantId,
}: UserDataProps) {
  const { user } = useAuth();

  const loggedInUser = user?.participantId;
  const router = useRouter();
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/echo-net/${loggedInUser}-${participantId}`);
  };

  return (
    <HoverCard>
      <div className="flex cursor-pointer items-center text-sm w-fit ">
        <HoverCardTrigger asChild>
          <div className="flex cursor-pointer items-center text-sm w-fit ">
            <span
              className="glitch-text mr-2 font-bold text-white hover:underline"
              data-text={name}
            >
              {name}
            </span>
            <span
              className="glitch-text font-mono text-muted-foreground"
              data-text={`@${handle}`}
            >
              @{handle}
            </span>
          </div>
        </HoverCardTrigger>
        <span className="mx-2 text-gray-600">·</span>
        <span className="text-gray-500">
          {getCompactRelativeTime(timestamp)}
        </span>
      </div>
      <HoverCardContent className="w-80 border-cyan-900/50 bg-black text-white">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Avatar className="h-10 w-10 shrink-0 rounded-full border border-cyan-700">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-black text-cyan-400">
                  {name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-bold text-white">{name}</span>
                <span className="font-mono text-sm text-gray-500">
                  @{handle}
                </span>
              </div>
            </div>
            <div className="">
              <BeveledButton onClick={handleMessage} size="icon-lsm">
                <MessageSquare className="size-3" />
              </BeveledButton>
            </div>
            {/* TODO: Add follow button */}
          </div>

          <p className="text-sm text-gray-300">{bio}</p>

          {mutualFriends && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {mutualFriends.avatars.map((friendAvatar) => (
                  <Avatar
                    key={friendAvatar}
                    className="h-10 w-10 shrink-0 rounded-full border border-cyan-700"
                  >
                    <AvatarImage src={friendAvatar} alt={friendAvatar} />
                    <AvatarFallback className="bg-black text-cyan-400">
                      {name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {mutualFriends.count} mutual friends
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
