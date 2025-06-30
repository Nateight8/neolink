import { UserProfileService } from "../services/user-profile.service.js";

const userProfileService = new UserProfileService();

/**
 * Get user profile by username
 */
export async function getUserProfile(req, res) {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    const profile = await userProfileService.getProfileByUsername(
      username,
      currentUserId
    );

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(req, res) {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const updatedProfile = await userProfileService.updateProfile(
      userId,
      updateData
    );

    return res.status(200).json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

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
        field,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
