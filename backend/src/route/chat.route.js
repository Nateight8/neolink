import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controlers.js";

const chatRoute = express.Router();
chatRoute.use(authMiddleware);
// authentication routes

chatRoute.get("/token", getStreamToken);

export default chatRoute;
