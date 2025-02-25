import { Router, Request } from "express";
import { z } from "zod";
import { CodeExecutor } from "../services/executor";
import { ChallengeModel } from "../models/Challenge";
import { UserModel } from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const executor = new CodeExecutor();

// Validation schema for submissions
const SubmissionSchema = z.object({
  challengeId: z.string(),
  code: z.string(),
  language: z.enum(["javascript", "typescript"]),
});

router.post("/", authMiddleware, async (req: Request, res) => {
  try {
    // Cast req to AuthRequest to access user property
    const authReq = req as AuthRequest;
    const user = authReq.user;

    const submission = SubmissionSchema.parse(req.body);

    // Fetch the challenge
    const challenge = await ChallengeModel.findById(submission.challengeId);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    // Execute code and get results
    const metadata = {
      functionName: challenge.functionName,
      parameterTypes: challenge.parameterTypes,
      returnType: challenge.returnType,
    };

    const results = await executor.executeTypeScript(
      submission.code,
      challenge.testCases,
      metadata,
    );

    // Update user's submissions
    const submissionRecord = {
      challengeId: challenge._id,
      timestamp: new Date(),
      status: results.success ? "passed" : "failed",
      language: submission.language,
      code: submission.code,
      results: results.results,
    };

    // Update user document
    await UserModel.findByIdAndUpdate(
      user._id,
      {
        $push: { submissions: submissionRecord },
        // If passed, add to completed challenges if not already there
        ...(results.success && {
          $addToSet: { completedChallenges: challenge._id },
        }),
      },
      { new: true },
    );

    console.log("Submission recorded for user:", user._id);

    // If submission is successful, update concept progress
    if (results.success) {
      const challenge = await ChallengeModel.findById(submission.challengeId);

      if (challenge && challenge.conceptTags?.length) {
        // Get current date
        const completionDate = new Date();

        // Prepare updates - use proper MongoDB update operators with type-safe paths
        const incrementUpdates: Record<string, number> = {}; // For numeric fields
        const setUpdates: Record<string, any> = {}; // For non-numeric fields like dates

        // Update user progress for each concept
        for (const conceptTag of challenge.conceptTags) {
          // Use proper MongoDB dot notation for paths
          incrementUpdates[
            `progress.conceptsProgress.${conceptTag}.completed`
          ] = 1;
          setUpdates[`progress.conceptsProgress.${conceptTag}.lastCompleted`] =
            completionDate;
        }

        // Update language progress
        incrementUpdates[
          `progress.languageProgress.${challenge.language}.completed`
        ] = 1;
        setUpdates[
          `progress.languageProgress.${challenge.language}.lastCompleted`
        ] = completionDate;

        // Update points
        incrementUpdates["progress.totalPoints"] = challenge.points || 10;

        // Fetch full user document to access progress data
        const user = await UserModel.findById(authReq.user._id).lean();
        if (!user) {
          throw new Error("User not found");
        }

        // Calculate streak
        const lastActive = user.progress?.streak?.lastActive;
        const now = new Date();
        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        // Update streak fields
        if (lastActive && lastActive > oneDayAgo) {
          // Continue streak - increment current streak
          incrementUpdates["progress.streak.current"] = 1;
          setUpdates["progress.streak.lastActive"] = now;

          // Update longest streak if needed
          const currentStreak = (user.progress?.streak?.current || 0) + 1;
          const longestStreak = user.progress?.streak?.longest || 0;
          if (currentStreak > longestStreak) {
            incrementUpdates["progress.streak.longest"] = 1;
          }
        } else {
          // Reset streak
          setUpdates["progress.streak.current"] = 1;
          setUpdates["progress.streak.lastActive"] = now;
        }

        // Perform updates using both $inc and $set
        const updateOperation = {
          $inc: incrementUpdates,
          $set: setUpdates,
          $addToSet: { completedChallenges: challenge._id },
        };

        // Update user document
        await UserModel.findByIdAndUpdate(authReq.user._id, updateOperation);
      }
    }

    res.json(results);
  } catch (error) {
    console.error("Submission error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({
        error: "Submission failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
});

export default router;
