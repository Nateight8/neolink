import express from "express";
import { acceptChessChallenge } from "../controllers/chess.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Accept a chess challenge
router.post("/accept", authMiddleware, acceptChessChallenge);

export default router;
