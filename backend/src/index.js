import express from "express";
import { configDotenv } from "dotenv";
import authRoute from "./route/auth.route.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from 'connect-mongo';
import cors from "cors";

import { connectDB } from "./lib/db.js";
import usersRoute from "./route/user.route.js";
import chatRoute from "./route/chat.route.js";
import postRouter from "./route/post.route.js";
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

// Configure CORS with production settings
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://neolink-2.onrender.com',
      'https://neolink-tawny.vercel.app',
      // Add other allowed origins here
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Cookie", 
    "x-auth-token",
    "x-requested-with"
  ],
  exposedHeaders: ["Set-Cookie", "x-auth-token"],
  // Enable preflight requests to have credentials
  preflightContinue: false,
  optionsSuccessStatus: 204
};

console.log("CORS Options:", corsOptions);

// Trust first proxy (important for Render)
app.set('trust proxy', 1);

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
  name: 'sessionId', // Don't use 'connect.sid' as it can be fingerprinted
  cookie: {
    httpOnly: true,
    secure: true, // Must be true for sameSite: 'none'
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    // For production, we'll use the root domain without subdomain to work across all subdomains
    domain: process.env.NODE_ENV === 'production' ? '.render.com' : 'localhost'
  },
  rolling: true, // Reset the maxAge on every request
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // 7 days in seconds
  })
};

app.use(session(sessionConfig));

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
