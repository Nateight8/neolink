import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BeveledButton } from "@/components/ui/beveled-button";
import { MessageSquare } from "lucide-react";

interface AtMentionProps {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  mutualFriends?: {
    count: number;
    avatars: string[];
  };
}

export default function AtMention({
  name,
  handle,
  avatar,
  bio,
  mutualFriends,
}: AtMentionProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className="glitch-text cursor-pointer text-cyan-300 hover:text-cyan-300"
          data-text={`@${handle}`}
        >
          @{handle}
        </span>
      </HoverCardTrigger>
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
              <BeveledButton size="icon-lsm">
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
