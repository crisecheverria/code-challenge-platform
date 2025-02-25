import { api } from "./config";
import { Challenge, SubmissionResult, ConceptProgress, Badge } from "../types";

export const getChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get("/api/challenges");
  return response.data;
};

export const getChallenge = async (id: string): Promise<Challenge> => {
  const response = await api.get(`/api/challenges/${id}`);
  return response.data;
};

export const submitSolution = async (
  challengeId: string,
  code: string,
  language: "javascript" | "typescript" = "typescript",
): Promise<SubmissionResult> => {
  const response = await api.post("/api/submissions", {
    challengeId,
    code,
    language,
  });
  return response.data;
};

// Get the progress for a specific concept
export const getChallengeProgress = async (
  conceptTag: string,
): Promise<ConceptProgress> => {
  const response = await api.get("/api/user/progress", {
    params: { conceptTag },
  });
  return response.data;
};

// Get the next challenge in a sequence
export const getNextChallenge = async (
  conceptTag: string,
  currentId: string,
): Promise<Challenge | null> => {
  try {
    console.log("Calling getNextChallenge with:", { conceptTag, currentId });
    const response = await api.get("/api/challenges/next", {
      params: {
        conceptTag,
        currentId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getNextChallenge:", error);
    throw error;
  }
};

export const getAllChallengesByConceptTag = async (
  conceptTag: string,
): Promise<Challenge[]> => {
  try {
    // Get all challenges first
    const response = await api.get("/api/challenges");
    const allChallenges = response.data;

    // Filter by concept tag on the client side
    return allChallenges.filter(
      (challenge) =>
        challenge.conceptTags && challenge.conceptTags.includes(conceptTag),
    );
  } catch (error) {
    console.error("Error fetching challenges by concept tag:", error);
    throw error;
  }
};

// Award a badge for completing all challenges in a concept
export const earnBadge = async (
  conceptTag: string,
): Promise<{ message: string; badge: Badge }> => {
  const response = await api.post("/api/user/badges", { conceptTag });
  return response.data;
};

// Get all earned badges
export const getUserBadges = async (): Promise<Badge[]> => {
  const response = await api.get("/api/user/badges");
  return response.data;
};
