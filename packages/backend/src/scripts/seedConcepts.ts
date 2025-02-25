import { ConceptModel } from "../models/Concept";
import { connectDB } from "../db";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Function to update challenges with concept tags
const updateChallengesWithConcepts = async () => {
  // Expanded map of challenge functionName to concept tags
  const conceptMappings: Record<string, string[]> = {
    // Basic challenges
    sum: ["variables", "operators"],
    multiply: ["variables", "operators"],
    isEven: ["conditionals", "operators"],
    reverse: ["strings", "arrays"],
    countVowels: ["strings", "loops"],
    findMax: ["arrays", "loops", "reduce"],
    filterEven: ["arrays", "functions", "loops", "filter"],
    isPalindrome: ["strings", "conditionals"],
    factorial: ["recursion", "functions"],
    fibonacci: ["recursion", "functions"],

    // Functional programming challenges
    doubleNumbers: ["functional-programming", "map", "arrays"],
    toUpperCase: ["functional-programming", "map", "strings"],
    filterEvenNumbers: ["functional-programming", "filter", "arrays"],
    filterLongWords: ["functional-programming", "filter", "strings"],
    sumArray: ["functional-programming", "reduce", "arrays"],
    averageOfEvenNumbers: [
      "functional-programming",
      "filter",
      "reduce",
      "arrays",
    ],
    wordLengthMap: ["functional-programming", "reduce", "objects"],
    groupByLength: ["functional-programming", "reduce", "objects", "arrays"],
    compose: ["functional-programming", "higher-order-functions"],
    curry: ["functional-programming", "higher-order-functions", "currying"],
    pipeline: ["functional-programming", "higher-order-functions"],
  };

  // Access collection directly for better flexibility
  const db = mongoose.connection.db;
  const challengeCollection = db.collection("challenges");

  // Get all challenges
  const challenges = await challengeCollection.find({}).toArray();
  let updatedCount = 0;
  let skippedCount = 0;

  // Update each challenge with conceptTags based on functionName
  for (const challenge of challenges) {
    if (conceptMappings[challenge.functionName]) {
      await challengeCollection.updateOne(
        { _id: challenge._id },
        { $set: { conceptTags: conceptMappings[challenge.functionName] } }
      );
      console.log(
        `✓ Updated challenge: ${
          challenge.title
        } with concepts: ${conceptMappings[challenge.functionName].join(", ")}`
      );
      updatedCount++;
    } else {
      console.log(
        `⤫ Skipped challenge: ${challenge.title} (no concept mapping found)`
      );
      skippedCount++;
    }
  }

  console.log(`
  Challenge concept mapping completed:
  - Updated: ${updatedCount}
  - Skipped: ${skippedCount}
  - Total: ${challenges.length}
  `);
};

const seedConcepts = async () => {
  try {
    await connectDB();

    // Check if "true" is passed as a command line argument (force update)
    const forceUpdate = process.argv.includes("true");

    // Read concepts from JSON file
    const conceptsPath = path.resolve(
      __dirname,
      "../../../../data/concepts.json"
    );
    const conceptsData = fs.readFileSync(conceptsPath, "utf8");
    const concepts = JSON.parse(conceptsData);

    if (forceUpdate) {
      // Clear existing concepts
      await ConceptModel.deleteMany({});
      console.log("✓ Cleared existing concepts");

      // Insert new concepts
      await ConceptModel.insertMany(concepts);
      console.log(`✓ Successfully seeded ${concepts.length} concepts!`);
    } else {
      // Update or insert concepts without clearing
      let created = 0;
      let updated = 0;

      for (const concept of concepts) {
        const exists = await ConceptModel.findOne({ slug: concept.slug });

        if (!exists) {
          await ConceptModel.create(concept);
          console.log(`✓ Created concept: ${concept.name}`);
          created++;
        } else {
          await ConceptModel.findOneAndUpdate({ slug: concept.slug }, concept);
          console.log(`↻ Updated concept: ${concept.name}`);
          updated++;
        }
      }

      console.log(`
      Concept seeding completed:
      - Created: ${created}
      - Updated: ${updated}
      - Total: ${concepts.length}
      `);
    }

    // Update challenges with concept tags
    await updateChallengesWithConcepts();

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding concepts:", error);
    process.exit(1);
  }
};

// Run the seed function
seedConcepts();
