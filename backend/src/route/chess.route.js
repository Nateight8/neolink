import express from "express";
import {
  acceptChessChallenge,
  getChessRoomState,
} from "../controllers/chess.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Accept a chess challenge
router.post("/accept", authMiddleware, acceptChessChallenge);

// Get chess room state (auth required)
router.get("/room/:roomId", authMiddleware, getChessRoomState);

export default router;
