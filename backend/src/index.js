import express from "express";
import { configDotenv } from "dotenv";
import authRoute from "./route/auth.route.js";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import usersRoute from "./route/user.route.js";
import chatRoute from "./route/chat.route.js";
import postRouter from "./route/post.route.js";

import cors from "cors";
import notificationRoute from "./route/notifications.js";
import pollRouter from "./route/poll.route.js";

configDotenv();

const PORT = process.env.PORT || 5001;

// Debug environment variables
console.log("Environment Variables:");
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
console.log("NODE_ENV:", process.env.NODE_ENV);

if (!process.env.CORS_ORIGIN) {
  throw new Error(
    "CORS_ORIGIN is not defined in your environment. Please check your .env file."
  );
}

const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

// Debug middleware with more detailed logging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  console.log(`[DEBUG] Origin: ${req.headers.origin}`);
  console.log(`[DEBUG] CORS_ORIGIN: ${CORS_ORIGIN}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    corsOrigin: CORS_ORIGIN,
    environment: process.env.NODE_ENV,
  });
});

// CORS middleware with debug logging
const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

console.log("CORS Options:", corsOptions);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/chat", chatRoute);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRoute);
app.use("/api/polls", pollRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
  connectDB();
});
