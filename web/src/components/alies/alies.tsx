"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Users, Zap } from "lucide-react";
import { GlitchText } from "@/components/feed/glitch-text";
import { EmptyAlliesState } from "./no-allies";
import { AllyCard } from "./ally-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios-instance";
import { User } from "@/contexts/auth-context";

export default function AlliesRecommendation() {
  const queryClient = useQueryClient();

  // Mark suggestions as seen when component mounts
  useEffect(() => {
    const markSuggestionsAsSeen = async () => {
      try {
        await axiosInstance.patch('/auth/me', { hasSeenSuggestions: true });
        // Invalidate user data to refresh the UI
        await queryClient.invalidateQueries({
          queryKey: ["currentUser"],
        });
      } catch (error) {
        console.error('Error updating suggestions status:', error);
        // You might want to add error handling here, like showing a toast notification
        // toast.error('Failed to update suggestions status');
      }
    };

    markSuggestionsAsSeen();
  }, [queryClient]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentAllyIndex, setCurrentAllyIndex] = useState(0);
  const [addedAllies, setAddedAllies] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [emptyStateReason, setEmptyStateReason] = useState<
    "no-results" | "all-added" | "no-data"
  >("no-results");
  const [glitchEffect, setGlitchEffect] = useState(false);

  // const queryClient = useQueryClient();

  const { data: RECOMMENDED_ALLIES } = useQuery<User[]>({
    queryKey: ["recommendFriends"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // <== cache for 5 mins
    retry: false, //<== disable retry if unauthenticated
  });

  // Filter allies based on search query and already added allies
  const filteredAllies = (RECOMMENDED_ALLIES || [])
    .map((ally) => ({
      ...ally,
      avatar: `/placeholder.svg?height=200&width=200&text=${
        ally.username?.substring(0, 2) || "NA"
      }`,
      verified: true, // Default to true for now
      mutualAllies: ally.friends?.length || 0,
      neuralCompatibility: Math.random() * 0.3 + 0.7, // Random between 0.7 and 1.0
      skills: ["NEURAL_LINK", "GRID_ACCESS", "DATA_SYNC"], // Default skills
    }))
    .filter(
      (ally) =>
        !addedAllies.includes(ally._id) &&
        (searchQuery === "" ||
          ally.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ally.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ally.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Current ally to display
  const currentAlly = filteredAllies[currentAllyIndex];

  // Check if we should show empty state
  useEffect(() => {
    if (filteredAllies.length === 0) {
      if (searchQuery !== "") {
        setEmptyStateReason("no-results");
      } else if (addedAllies.length === (RECOMMENDED_ALLIES || []).length) {
        setEmptyStateReason("all-added");
      } else {
        setEmptyStateReason("no-data");
      }
      setShowEmptyState(true);
    } else {
      setShowEmptyState(false);
    }
  }, [
    filteredAllies.length,
    searchQuery,
    addedAllies.length,
    RECOMMENDED_ALLIES,
  ]);

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Handle adding an ally
  const handleAddAlly = () => {
    if (!currentAlly) return;

    setIsAnimating(true);
    setAddedAllies([...addedAllies, currentAlly._id]);

    // After animation completes, move to next ally
    setTimeout(() => {
      if (currentAllyIndex >= filteredAllies.length - 1) {
        setCurrentAllyIndex(0);
      } else {
        setCurrentAllyIndex(currentAllyIndex + 1);
      }
      setIsAnimating(false);
    }, 500);
  };

  // Handle skipping an ally
  const handleSkipAlly = () => {
    setIsAnimating(true);

    // After animation completes, move to next ally
    setTimeout(() => {
      if (currentAllyIndex >= filteredAllies.length - 1) {
        setCurrentAllyIndex(0);
      } else {
        setCurrentAllyIndex(currentAllyIndex + 1);
      }
      setIsAnimating(false);
    }, 500);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentAllyIndex(0);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentAllyIndex(0);
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-black text-white">
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Header */}
        <div className="w-full max-w-md mb-8 text-center">
          <GlitchText
            text="NEURAL ALLIES"
            className="text-3xl font-bold text-cyan-400 mb-2"
          />
          <p className="text-gray-400 max-w-md mx-auto">
            Connect with compatible neural networks to expand your digital
            influence.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-md mb-8">
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-cyan-500" />
              <Input
                placeholder="SEARCH_NEURAL_ALLIES"
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-black border-cyan-900 text-white font-mono pl-10 pr-10 relative focus-visible:ring-cyan-500"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ally cards or empty state */}
        <div className="w-full max-w-md flex-1 flex items-center justify-center">
          {showEmptyState ? (
            <EmptyAlliesState
              reason={emptyStateReason}
              onClearSearch={handleClearSearch}
            />
          ) : (
            <AnimatePresence mode="wait">
              {currentAlly && (
                <motion.div
                  key={currentAlly._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full ${
                    isAnimating ? "pointer-events-none" : ""
                  } ${
                    glitchEffect ? "animate-[glitch_0.2s_ease_forwards]" : ""
                  }`}
                >
                  <AllyCard
                    ally={currentAlly}
                    onAdd={handleAddAlly}
                    onSkip={handleSkipAlly}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Stats */}
        <div className="w-full max-w-md mt-8">
          <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-cyan-400 mr-2" />
                <span className="text-white font-mono">ALLIES_ADDED:</span>
              </div>
              <Badge className="bg-cyan-600 text-white">
                {addedAllies.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-fuchsia-400 mr-2" />
                <span className="text-white font-mono">
                  NEURAL_NETWORK_STRENGTH:
                </span>
              </div>
              <Badge className="bg-fuchsia-600 text-white">
                {Math.min(100, Math.round(addedAllies.length * 12.5))}%
              </Badge>
            </div>
            <div className="w-full max-w-md mt-6">
              <Button
                onClick={() => {
                  // Just refresh the page since we already updated hasSeenSuggestions on mount
                  window.location.reload();
                }}
                className="w-full rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)] py-6 text-lg font-bold"
              >
                <Zap className="h-5 w-5 mr-2" />
                {addedAllies.length > 0
                  ? `CONTINUE WITH ${addedAllies.length} ALLIES`
                  : "SKIP ALLY SELECTION"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
