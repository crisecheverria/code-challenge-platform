import mongoose from "mongoose";
import { config } from "../config";

export const connectDB = async (): Promise<void> => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Remove any whitespace from the URI
    const uri = config.mongoUri.trim();
    console.log("URI:", uri.replace(/\/\/[^:]+:[^@]+@/, "//****:****@")); // Hide credentials

    await mongoose.connect(uri, {
      retryWrites: true,
      w: "majority",
    });

    console.log("MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
