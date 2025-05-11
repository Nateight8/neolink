import express from "express";
import { configDotenv } from "dotenv";
import authRoute from "./route/auth.route.js";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import usersRoute from "./route/user.route.js";
import chatRoute from "./route/chat.route.js";
import postRouter from "./route/post.route.js";

import cors from "cors";

configDotenv();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/chat", chatRoute);
app.use("/api/posts", postRouter);

app.listen(PORT, () => {
  console.log("Server is running on port PORT " + PORT);
  connectDB();
});
