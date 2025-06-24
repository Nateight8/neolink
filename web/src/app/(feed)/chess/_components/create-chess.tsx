"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Clock,
  Award as BulletIcon,
  Flame as BlitzIcon,
  Gauge as RapidIcon,
  Clock as ClassicalIcon,
  Info,
  Settings,
  X,
  Globe,
  Users,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IconChessQueenFilled } from "@tabler/icons-react";

type ChallengerType = "everyone" | "ally" | "clan";

interface CreateChessProps {
  onSettingsChange?: (settings: {
    timeControl: string;
    rated: boolean;
    challenger: ChallengerType;
  }) => void;
}

const chessGameModes = [
  {
    name: "Bullet",
    timeControl: "1+0",
    description: "Lightning-fast games where every second counts.",
    Icon: BulletIcon,
    color: "text-yellow-400",
  },
  {
    name: "Blitz",
    timeControl: "3+2",
    description: "Quick-paced games with a small time increment.",
    Icon: BlitzIcon,
    color: "text-orange-400",
  },
  {
    name: "Rapid",
    timeControl: "10+0",
    description: "Balanced games with time for tactical thinking.",
    Icon: RapidIcon,
    color: "text-green-400",
  },
  {
    name: "Classical",
    timeControl: "30+0",
    description: "Traditional chess with time for deep strategy.",
    Icon: ClassicalIcon,
    color: "text-blue-400",
  },
];

export default function CreateChess({ onSettingsChange }: CreateChessProps) {
  const [timeControl, setTimeControl] = useState(chessGameModes[1].timeControl);
  const [rated, setRated] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [challenger, setChallenger] = useState<ChallengerType>("everyone");

  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        timeControl,
        rated,
        challenger,
      });
    }
  }, [timeControl, rated, challenger, onSettingsChange]);

  const clipPath =
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-cyan-400 flex items-center">
          <IconChessQueenFilled className="h-4 w-4 mr-1" />
          CHESS CHALLENGE
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowSettings(true)}
                className="h-7 w-7 rounded-sm text-gray-400 hover:text-cyan-400 hover:bg-[#2a3547]"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Challenge Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {chessGameModes.map((mode) => {
            const isSelected = timeControl === mode.timeControl;
            const Icon = mode.Icon || Clock;

            return (
              <TooltipProvider key={mode.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group aspect-[2/1] ">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setTimeControl(mode.timeControl)}
                        className={`h-full w-full p-0 overflow-hidden transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-br from-fuchsia-900/30 to-cyan-900/30 border border-fuchsia-500/30"
                            : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-fuchsia-500/30"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full mb-1.5 ${
                              isSelected
                                ? "bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/30"
                                : "bg-gray-800/50 border border-gray-700/50"
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${mode.color}`} />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isSelected
                                ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-cyan-300"
                                : "text-gray-300 group-hover:text-white"
                            }`}
                          >
                            {mode.name}
                          </span>
                          <span
                            className={`text-xs mt-0.5 ${
                              isSelected
                                ? "text-fuchsia-200/80"
                                : "text-gray-400 group-hover:text-gray-200"
                            }`}
                          >
                            {mode.timeControl}
                          </span>
                        </div>
                      </Button>
                      {isSelected && (
                        <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent variant="production" className="max-w-xs">
                    <p className="font-medium">
                      {mode.name} ({mode.timeControl})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="rated-switch" className="text-sm text-gray-400">
              {rated ? "Rated Game" : "Casual"}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center cursor-pointer">
                    <Info className="w-4 h-4 text-cyan-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent variant="production" className="max-w-xs">
                  <div className="text-xs text-gray-200">
                    {rated ? (
                      <>
                        <b>Rated</b> games affect your chess rating and are more
                        competitive.
                      </>
                    ) : (
                      <>
                        <b>Casual</b> games are just for fun and do not impact
                        your rating.
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="rated-switch"
            checked={rated}
            onCheckedChange={setRated}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
      </div>
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 z-10"
          >
            <div
              className="h-full bg-[#1a1e2e] p-4 border border-cyan-900 rounded-sm"
              style={{ clipPath }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-cyan-400 flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  CHALLENGE SETTINGS
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="h-7 w-7 rounded-sm text-gray-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm text-white flex items-center">
                    <Users className="h-4 w-4 mr-2 text-cyan-400" />
                    Who Can Challenge
                  </Label>
                </div>
                <Select
                  value={challenger}
                  onValueChange={(value: ChallengerType) =>
                    setChallenger(value)
                  }
                >
                  <SelectTrigger
                    className="w-full bg-[#2a3547] border border-border rounded text-sm text-gray-300 p-2"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone" className="text-sm">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Everyone
                      </span>
                    </SelectItem>
                    <SelectItem value="ally" className="text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Allies only
                      </span>
                    </SelectItem>
                    <SelectItem value="clan" className="text-sm" disabled>
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Clan only
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                className="w-full mt-4 bg-[#2a3547] text-cyan-400 hover:bg-[#3a4557] hover:text-cyan-300 border-cyan-900/50"
                onClick={() => setShowSettings(false)}
              >
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
