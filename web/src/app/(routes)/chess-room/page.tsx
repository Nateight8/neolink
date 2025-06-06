"use client";

// import { ChessLobby } from "./_components/v2/lobby";

import { ChessLobby } from "./_components/chess-lobby";

export default function ChessLobbyDemo() {
  const currentUser = {
    username: "KnightMaster",
    avatar: "/placeholder.svg?height=48&width=48&text=KM",
    rating: 1650,
  };

  const friends = [
    {
      id: "1",
      username: "QueenSlayer",
      avatar: "/placeholder.svg?height=40&width=40&text=QS",
      status: "online" as const,
      rating: 1720,
    },
    {
      id: "2",
      username: "RookRider",
      avatar: "/placeholder.svg?height=40&width=40&text=RR",
      status: "playing" as const,
      rating: 1580,
    },
    {
      id: "3",
      username: "BishopBane",
      avatar: "/placeholder.svg?height=40&width=40&text=BB",
      status: "online" as const,
      rating: 1890,
    },
    {
      id: "4",
      username: "PawnPusher",
      avatar: "/placeholder.svg?height=40&width=40&text=PP",
      status: "offline" as const,
      rating: 1420,
    },
    {
      id: "5",
      username: "CastleKeeper",
      avatar: "/placeholder.svg?height=40&width=40&text=CK",
      status: "online" as const,
      rating: 1750,
    },
  ];

  const handleFriendChallenge = (friendId: string) => {
    console.log("Challenging friend:", friendId);
  };

  const handleRandomMatch = () => {
    console.log("Starting random match");
  };

  return (
    <ChessLobby
      currentUser={currentUser}
      friends={friends}
      onFriendChallenge={handleFriendChallenge}
      onRandomMatch={handleRandomMatch}
    />
  );

  // return <ChessLobby />;
}
