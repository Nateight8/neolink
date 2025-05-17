"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, BarChart3, X } from "lucide-react";
import { PollCreator } from "./poll-creator";
import { motion, AnimatePresence } from "motion/react";

interface PostInputProps {
  onSubmit?: (data: {
    text: string;
    image?: File;
    poll?: {
      question: string;
      options: string[];
      duration: number;
      visibility: "everyone" | "allies" | "selected" | "clan";
      maxVotes: number | null;
    };
  }) => void;
}

export default function PostInput({ onSubmit }: PostInputProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [poll, setPoll] = useState<{
    question: string;
    options: string[];
    duration: number;
    visibility: "everyone" | "allies" | "selected" | "clan";
    maxVotes: number | null;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddPoll = (pollData: {
    question: string;
    options: string[];
    duration: number;
    visibility: "everyone" | "allies" | "selected" | "clan";
    maxVotes: number | null;
  }) => {
    setPoll(pollData);
    setShowPollCreator(false);
  };

  const handleRemovePoll = () => {
    setPoll(null);
  };

  const handleSubmit = () => {
    if (!text.trim() && !image && !poll) return;

    if (onSubmit) {
      onSubmit({
        text,
        image: image || undefined,
        poll: poll || undefined,
      });
    }

    // Reset form
    setText("");
    setImage(null);
    setImagePreview(null);
    setPoll(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get visibility icon and text
  const getVisibilityInfo = () => {
    if (!poll) return null;

    switch (poll.visibility) {
      case "everyone":
        return { icon: "🌐", text: "Everyone can vote" };
      case "allies":
        return { icon: "👥", text: "Only allies can vote" };
      case "selected":
        return { icon: "👤", text: "Selected allies can vote" };
      case "clan":
        return { icon: "🔒", text: "Only clan members can vote" };
      default:
        return { icon: "🌐", text: "Everyone can vote" };
    }
  };

  const visibilityInfo = getVisibilityInfo();

  return (
    <div className="bg-[#1a1e2e] rounded-3xl overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10 rounded-full border-2 border-[#3dd1c4]/20">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40&text=YOU"
              alt="Your avatar"
            />
            <AvatarFallback className="bg-[#2a3547] text-[#3dd1c4]">
              YOU
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[80px] bg-[#2a3547] border-0 focus-visible:ring-1 focus-visible:ring-[#3dd1c4] text-white resize-none rounded-xl"
            />

            {/* Image preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative rounded-xl overflow-hidden"
                >
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-60 w-auto"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poll preview */}
            <AnimatePresence>
              {poll && !showPollCreator && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative bg-[#2a3547] rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-[#3dd1c4]" />
                      <h3 className="text-sm font-bold text-white">POLL</h3>
                    </div>
                    <button
                      onClick={handleRemovePoll}
                      className="bg-[#1a1e2e]/60 rounded-full p-1 text-white hover:bg-[#1a1e2e]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-white mb-2">{poll.question}</p>
                  <div className="space-y-1">
                    {poll.options.map((option, index) => (
                      <div
                        key={index}
                        className="bg-[#1a1e2e]/60 rounded-xl p-2 text-sm text-gray-300"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Duration: {poll.duration} hours</span>
                    {visibilityInfo && (
                      <span>
                        {visibilityInfo.icon} {visibilityInfo.text}
                      </span>
                    )}
                    {poll.maxVotes && <span>Max votes: {poll.maxVotes}</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poll creator */}
            <AnimatePresence>
              {showPollCreator && (
                <PollCreator
                  onAddPoll={handleAddPoll}
                  onCancel={() => setShowPollCreator(false)}
                />
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 w-9 rounded-full text-[#3dd1c4] hover:text-[#3dd1c4]/80 hover:bg-[#2a3547]"
                  disabled={!!poll}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPollCreator(true)}
                  className="h-9 w-9 rounded-full text-[#3dd1c4] hover:text-[#3dd1c4]/80 hover:bg-[#2a3547]"
                  disabled={!!imagePreview || showPollCreator}
                >
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="bg-[#3dd1c4] hover:bg-[#3dd1c4]/80 text-[#1a1e2e] font-medium rounded-xl"
                  disabled={
                    (!text.trim() && !image && !poll) || showPollCreator
                  }
                >
                  Post
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
