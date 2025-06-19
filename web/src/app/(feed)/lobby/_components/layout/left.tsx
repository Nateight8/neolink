"use client";
import { useState } from "react";
import AllyList from "../ally-list";
import GlobalChat from "../global-chat";

export default function Left() {
  const [chatMessage, setChatMessage] = useState("");

  const friends = [
    {
      id: 1,
      username: "QuantumQueen",
      avatar: "/placeholder.svg?height=40&width=40&text=QQ",
      status: "online",
      rating: 1920,
      lastSeen: "now",
    },
    {
      id: 2,
      username: "DataGrandmaster",
      avatar: "/placeholder.svg?height=40&width=40&text=DG",
      status: "playing",
      rating: 2100,
      lastSeen: "5m ago",
    },
    {
      id: 3,
      username: "CodeWarrior",
      avatar: "/placeholder.svg?height=40&width=40&text=CW",
      status: "online",
      rating: 1780,
      lastSeen: "now",
    },
    {
      id: 4,
      username: "AlgoAssassin",
      avatar: "/placeholder.svg?height=40&width=40&text=AA",
      status: "away",
      rating: 1650,
      lastSeen: "15m ago",
    },
    {
      id: 5,
      username: "ByteBishop",
      avatar: "/placeholder.svg?height=40&width=40&text=BB",
      status: "offline",
      rating: 1590,
      lastSeen: "2h ago",
    },
  ];

  const chatMessages = [
    {
      id: 1,
      username: "CyberKnight",
      message: "Anyone up for a quick blitz?",
      time: "2m ago",
      avatar: "/placeholder.svg?height=24&width=24&text=CK",
    },
    {
      id: 2,
      username: "QuantumQueen",
      message: "GG everyone! Great tournament",
      time: "5m ago",
      avatar: "/placeholder.svg?height=24&width=24&text=QQ",
    },
    {
      id: 3,
      username: "DataMaster",
      message: "New neural chess algorithm is insane!",
      time: "8m ago",
      avatar: "/placeholder.svg?height=24&width=24&text=DM",
    },
  ];

  return (
    <div>
      <div className=" lg:col-span-3 space-y-4 md:space-y-6 hidden">
        {/* Friends List */}
        <div className="relative group">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
            <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                Friends List
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Coming Soon: Connect with friends, see who&apos;s online, and
                challenge them to a game.
              </p>
              <div className="text-xs text-gray-500">Release: Q3 2025</div>
            </div>
          </div>
          <AllyList friends={friends} />
        </div>

        {/* Global Chat */}
        <div className="relative group">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
            <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                Global Chat
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Coming Soon: Chat with the community, discuss strategies, and
                make new friends.
              </p>
              <div className="text-xs text-gray-500">Release: Q3 2025</div>
            </div>
          </div>
          <GlobalChat
            chatMessages={chatMessages}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
          />
        </div>
      </div>
    </div>
  );
}
