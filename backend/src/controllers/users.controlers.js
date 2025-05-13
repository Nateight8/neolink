import FriendRequest from "../models/friend-request.js";
import User from "../models/User.js";

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

    // ✅ Create a notification
    await Notification.create({
      userId: recipient._id, // who receives the notification
      fromUserId: currentUser._id, // who triggered it
      type: "friend_request",
      postId: null, // optional, use null or omit if not related to a post
    });

    return res.status(201).json(newFriendRequest);
  } catch (error) {
    console.error("Error in friendRequest controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptRequest(req, res) {
  try {
    const { id } = req.params;
    const friendRequest = await FriendRequest.findById(id);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    //verify that the current user is the recipient of the request
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted"; // Update the status of the friend request
    await friendRequest.save();

    // Add each user to the other's friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({
      message: "Friend request accepted",
      friendRequest,
    });
  } catch (error) {
    console.error("Error in acceptRequest controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
