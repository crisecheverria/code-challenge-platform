import { connectDB } from "../db";
import { ChallengeModel } from "../models/Challenge";
import fs from "fs";
import path from "path";

const seedChallenges = async () => {
  try {
    await connectDB();

    // Check if "true" is passed as a command line argument
    const forceUpdate = process.argv.includes("true");

    // If forceUpdate is true, clear all existing challenges
    if (forceUpdate) {
      await ChallengeModel.deleteMany({});
      console.log("Cleared existing challenges");
    }

    // Read challenges from JSON file
    const challengesPath = path.resolve(
      __dirname,
      "../../../../data/challenges.json"
    );
    const challengesData = fs.readFileSync(challengesPath, "utf8");
    const challenges = JSON.parse(challengesData);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Check for existing challenges to avoid duplicates
    for (const challenge of challenges) {
      const exists = await ChallengeModel.findOne({ title: challenge.title });

      if (!exists) {
        // Create new challenge
        await ChallengeModel.create(challenge);
        console.log(`✓ Created: ${challenge.title}`);
        created++;
      } else if (forceUpdate) {
        // Update if forceUpdate is true
        await ChallengeModel.findOneAndUpdate(
          { title: challenge.title },
          challenge
        );
        console.log(`↻ Updated: ${challenge.title}`);
        updated++;
      } else {
        console.log(`⤫ Skipped: ${challenge.title} (already exists)`);
        skipped++;
      }
    }

    console.log(`
      Challenge seeding completed:
      - Created: ${created}
      - Updated: ${updated}
      - Skipped: ${skipped}
      - Total processed: ${challenges.length}
    `);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding challenges:", error);
    process.exit(1);
  }
};

seedChallenges();
