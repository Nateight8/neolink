// controllers/onboarding.js

import FriendRequest from "../models/friend-request.js";
import User from "../models/User.js";
import { escapeRegExp } from "../lib/escapeRegExp.js";

export async function onboardingStatus(req, res) {
  try {
    const currentUser = req.user;

    if (!currentUser || !currentUser._id) {
      return res.status(401).json({ message: "Unauthorized - Invalid user" });
    }

    const userId = currentUser._id;

    // Step 1: Check if the user has any friends
    const user = await User.findById(userId).populate("friends");

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

export async function searchUsers(req, res) {
  const { q } = req.query;

  if (!q || typeof q !== "string" || q.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Search query must be at least 3 characters" });
  }

  const sanitizedQuery = escapeRegExp(q.trim());

  try {
    const regex = new RegExp(
      `(^${sanitizedQuery}$)|(^${sanitizedQuery})|(${sanitizedQuery}$)|(${sanitizedQuery})`,
      "i"
    );

    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: regex },
          username: { $ne: null },
        },
      },
      {
        $addFields: {
          score: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$username",
                      regex: new RegExp(`^${sanitizedQuery}$`, "i"),
                    },
                  },
                  then: 4,
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$username",
                      regex: new RegExp(`^${sanitizedQuery}`, "i"),
                    },
                  },
                  then: 3,
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$username",
                      regex: new RegExp(`${sanitizedQuery}$`, "i"),
                    },
                  },
                  then: 2,
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$username",
                      regex: new RegExp(`${sanitizedQuery}`, "i"),
                    },
                  },
                  then: 1,
                },
              ],
              default: 0,
            },
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
      {
        $project: {
          username: 1,
          fullName: 1,
          handle: 1,
          bio: 1,
          _id: 1,
        },
      },
    ]);

    return res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Server error during user search" });
  }
}
