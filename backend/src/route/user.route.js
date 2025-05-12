import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  recommendedUsers,
  friends,
  friendRequest,
  acceptRequest,
  getFriendRequests,
  getOutgoingRequests,
} from "../controllers/users.controlers.js";
import { onboardingStatus } from "../controllers/onboarding.js";

const usersRoute = express.Router();

usersRoute.use(authMiddleware);

usersRoute.get("/", recommendedUsers);
usersRoute.get("/friends", friends);

usersRoute.post("/friend-request/:id", friendRequest);
usersRoute.put("/friend-request/:id/accept", acceptRequest);
usersRoute.get("/friend-request", getFriendRequests);
usersRoute.get("/outgoing-friend-request", getOutgoingRequests);
usersRoute.get("/status", onboardingStatus);

// authentication routes

export default usersRoute;
