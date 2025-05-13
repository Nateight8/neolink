"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export interface Ally {
  id: string;
  username: string;
  name: string;
  avatar: string;
  specialization?: string;
}

interface AllyMentionPopoverProps {
  allies: Ally[];
  searchTerm: string;
  position: { top: number; left: number } | null;
  onSelect: (ally: Ally) => void;
  onClose: () => void;
}

export function AllyMentionPopover({
  allies,
  searchTerm,
  position,
  onSelect,
  onClose,
}: AllyMentionPopoverProps) {
  const [filteredAllies, setFilteredAllies] = useState<Ally[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Filter allies based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAllies(allies.slice(0, 5)); // Show first 5 allies if no search term
    } else {
      const filtered = allies
        .filter(
          (ally) =>
            ally.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ally.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results
      setFilteredAllies(filtered);
      setSelectedIndex(0); // Reset selection when results change
    }
  }, [allies, searchTerm]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!position) return; // Only handle keys when popover is open

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredAllies.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredAllies[selectedIndex]) {
            onSelect(filteredAllies[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredAllies, selectedIndex, onSelect, onClose, position]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, position]);

  if (!position) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 w-64 bg-black border border-cyan-800 rounded-sm shadow-lg shadow-cyan-900/30"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10"></div>

      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className="bg-black/50 border-cyan-500 text-cyan-400"
          >
            <Zap className="h-3 w-3 mr-1" />
            NEURAL ALLIES
          </Badge>
          <span className="text-xs text-gray-500">
            {filteredAllies.length} found
          </span>
        </div>

        {filteredAllies.length === 0 ? (
          <div className="py-3 text-center text-gray-500 text-xs">
            NO NEURAL MATCHES FOUND
          </div>
        ) : (
          <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black">
            {filteredAllies.map((ally, index) => (
              <div
                key={ally.id}
                className={`flex items-center p-2 rounded-sm cursor-pointer ${
                  index === selectedIndex
                    ? "bg-cyan-950/50 border border-cyan-700"
                    : "hover:bg-cyan-950/30"
                }`}
                onClick={() => onSelect(ally)}
              >
                <Avatar className="h-8 w-8 border border-cyan-700 mr-3">
                  <AvatarImage
                    src={ally.avatar || "/placeholder.svg"}
                    alt={ally.name}
                  />
                  <AvatarFallback className="bg-black text-cyan-400">
                    {ally.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-white truncate">
                      @{ally.username}
                    </p>
                    {index === selectedIndex && (
                      <span className="text-xs text-cyan-400">TAB</span>
                    )}
                  </div>
                  {ally.specialization && (
                    <p className="text-xs text-gray-400 truncate">
                      {ally.specialization}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
