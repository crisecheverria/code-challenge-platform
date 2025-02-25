import Docker from "dockerode";
import { TestCase, ExecutionResult, SubmissionResult } from "../types";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";

interface ChallengeMetadata {
  functionName: string; // e.g., "sum", "reverseString"
  parameterTypes: string[]; // e.g., ["number", "number"] or ["string"]
  returnType: string; // e.g., "number" or "string"
}

export class CodeExecutor {
  private docker: Docker;
  private readonly tempDir: string;
  private readonly TIMEOUT_MS = 5000; // 5 seconds timeout

  constructor() {
    this.docker = new Docker();
    this.tempDir = path.join(__dirname, "../temp");
  }

  private async saveCode(
    code: string,
    containerId: string,
    testCases: TestCase[],
    metadata: ChallengeMetadata,
  ): Promise<string> {
    await fs.mkdir(this.tempDir, { recursive: true });
    const filePath = path.join(this.tempDir, `${containerId}.ts`);

    // Create a self-contained TypeScript test file with proper types
    const wrappedCode = `/// <reference types="node" />

// Type definitions
interface TestCase {
  input: any[];
  expected: any;
  description?: string;
}

// User's solution
${code}

// Clean test cases by removing MongoDB-specific fields
const testCases = ${JSON.stringify(
      testCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected,
        description: tc.description,
      })),
      null,
      2,
    )};

// Run tests
function runTests() {
  testCases.forEach((testCase, index) => {
    try {
      // Determine how to call the function based on input
      let result;
      if (testCase.input.length === 1 && Array.isArray(testCase.input[0])) {
        // If input is a single array (like for sort)
        result = ${metadata.functionName}(testCase.input[0]);
      } else {
        // Default to spreading arguments
        result = ${metadata.functionName}(...testCase.input);
      }
      
      // Compare result
      let passed = false;
      if (Array.isArray(result) && Array.isArray(testCase.expected)) {
        passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
      } else if (typeof result === 'object' && result !== null) {
        passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
      } else {
        passed = result === testCase.expected;
      }

      console.log(JSON.stringify({
        index,
        passed,
        output: result,
        error: null
      }));
    } catch (error: any) {
      console.log(JSON.stringify({
        index,
        passed: false,
        output: null,
        error: error.message
      }));
    }
  });
}

// Execute tests
runTests();`;

    await fs.writeFile(filePath, wrappedCode);
    return filePath;
  }

  async executeTypeScript(
    code: string,
    testCases: TestCase[],
    metadata: ChallengeMetadata,
  ): Promise<SubmissionResult> {
    const containerId = uuidv4();
    const codePath = await this.saveCode(
      code,
      containerId,
      testCases,
      metadata,
    );

    let container: Docker.Container | null = null;

    try {
      console.log("Creating container...");
      container = await this.docker.createContainer({
        Image: "code-runner",
        name: `ts-execution-${containerId}`,
        Cmd: ["ts-node", "--transpile-only", "/code/solution.ts"],
        HostConfig: {
          AutoRemove: true,
          Memory: 128 * 1024 * 1024,
          MemorySwap: -1,
          CpuQuota: 100000,
          NetworkMode: "none",
          Binds: [`${codePath}:/code/solution.ts:ro`],
        },
        WorkingDir: "/code",
      });

      console.log("Starting container...");
      const startTime = process.hrtime();
      await container.start();

      // Create a promise that resolves with the logs
      const logsPromise = this.getContainerLogs(container);

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Execution timeout - took longer than 5 seconds"));
        }, this.TIMEOUT_MS);
      });

      // Race between logs and timeout
      console.log("Getting container logs (with timeout)...");
      const logs = await Promise.race([logsPromise, timeoutPromise]);
      const executionTime = process.hrtime(startTime);

      return this.processResults(logs, testCases, executionTime);
    } catch (error) {
      console.error("Execution error:", error);

      // Return timeout error result
      return {
        success: false,
        results: testCases.map((testCase) => ({
          passed: false,
          error: error instanceof Error ? error.message : "Execution failed",
          testCase,
          executionTime: this.TIMEOUT_MS,
          memoryUsed: 0,
        })),
        metrics: {
          totalTime: this.TIMEOUT_MS,
          totalMemory: 0,
          passedTests: 0,
          totalTests: testCases.length,
        },
      };
    } finally {
      // Make sure to force stop and remove the container in case of timeout
      if (container) {
        try {
          await container.stop();
          await container.remove();
        } catch (error) {
          console.error("Error cleaning up container:", error);
        }
      }
      await this.cleanup(containerId);
    }
  }

  private async getContainerLogs(container: Docker.Container): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true,
          timestamps: false,
        },
        (err, stream) => {
          if (err) {
            reject(err);
            return;
          }
          const chunks: Buffer[] = [];
          (stream as Readable).on("data", (chunk) => chunks.push(chunk));
          (stream as Readable).on("end", () => resolve(Buffer.concat(chunks)));
          (stream as Readable).on("error", reject);
        },
      );
    });
  }

  private async cleanup(containerId: string): Promise<void> {
    try {
      const filePath = path.join(this.tempDir, `${containerId}.ts`);
      await fs.unlink(filePath).catch(() => {});

      try {
        const container = await this.docker.getContainer(
          `ts-execution-${containerId}`,
        );
        await container.stop().catch(() => {});
        await container.remove().catch(() => {});
      } catch (error) {
        console.log("Container cleanup: container might already be removed");
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }

  private processResults(
    logs: Buffer,
    testCases: TestCase[],
    executionTime: [number, number],
  ): SubmissionResult {
    const outputStr = logs.toString("utf8");
    console.log("Raw logs:", outputStr); // Debug log

    const results: ExecutionResult[] = [];

    // Clean and parse the log output
    const outputLines = outputStr
      .split("\n")
      .map((line) => {
        // Remove any non-JSON prefix (including stream identifiers)
        const jsonStart = line.indexOf("{");
        return jsonStart >= 0 ? line.slice(jsonStart) : "";
      })
      .filter((line) => line.length > 0);

    console.log("Cleaned lines:", outputLines); // Debug log

    for (const line of outputLines) {
      try {
        console.log("Parsing line:", line); // Additional debug log
        const result = JSON.parse(line);
        console.log("Parsed result:", result); // Additional debug log

        const testCase = testCases[result.index];

        if (testCase) {
          results.push({
            passed: result.passed,
            error: result.error,
            output: result.output,
            testCase,
            executionTime: executionTime[0] * 1000 + executionTime[1] / 1000000,
            memoryUsed: 0,
          });
        }
      } catch (error) {
        console.error("Failed to parse result line:", line);
        console.error("Parse error:", error);
      }
    }

    console.log("Processed results:", results); // Additional debug log

    // If no results were parsed, create failed results for all test cases
    if (results.length === 0) {
      results.push(
        ...testCases.map((testCase) => ({
          passed: false,
          error: "Failed to parse test results",
          testCase,
          executionTime: executionTime[0] * 1000 + executionTime[1] / 1000000,
          memoryUsed: 0,
        })),
      );
    }

    const finalResult = {
      success: results.every((r) => r.passed),
      results,
      metrics: {
        totalTime: executionTime[0] * 1000 + executionTime[1] / 1000000,
        totalMemory: 0,
        passedTests: results.filter((r) => r.passed).length,
        totalTests: testCases.length,
      },
    };

    console.log("Final result:", finalResult); // Additional debug log
    return finalResult;
  }
}
