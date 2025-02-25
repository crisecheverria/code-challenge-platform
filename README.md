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
