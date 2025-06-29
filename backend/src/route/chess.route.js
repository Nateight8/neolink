import express from "express";
import {
  acceptChessChallenge,
  getChessRoomState,
  makeChessMove,
  getActiveGameStatus,
} from "../controllers/chess.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Accept a chess challenge
router.post("/accept", authMiddleware, acceptChessChallenge);

// Get chess room state (auth required)
router.get("/room/:roomId", authMiddleware, getChessRoomState);

// Make a chess move (auth required)
router.post("/room/:roomId/move", authMiddleware, makeChessMove);

// Get active game status for the current user (auth required)
router.get("/status", authMiddleware, getActiveGameStatus);

export default router;
