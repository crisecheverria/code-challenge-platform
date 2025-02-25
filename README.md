# Code Challenge Platform

An open-source platform for creating and solving coding challenges, built with TypeScript, React, and Node.js.

## Features

- 🚀 Interactive coding environment
- ✅ Automated test execution
- 🔒 Secure code execution in Docker containers
- 📊 Progress tracking
- 🏆 Achievement system

## Getting Started

### Prerequisites

- Node.js 18+
- Docker
- Docker Compose

### Installation

1. Clone the repository:

```bash
git clone https://github.com/crisecheverria/code-challenge-platform.git
cd code-challenge-platform
```

2. Install dependencies:

```bash
npm install
```

3. Start the development environment:

```bash
npm run dev:all
```

This will start both the frontend and backend services. The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Project Structure

- `packages/frontend`: React application
- `packages/backend`: Node.js API and code execution service

# Data-Driven Seeding for Code Challenge Platform

This repository has been updated to use a data-driven approach for seeding challenges and concepts. This makes it easier for contributors to add or modify content without touching the seed scripts.

## Directory Structure

```
code-challenge-platform/
├── data/
│   ├── challenges.json
│   └── concepts.json
├── packages/
│   ├── backend/
│   │   └── src/
│   │       └── scripts/
│   │           ├── seedChallenges.ts
│   │           └── seedConcepts.ts
│   └── frontend/
├── seed.js
└── package.json
```

## How It Works

1. Challenge and concept data is stored in separate JSON files in the `data/` directory.
2. The seed scripts read from these JSON files instead of having hardcoded data.
3. A root-level script `seed.js` manages the seeding process from the monorepo root.

## Running the Seeds

You can now run the seed scripts from the root of the monorepo:

```bash
# Regular seeding (skips existing entries)
npm run seed

# Force update (overwrites existing entries)
npm run seed:force
```

## Contributing New Challenges or Concepts

To add new challenges or concepts:

1. Edit the appropriate JSON file in the `data/` directory.
2. Run the seed script to update the database.

### Adding a New Challenge

Add a new entry to `data/challenges.json` following the existing format:

```json
{
  "title": "Your Challenge Title",
  "description": "Challenge description...",
  "difficulty": "easy|medium|hard",
  "language": "typescript",
  "functionName": "yourFunctionName",
  "parameterTypes": ["param1Type", "param2Type"],
  "returnType": "returnType",
  "template": "function yourFunctionName(...) {\n  // Write your code here\n}",
  "testCases": [
    {
      "input": [input1, input2],
      "expected": expectedOutput,
      "description": "test case description"
    }
  ],
  "conceptTags": ["tag1", "tag2"],
  "timeLimit": 5000,
  "memoryLimit": 128
}
```

### Adding a New Concept

Add a new entry to `data/concepts.json` following the existing format:

```json
{
  "name": "Concept Name",
  "slug": "concept-slug",
  "description": "Concept description...",
  "category": "fundamentals|intermediate|advanced",
  "language": "all|typescript|javascript",
  "order": 21,
  "dependencies": ["dependency1", "dependency2"],
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://resource-url.com",
      "type": "documentation|tutorial|video"
    }
  ]
}
```

## Challenge-Concept Mapping

The mapping between challenges and concepts is handled in the `seedConcepts.ts` script. If you add a new challenge with a new function name, you may need to update the `conceptMappings` object in this script to ensure proper tagging.

## Installation Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the data directory and place the JSON files:
   ```bash
   mkdir -p data
   # Copy the challenges.json and concepts.json files to the data directory
   ```
4. Run the seed script:
   ```bash
   npm run seed
   ```

## Development Workflow

1. Start the development environment:
   ```bash
   npm run dev
   ```
2. Make changes to challenges or concepts in the `data/` directory
3. Run the seed script to update the database:
   ```bash
   npm run seed
   ```
4. Changes will be reflected in the application

## Benefits of the Data-Driven Approach

- **Separation of Concerns**: Data is separate from logic
- **Easy Collaboration**: Contributors can focus on content without touching code
- **Versioning**: JSON files can be version-controlled separately
- **Flexibility**: Easy to extend or modify data structure without changing scripts
- **Maintainability**: Centralized data management makes updates simpler

## Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details.

## Development Flow

1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
