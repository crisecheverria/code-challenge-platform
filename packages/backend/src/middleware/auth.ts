import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel, User, UserProgress } from "../models/User";
import { config } from "../config";

export interface AuthRequest extends Request {
  user: User & {
    progress?: UserProgress;
  };
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
