import { connectDB } from "../db";
import mongoose from "mongoose";

const resetUserProgress = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Access the users collection directly
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Count users before updating
    const totalUsers = await usersCollection.countDocuments();
    console.log(`Found ${totalUsers} users in the database`);

    // Option 1: Complete removal (like the cleanUserData script)
    if (process.argv.includes("--remove")) {
      const result = await usersCollection.updateMany(
        {}, // match all documents
        {
          $unset: {
            badges: "",
            submissions: "",
            progress: "",
            completedChallenges: "",
          },
        },
      );
      console.log(
        `✓ Removed progress data from ${result.modifiedCount} user records`,
      );
    }
    // Option 2: Initialize empty structures instead of removing fields
    else {
      const result = await usersCollection.updateMany(
        {}, // match all documents
        {
          $set: {
            badges: [],
            completedChallenges: [],
            submissions: [],
            progress: {
              conceptsProgress: {},
              languageProgress: {},
              streak: {
                current: 0,
                longest: 0,
                lastActive: new Date(),
              },
              totalPoints: 0,
            },
          },
        },
      );
      console.log(
        `✓ Reset progress data for ${result.modifiedCount} user records`,
      );
    }

    // Optional: Print a sample user to verify changes
    const sampleUser = await usersCollection.findOne({});
    console.log("Sample user after reset:");
    console.log(JSON.stringify(sampleUser, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting user progress:", error);
    process.exit(1);
  }
};

// Run the script
resetUserProgress();
