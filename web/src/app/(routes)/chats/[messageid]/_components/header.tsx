import { Dispatch, SetStateAction } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowBigLeftDashIcon,
  Brain,
  MoreVertical,
  Phone,
  Shield,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserMeta } from "@/hooks/api/use-direct-message";

interface ChatProps {
  setActiveNeuralLink: Dispatch<SetStateAction<boolean>>;
  activeNeuralLink: boolean;
  user?: UserMeta | null;
}

export default function ChatHeader({
  activeNeuralLink,
  setActiveNeuralLink,
  user,
}: ChatProps) {
  const toggleNeuralLink = () => {
    setActiveNeuralLink(!activeNeuralLink);
  };

  const router = useRouter();

  return (
    <>
      {" "}
      {/* Chat header */}
      <div className="py-3 border-b border-cyan-900 flex items-center justify-between">
        <div className="flex items-center">
          {/* Back button (mobile only) */}
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="h-8 md:hidden w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
          >
            <ArrowBigLeftDashIcon />
          </Button>

          {/* User info */}
          <div className="flex flex-1 items-center mx-3">
            <div className="relative">
              <Avatar className="size-8 border border-cyan-500">
                <AvatarImage
                  src={user?.avatarUrl || ""}
                  alt={
                    user?.username || user?.fullName || user?.handle || "User"
                  }
                />
                <AvatarFallback className="bg-black text-cyan-400">
                  {(
                    user?.username ||
                    user?.fullName ||
                    user?.handle ||
                    "UN"
                  ).substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 size-2 rounded-full border border-black ${
                  user?.status === "online"
                    ? "bg-green-500"
                    : user?.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div className="ml-3">
              <div className=" items-center hidden">
                <h3 className="font-bold text-white mr-1">
                  {user?.username || user?.fullName || user?.handle || "User"}
                </h3>
                {user?.verified && (
                  <Badge
                    variant="outline"
                    className="h-4 px-1 bg-cyan-950/50 border-cyan-500 text-cyan-400 text-[10px]"
                  >
                    <Shield className="h-2 w-2 mr-1" />
                    VERIFIED
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-lg font-semibold">
                <span className="text-cyan-400 uppercase font-mono">
                  {user?.handle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent variant="production">
                <p>Neural Voice Call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Neural Video Call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleNeuralLink}
                  className={`h-8 w-8 rounded-sm ${
                    activeNeuralLink
                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                      : "text-gray-500 hover:text-gray-400 hover:bg-gray-900/30"
                  }`}
                >
                  <Brain className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {activeNeuralLink
                    ? "Deactivate Neural Link"
                    : "Activate Neural Link"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-gray-400 hover:text-gray-300 hover:bg-gray-900/30"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
