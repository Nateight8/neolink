"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type JSX,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Chessboard } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import { useStockfish } from "@/hooks/use-stockfish";
import { useAuth } from "@/contexts/auth-context";
import { useChessSocket, ChessRoom } from "@/hooks/api/use-chess-socket";

type PiecePosition = {
  x: number;
  y: number;
  piece: string;
  square: string;
};

const squareToPosition = (square: string) => {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = 8 - parseInt(square[1], 10);
  return { x: file, y: rank };
};
import GameController from "./game-control";
import Spectators from "./spectators";
import ChessHeader from "./chess-header";
import Player, { type PlayerData } from "./player";

import GameStatus from "./game-status";

type PlayerColor = "white" | "black";

// Define a custom move type that's compatible with chess.js Move
type ChessMove = {
  to: string;
  from: string;
  piece: string;
  color: "w" | "b";
  flags: string;
  san: string;
  // Add other properties from Move that you need
};

interface BotGameSettings {
  difficulty: number;
  timeControl: string;
  color: "white" | "black" | "random";
}

interface ChessGameCleanProps {
  matchType: "friend" | "random" | "bot" | null;
  onDisconnect: () => void;
  botSettings?: BotGameSettings | null;
  roomid: string;
  roomState?: Record<string, unknown> | null;
}

type ChessRoomMove = {
  from: string;
  to: string;
  san: string;
  timestamp: string;
};

type ChessPlayer = {
  user: { _id: string; username: string };
  isCreator: boolean;
  color: PlayerColor;
  _id: string;
};

export function ChessGameClean({
  matchType,
  onDisconnect,
  botSettings = null,
  roomid,
  roomState,
}: ChessGameCleanProps) {
  const { user } = useAuth();

  // Determine players and color based on game type
  // Check if there's an opponent in the game
  const hasOpponent = useMemo(() => {
    if (matchType === "bot") return true; // Always true for bot games
    if (!roomState || !("chessPlayers" in roomState)) return false;
    const chessPlayers = (roomState.chessPlayers as ChessPlayer[]) || [];
    return (
      chessPlayers.length >= 2 &&
      chessPlayers.some((p) => p.user._id !== user?._id)
    );
  }, [matchType, roomState, user]);

  const { players, myColor } = useMemo(() => {
    let playersList: PlayerData[] = [];
    let playerColor: PlayerColor = "white";

    if (matchType === "friend" && roomState) {
      // Friend game logic
      const chessPlayers =
        (roomState as { chessPlayers?: ChessPlayer[] }).chessPlayers || [];
      const me = chessPlayers.find((p) => p.user._id === user?._id);

      if (me) playerColor = me.color;

      // Only include actual players in the game
      if (chessPlayers.length > 0) {
        playersList = chessPlayers.map((p, index) => ({
          id: p.user._id || String(index + 1),
          username: p.user.username || `Player ${index + 1}`,
          rating: 1500,
          color: p.color,
          avatar: "",
        }));
      } else {
        // Fallback if no players found
        playersList = [
          {
            id: "1",
            username: "Player 1",
            rating: 1500,
            color: "white",
            avatar: "",
          },
          {
            id: "2",
            username: "Player 2",
            rating: 1500,
            color: "black",
            avatar: "",
          },
        ];
      }
    } else if (matchType === "bot" && botSettings) {
      // Bot game logic - always treat as player
      const botColor =
        botSettings.color === "random"
          ? Math.random() > 0.5
            ? "white"
            : "black"
          : botSettings.color;
      playerColor = botColor === "white" ? "black" : "white";

      playersList = [
        {
          id: "bot-1",
          username: "AI Bot",
          rating: 2000,
          color: botColor,
          avatar: "",
        },
        {
          id: user?._id || "2",
          username: user?.username || "You",
          rating: 1500,
          color: playerColor,
          avatar: "",
        },
      ];
    } else {
      // Default/fallback for random or unknown game types
      playersList = [
        {
          id: "1",
          username: "Player 1",
          rating: 1500,
          color: "white",
          avatar: "",
        },
        {
          id: "2",
          username: "Player 2",
          rating: 1500,
          color: "black",
          avatar: "",
        },
      ];
    }

    return { players: playersList, myColor: playerColor };
  }, [matchType, roomState, user, botSettings]);

  // Log bot settings when they change
  useEffect(() => {
    if (matchType === "bot" && botSettings) {
      // Here you would initialize the bot with the settings
      // For example: initializeBot(botSettings);
    }
  }, [matchType, botSettings]);

  // Log roomState for now
  useEffect(() => {
    if (roomState) {
      console.log("[ChessGameClean] roomState:", roomState);
    }
  }, [roomState]);

  // Initialize state
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [game, setGame] = useState<Chess>(() => {
    if (matchType === "bot" && typeof window !== "undefined") {
      const savedGame = localStorage.getItem("chessBotGame");
      if (savedGame) {
        try {
          const { fen, moveHistory: savedMoveHistory } = JSON.parse(savedGame);
          const chess = new Chess();
          chess.load(fen);

          // Set move history from saved game
          if (Array.isArray(savedMoveHistory)) {
            setMoveHistory(savedMoveHistory);
          }

          return chess;
        } catch (e) {
          console.error("Failed to load saved game:", e);
        }
      }
    }
    return new Chess();
  });

  const [showGameOverlay, setShowGameOverlay] = useState<boolean>(true);
  const [gamePosition, setGamePosition] = useState<string>(game.fen());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Save game state and move history to localStorage when they change (only for bot games)
  useEffect(() => {
    if (matchType === "bot" && typeof window !== "undefined") {
      const gameState = {
        fen: game.fen(),
        history: game.history(),
        moveHistory: moveHistory,
      };
      localStorage.setItem("chessBotGame", JSON.stringify(gameState));
    }
  }, [game, matchType, moveHistory]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [animatedPiece, setAnimatedPiece] = useState<PiecePosition | null>(
    null
  );
  const [capturedPieces, setCapturedPieces] = useState<{
    white: string[];
    black: string[];
  }>({ white: [], black: [] });
  const boardRef = useRef<HTMLDivElement>(null);

  const skillLevel = botSettings?.difficulty; // Set to 1 for very easy, 10 for medium, 20 for strongest
  const { evaluatePosition, onBestMove } = useStockfish(game.fen(), skillLevel);

  // Memoize game state to prevent unnecessary effect triggers
  const gameState = useMemo(
    () => ({
      fen: game.fen(),
      turn: game.turn(),
      isGameOver: game.isGameOver(),
    }),
    [game]
  );

  // For human vs human, always use backend FEN and move history as source of truth
  useEffect(() => {
    if (
      matchType === "friend" &&
      roomState &&
      typeof roomState === "object" &&
      "fen" in roomState &&
      typeof roomState.fen === "string"
    ) {
      setGame(new Chess(roomState.fen));
      setGamePosition(roomState.fen);
    }
    if (
      matchType === "friend" &&
      roomState &&
      Array.isArray((roomState as { moves?: ChessRoomMove[] }).moves)
    ) {
      const moves = (roomState as { moves: ChessRoomMove[] }).moves
        .map((m) => m.san)
        .filter(Boolean);
      setMoveHistory(moves);
    }
  }, [roomState, matchType]);

  // Make bot move if it's the bot's turn
  useEffect(() => {
    let isMounted = true;
    const { fen: currentFen, turn: currentTurn, isGameOver } = gameState;

    const makeBotMove = async () => {
      if (!isMounted || matchType !== "bot" || !botSettings || isAnimating)
        return;

      const isBotTurn =
        (currentTurn === "w" && myColor === "black") ||
        (currentTurn === "b" && myColor === "white");

      if (!isBotTurn || isGameOver) return;

      console.log("Bot is thinking...");

      try {
        const bestMove = await new Promise<string | null>((resolve) => {
          if (!isMounted) return resolve(null);

          const timeoutId = setTimeout(() => {
            resolve(null);
          }, 10000);

          const handleBestMove = ({
            bestMove,
          }: {
            bestMove: string | null;
          }) => {
            if (bestMove && bestMove !== "(none)") {
              clearTimeout(timeoutId);
              resolve(bestMove);
            }
          };

          // Set up the best move listener
          const cleanup = onBestMove(handleBestMove);

          evaluatePosition(currentFen, 15);

          // Return cleanup function
          return () => {
            cleanup();
            clearTimeout(timeoutId);
          };
        });

        if (!isMounted || !bestMove) return;

        const gameCopy = new Chess(currentFen);
        const moveDetails = gameCopy.move({
          from: bestMove.slice(0, 2) as Square,
          to: bestMove.slice(2, 4) as Square,
          promotion:
            bestMove.length > 4
              ? (bestMove[4] as "q" | "r" | "b" | "n")
              : undefined,
        });

        if (!moveDetails) return;

        setGame(gameCopy);
        setGamePosition(gameCopy.fen());

        // Update captured pieces if a piece was captured
        if (moveDetails.captured) {
          const botColor = myColor === "white" ? "black" : "white";
          const pieceType = moveDetails.captured;
          console.log(`Bot (${botColor}) captured piece: ${pieceType}`);

          setCapturedPieces((prev) => ({
            ...prev,
            [botColor]: [...prev[botColor as keyof typeof prev], pieceType],
          }));
        }

        // Set up animation after state updates
        requestAnimationFrame(() => {
          if (!isMounted) return;

          console.log("Starting animation for move:", {
            from: moveDetails.from,
            to: moveDetails.to,
            piece: moveDetails.piece + moveDetails.color,
          });

          setLastMove({
            from: moveDetails.from,
            to: moveDetails.to,
          });

          // Get piece being moved for animation
          const fromPos = squareToPosition(moveDetails.from);
          setAnimatedPiece({
            ...fromPos,
            piece: moveDetails.piece + moveDetails.color,
            square: moveDetails.from,
          });

          // Animate the move
          setIsAnimating(true);

          // Clear animation after a delay
          setTimeout(() => {
            if (!isMounted) return;
            console.log("Clearing animation");
            setAnimatedPiece(null);
            setIsAnimating(false);
          }, 300);
        });
      } catch (error) {
        console.error("Error in bot move:", error);
        if (isMounted) {
          setIsAnimating(false);
        }
      }
    };

    makeBotMove();

    return () => {
      isMounted = false;
    };
  }, [
    gameState,
    matchType,
    botSettings,
    myColor,
    isAnimating,
    evaluatePosition,
    onBestMove,
  ]);
  // Parse time control string (e.g., "5+3" = 5 minutes + 3 second increment)
  const parseTimeControl = (timeControl: string) => {
    const [minutes, increment] = timeControl.split("+").map(Number);
    return {
      baseTime: (minutes || 10) * 60, // Default to 10 minutes if parsing fails
      increment: increment || 0,
    };
  };

  // Get time control from backend for human vs human, or from bot settings/default for bot games
  let timeControl = "10+0";
  if (
    matchType === "friend" &&
    roomState &&
    typeof roomState === "object" &&
    "timeControl" in roomState &&
    typeof roomState.timeControl === "string"
  ) {
    timeControl = roomState.timeControl;
  } else if (botSettings?.timeControl) {
    timeControl = botSettings.timeControl;
  }
  const { baseTime } = parseTimeControl(timeControl);

  const [gameTime, setGameTime] = useState<{ white: number; black: number }>({
    white: baseTime,
    black: baseTime,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSpectators, setShowSpectators] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Timer management
  const lastMoveTime = useRef<number>(Date.now());
  const [currentPlayerTime, setCurrentPlayerTime] = useState<number>(() => {
    const initialTime = timeControl.split("+")[0];
    return parseInt(initialTime) * 60; // Convert minutes to seconds
  });

  const currentTurn = game.turn();

  // Reset timer when turn changes
  useEffect(() => {
    lastMoveTime.current = Date.now();
    const initialTime = timeControl.split("+")[0];
    setCurrentPlayerTime(parseInt(initialTime) * 60); // Reset to initial time in seconds
  }, [currentTurn, timeControl]);

  // Timer countdown effect
  useEffect(() => {
    // Only start the timer if the game is in progress, has both players, and is not paused
    if (game.isGameOver() || isPaused || !hasOpponent) {
      // Reset the timer if there's no opponent
      if (!hasOpponent && !game.isGameOver()) {
        const initialTime = timeControl.split("+")[0];
        setCurrentPlayerTime(parseInt(initialTime) * 60);
      }
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const timeElapsed = Math.floor((now - lastMoveTime.current) / 1000);

      setCurrentPlayerTime((prev) => {
        const newTime = prev - timeElapsed;
        lastMoveTime.current = now;

        if (newTime <= 0) {
          const currentTurn = game.turn();
          const currentPlayer = currentTurn === "w" ? "white" : "black";
          const winner = currentTurn === "w" ? "black" : "white";

          game.setHeader(
            "Termination",
            `Time forfeit - ${currentPlayer} lost on time`
          );
          game.setHeader("Result", winner === "white" ? "1-0" : "0-1");
          game.load(game.fen()); // Force game to end
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game, timeControl, isPaused, hasOpponent]);

  // Update game time for display
  useEffect(() => {
    const currentPlayer = currentTurn === "w" ? "white" : "black";
    setGameTime((prev) => ({
      ...prev,
      [currentPlayer]: currentPlayerTime,
    }));
  }, [currentPlayerTime, currentTurn]);

  // Track animation state with ref to avoid stale closures
  const isAnimatingRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync ref with state
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Reset animation state if it gets stuck
  useEffect(() => {
    const timer = setInterval(() => {
      if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
        setAnimatedPiece(null);
        setIsAnimating(false);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // --- WebSocket for real-time multiplayer ---
  const handleSocketRoomState = useCallback(
    (newRoomState: ChessRoom) => {
      if (matchType === "friend") {
        if (newRoomState.fen) {
          setGame(new Chess(newRoomState.fen));
          setGamePosition(newRoomState.fen);
        }
        if (Array.isArray(newRoomState.moves)) {
          const moves = newRoomState.moves.map((m) => m.san).filter(Boolean);
          setMoveHistory(moves);
        }
      }
    },
    [matchType]
  );

  // Get WebSocket connection and spectators
  const { sendMove, spectators } = useChessSocket(
    matchType === "friend" ? roomid : "",
    handleSocketRoomState
  );

  // Format spectators data for the Spectators component, ensuring players are not included
  const formattedSpectators = useMemo(() => {
    if (!spectators) return [];

    // Get player IDs from the current room state
    const chessPlayers =
      (roomState as { chessPlayers?: ChessPlayer[] })?.chessPlayers || [];
    const playerIds = new Set(chessPlayers.map((p) => p.user._id));

    // Filter out any spectators that are actually players
    return spectators
      .filter((spec) => !playerIds.has(spec._id))
      .map((spec) => ({
        id: spec._id,
        username: spec.username,
        avatar:
          "/placeholder.svg?height=32&width=32&text=" +
          (spec.username?.charAt(0) || "U"),
      }));
  }, [spectators, roomState]);

  // Update document title with spectator count
  useEffect(() => {
    if (formattedSpectators.length > 0) {
      document.title = `NeoLink Chess (${formattedSpectators.length} spectators)`;
    } else {
      document.title = "NeoLink Chess";
    }

    return () => {
      document.title = "NeoLink";
    };
  }, [formattedSpectators.length]);

  const makeMove = (sourceSquare: string, targetSquare: string): boolean => {
    if (isAnimatingRef.current || isAnimating) {
      return false;
    }
    isAnimatingRef.current = true;
    setIsAnimating(true);
    const gameCopy = new Chess(game.fen());
    const { increment } = parseTimeControl(timeControl);
    try {
      const move = gameCopy.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: "q",
      });
      if (move) {
        if (matchType === "bot") {
          setGame(gameCopy);
          setGamePosition(gameCopy.fen());
          setMoveHistory((prev) => [...prev, move.san]);
        }
        // Update captured pieces if a piece was captured (en passant or regular capture)
        if (move.captured) {
          // The capturing player is the one who made the move (move.color)
          const capturingColor = move.color === "w" ? "white" : "black";
          const pieceType = move.captured;

          // Create a new array reference to trigger re-render
          setCapturedPieces((prev) => {
            const newPieces = {
              ...prev,
              [capturingColor]: [
                ...prev[capturingColor as keyof typeof prev],
                pieceType,
              ],
            };

            return newPieces;
          });
        }

        // Set last move for animation
        setLastMove({
          from: sourceSquare,
          to: targetSquare,
        });

        // Get piece being moved for animation
        const fromPos = squareToPosition(sourceSquare);
        const animatedPieceData = {
          ...fromPos,
          piece: move.piece + move.color,
          square: sourceSquare,
        };

        setAnimatedPiece(animatedPieceData);

        // Apply time increment to the current player's clock
        const currentTurn = gameCopy.turn();

        if (increment > 0) {
          setGameTime((prev) => {
            const newTime = {
              ...prev,
              [currentTurn === "w" ? "white" : "black"]:
                prev[currentTurn === "w" ? "white" : "black"] + increment,
            };

            return newTime;
          });
        }

        // Animate the move
        setIsAnimating(true);

        // Clear any pending timeouts first
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        try {
          // Update game state first
          setGame(gameCopy);
          setGamePosition(gameCopy.fen());
          setMoveHistory((prev) => [...prev, move.san]);

          // Game state updated

          // Set a single timeout for animation cleanup
          animationTimeoutRef.current = setTimeout(() => {
            try {
              setAnimatedPiece(null);

              // Update ref and state after a small delay
              setTimeout(() => {
                isAnimatingRef.current = false;
                setIsAnimating(false);
              }, 50);
            } catch {
              // Reset animation state on error
              isAnimatingRef.current = false;
              setAnimatedPiece(null);
              setIsAnimating(false);
            }
          }, 300); // Match this with your CSS transition duration

          // Persist move for human vs human
          if (matchType === "friend") {
            sendMove({
              from: move.from,
              to: move.to,
              san: move.san,
              fen: gameCopy.fen(),
            });
          }

          return true;
        } catch {
          // Reset state on error
          isAnimatingRef.current = false;
          setAnimatedPiece(null);
          setIsAnimating(false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Move failed:", error.message);
      }
    }
    return false;
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    // Check if the user is a player in this game
    const chessPlayers =
      (roomState as { chessPlayers?: ChessPlayer[] })?.chessPlayers || [];
    const isPlayer =
      matchType === "bot" || chessPlayers.some((p) => p.user._id === user?._id);

    if (!isPlayer) {
      console.log("Spectators cannot make moves");
      return false;
    }

    // Prevent move if no opponent has joined (for non-bot games)
    if (!hasOpponent && matchType !== "bot") {
      console.log("Waiting for opponent to join...");
      return false;
    }

    // Check if it's the current player's turn based on the game state
    const currentTurn = game.turn();
    const isPlayerTurn =
      (currentTurn === "w" && myColor === "white") ||
      (currentTurn === "b" && myColor === "black");

    if (!isPlayerTurn) {
      return false;
    }

    return makeMove(sourceSquare, targetSquare);
  };

  const handleResign = () => {
    // In a real app, this would send a resignation to the server
  };

  const handleDrawOffer = () => {
    // In a real app, this would send a draw offer to the opponent
  };

  const customPieces = useMemo(() => {
    return () => {
      const pieces = [
        "wP",
        "wN",
        "wB",
        "wR",
        "wQ",
        "wK",
        "bP",
        "bN",
        "bB",
        "bR",
        "bQ",
        "bK",
      ];
      const pieceComponents: {
        [key: string]: ({
          squareWidth,
        }: {
          squareWidth: number;
        }) => JSX.Element;
      } = {};

      pieces.forEach((piece) => {
        const isWhite = piece[0] === "w";

        pieceComponents[piece] = ({ squareWidth }) => (
          <div
            style={{
              width: squareWidth,
              height: squareWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: squareWidth * 0.7,
              filter: isWhite
                ? "drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))"
                : "drop-shadow(0 0 8px rgba(255, 0, 255, 0.8))",
              color: isWhite ? "#00ffff" : "#ff00ff",
            }}
          >
            <span
              style={{
                textShadow: isWhite
                  ? "0 0 10px rgba(0, 255, 255, 0.5)"
                  : "0 0 10px rgba(255, 0, 255, 0.5)",
              }}
            >
              {getUnicodePiece(piece)}
            </span>
          </div>
        );
      });

      return pieceComponents;
    };
  }, []);

  function getUnicodePiece(piece: string) {
    const pieces: Record<string, string> = {
      wK: "♔",
      wQ: "♕",
      wR: "♖",
      wB: "♗",
      wN: "♘",
      wP: "♙",
      bK: "♔",
      bQ: "♕",
      bR: "♖",
      bB: "♗",
      bN: "♘",
      bP: "♙",
    };
    return pieces[piece] || "";
  }

  // Check if it's the current player's turn
  const isPlayersTurn = (): boolean => {
    const currentTurn = game.turn();
    const currentPlayerColor = currentTurn === "w" ? "white" : "black";
    return myColor === currentPlayerColor;
  };

  const onSquareClick = (square: string) => {
    // Check if it's the current player's turn
    if (!isPlayersTurn()) return;

    // If a piece is already selected and the clicked square is a valid move, make the move
    if (selectedSquare) {
      if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
      // If clicking on the same square, deselect it
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
    }

    // Check if the clicked square has a piece of the current player's color
    const piece = game.get(square as Square);
    if (
      piece &&
      ((game.turn() === "w" && piece.color === "w") ||
        (game.turn() === "b" && piece.color === "b"))
    ) {
      setSelectedSquare(square);
      const moves = game.moves({
        square: square as Square,
        verbose: true,
      }) as ChessMove[];
      setPossibleMoves(moves.map((move) => move.to));
    }
  };

  const getCustomSquareStyles = (): {
    [square: string]: React.CSSProperties;
  } => {
    const styles: { [square: string]: React.CSSProperties } = {};

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(0, 255, 255, 0.4)",
        boxShadow: "inset 0 0 20px rgba(0, 255, 255, 0.6)",
      };
    }

    // Highlight possible moves
    possibleMoves.forEach((square) => {
      const piece = game.get(square as Square);
      styles[square] = {
        background: piece
          ? "radial-gradient(circle, rgba(255,0,255,0.4) 85%, transparent 85%)" // Capture move
          : "radial-gradient(circle, rgba(0,255,255,0.4) 25%, transparent 25%)", // Normal move
        borderRadius: piece ? "0%" : "50%",
      };
    });

    return styles;
  };

  // Toggle pause state
  const togglePause = () => {
    if (!game.isGameOver()) {
      setIsPaused(!isPaused);
      if (!isPaused) {
        // Update last move time when pausing to prevent time jump on resume
        lastMoveTime.current = Date.now();
      }
    }
  };

  // Show waiting overlay if no opponent has joined
  const showWaitingOverlay =
    !hasOpponent && matchType !== "bot" && !game.isGameOver();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {showWaitingOverlay && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-gray-900/90 border border-gray-800 rounded-lg p-6 max-w-md mx-4 text-center">
            <div className="animate-pulse text-2xl text-cyan-400 mb-4">
              Waiting for opponent...
            </div>
            <p className="text-gray-300 mb-4">
              Share this room link with a friend to start playing!
            </p>
            <div className="bg-gray-800/50 p-3 rounded border border-dashed border-gray-700">
              <code className="text-cyan-300 break-all">
                {typeof window !== "undefined"
                  ? window.location.href
                  : "Loading..."}
              </code>
            </div>
          </div>
        </div>
      )}
      {/* Cyberpunk background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

      {/* Neural grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="neural-grid"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#00ffff"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      {/* Chess game interface */}
      <div className="relative z-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ChessHeader
            isGameOver={game.isGameOver()}
            isCheckmate={game.isCheckmate()}
            isDraw={game.isDraw()}
            soundEnabled={soundEnabled}
            isPaused={isPaused}
            showSpectators={showSpectators}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onPauseResume={() => setIsPaused(!isPaused)}
            onSurrender={() => {
              // Handle surrender logic here
            }}
            onOfferDraw={() => {
              // Handle draw offer logic here
            }}
            onToggleSpectators={() => setShowSpectators(!showSpectators)}
            roomId={roomid}
          />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 max-w-7xl mx-auto mt-6">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-2 hidden lg:block space-y-4">
              <GameController
                onResign={handleResign}
                onDrawOffer={handleDrawOffer}
                isGameOver={
                  game.isGameOver() ||
                  gameTime.white <= 0 ||
                  gameTime.black <= 0
                }
                isPlayerTurn={isPlayersTurn()}
                isPaused={isPaused}
                onPause={togglePause}
              />
              <GameStatus
                game={game}
                gameTime={gameTime}
                onPlayAgain={() => {
                  // Clear game state from localStorage before reloading
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("chessBotGame");
                  }
                  window.location.reload();
                }}
                onViewBoard={() => {
                  setShowGameOverlay(false);
                }}
                onExit={onDisconnect}
              />
            </div>
            {/* Center - Game Area */}
            <div className="lg:col-span-3 border flex flex-col items-center space-y-6">
              {/* Top Player (Opponent) */}
              {players[0]?.id !== "1" ? (
                <Player
                  player={players[0]}
                  isCurrentPlayer={
                    players[0]?.color &&
                    myColor === players[0].color &&
                    !game.isGameOver()
                  }
                  timeRemaining={
                    players[0]?.color ? gameTime[players[0].color] : 0
                  }
                  capturedPieces={
                    players[1]?.color ? capturedPieces[players[1].color] : []
                  } // Opponent's captures are my pieces
                  color={players[0]?.color || "white"}
                  isLoggedIn={players[0]?.color && myColor === players[0].color}
                  key={`top-${players[0]?.id || "1"}`}
                />
              ) : (
                <div className="w-full bg-black/30 border border-cyan-500/20 rounded-xl p-4 text-center">
                  <p className="text-cyan-400 font-medium">
                    Awaiting opponent...
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Share the room link to invite a friend
                  </p>
                </div>
              )}

              {/* Chess Board */}
              {/* Chessboard Container */}
              <div className="w-full aspect-square max-w-[600px] relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-sm -z-10" />

                {/* Spectator overlay - blocks interactions */}
                {(() => {
                  const chessPlayers =
                    (roomState as { chessPlayers?: ChessPlayer[] })
                      ?.chessPlayers || [];
                  const isPlayer =
                    matchType === "bot" ||
                    chessPlayers.some((p) => p.user._id === user?._id);

                  if (!isPlayer) {
                    return (
                      <div
                        className="absolute inset-0 z-10 cursor-not-allowed"
                        style={{ pointerEvents: "auto" }}
                        onClick={(e) => e.preventDefault()}
                      />
                    );
                  }
                  return null;
                })()}

                <div ref={boardRef} className="w-full h-full">
                  <Chessboard
                    position={gamePosition}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    isDraggablePiece={({ piece }) => {
                      // Only allow dragging if the user is a player and it's their turn
                      const chessPlayers =
                        (roomState as { chessPlayers?: ChessPlayer[] })
                          ?.chessPlayers || [];
                      const isPlayer =
                        matchType === "bot" ||
                        chessPlayers.some((p) => p.user._id === user?._id);
                      if (!isPlayer) return false;

                      // Only allow dragging pieces of the current player's color
                      const pieceColor = piece[0] === "w" ? "white" : "black";
                      return (
                        pieceColor === myColor &&
                        ((game.turn() === "w" && myColor === "white") ||
                          (game.turn() === "b" && myColor === "black"))
                      );
                    }}
                    customBoardStyle={{
                      borderRadius: "4px",
                      boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
                    }}
                    customDarkSquareStyle={{ backgroundColor: "#1f2937" }}
                    customLightSquareStyle={{ backgroundColor: "#374151" }}
                    customSquareStyles={getCustomSquareStyles()}
                    customPieces={customPieces()}
                    boardOrientation={myColor}
                  />
                </div>

                {/* Animated piece overlay */}
                <AnimatePresence>
                  {animatedPiece && lastMove && (
                    <motion.div
                      key={`${animatedPiece.square}-${lastMove.to}`}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        transform: `translate(${animatedPiece.x * 12.5}%, ${
                          animatedPiece.y * 12.5
                        }%)`,
                        width: "12.5%",
                        height: "12.5%",
                        zIndex: 10,
                      }}
                      animate={{
                        x: `calc(${
                          (squareToPosition(lastMove.to).x - animatedPiece.x) *
                          100
                        }%)`,
                        y: `calc(${
                          (squareToPosition(lastMove.to).y - animatedPiece.y) *
                          100
                        }%)`,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl">
                        {getUnicodePiece(animatedPiece.piece)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scan line animation overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400/30"
                    animate={{ y: ["0%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Game status overlay */}
                {showGameOverlay &&
                  (game.isGameOver() ||
                    gameTime.white <= 0 ||
                    gameTime.black <= 0) && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-sm p-4">
                      <div className="text-center mb-6">
                        <h2
                          className={`text-4xl font-extrabold mb-2 font-cyber neon-text ${(() => {
                            const result =
                              roomState &&
                              typeof roomState === "object" &&
                              "result" in roomState &&
                              typeof roomState.result === "object" &&
                              roomState.result !== null &&
                              "status" in roomState.result &&
                              "winner" in roomState.result
                                ? (roomState.result as {
                                    status?: string;
                                    winner?: string | null;
                                  })
                                : undefined;
                            if (result?.status === "draw")
                              return "text-cyan-400";
                            if (result?.winner && user) {
                              return result.winner === user._id
                                ? "text-emerald-600 drop-shadow-[0_0_16px_#10b981]"
                                : "text-rose-600 drop-shadow-[0_0_16px_#f43f5e]";
                            }
                            return "text-cyan-400";
                          })()}`}
                        >
                          {(() => {
                            const result =
                              roomState &&
                              typeof roomState === "object" &&
                              "result" in roomState &&
                              typeof roomState.result === "object" &&
                              roomState.result !== null &&
                              "status" in roomState.result &&
                              "winner" in roomState.result
                                ? (roomState.result as {
                                    status?: string;
                                    winner?: string | null;
                                  })
                                : undefined;
                            if (result?.status === "draw") return "DRAW";
                            if (result?.winner && user) {
                              return result.winner === user._id
                                ? "YOU WON"
                                : "YOU LOST";
                            }
                            return gameTime.white <= 0
                              ? "BLACK WINS!"
                              : gameTime.black <= 0
                              ? "WHITE WINS!"
                              : game.isCheckmate()
                              ? `${
                                  game.turn() === "w" ? "BLACK" : "WHITE"
                                } WINS!`
                              : "NEURAL DRAW";
                          })()}
                        </h2>
                        <p className="text-cyan-300 mb-6">
                          {gameTime.white <= 0 || gameTime.black <= 0
                            ? "TIME FORFEIT"
                            : game.isCheckmate()
                            ? "CHECKMATE"
                            : game.isStalemate()
                            ? "STALEMATE"
                            : game.isThreefoldRepetition()
                            ? "THREEFOLD REPETITION"
                            : game.isInsufficientMaterial()
                            ? "INSUFFICIENT MATERIAL"
                            : "DRAW"}
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {/* Bottom Player (Me) */}
              {players[1] ? (
                <Player
                  player={players[1]}
                  isCurrentPlayer={
                    players[1]?.color &&
                    myColor === players[1].color &&
                    !game.isGameOver()
                  }
                  timeRemaining={
                    players[1]?.color ? gameTime[players[1].color] : 0
                  }
                  capturedPieces={
                    players[0]?.color ? capturedPieces[players[0].color] : []
                  } // My captures are opponent's pieces
                  color={players[1]?.color || "black"}
                  isLoggedIn={players[1]?.color && myColor === players[1].color}
                  key={`bottom-${players[1]?.id || "2"}`}
                />
              ) : (
                <div className="w-full bg-black/30 border border-cyan-500/20 rounded-xl p-4 text-center">
                  <p className="text-cyan-400 font-medium">
                    Connecting to game...
                  </p>
                </div>
              )}
            </div>

            {/* Right Panel - Spectators */}
            <Spectators
              spectators={formattedSpectators}
              moveHistory={moveHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
