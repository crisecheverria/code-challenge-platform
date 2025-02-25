// backend/src/models/Challenge.ts
import mongoose, { Document, Schema } from "mongoose";

// Define interfaces for the document structure
interface TestCase {
  input: any[];
  expected: any;
  description?: string;
  testFunction?: string; // Optional custom test function for complex cases
}

interface IChallenge {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  language: "javascript" | "typescript";
  functionName: string;
  parameterTypes: string[];
  returnType: string;
  template: string;
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
  conceptTags: string[]; // Now accepts any string
  points: number; // points awarded for completion
  hints: string[]; // optional hints for learners
  explanations: string; // explanation of the concept being taught
  resources: { title: string; url: string }[]; // additional learning resources
  prerequisites: mongoose.Types.ObjectId[]; // challenges recommended before this one
  createdAt?: Date;
  updatedAt?: Date;
}

// Create interface for the document with Mongoose methods
export interface ChallengeDocument extends IChallenge, Document {}

const TestCaseSchema = new Schema({
  input: [Schema.Types.Mixed],
  expected: Schema.Types.Mixed,
  description: String,
  testFunction: String, // Custom test function for complex cases
});

const ResourceSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const ChallengeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    language: {
      type: String,
      enum: ["javascript", "typescript"],
      required: true,
    },
    functionName: { type: String, required: true },
    parameterTypes: [{ type: String, required: true }],
    returnType: { type: String, required: true },
    template: { type: String, required: true },
    testCases: [TestCaseSchema],
    timeLimit: { type: Number, required: true },
    memoryLimit: { type: Number, required: true },
    // Modified: removed enum restriction to allow any string
    conceptTags: [{ type: String }],
    points: { type: Number, default: 10 },
    hints: [String],
    explanations: String,
    resources: [ResourceSchema],
    prerequisites: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Add indexes for efficient querying
ChallengeSchema.index({ difficulty: 1, language: 1 });
ChallengeSchema.index({ conceptTags: 1 });
ChallengeSchema.index({ points: -1 });

// Create and export the model
export const ChallengeModel = mongoose.model<ChallengeDocument>(
  "Challenge",
  ChallengeSchema,
);

// Export the interface for use in other files
export type { IChallenge, TestCase };
