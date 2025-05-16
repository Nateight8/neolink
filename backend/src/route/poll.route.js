import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPoll,
  votePoll,
  removeVote,
  getMyPolls,
  getAccessiblePolls,
  deletePoll,
  createPostWithPoll,
} from "../controllers/poll.controllers.js";

const pollRouter = express.Router();

// All routes are protected - require authentication
pollRouter.use(authMiddleware);

// Create a post with a poll (alternative to using the createPost endpoint)
pollRouter.post("/with-post", createPostWithPoll);

// Get a specific poll
pollRouter.get("/:id", getPoll);

// Vote on a poll
pollRouter.post("/:id/vote", votePoll);

// Remove a vote from a poll
pollRouter.post("/:id/remove-vote", removeVote);

// Get polls created by logged-in user
pollRouter.get("/user/me", getMyPolls);

// Get polls the user can access (public, friends, or own)
pollRouter.get("/feed/accessible", getAccessiblePolls);

// Delete a poll
pollRouter.delete("/:id", deletePoll);

export default pollRouter;
