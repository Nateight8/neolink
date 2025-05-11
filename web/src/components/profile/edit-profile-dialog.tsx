"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  X,
  Upload,
  Cpu,
  Zap,
  Shield,
  Gamepad2,
  Code,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProfileDialogProps {
  trigger?: React.ReactNode;
}

export function EditProfileDialog({ trigger }: EditProfileDialogProps) {
  const [avatarPreview, setAvatarPreview] = useState(
    "/placeholder.svg?height=128&width=128"
  );
  const [selectedBadges, setSelectedBadges] = useState([
    {
      id: 1,
      icon: <Cpu className="h-3 w-3 mr-1" />,
      label: "TECH WIZARD",
      selected: true,
    },
    {
      id: 2,
      icon: <Zap className="h-3 w-3 mr-1" />,
      label: "NEON GAMER",
      selected: true,
    },
    {
      id: 3,
      icon: <Shield className="h-3 w-3 mr-1" />,
      label: "CYBER DEFENDER",
      selected: true,
    },
    {
      id: 4,
      icon: <Gamepad2 className="h-3 w-3 mr-1" />,
      label: "VR EXPLORER",
      selected: false,
    },
    {
      id: 5,
      icon: <Code className="h-3 w-3 mr-1" />,
      label: "CODE NINJA",
      selected: false,
    },
    {
      id: 6,
      icon: <Sparkles className="h-3 w-3 mr-1" />,
      label: "DIGITAL ARTIST",
      selected: false,
    },
  ]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleBadge = (id: number) => {
    setSelectedBadges(
      selectedBadges.map((badge) =>
        badge.id === id ? { ...badge, selected: !badge.selected } : badge
      )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="outline"
            className="rounded-sm border-cyan-500 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300"
          >
            <Edit className="h-4 w-4 mr-2" />
            EDIT.SYS
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-0 p-0 bg-transparent">
        {/* Cyberpunk container with neon border */}
        <div className="relative bg-black border border-cyan-900 p-6 rounded-sm">
          {/* Animated neon border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-75 blur-[2px] -z-10 animate-pulse"></div>

          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-cyan-400 font-mono tracking-wider">
                PROFILE.EDIT
              </DialogTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500"></div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6 relative z-10">
            {/* Avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm group-hover:animate-pulse"></div>
                <Avatar className="h-24 w-24 border-2 border-cyan-500 relative">
                  <AvatarImage
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="bg-black text-cyan-400 text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer flex items-center justify-center w-full h-full"
                  >
                    <Upload className="h-6 w-6 text-cyan-400" />
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              <p className="text-xs text-cyan-300 font-mono">UPLOAD.AVATAR</p>
            </div>

            {/* Username and handle */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-cyan-400 font-mono text-xs tracking-wider"
                >
                  USERNAME
                </Label>
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
                  <Input
                    id="username"
                    defaultValue="JANE_D0E"
                    className="bg-black border-cyan-900 text-white font-mono relative focus-visible:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="handle"
                  className="text-fuchsia-400 font-mono text-xs tracking-wider"
                >
                  HANDLE
                </Label>
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[1px]"></div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-fuchsia-400">@</span>
                    <Input
                      id="handle"
                      defaultValue="n3on_runner"
                      className="bg-black border-fuchsia-900 text-white font-mono pl-8 relative focus-visible:ring-fuchsia-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-cyan-400 font-mono text-xs tracking-wider"
              >
                BIO.DATA
              </Label>
              <div className="relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
                <Textarea
                  id="bio"
                  defaultValue="⚡ EXPLORING THE DIGITAL FRONTIER ⚡"
                  className="bg-black border-cyan-900 text-white font-mono relative min-h-[80px] focus-visible:ring-cyan-500"
                />
              </div>
            </div>

            {/* Badges/Interests */}
            <div className="space-y-3">
              <Label className="text-fuchsia-400 font-mono text-xs tracking-wider">
                DIGITAL.IDENTITY.BADGES
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {selectedBadges.map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => toggleBadge(badge.id)}
                    className={cn(
                      "flex items-center justify-center py-2 px-3 rounded-sm text-xs font-mono relative group",
                      badge.selected
                        ? "border border-transparent"
                        : "border border-gray-800 text-gray-500 hover:text-gray-400"
                    )}
                  >
                    {badge.selected && (
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
                    )}
                    <div
                      className={cn(
                        "flex items-center",
                        badge.selected
                          ? badge.id % 2 === 0
                            ? "text-fuchsia-300"
                            : "text-cyan-300"
                          : "text-gray-500"
                      )}
                    >
                      {badge.icon}
                      {badge.label}
                    </div>
                    {badge.selected && (
                      <X className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme color */}
            <div className="space-y-3">
              <Label className="text-cyan-400 font-mono text-xs tracking-wider">
                INTERFACE.COLOR.SCHEME
              </Label>
              <div className="flex justify-center gap-3">
                {["cyan", "fuchsia", "green", "orange", "blue"].map(
                  (color, index) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-sm relative",
                        index < 2 &&
                          "ring-2 ring-white ring-offset-2 ring-offset-black"
                      )}
                      style={{
                        background:
                          color === "cyan"
                            ? "#00FFFF"
                            : color === "fuchsia"
                            ? "#FF00FF"
                            : color === "green"
                            ? "#00FF00"
                            : color === "orange"
                            ? "#FF9900"
                            : "#0099FF",
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                className="rounded-sm border-red-500 text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                CANCEL.SYS
              </Button>
              <Button className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                SAVE.PROFILE
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
