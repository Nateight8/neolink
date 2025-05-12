"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCheck,
  Clock,
  Maximize2,
  Minimize2,
  Zap,
  CuboidIcon as Cube,
} from "lucide-react";

import type { MockMessage } from "@/types/chat";

interface ChatMessageProps {
  message: MockMessage;
  neuralLinkActive: boolean;
  neuralLinkStrength: number;
}

export function ChatMessage({
  message,
  neuralLinkActive,
  neuralLinkStrength,
}: ChatMessageProps) {
  const [expanded, setExpanded] = useState(false);

  // Get status icon
  const getStatusIcon = () => {
    switch (message.status) {
      case "read":
        return <CheckCheck className="h-3 w-3 text-cyan-400" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "sent":
        return <Clock className="h-3 w-3 text-gray-600" />;
      default:
        return null;
    }
  };

  // Neural message effect based on link strength
  const getNeuralEffect = () => {
    if (!neuralLinkActive) return "opacity-50";
    if (neuralLinkStrength < 0.7) return "neural-flicker";
    return "";
  };

  // Render neural sensation message
  const renderNeuralMessage = () => {
    if (!message.neuralData) return null;

    return (
      <div
        className={`p-3 border rounded-sm ${
          message.sender === "self"
            ? "bg-fuchsia-950/30 border-fuchsia-900 ml-auto"
            : "bg-cyan-950/30 border-cyan-900"
        } ${getNeuralEffect()}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Zap
              className={`h-4 w-4 mr-1 ${
                message.sender === "self" ? "text-fuchsia-400" : "text-cyan-400"
              }`}
            />
            <span
              className={`text-xs font-bold ${
                message.sender === "self" ? "text-fuchsia-400" : "text-cyan-400"
              }`}
            >
              NEURAL_SENSATION
            </span>
          </div>
          <div
            className={`text-xs ${
              message.neuralData.intensity > 0.7
                ? "text-red-400"
                : message.neuralData.intensity > 0.4
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {Math.round(message.neuralData.intensity * 100)}% INTENSITY
          </div>
        </div>

        <div className="flex items-center justify-center py-4">
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center ${
              message.sender === "self" ? "bg-fuchsia-950/50" : "bg-cyan-950/50"
            }`}
          >
            <div
              className={`h-12 w-12 rounded-full ${
                message.sender === "self" ? "bg-fuchsia-600" : "bg-cyan-600"
              } animate-pulse`}
              style={{
                animationDuration: `${0.5 / message.neuralData.intensity}s`,
              }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-center text-gray-300 mt-2">
          {message.neuralData.description}
        </p>
      </div>
    );
  };

  // Render AR message
  const renderARMessage = () => {
    if (!message.arData) return null;

    return (
      <div
        className={`border rounded-sm ${
          message.sender === "self"
            ? "bg-fuchsia-950/20 border-fuchsia-900 ml-auto"
            : "bg-cyan-950/20 border-cyan-900"
        } ${getNeuralEffect()}`}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Cube
                className={`h-4 w-4 mr-1 ${
                  message.sender === "self"
                    ? "text-fuchsia-400"
                    : "text-cyan-400"
                }`}
              />
              <span
                className={`text-xs font-bold ${
                  message.sender === "self"
                    ? "text-fuchsia-400"
                    : "text-cyan-400"
                }`}
              >
                AR_CONTENT
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className={`h-6 w-6 rounded-sm ${
                message.sender === "self"
                  ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                  : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              }`}
            >
              {expanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="relative">
            <div
              className={`absolute -inset-[1px] ${
                message.sender === "self"
                  ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                  : "bg-gradient-to-r from-cyan-500 to-fuchsia-500"
              } rounded-sm opacity-50 blur-[1px]`}
            ></div>
            <div
              className={`relative overflow-hidden rounded-sm ${
                expanded ? "h-64" : "h-32"
              }`}
            >
              <Image
                src={message.arData.preview}
                alt="AR Preview"
                className="object-cover rounded-sm"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 scan-lines"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  className={`rounded-sm ${
                    message.sender === "self"
                      ? "bg-fuchsia-600 hover:bg-fuchsia-500"
                      : "bg-cyan-600 hover:bg-cyan-500"
                  } text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]`}
                  disabled={!neuralLinkActive}
                >
                  <Cube className="h-4 w-4 mr-2" />
                  ACTIVATE AR
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 mt-2">
            {message.arData.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex items-start space-x-2 max-w-[80%] ${
        message.sender === "self"
          ? "ml-auto flex-row-reverse space-x-reverse"
          : ""
      }`}
    >
      {message.sender === "other" && (
        <Avatar className="h-8 w-8 border border-cyan-900">
          <AvatarImage
            src="/placeholder.svg?height=50&width=50&text=CN"
            alt="User"
          />
          <AvatarFallback className="bg-black text-cyan-400">CN</AvatarFallback>
        </Avatar>
      )}

      {message.type === "text" ? (
        <div
          className={`relative group ${
            message.sender === "self"
              ? "bg-fuchsia-950/30 border border-fuchsia-900"
              : "bg-cyan-950/30 border border-cyan-900"
          } rounded-sm px-3 py-2 text-white`}
        >
          <p
            className={`${
              !neuralLinkActive && message.sender === "other"
                ? "opacity-80"
                : ""
            }`}
          >
            {message.text}
          </p>
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span className="text-xs text-gray-500">{message.time}</span>
            {message.sender === "self" && getStatusIcon()}
          </div>
        </div>
      ) : message.type === "neural" ? (
        renderNeuralMessage()
      ) : (
        renderARMessage()
      )}
    </div>
  );
}
