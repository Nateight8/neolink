import FriendRequest from "../models/friend-request.js";
import User from "../models/User.js";
import Notification from "../models/notifications.js";

export async function recommendedUsers(req, res) {
  try {
    const currentUser = req.user;

    // Ensure we have a valid user
    if (!currentUser || !currentUser._id) {
      console.error("Current user is missing or invalid:", currentUser);
      return res.status(401).json({ message: "Unauthorized - Invalid user" });
    }

    // Convert ObjectId to string for safer comparison
    const userId = currentUser._id.toString();
    console.log("Current user ID:", userId);

    // Ensure friends is an array
    const friendIds = Array.isArray(currentUser.friends)
      ? currentUser.friends.map((id) => id.toString())
      : [];
    console.log("Friends count:", friendIds.length);

    // Get all users first (for debugging)
    const allUsers = await User.find({});
    console.log("Total users in database:", allUsers.length);

    // Get pending requests that the current user has sent
    const pendingRequests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    });

    // Get IDs of users that the current user has sent requests to
    const pendingUserIds = pendingRequests.map((request) =>
      request.recipient.toString()
    );
    console.log("DEBUG - Current user:", { id: userId, friends: friendIds });
    console.log("DEBUG - Pending requests sent by user:", pendingRequests);
    console.log("DEBUG - Users with pending requests:", pendingUserIds);

    // Get incoming friend requests
    const incomingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullName handle");
    console.log(
      "DEBUG - Incoming friend requests:",
      incomingRequests.map((r) => ({
        from: r.sender.fullName,
        senderId: r.sender._id,
      }))
    );

    // Query with explicit string conversion and proper handling
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { isOnboarder: true },
        { _id: { $nin: friendIds } },
        { _id: { $nin: pendingUserIds } },
      ],
    }).lean();

    console.log(
      "DEBUG - Recommended users:",
      recommendedUsers.map((u) => ({
        id: u._id,
        name: u.fullName,
        handle: u.handle,
      }))
    );

    return res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in recommendedUsers controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function friends(req, res) {
  try {
    const currentUser = req.user; // Assuming `req.user` contains the authenticated user data
    const userId = currentUser._id; // Get the user's ID

    // Find the current user and populate the friends list
    const user = await User.findById(userId)
      .select("friends") // Only select the `friends` field
      .populate("friends", "fullName profilePicture username"); // Populate the `friends` field with fullName, profilePicture, and username

    return res.status(200).json(user.friends); // Return the populated friends
  } catch (error) {
    console.error("Error in friends controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
// controllers/friendController.js - friendRequest function

export async function friendRequest(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Prevent sending a request to self
    if (currentUser._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    // Check recipient exists
    const recipient = await User.findById(id);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Already friends?
    if (recipient.friends.includes(currentUser._id)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // Request already sent?
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: currentUser._id, recipient: id },
        { sender: id, recipient: currentUser._id },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create friend request
    const newFriendRequest = new FriendRequest({
      sender: currentUser._id,
      recipient: id,
    });

    await newFriendRequest.save();

    // Create notification with the friend request ID
    console.log("Creating notification for friend request:", {
      recipientId: recipient._id,
      senderId: currentUser._id,
      requestId: newFriendRequest._id, // Include the request ID
    });

    await Notification.create({
      userId: recipient._id, // who receives the notification
      fromUserId: currentUser._id, // who triggered it
      type: "follow",
      postId: null,
      requestId: newFriendRequest._id, // Save the request ID in the notification
    });

    return res.status(201).json(newFriendRequest);
  } catch (error) {
    console.error("Error in friendRequest controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// _id
// 6821a9910f63e07e391f4116
// fullName
// "Lani Cruz"
// email
// ""
// password
// "$2b$10$0isF36FTZUFtGJzhr6p8tOw1ZNSIfQZz/.a/vhShdXZm7NNvocU5q"
// handle
// "boots4lani!"
// bio
// "Mountains > men. Period. 🏔️💅 Hiking boots on, red flags off 🚩🚫"
// isOnboarder
// true

// friends
// Array (empty)
// createdAt
// 2025-05-12T07:56:01.721+00:00
// updatedAt
// 2025-05-12T07:56:21.978+00:00
// username
// "BOOTS4LANI!"

// PATCH /api/friends/respond/:id
export async function respondToFriendRequest(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; // "accept" or "reject"

    const friendRequest = await FriendRequest.findById(id);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to respond to this request" });
    }

    if (action === "accept") {
      friendRequest.status = "accepted";
      await friendRequest.save();

      await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient },
      });

      await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender },
      });

      return res.status(200).json({ message: "Friend request accepted" });
    } else if (action === "reject") {
      await friendRequest.deleteOne(); // or keep it with status "rejected" if you want history
      return res.status(200).json({ message: "Friend request rejected" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error in respondToFriendRequest controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
