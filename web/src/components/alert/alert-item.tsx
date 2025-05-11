"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Heart,
  MessageSquare,
  AtSign,
  Shield,
  Cpu,
  Zap,
  Check,
  X,
  Eye,
  AlertTriangle,
  UserPlus,
  CuboidIcon as Cube,
  Brain,
  Bell,
} from "lucide-react";

interface Alert {
  id: number;
  type: string;
  user?: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  target?: string;
  time: string;
  isRead: boolean;
  isUrgent: boolean;
  neuralSignature: number;
  arPreview?: string;
}

interface AlertItemProps {
  alert: Alert;
  onMarkAsRead: (id: number) => void;
  onDismiss: (id: number) => void;
  neuralLinkActive: boolean;
  neuralLinkStrength: number;
  glitchEffect: boolean;
}

export function AlertItem({
  alert,
  onMarkAsRead,
  onDismiss,
  neuralLinkActive,
  neuralLinkStrength,
  glitchEffect,
}: AlertItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get icon based on alert type
  const getAlertIcon = () => {
    switch (alert.type) {
      case "like":
        return <Heart className="h-4 w-4 text-fuchsia-400" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-cyan-400" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-fuchsia-400" />;
      case "system":
        return <Shield className="h-4 w-4 text-cyan-400" />;
      case "neural":
        return <Brain className="h-4 w-4 text-fuchsia-400" />;
      case "ar":
        return <Cube className="h-4 w-4 text-cyan-400" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-fuchsia-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get background color based on alert type and read status
  const getAlertBackground = () => {
    if (alert.isUrgent) return "bg-red-950/20 border-red-900";
    if (!alert.isRead) return "bg-cyan-950/20 border-cyan-900";
    return "bg-black border-gray-900";
  };

  // Neural effect based on link strength and alert neural signature
  const getNeuralEffect = () => {
    if (!neuralLinkActive) return "";
    if (neuralLinkStrength < 0.7 && alert.neuralSignature > 0.8)
      return "neural-flicker";
    return "";
  };

  // Handle click on alert
  const handleAlertClick = () => {
    if (!alert.isRead) {
      onMarkAsRead(alert.id);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`border rounded-sm p-4 relative transition-colors ${getAlertBackground()} ${
        glitchEffect && alert.type === "neural"
          ? "animate-[glitch_0.2s_ease_forwards]"
          : ""
      } ${getNeuralEffect()}`}
    >
      {/* Unread indicator */}
      {!alert.isRead && (
        <div className="absolute top-0 right-0 w-3 h-3 transform translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-full h-full bg-cyan-500 rounded-full"></div>
        </div>
      )}

      {/* Urgent indicator */}
      {alert.isUrgent && (
        <div className="absolute top-4 right-4">
          <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Avatar or icon */}
        {alert.user ? (
          <Avatar className="h-10 w-10 border border-cyan-900">
            <AvatarImage
              src={alert.user.avatar || "/placeholder.svg"}
              alt={alert.user.name}
            />
            <AvatarFallback className="bg-black text-cyan-400">
              {alert.user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={`h-10 w-10 rounded-sm flex items-center justify-center ${
              alert.isUrgent
                ? "bg-red-950/50 border border-red-500"
                : "bg-cyan-950/50 border border-cyan-900"
            }`}
          >
            {alert.type === "system" ? (
              alert.isUrgent ? (
                <Shield className="h-5 w-5 text-red-400" />
              ) : (
                <Cpu className="h-5 w-5 text-cyan-400" />
              )
            ) : (
              <Zap className="h-5 w-5 text-cyan-400" />
            )}
          </div>
        )}

        {/* Alert content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* User and action */}
              <div className="flex items-center flex-wrap">
                {alert.user && (
                  <>
                    <span className="font-bold text-white mr-1">
                      {alert.user.name}
                    </span>
                    {alert.user.verified && (
                      <Badge
                        variant="outline"
                        className="h-4 px-1 bg-cyan-950/50 border-cyan-500 text-cyan-400 text-[10px] mr-1"
                      >
                        <Shield className="h-2 w-2 mr-1" />
                        VERIFIED
                      </Badge>
                    )}
                  </>
                )}
                <span
                  className={`text-sm ${
                    alert.user ? "text-gray-400" : "text-cyan-400 font-bold"
                  }`}
                >
                  {alert.content}
                </span>
              </div>

              {/* Target content preview */}
              {alert.target && (
                <div
                  className={`mt-1 text-sm ${
                    alert.type === "system" ? "text-red-400" : "text-gray-300"
                  } line-clamp-2 ${isExpanded ? "line-clamp-none" : ""}`}
                >
                  {alert.target}
                </div>
              )}

              {/* AR preview */}
              {alert.type === "ar" && alert.arPreview && isExpanded && (
                <div className="mt-3 relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
                  <div className="relative overflow-hidden rounded-sm h-40">
                    <img
                      src={alert.arPreview || "/placeholder.svg"}
                      alt="AR Preview"
                      className="w-full h-full object-cover holographic"
                    />
                    <div className="absolute inset-0 scan-lines"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button className="rounded-sm bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                        <Cube className="h-4 w-4 mr-2" />
                        VIEW IN AR
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Time and neural signature */}
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="mr-3">{alert.time}</span>
                {neuralLinkActive && (
                  <div className="flex items-center">
                    <Brain className="h-3 w-3 mr-1 text-fuchsia-400" />
                    <span
                      className={
                        alert.neuralSignature > 0.9
                          ? "text-fuchsia-400"
                          : alert.neuralSignature > 0.7
                          ? "text-cyan-400"
                          : "text-gray-500"
                      }
                    >
                      SIG: {Math.round(alert.neuralSignature * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Alert type indicator */}
            <Badge
              variant="outline"
              className={`ml-2 ${
                alert.type === "neural"
                  ? "border-fuchsia-500 bg-fuchsia-950/30 text-fuchsia-400"
                  : alert.type === "system" && alert.isUrgent
                  ? "border-red-500 bg-red-950/30 text-red-400"
                  : "border-cyan-500 bg-cyan-950/30 text-cyan-400"
              }`}
            >
              {getAlertIcon()}
              <span className="ml-1 uppercase text-xs">{alert.type}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end mt-3 space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAlertClick}
                className="h-8 w-8 p-0 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isExpanded ? "Collapse" : "Expand"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!alert.isRead && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(alert.id)}
                  className="h-8 w-8 p-0 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as Read</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.id)}
                className="h-8 w-8 p-0 rounded-sm text-gray-500 hover:text-gray-400 hover:bg-gray-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dismiss</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
