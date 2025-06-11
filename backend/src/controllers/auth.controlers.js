import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import SignupSession from "../models/sign-up.js";
import { Resend } from "resend";
import { configDotenv } from "dotenv";

configDotenv();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signinControler(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with secure settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production, false in development
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Make sure cookie is sent for all paths
    };

    // For cross-origin cookies, we need to ensure proper settings for Vercel
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = req.headers.origin && req.headers.origin.includes('vercel.app');
    
    // Set cookie options for cross-origin requests
    const cookieSettings = {
      ...cookieOptions,
      // For Vercel, we need to set secure and sameSite
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      // Don't set domain for Vercel as it breaks cross-origin cookies
      domain: isProduction && !isVercel ? '.onrender.com' : undefined,
      // Ensure path is set
      path: '/',
      // Make cookies accessible to JavaScript for debugging
      httpOnly: false
    };

    console.log('Setting cookies with options:', {
      ...cookieSettings,
      environment: process.env.NODE_ENV,
      isVercel,
      origin: req.headers.origin
    });

    // Set the JWT cookie
    res.cookie("jwt", token, cookieSettings);
    
    // Also set a simpler cookie for better compatibility
    res.cookie('logged_in', 'true', {
      ...cookieSettings,
      httpOnly: false
    });
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    console.log('Cookies set successfully');

    // Return user data and token in response
    const userData = user.toObject();
    delete userData.password;
    
    return res.status(200).json({ 
      success: true, 
      user: userData, 
      token, // Include token in response for clients that need it
      message: 'Login successful'
    });
  } catch (error) {
    console.error("Error in signin controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signOutControler(req, res) {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    };

    // Set domain based on the request origin
    if (process.env.NODE_ENV === 'production' && req.headers.origin) {
      try {
        const originUrl = new URL(req.headers.origin);
        if (originUrl.hostname.endsWith('.vercel.app')) {
          cookieOptions.domain = originUrl.hostname;
        } else if (originUrl.hostname.endsWith('.onrender.com')) {
          cookieOptions.domain = '.onrender.com';
        }
      } catch (e) {
        console.error('Error parsing origin URL in signOut:', e);
      }
    }

    // Clear both JWT and logged_in cookies
    res.clearCookie('jwt', cookieOptions);
    res.clearCookie('logged_in', {
      ...cookieOptions,
      httpOnly: false
    });
    
    return res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Error in signOut controller:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}

export async function emailVerificationController(req, res) {
  const { fullName, email } = req.body;

  try {
    // Validation
    if (!fullName || !email) {
      return res
        .status(400)
        .json({ message: "Full name and email are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP and session
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const sessionId = crypto.randomUUID();

    // Log OTP for testing (remove in production)
    console.log("Generated OTP for", email, ":", otp);

    // Store signup session
    await SignupSession.create({
      sessionId,
      email,
      fullName,
      otp,
      step: 1,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // For development: Always log the OTP
    console.log("OTP for development:", otp);

    // Only send email in production or to your verified test email
    const TEST_EMAIL = "mbaocha240793@gmail.com";
    const isTestEmail = email === TEST_EMAIL;

    if (isTestEmail) {
      try {
        console.log("Attempting to send email to:", email);
        const fromEmail = "onboarding@resend.dev";
        await resend.emails.send({
          from: `Your App <${fromEmail}>`,
          to: email,
          subject: "Verify your email - Your App",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              <!-- Header with chess pattern -->
              <div style="height: 8px; background: repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px);"></div>
              
              <!-- Main content -->
              <div style="padding: 40px;">
                <!-- Logo/App Name -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="margin: 0; font-size: 24px; color: #1a1a1a; font-weight: 600;">NOE</h1>
                  <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Your move starts here</p>
                </div>
                
                <!-- Greeting -->
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 25px 0;">
                  Hi <span style="font-weight: 600;">${fullName}</span>,
                </p>
                
                <!-- OTP Code -->
                <p style="font-size: 15px; color: #555; margin: 0 0 15px 0;">Your verification code is:</p>
                <div style="
                  background: #f8f9fa;
                  border: 1px solid #e1e4e8;
                  border-radius: 8px;
                  padding: 20px;
                  text-align: center;
                  font-size: 32px;
                  font-weight: 600;
                  letter-spacing: 6px;
                  color: #1a1a1a;
                  margin: 20px 0 30px;
                  font-family: 'Courier New', monospace;
                ">
                  ${otp}
                </div>
                
                <!-- Instructions -->
                <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 30px 0; font-size: 14px; color: #555; line-height: 1.5;">
                  <p style="margin: 0 0 8px 0; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 20px; text-align: center; margin-right: 8px;">⏱️</span>
                    <span>Code expires in 15 minutes</span>
                  </p>
                  <p style="margin: 8px 0 0 0; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 20px; text-align: center; margin-right: 8px;">🔒</span>
                    <span>Don't share this code with anyone</span>
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #999;">
                    © ${new Date().getFullYear()} NOE. All rights reserved.
                  </p>
                </div>
              </div>
              
              <!-- Bottom border -->
              <div style="height: 8px; background: repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px);"></div>
            </div>
          `,
        });
        console.log("Test email sent successfully");
      } catch (emailError) {
        console.error("Error sending test email:", emailError);
      }
    } else {
      console.log(
        `Skipping email send to ${email} in development. OTP: ${otp}`
      );
    }

    return res.status(200).json({
      success: true,
      sessionId,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Error in email verification controller:", error);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }
}

export async function verifyOTPController(req, res) {
  const { sessionId, otp } = req.body;

  try {
    if (!sessionId || !otp) {
      return res
        .status(400)
        .json({ message: "Session ID and OTP are required" });
    }

    const session = await SignupSession.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.status(400).json({ message: "Invalid or expired session" });
    }

    if (session.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Update session - email verified, move to step 2
    session.step = 2;
    session.isEmailVerified = true;
    await session.save();

    return res.status(200).json({
      success: true,
      sessionId,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in verify OTP controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function passwordSetupController(req, res) {
  const { sessionId, password } = req.body;

  try {
    // Validation
    if (!sessionId || !password) {
      return res
        .status(400)
        .json({ message: "Session ID and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Find and validate signup session
    const session = await SignupSession.findOne({
      sessionId,
      isEmailVerified: true,
      step: 2,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.status(400).json({
        message: "Invalid session, email not verified, or session expired",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: session.email });

    if (!user) {
      // Create new user account if doesn't exist
      user = await User.create({
        fullName: session.fullName,
        email: session.email,
        password, // Will be hashed by your User model pre-save hook
        username: null, // Not set yet
        displayName: null, // Not set yet
        isOnboarder: false, // Profile setup still needed
      });
    } else {
      // Update existing user's password
      user.password = password;
      await user.save();
    }

    // Generate JWT token - user is now authenticated
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Clean up signup session
    await SignupSession.deleteOne({ _id: session._id });

    // Set HTTP-only cookie with JWT token
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Return user data (without sensitive information)
    const userResponse = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      handle: user.handle,
      isOnboarder: user.isOnboarder,
      hasSeenSuggestions: user.hasSeenSuggestions,
    };

    return res.status(200).json({
      success: true,
      message: "Password set successfully",
      user: userResponse,
      token, // Also send token in response for clients that need it (e.g., mobile)
    });
  } catch (error) {
    console.error("Error in password setup controller:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

// Controller to update user profile fields
export async function updateUserProfileController(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    // List of allowed fields that can be updated
    const allowedUpdates = [
      "username",
      "handle",
      "bio",
      "avatar",
      "hasSeenSuggestions",
      "status",
      "title",
      "xp",
      "maxXp",
      "level",
      "rating",
    ];

    // Check if username is being updated
    if (updateData.username) {
      // Get the current user to check last username change
      const user = await User.findById(userId).session(session);

      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if username is actually changing
      if (user.username !== updateData.username) {
        // Check if it's been at least 30 days since last username change
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (
          user.lastUsernameChange &&
          user.lastUsernameChange > thirtyDaysAgo
        ) {
          const nextChangeDate = new Date(user.lastUsernameChange);
          nextChangeDate.setDate(nextChangeDate.getDate() + 30);

          await session.abortTransaction();
          session.endSession();

          return res.status(400).json({
            success: false,
            message: "Username can only be changed once every 30 days",
            nextChangeDate: nextChangeDate.toISOString(),
          });
        }

        // Add lastUsernameChange to updates
        updateData.lastUsernameChange = new Date();
      }
    }

    // Filter out any fields that aren't in the allowed updates
    const updates = Object.keys(updateData).reduce((acc, key) => {
      if (allowedUpdates.includes(key) || key === "lastUsernameChange") {
        acc[key] = updateData[key];
      }
      return acc;
    }, {});

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
        allowedFields: allowedUpdates,
      });
    }

    // Update user with the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, session }
    ).select(
      "-password -emailVerificationToken -emailVerificationTokenExpires"
    );

    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
      nextUsernameChangeDate: updateData.username
        ? new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        : undefined,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // If we get here, something went wrong
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = error.keyPattern?.username
        ? "username"
        : Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({
        success: false,
        message: `A user with this ${field} already exists`,
        field: field,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    // End the session if it's still active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
  }
}

// Separate controller for profile setup (for authenticated users)
export async function profileSetupController(req, res) {
  const { username, handle } = req.body;

  try {
    // User is already authenticated via middleware
    const userId = req.user._id;

    // Validation
    if (!username || !handle) {
      return res
        .status(400)
        .json({ message: "Username and handle are required" });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters and contain only letters, numbers, and underscores",
      });
    }

    // Check if username is already taken (case-insensitive)
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
      _id: { $ne: userId }, // Exclude current user
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        handle,
        isOnboarder: true, // Profile setup complete
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare response
    const userResponse = {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      username: updatedUser.username,
      handle: updatedUser.handle,
      isOnboarder: updatedUser.isOnboarder,
      createdAt: updatedUser.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Profile setup completed",
      user: userResponse,
      redirectTo: "/",
    });
  } catch (error) {
    console.error("Error in profile setup controller:", error);

    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(400).json({ message: "Username already taken" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}
