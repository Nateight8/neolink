// hooks/useStockfish.ts
import { useCallback, useEffect, useRef } from "react";

export const useStockfish = (initialFen?: string, skillLevel: number = 0) => {
  const stockfishRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<((data: { bestMove: string | null }) => void)[]>(
    []
  );

  // Initialize Stockfish worker
  useEffect(() => {
    if (typeof Worker === "undefined") {
      console.error("Web Workers are not supported in this environment");
      return;
    }

    stockfishRef.current = new Worker("/stockfish.js");

    // Handle messages from Stockfish
    const handleMessage = (e: MessageEvent) => {
      const message = e.data as string;

      // Check for best move
      const bestMoveMatch = message.match(/bestmove\s+(\S+)/);
      if (bestMoveMatch) {
        const bestMove = bestMoveMatch[1];
        callbacksRef.current.forEach((callback) => callback({ bestMove }));
      }
    };

    stockfishRef.current.addEventListener("message", handleMessage);

    // Initialize UCI and set options
    stockfishRef.current.postMessage("uci");
    
    // Set skill level and other options
    stockfishRef.current.postMessage(`setoption name Skill Level value ${skillLevel}`);
    stockfishRef.current.postMessage('setoption name Skill Level Maximum Error value 200');
    stockfishRef.current.postMessage('setoption name Skill Level Probability value 100');
    stockfishRef.current.postMessage('setoption name Slow Mover value 1000');
    stockfishRef.current.postMessage('setoption name Threads value 1');
    stockfishRef.current.postMessage('setoption name Hash value 1');
    
    // Start new game and set ready
    stockfishRef.current.postMessage('ucinewgame');
    stockfishRef.current.postMessage('isready');

    // Set initial position if provided
    if (initialFen) {
      stockfishRef.current.postMessage(`position fen ${initialFen}`);
    }

    return () => {
      stockfishRef.current?.terminate();
      stockfishRef.current = null;
    };
  }, [initialFen, skillLevel]);

  // Evaluate position and get best move
  const evaluatePosition = useCallback((fen: string, depth: number = 10) => {
    if (!stockfishRef.current) return;

    stockfishRef.current.postMessage(`position fen ${fen}`);
    stockfishRef.current.postMessage(`go depth ${depth}`);
  }, []);

  // Set position without searching
  const setPosition = useCallback((fen: string) => {
    if (!stockfishRef.current) return;
    stockfishRef.current.postMessage(`position fen ${fen}`);
  }, []);

  // Set skill level (0-20)
  const setSkillLevel = useCallback((level: number) => {
    if (!stockfishRef.current) return;
    const skillLevel = Math.min(20, Math.max(0, level));
    stockfishRef.current.postMessage(
      `setoption name Skill Level value ${skillLevel}`
    );
    stockfishRef.current.postMessage("setoption name Skill Level");
  }, []);

  // Register callback for best move
  const onBestMove = useCallback(
    (callback: (data: { bestMove: string | null }) => void) => {
      callbacksRef.current.push(callback);
      return () => {
        callbacksRef.current = callbacksRef.current.filter(
          (cb) => cb !== callback
        );
      };
    },
    []
  );

  // Cleanup
  const cleanup = useCallback(() => {
    if (stockfishRef.current) {
      stockfishRef.current.postMessage("quit");
      stockfishRef.current.terminate();
      stockfishRef.current = null;
    }
  }, []);

  return {
    evaluatePosition,
    setPosition,
    setSkillLevel,
    onBestMove,
    cleanup,
  };
};
