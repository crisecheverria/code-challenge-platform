#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log("Created data directory");
}

// Check if challenges.json and concepts.json exist in the data directory
const challengesPath = path.join(dataDir, "challenges.json");
const conceptsPath = path.join(dataDir, "concepts.json");

if (!fs.existsSync(challengesPath)) {
  console.error("Error: challenges.json not found in the data directory");
  process.exit(1);
}

if (!fs.existsSync(conceptsPath)) {
  console.error("Error: concepts.json not found in the data directory");
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceUpdate = args.includes("--force") || args.includes("-f");
const forceFlag = forceUpdate ? "true" : "";

console.log(
  `🌱 Starting database seeding ${forceUpdate ? "(with force update)" : ""}...`
);

// Function to run a seed script
function runSeedScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Running ${scriptName}...`);

    const seedProcess = spawn(
      "npx",
      [
        "ts-node",
        path.join("packages", "backend", "src", "scripts", scriptName),
        forceFlag,
      ],
      {
        stdio: "inherit",
      }
    );

    seedProcess.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} completed successfully`);
        resolve();
      } else {
        console.error(`❌ ${scriptName} failed with code ${code}`);
        reject(new Error(`${scriptName} exited with code ${code}`));
      }
    });
  });
}

// Run seed scripts in sequence
async function runSeeds() {
  try {
    // First seed concepts
    await runSeedScript("seedConcepts.ts");

    // Then seed challenges
    await runSeedScript("seedChallenges.ts");

    console.log("\n🎉 All seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

runSeeds();
