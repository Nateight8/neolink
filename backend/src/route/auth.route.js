import express from "express";
import {
  emailVerificationController,
  signOutControler,
  signinControler,
  verifyOTPController,
  passwordSetupController,
  profileSetupController,
  updateUserProfileController,
} from "../controllers/auth.controlers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoute = express.Router();

// authentication routes

authRoute.post("/login", signinControler);
// authRoute.post("/signup", signupControler);
authRoute.post("/email-verification", emailVerificationController);
authRoute.post("/verify-otp", verifyOTPController);
authRoute.post("/logout", signOutControler);
authRoute.post("/password", passwordSetupController);
authRoute.post("/account-setup", authMiddleware, profileSetupController);
// authRoute.post("/onboarding", authMiddleware, onboardingControler);

authRoute.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Update user profile
authRoute.patch("/me", authMiddleware, updateUserProfileController);

export default authRoute;
