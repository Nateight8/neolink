import User from "../models/User.js";
import FriendRequest from "../models/friend-request.js";
import Post from "../models/post.js";
import mongoose from "mongoose";
import { getPosts } from "./post.service.js";

export class UserProfileService {
  /**
   * Get user profile by username
   * @param {string} username - Username to fetch profile for
   * @param {string} currentUserId - ID of the requesting user (for friend status)
   * @returns {Promise<Object>} User profile data
   */
  async getProfileByUsername(username, currentUserId) {
    // Get user data
    const user = await User.findOne({ username })
      .select(
        "-password -emailVerificationToken -emailVerificationTokenExpires -hasSeenSuggestions -isEmailVerified -email"
      )
      .populate("achievements")
      .populate({
        path: "friends",
        select: "_id username handle fullName participantId bio",
        limit: 10,
      })
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    // Get recent posts using the new service
    const posts = await getPosts({ authorId: user._id });

    // Add isLiked field to posts
    const postsWithLikeStatus = posts.map((post) => {
      const isLiked = post.likedBy?.some(
        (id) => id.toString() === currentUserId.toString()
      );
      return {
        ...post,
        likes: post.likedBy?.length || 0,
        comments: post.comments?.length || 0,
        isLiked,
      };
    });

    // Format the response according to the expected structure
    return {
      user: {
        _id: user._id,
        username: user.username,
        handle: user.handle,
        fullName: user.fullName,
        participantId: user.participantId,
        bio: user.bio,
      },
      stats: user.stats,
      achievements: (user.achievements || []).map((achievement) => ({
        name: achievement.name,
        icon: achievement.icon,
        color: achievement.color,
      })),
      allies: (user.friends || []).map((friend) => ({
        _id: friend._id,
        username: friend.username,
        handle: friend.handle,
        fullName: friend.fullName,
        participantId: friend.participantId,
        bio: friend.bio,
      })),
      posts: postsWithLikeStatus,
    };
  }

  /**
   * Get user stats
   * @param {string} userId - User ID to get stats for
   * @returns {Promise<Object>} User stats
   */
  async getUserStats(userId) {
    const [friendsCount, pendingRequestsCount] = await Promise.all([
      User.findById(userId)
        .select("friends")
        .then((user) => user.friends.length),
      FriendRequest.countDocuments({
        recipient: userId,
        status: "pending",
      }),
    ]);

    return {
      friends: friendsCount,
      pendingRequests: pendingRequestsCount,
    };
  }

  /**
   * Get friendship status between two users
   * @param {string} targetUserId - Target user ID
   * @param {string} currentUserId - Current user ID
   * @returns {Promise<string>} Friendship status
   */
  async getFriendshipStatus(targetUserId, currentUserId) {
    if (targetUserId.toString() === currentUserId.toString()) {
      return "self";
    }

    const [areFriends, pendingRequest] = await Promise.all([
      User.findOne({
        _id: currentUserId,
        friends: targetUserId,
      })
        .select("_id")
        .lean(),
      FriendRequest.findOne({
        $or: [
          { sender: currentUserId, recipient: targetUserId },
          { sender: targetUserId, recipient: currentUserId },
        ],
        status: "pending",
      })
        .select("sender")
        .lean(),
    ]);

    if (areFriends) {
      return "friends";
    }

    if (pendingRequest) {
      return pendingRequest.sender.toString() === currentUserId.toString()
        ? "request_sent"
        : "request_received";
    }

    return "not_friends";
  }

  /**
   * Update user profile
   * @param {string} userId - User ID to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, updateData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // List of allowed fields that can be updated
      const allowedUpdates = ["username", "handle", "bio", "fullName"];

      // Filter out any fields that aren't in the allowed updates
      const updates = Object.keys(updateData).reduce((acc, key) => {
        if (allowedUpdates.includes(key)) {
          acc[key] = updateData[key];
        }
        return acc;
      }, {});

      // If no valid updates provided
      if (Object.keys(updates).length === 0) {
        throw new Error("No valid fields provided for update");
      }

      // Update user with the provided fields
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true, session }
      )
        .select(
          "-password -emailVerificationToken -emailVerificationTokenExpires"
        )
        .populate("achievements")
        .populate({
          path: "friends",
          select: "_id username handle fullName participantId bio",
          limit: 10,
        });

      if (!updatedUser) {
        throw new Error("User not found");
      }

      // Get recent posts for the response using the new service
      const posts = await getPosts({ authorId: userId });

      // Add isLiked field to posts
      const postsWithLikeStatus = posts.map((post) => {
        const isLiked = post.likedBy?.some(
          (id) => id.toString() === userId.toString()
        );
        return {
          ...post,
          likes: post.likedBy?.length || 0,
          comments: post.comments?.length || 0,
          isLiked,
        };
      });

      await session.commitTransaction();
      session.endSession();

      return {
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          handle: updatedUser.handle,
          fullName: updatedUser.fullName,
          participantId: updatedUser.participantId,
          bio: updatedUser.bio,
        },
        stats: updatedUser.stats,
        achievements: (updatedUser.achievements || []).map((achievement) => ({
          name: achievement.name,
          icon: achievement.icon,
          color: achievement.color,
        })),
        allies: (updatedUser.friends || []).map((friend) => ({
          _id: friend._id,
          username: friend.username,
          handle: friend.handle,
          fullName: friend.fullName,
          participantId: friend.participantId,
          bio: friend.bio,
        })),
        posts: postsWithLikeStatus,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
