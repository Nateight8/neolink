import mongoose from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Find all users without a participantId
    const users = await User.find({ 
      $or: [
        { participantId: { $exists: false } },
        { participantId: null }
      ] 
    });

    console.log(`Found ${users.length} users to update`);

    // Update each user with a new participantId
    for (const user of users) {
      user.participantId = Snowflake.generate();
      await user.save();
      console.log(`Updated user ${user._id} with participantId: ${user.participantId}`);
    }

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the migration
migrate();
