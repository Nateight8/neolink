"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChessWaitingRoom } from "./chess-waiting-room";
import { ChessGameView } from "./chess-game-view";
import { ChessSpectatorView } from "./chess-spectator-view";

export type RoomState = "waiting" | "playing" | "spectating";

export interface Player {
  id: string;
  username: string;
  avatar: string;
  rating: number;
}

export interface Spectator {
  id: string;
  username: string;
  avatar: string;
}

export interface ChessRoomProps {
  roomId: string;
  currentUser: Player;
  initialState?: RoomState;
}

export function ChessRoom({
  roomId,
  currentUser,
  initialState = "waiting",
}: ChessRoomProps) {
  const [roomState, setRoomState] = useState<RoomState>(initialState);
  const [players, setPlayers] = useState<Player[]>([currentUser]);
  const [spectators, setSpectators] = useState<Spectator[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Mock data for demonstration
  const mockOpponent: Player = {
    id: "opponent-1",
    username: "CyberKnight",
    avatar: "/placeholder.svg?height=40&width=40&text=CK",
    rating: 1850,
  };

  const mockSpectators: Spectator[] = [
    {
      id: "spec-1",
      username: "NeuralWatcher",
      avatar: "/placeholder.svg?height=32&width=32&text=NW",
    },
    {
      id: "spec-2",
      username: "QuantumObserver",
      avatar: "/placeholder.svg?height=32&width=32&text=QO",
    },
  ];

  const handleJoinGame = () => {
    setPlayers([currentUser, mockOpponent]);
    setRoomState("playing");
    setGameStarted(true);
  };

  const handleSpectateGame = () => {
    setPlayers([mockOpponent, { ...currentUser, id: "player-2" }]);
    setSpectators([...mockSpectators, currentUser]);
    setRoomState("spectating");
    setGameStarted(true);
  };

  const handleLeaveRoom = () => {
    setRoomState("waiting");
    setPlayers([currentUser]);
    setSpectators([]);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}

      {/* Neural grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {roomState === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChessWaitingRoom
              roomId={roomId}
              currentUser={currentUser}
              onJoinGame={handleJoinGame}
              onSpectateGame={handleSpectateGame}
            />
          </motion.div>
        )}

        {roomState === "playing" && (
          <motion.div
            key="playing"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="origin-center"
          >
            <ChessGameView
              roomId={roomId}
              players={players}
              spectators={spectators}
              currentUser={currentUser}
              onLeaveRoom={handleLeaveRoom}
            />
          </motion.div>
        )}

        {roomState === "spectating" && (
          <motion.div
            key="spectating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ChessSpectatorView
              roomId={roomId}
              players={players}
              spectators={spectators}
              currentUser={currentUser}
              onLeaveRoom={handleLeaveRoom}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
