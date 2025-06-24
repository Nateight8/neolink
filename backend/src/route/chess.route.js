import express from "express";
import { createChessRoom } from "../controllers/chess.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a chess room
router.post("/rooms", authMiddleware, createChessRoom);

export default router;
