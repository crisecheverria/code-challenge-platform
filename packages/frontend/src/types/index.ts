export interface TestCase {
  input: any[];
  expected: any;
  description?: string;
}

export interface SubmissionResult {
  success: boolean;
  results: ExecutionResult[];
  metrics: {
    totalTime: number;
    totalMemory: number;
    passedTests: number;
    totalTests: number;
  };
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  language: "javascript" | "typescript";
  template: string;
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
  conceptTags: string[];
}

export interface ExecutionResult {
  passed: boolean;
  error?: string;
  output?: any;
  testCase: TestCase;
  executionTime: number;
  memoryUsed: number;
}

export interface ConceptProgress {
  completed: number;
  totalChallenges: number;
  lastCompleted?: string;
  earnedBadge: boolean;
  completedChallenges: string[];
}

export interface Badge {
  conceptTag: string;
  name: string;
  description: string;
  earnedAt: string; // ISO date string
  icon: string;
}

// Add other types you might need for the user profile
export interface UserProgress {
  conceptsProgress: Record<
    string,
    {
      completed: number;
      lastCompleted?: string;
    }
  >;
  languageProgress: {
    javascript?: {
      completed: number;
      lastCompleted?: string;
    };
    typescript?: {
      completed: number;
      lastCompleted?: string;
    };
  };
  streak?: {
    current: number;
    longest: number;
    lastActive?: string;
  };
  totalPoints: number;
}
