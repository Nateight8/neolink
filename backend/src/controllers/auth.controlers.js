import jwt from "jsonwebtoken";
import User from "./../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export async function signupControler(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
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

    // Create and save user
    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    // Upsert user in Stream - make sure to pass the user ID as a string
    await upsertStreamUser({
      id: newUser._id.toString(), // This is the key part - ensure ID is properly stringified
      name: newUser.fullName,
      image: "https://example.com/default-avatar.png", // Replace with real default avatar if needed
    });

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

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

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error("Error in signin controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signOutControler(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in signOut controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function onboardingControler(req, res) {
  //<==change to username controller
  try {
    const userId = req.user._id;
    const { fullName, avatar, bio, username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, bio, isOnboarder: true }, //<==remove isOnboarder
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Upsert user in Stream
    await upsertStreamUser({
      id: updatedUser._id.toString(), // This is the key part - ensure ID is properly stringified
      name: updatedUser.fullName,
      image: "", // Replace with real default avatar if needed
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in onboarding controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
