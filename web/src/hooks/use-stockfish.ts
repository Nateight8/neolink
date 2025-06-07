// hooks/useStockfish.ts
import { useCallback, useEffect, useRef } from "react";

export const useStockfish = (initialFen?: string) => {
  const stockfishRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<((data: { bestMove: string | null }) => void)[]>(
    []
  );

  // Initialize Stockfish worker
  useEffect(() => {
    if (typeof Worker === "undefined") return;

    stockfishRef.current = new Worker("/stockfish.js");

    // Handle messages from Stockfish
    const handleMessage = (e: MessageEvent) => {
      const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1] || null;
      callbacksRef.current.forEach((callback) => callback({ bestMove }));
    };

    stockfishRef.current.addEventListener("message", handleMessage);

    // Initialize UCI and check if ready
    stockfishRef.current.postMessage("uci");
    stockfishRef.current.postMessage("isready");

    // Set initial position if provided
    if (initialFen) {
      stockfishRef.current.postMessage(`position fen ${initialFen}`);
    }

    return () => {
      stockfishRef.current?.terminate();
      stockfishRef.current = null;
    };
  }, [initialFen]);

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
    stockfishRef.current.postMessage(
      `setoption name Skill Level value ${Math.min(20, Math.max(0, level))}`
    );
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
