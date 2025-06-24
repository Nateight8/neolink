import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  reactToPost,
  getUserPostById,
} from "../controllers/post.controlers.js";

const postRouter = express.Router();

// Add auth middleware to protected routes
postRouter.post("/", authMiddleware, createPost); // Create post
postRouter.get("/", getAllPosts); // Get all posts
postRouter.get("/me", authMiddleware, getMyPosts); // Get user's own posts
postRouter.put("/:id", authMiddleware, updatePost); // Edit post
postRouter.delete("/:id", authMiddleware, deletePost); // Delete post
postRouter.post("/:id/reactions", authMiddleware, reactToPost); // React to post
postRouter.get("/:username/:id", getUserPostById); // Get a post by username and post ID

export default postRouter;
