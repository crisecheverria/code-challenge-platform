import mongoose, { Document, Schema } from "mongoose";

export interface Submission extends Document {
  challengeId: mongoose.Types.ObjectId;
  code: string;
  language: "javascript" | "typescript";
  results: {
    passed: boolean;
    error?: string;
    output?: any;
    testCase: {
      input: any[];
      expected: any;
      description?: string;
    };
    executionTime: number;
    memoryUsed: number;
  }[];
  metrics: {
    totalTime: number;
    totalMemory: number;
    passedTests: number;
    totalTests: number;
  };
  createdAt: Date;
}

const SubmissionSchema = new Schema({
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  code: { type: String, required: true },
  language: {
    type: String,
    enum: ["javascript", "typescript"],
    required: true,
  },
  results: [
    {
      passed: Boolean,
      error: String,
      output: Schema.Types.Mixed,
      testCase: {
        input: [Schema.Types.Mixed],
        expected: Schema.Types.Mixed,
        description: String,
      },
      executionTime: Number,
      memoryUsed: Number,
    },
  ],
  metrics: {
    totalTime: Number,
    totalMemory: Number,
    passedTests: Number,
    totalTests: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export const SubmissionModel = mongoose.model<Submission>(
  "Submission",
  SubmissionSchema,
);
