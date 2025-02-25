
      // Test case type definition
      interface TestCase {
        input: [number, number];
        expected: number;
        description?: string;
      }

      // User's solution
      function sum(a: number, b: number): number {
  // Write your code here
  while(true) {}
}

      // Test cases
      const testCases: TestCase[] = [
  {
    "input": [
      1,
      2
    ],
    "expected": 3,
    "description": "should add positive numbers",
    "_id": "67aca80a8d9c709f59cf2d4c"
  },
  {
    "input": [
      -1,
      1
    ],
    "expected": 0,
    "description": "should handle negative numbers",
    "_id": "67aca80a8d9c709f59cf2d4d"
  }
];
      
      // Run tests
      async function runTests() {
        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          try {
            const [a, b] = testCase.input;
            const result = sum(a, b);
            const passed = result === testCase.expected;
            
            process.stdout.write(JSON.stringify({
              index: i,
              passed,
              output: result,
              error: null
            }) + '\n');
          } catch (error: any) {
            process.stdout.write(JSON.stringify({
              index: i,
              passed: false,
              output: null,
              error: error.message
            }) + '\n');
          }
        }
      }

      runTests();
    