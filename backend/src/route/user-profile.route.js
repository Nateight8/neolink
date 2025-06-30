import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user-profile.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userProfileRouter = express.Router();

// Apply auth middleware to all routes
userProfileRouter.use(authMiddleware);

// Get user profile by username
userProfileRouter.get("/:username", getUserProfile);

// Update current user's profile
userProfileRouter.patch("/me", updateUserProfile);

export default userProfileRouter;
