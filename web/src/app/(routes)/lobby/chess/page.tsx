"use client";

import { ChessGameClean } from "./_components/chess-lobby";

export default function ChessGameCleanPage() {
  const handleDisconnect = () => {
    console.log("Disconnecting from game...");
    // Handle disconnect logic here
  };

  return <ChessGameClean matchType="friend" onDisconnect={handleDisconnect} />;
}
