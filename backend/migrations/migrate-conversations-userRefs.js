import mongoose from "mongoose";
// import dotenv from "dotenv";
import User from "../src/models/User.js";
import { Conversation } from "../src/models/dm.models.js";

dotenv.config();

async function migrateUserRefs() {
  await mongoose.connect(MONGO_URI);

  const conversations = await Conversation.find({});

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
      continue;
    }

    conv.userRefs = users.map((u) => u._id);
    await conv.save();
    updated++;
  }

  await mongoose.disconnect();
}

migrateUserRefs().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
