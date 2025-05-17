"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Users, Lock, Globe, UserPlus } from "lucide-react";
import { motion } from "motion/react";

interface PollCreatorProps {
  onAddPoll: (poll: {
    question: string;
    options: string[];
    duration: number;
    visibility: "everyone" | "allies" | "selected" | "clan";
    maxVotes: number | null;
  }) => void;
  onCancel: () => void;
}

export function PollCreator({ onAddPoll, onCancel }: PollCreatorProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [duration, setDuration] = useState(24); // Default 24 hours
  const [visibility, setVisibility] = useState<
    "everyone" | "allies" | "selected" | "clan"
  >("everyone");
  const [hasMaxVotes, setHasMaxVotes] = useState(false);
  const [maxVotes, setMaxVotes] = useState<number>(100);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!question.trim()) return;

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) return;

    onAddPoll({
      question,
      options: validOptions,
      duration,
      visibility,
      maxVotes: hasMaxVotes ? maxVotes : null,
    });
  };

  // Get visibility icon and text
  const getVisibilityInfo = () => {
    switch (visibility) {
      case "everyone":
        return {
          icon: <Globe className="h-4 w-4 mr-2" />,
          text: "Everyone can vote",
        };
      case "allies":
        return {
          icon: <Users className="h-4 w-4 mr-2" />,
          text: "Only allies can vote",
        };
      case "selected":
        return {
          icon: <UserPlus className="h-4 w-4 mr-2" />,
          text: "Selected allies can vote",
        };
      case "clan":
        return {
          icon: <Lock className="h-4 w-4 mr-2" />,
          text: "Only clan members can vote",
        };
      default:
        return {
          icon: <Globe className="h-4 w-4 mr-2" />,
          text: "Everyone can vote",
        };
    }
  };

  const visibilityInfo = getVisibilityInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 mt-4 p-4 bg-black border border-cyan-900/50 rounded-md"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-cyan-400">Create Poll</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Poll question */}
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm text-cyan-400">
            Question
          </Label>
          <Input
            id="question"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="bg-gray-900 border-gray-800 focus-visible:border-cyan-900 text-white rounded-md"
          />
        </div>

        {/* Poll options */}
        <div className="space-y-2">
          <Label className="text-sm text-cyan-400">Options</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="bg-gray-900 border-gray-800 focus-visible:border-cyan-900 text-white rounded-md"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {options.length < 4 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleAddOption}
              className="w-full mt-2 border border-dashed border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-900 hover:bg-gray-900/50 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        {/* Poll settings */}
        <div className="space-y-4 pt-2 border-t border-gray-800">
          {/* Poll duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm text-cyan-400">
              Duration
            </Label>
            <Select
              value={duration.toString()}
              onValueChange={(value) => setDuration(Number.parseInt(value))}
            >
              <SelectTrigger className="bg-gray-900 border-gray-800 focus:ring-1 focus:ring-cyan-900 text-white rounded-md">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="72">72 hours</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Poll visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility" className="text-sm text-cyan-400">
              Who can vote
            </Label>
            <Select
              value={visibility}
              onValueChange={(
                value: "everyone" | "allies" | "selected" | "clan"
              ) => setVisibility(value)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-800 focus:ring-1 focus:ring-cyan-900 text-white rounded-md">
                <SelectValue placeholder="Select who can vote">
                  <div className="flex items-center">
                    {visibilityInfo.icon}
                    {visibilityInfo.text}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="everyone">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Everyone can vote
                  </div>
                </SelectItem>
                <SelectItem value="allies">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Only allies can vote
                  </div>
                </SelectItem>
                <SelectItem value="selected">
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Selected allies can vote
                  </div>
                </SelectItem>
                <SelectItem value="clan">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Only clan members can vote
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max votes limit */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="max-votes"
                className="text-sm text-white flex items-center"
              >
                Limit maximum votes
              </Label>
              <p className="text-xs text-gray-500">
                Set a maximum number of votes for this poll
              </p>
            </div>
            <Switch
              id="max-votes"
              checked={hasMaxVotes}
              onCheckedChange={setHasMaxVotes}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>

          {hasMaxVotes && (
            <div className="space-y-2">
              <Label
                htmlFor="max-votes-count"
                className="text-sm text-cyan-400"
              >
                Maximum votes
              </Label>
              <Input
                id="max-votes-count"
                type="number"
                min="10"
                max="10000"
                value={maxVotes}
                onChange={(e) =>
                  setMaxVotes(Number.parseInt(e.target.value) || 100)
                }
                className="bg-gray-900 border-gray-800 focus-visible:border-cyan-900 text-white rounded-md"
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2 flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 bg-transparent border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white rounded-md"
          >
            Create Poll
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
