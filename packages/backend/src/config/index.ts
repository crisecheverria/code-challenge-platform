import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongoUri:
    process.env.MONGODB_URI?.replace(/\s/g, "") ||
    "mongodb://localhost:27017/code-challenges",
  environment: process.env.NODE_ENV || "development",
  docker: {
    memory: process.env.DOCKER_MEMORY_LIMIT || "128m",
    cpuQuota: process.env.DOCKER_CPU_QUOTA || "100000",
    timeout: parseInt(process.env.DOCKER_TIMEOUT || "10000", 10),
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackUrl:
      process.env.GITHUB_CALLBACK_URL ||
      "http://localhost:5173/auth/github/callback",
  },
  jwt: {
    secret: (process.env.JWT_SECRET || "your-secret-key") as Secret,
    expiresIn: "7d" as const, // Using a literal type
  },
};
