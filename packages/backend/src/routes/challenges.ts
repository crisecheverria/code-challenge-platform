// backend/src/routes/challenges.ts
import { Router } from "express";
import { z } from "zod";
import { ChallengeModel } from "../models";

const router = Router();

// Validation schema for creating a challenge
const CreateChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  language: z.enum(["javascript", "typescript"]),
  functionName: z.string().min(1),
  parameterTypes: z.array(z.string()),
  returnType: z.string(),
  template: z.string(),
  testCases: z.array(
    z.object({
      input: z.array(z.any()),
      expected: z.any(),
      description: z.string().optional(),
    }),
  ),
  timeLimit: z.number().positive(),
  memoryLimit: z.number().positive(),
});

// Get all challenges
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all challenges...");
    const challenges = await ChallengeModel.find({});
    console.log(`Found ${challenges.length} challenges`);
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

// Get single challenge by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching challenge with ID:", req.params.id); // Debug log
    const challenge = await ChallengeModel.findById(req.params.id);

    if (!challenge) {
      console.log("Challenge not found"); // Debug log
      return res.status(404).json({ error: "Challenge not found" });
    }

    console.log("Found challenge:", challenge); // Debug log
    res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

// Create new challenge
router.post("/", async (req, res) => {
  try {
    console.log(
      "Received challenge creation request with body:",
      JSON.stringify(req.body, null, 2),
    );

    // Validate request body
    const challengeData = CreateChallengeSchema.parse(req.body);
    console.log("Validation passed, creating challenge...");

    // Create new challenge document
    const challenge = new ChallengeModel(challengeData);
    console.log("Challenge model created:", challenge);

    // Save to database
    const savedChallenge = await challenge.save();
    console.log("Challenge saved successfully:", savedChallenge._id);

    res.status(201).json({
      message: "Challenge created",
      challengeId: savedChallenge._id,
      challenge: savedChallenge,
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    } else {
      res.status(500).json({
        error: "Failed to create challenge",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
});

export default router;
