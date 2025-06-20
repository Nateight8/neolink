import express from "express";
import { configDotenv } from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authRoute from "./route/auth.route.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import usersRoute from "./route/user.route.js";
import postRouter from "./route/post.route.js";
import notificationRoute from "./route/notifications.js";
import pollRouter from "./route/poll.route.js";
import dmRoute from "./route/dm.route.js";

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
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://neolink-2.onrender.com",
      process.env.CORS_ORIGIN,
      /https?:\/\/neolink-[a-z0-9-]+\.vercel\.app$/,
    ],
    credentials: true,
  },
});

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

// Configure CORS with production settings
const allowedOrigins = [
  "http://localhost:3000",
  "https://neolink-2.onrender.com",
  // Add CORS_ORIGIN if it exists
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
  // Match all Vercel preview and production deployments
  /^https?:\/\/neolink-[a-z0-9-]+\.vercel\.app$/,
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-side requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list or matches the patterns
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This is important for cookies to be sent cross-origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-HTTP-Method-Override",
    "Accept",
    "X-Requested-With",
    "x-auth-token",
    "x-csrf-token",
    "x-forwarded-for",
    "x-forwarded-proto",
    "x-forwarded-host",
  ],
  exposedHeaders: ["Set-Cookie", "set-cookie", "authorization", "x-auth-token"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // 24 hours
};

console.log("CORS Options:", corsOptions);

// Trust first proxy (important for Render)
app.set("trust proxy", 1);

// Debug middleware for all requests
app.use((req, res, next) => {
  console.log("\n=== Incoming Request ===");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  console.log("Headers:", {
    "content-type": req.headers["content-type"],
    authorization: req.headers.authorization ? "present" : "missing",
    cookie: req.headers.cookie ? "present" : "missing",
  });
  next();
});

// Apply CORS middleware before other middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration with production settings
const sessionConfig = {
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for secure cookies on Render
  name: "sessionId", // Don't use 'connect.sid' as it can be fingerprinted
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Must be true for sameSite: 'none' in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
    // Only set domain in production
    ...(process.env.NODE_ENV === "production" && {
      domain: ".onrender.com", // Match your production domain
    }),
  },
  rolling: true, // Reset the maxAge on every request
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 7 * 24 * 60 * 60, // 7 days in seconds
  }),
};

app.use(session(sessionConfig));

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRoute);
app.use("/api/polls", pollRouter);
app.use("/api/dm", dmRoute);

// Socket.IO connection logic
io.on("connection", (socket) => {
  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });
  // Optionally handle disconnects, typing, etc. here
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
  connectDB();
});

// Export io for use in controllers
export { io };
