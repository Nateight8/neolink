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
import { Post } from "@/types/chat";
import { UserIcon } from "@phosphor-icons/react";

interface UserDataProps {
  post: Post;
}

export default function UserData({ post }: UserDataProps) {
  const { username, handle, avatar, bio, participantId, fullName } =
    post.author;
  const { createdAt } = post;
  const { user } = useAuth();

  const loggedInUser = user?.participantId;
  const router = useRouter();
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/echo-net/${loggedInUser}-${participantId}`);
  };

  return (
    <HoverCard>
      <div className="flex items-center w-full">
        <HoverCardTrigger asChild>
          <div
            className="flex items-center w-fit min-w-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/${username}`);
            }}
          >
            <div className="flex items-center min-w-0">
              <span
                className="glitch-text font-bold font-mono hover:underline truncate md:max-w-max max-w-[7ch]"
                title={handle}
              >
                {handle}
              </span>

              {/* <span className="mx-1 text-gray-600 font-mono">·</span> */}
              <span
                className="glitch-text ml-1 font-mono text-muted-foreground truncate max-w-[10ch]"
                title={`@${username}`}
              >
                @{username}
              </span>
            </div>
          </div>
        </HoverCardTrigger>
        <div className="flex items-center">
          <span className="mx-2 text-gray-600 font-mono">·</span>
          <span className="text-gray-500 text-xs font-mono whitespace-nowrap">
            {getCompactRelativeTime(createdAt)}
          </span>
        </div>
      </div>
      <HoverCardContent className="w-80 border-cyan-900/50 bg-black text-white">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Avatar className="h-10 w-10 shrink-0 rounded-full border border-cyan-700">
                <AvatarImage src={avatar} alt={fullName} />
                <AvatarFallback className="bg-black text-cyan-400">
                  <UserIcon size={24} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-mono font-bold text-white">
                  {handle}
                </span>
                <span className="font-mono text-sm text-gray-500">
                  @{username}
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

          {/* {mutualFriends && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {mutualFriends.avatars.map((friendAvatar) => (
                  <Avatar
                    key={friendAvatar}
                    className="h-10 w-10 shrink-0 rounded-full border border-cyan-700"
                  >
                    <AvatarImage src={friendAvatar} alt={friendAvatar} />
                    <AvatarFallback className="bg-black text-cyan-400">
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {mutualFriends.count} mutual friends
              </div>
            </div>
          )} */}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
