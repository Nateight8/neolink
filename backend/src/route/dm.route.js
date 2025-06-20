import express from "express";
import { getOrCreateConversation } from "../controllers/dm.controllers.js";
import {
  getConversationMessages,
  sendMessage,
} from "../controllers/message.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateMessage } from "../middleware/validate-message.middleware.js";

const router = express.Router();

// Apply authentication to all DM routes
router.use(authMiddleware);

// Get or create conversation - our main endpoint
// GET /api/dm/:conversationId
router.get("/:conversationId", getOrCreateConversation);

// POST: /api/dm/:conversationId/message
router.post("/:conversationId/message", validateMessage, sendMessage);

// GET: /api/dm/:conversationId/messages
router.get("/:conversationId/messages", getConversationMessages);

export default router;
