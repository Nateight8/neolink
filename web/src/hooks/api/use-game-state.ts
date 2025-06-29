// hooks/useGameState.js
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";

// Bot game query (localStorage only)
const useBotGameState = () => {
  return useQuery({
    queryKey: ["botGame"],
    queryFn: () => {
      if (typeof window === "undefined") return null;

      try {
        const botGameData = localStorage.getItem("chessBotGame");
        if (botGameData) {
          const parsed = JSON.parse(botGameData);
          // Return the game data if it has a valid FEN and history
          return parsed.fen && parsed.history ? parsed : null;
        }
      } catch (error) {
        console.error("Error reading bot game:", error);
      }
      return null;
    },
    staleTime: Infinity, // localStorage doesn't change unless we change it
    gcTime: Infinity,
  });
};

// PvP game query (API call)
const usePvPGameState = () => {
  return useQuery({
    queryKey: ["pvpGame"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/chess/status");
      return data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

// Combined hook
export const useGameState = () => {
  const botGameQuery = useBotGameState();
  const pvpGameQuery = usePvPGameState();

  const isLoading = botGameQuery.isLoading || pvpGameQuery.isLoading;
  const isError = botGameQuery.isError || pvpGameQuery.isError;

  let activeGame = null;

  // Priority: PvP games first, then bot games
  if (pvpGameQuery.data?.hasActiveGame) {
    activeGame = {
      type: "pvp",
      url: `/room/chess/${pvpGameQuery.data.roomId}`,
      data: pvpGameQuery.data,
    };
  } else if (botGameQuery.data) {
    activeGame = {
      type: "bot",
      url: "/room/chess/bot",
      data: botGameQuery.data,
    };
  }

  return {
    activeGame,
    isLoading,
    isError,
    refetch: () => {
      botGameQuery.refetch();
      pvpGameQuery.refetch();
    },
  };
};
