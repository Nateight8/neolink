// controllers/onboarding.js

import FriendRequest from "../models/friend-request.js";
import User from "../models/User.js";

export async function onboardingStatus(req, res) {
  try {
    const currentUser = req.user;

    if (!currentUser || !currentUser._id) {
      return res.status(401).json({ message: "Unauthorized - Invalid user" });
    }

    const userId = currentUser._id;

    // Step 1: Check if the user has any friends
    const user = await User.findById(userId).populate('friends');

    // Step 2: Get pending requests count
    const pendingRequestsCount = await FriendRequest.countDocuments({
      sender: userId,
      status: "pending",
    });

    return res.status(200).json({
      user,
      pendingRequests: pendingRequestsCount,
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
