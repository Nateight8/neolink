import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../src/models/User.js";
import { Conversation } from "../src/models/dm.models.js";

// Explicitly load .env file from the root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function migrateUserRefs() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in your environment variables.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for migration.");

  const conversations = await Conversation.find({});
  console.log(`Found ${conversations.length} conversations to check.`);

  let updated = 0;
  for (const conv of conversations) {
    // Skip if already migrated
    if (conv.userRefs && conv.userRefs.length === conv.participants.length)
      continue;

    // Find userIds for all participantIds
    const users = await User.find({
      participantId: { $in: conv.participants },
    });
    if (users.length !== conv.participants.length) {
      console.warn(
        `Could not find all users for conversation ${conv._id}. Skipping.`
      );
      continue;
    }

    conv.userRefs = users.map((u) => u._id);
    await conv.save();
    updated++;
    console.log(`Updated conversation ${conv._id}`);
  }

  console.log(`Migration complete. Updated ${updated} conversations.`);
  await mongoose.disconnect();
}

migrateUserRefs().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

// etching hooks on the frontend.  I'm exploring the nuances of incorporating Socket.IO events within the existing React Query flow for real-time updates. Considering the codebase structure, integration seems straightforward, assuming no major conflicts arise.
// Pinpointing Implementation Nuances
// I'm continuing to analyze the backend, particularly backend/src/index.js, where I'll initialize Socket.IO. I plan to seamlessly integrate it with the existing Express server by wrapping app.listen with http.createServer(app).  I'll ensure proper CORS configuration and then move on to the sendMessage controller, which appears to be the most critical location for emission.
// Outlining Integration Logic
// I've completed my initial analysis of the backend setup, specifically in backend/src/index.js, where Socket.IO will be initialized and I've started the preliminary implementation plan. The process begins with importing and creating the server, followed by the crucial integration of CORS. Afterwards I'll move onto the sendMessage controller. On the frontend, real-time updates will be handled by incorporating socket events with the React Query cache. This structure should keep the architecture relatively clean.
// Evaluating Next Steps
// My current focus is crafting the precise steps for seamless integration. I've broken down the steps needed for backend and frontend setup, including crucial aspects like the message broadcasting mechanism within the backend's controllers, room joining and connection handling, and the establishment of a single Socket.IO client instance for the entire application. The aim is to ensure smooth real-time updates and minimal architectural disruption.
// Finalizing Integration Strategy
// I've outlined all the necessary steps for backend and frontend integration. The backend will involve installing Socket.IO, initializing the server, configuring CORS, setting up connection handling with room joining, modifying the sendMessage controller to emit events, and making sure the io instance is accessible. For the frontend, I'll need to install the client library, create a Socket.IO client instance, set up useEffect to manage the connection and listeners, and finally, integrate the incoming message into the React Query cache using setQueryData
