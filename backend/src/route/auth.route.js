import express from "express";
import {
  signupControler,
  signOutControler,
  signinControler,
  onboardingControler,
} from "../controllers/auth.controlers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoute = express.Router();

// authentication routes

authRoute.post("/login", signinControler);
authRoute.post("/signup", signupControler);
authRoute.post("/logout", signOutControler);

authRoute.post("/onboarding", authMiddleware, onboardingControler);

authRoute.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default authRoute;
