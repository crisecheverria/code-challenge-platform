import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Challenge,
  ExecutionResult,
  ConceptProgress,
  Badge,
} from "../../types";
import {
  getChallenge,
  submitSolution,
  getChallengeProgress,
  earnBadge,
  getAllChallengesByConceptTag,
} from "../../api/challenges";
import CodeEditor from "./CodeEditor";
import confetti from "canvas-confetti";

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<ExecutionResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for next button and badges
  const [nextEnabled, setNextEnabled] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [conceptProgress, setConceptProgress] =
    useState<ConceptProgress | null>(null);
  const [badgeEarned, setBadgeEarned] = useState<Badge | null>(null);
  const [nextLoading, setNextLoading] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        if (!id) return;
        const data = await getChallenge(id);
        setChallenge(data);
        setCode(data.template);

        // Check if user is authenticated before fetching progress
        if (
          isAuthenticated &&
          data.conceptTags &&
          data.conceptTags.length > 0
        ) {
          try {
            // Get progress for the primary concept tag
            const primaryConcept = data.conceptTags[0];
            const progress = await getChallengeProgress(primaryConcept);
            setConceptProgress(progress);

            // Enable next button if this challenge is already completed
            if (progress.completedChallenges?.includes(id)) {
              setNextEnabled(true);
            }
          } catch (err) {
            console.error("Failed to fetch progress:", err);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id, isAuthenticated]);

  useEffect(() => {
    // Reset states when the challenge ID changes
    setResults(null);
    setError(null);
    setNextEnabled(false);
    // Any other state resets you need
  }, [id]);

  const handleSubmit = async () => {
    if (!challenge) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitSolution(
        challenge._id,
        code,
        challenge.language,
      );
      setResults(result.results);

      // Check if all tests passed
      const allPassed =
        Array.isArray(result.results) && result.results.every((r) => r.passed);

      if (allPassed) {
        setNextEnabled(true);

        // Check if this completes a concept
        if (
          isAuthenticated &&
          challenge.conceptTags &&
          challenge.conceptTags.length > 0 &&
          conceptProgress &&
          conceptProgress.completed + 1 >= conceptProgress.totalChallenges &&
          !conceptProgress.earnedBadge
        ) {
          // Trigger confetti
          triggerConfetti();

          try {
            // Award badge
            const badgeResult = await earnBadge(challenge.conceptTags[0]);
            setBadgeEarned(badgeResult.badge);
            setShowBadgeModal(true);
          } catch (err) {
            console.error("Failed to award badge:", err);
          }
        }
      }
    } catch (err) {
      const error = err as Error;
      setError(`Failed to submit solution: ${error.message}`);
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextChallenge = async () => {
    if (
      !challenge ||
      !challenge.conceptTags ||
      challenge.conceptTags.length === 0
    )
      return;

    try {
      setNextLoading(true); // Add a loading state if you want

      // Get all challenges with this concept tag
      const allChallenges = await getAllChallengesByConceptTag(
        challenge.conceptTags[0],
      );

      // Find current challenge index
      const currentIndex = allChallenges.findIndex(
        (c) => c._id === challenge._id,
      );

      if (currentIndex !== -1 && currentIndex < allChallenges.length - 1) {
        // Navigate to next challenge
        navigate(`/challenge/${allChallenges[currentIndex + 1]._id}`);
      } else {
        // No more challenges in this concept
        navigate(`/concept/${challenge.conceptTags[0]}/complete`);
      }
    } catch (err) {
      console.error("Failed to get next challenge:", err);
      // Show an error message to the user if needed
    } finally {
      setNextLoading(false); // Reset loading state
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (loading) return <div>Loading challenge...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!challenge) return <div>Challenge not found</div>;

  // Calculate progress percentage
  const progressPercentage = conceptProgress
    ? (conceptProgress.completed / conceptProgress.totalChallenges) * 100
    : 0;

  return (
    <div className="h-screen flex flex-col">
      {/* Header Section */}
      <div className="bg-white border-b py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                challenge.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : challenge.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-gray-500">{challenge.language}</span>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {!isAuthenticated
                  ? "Login to Submit"
                  : submitting
                    ? "Running Tests..."
                    : "Submit Solution"}
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleNextChallenge}
                  disabled={!nextEnabled || nextLoading}
                  className={`px-4 py-2 rounded-lg ${
                    nextEnabled && !nextLoading
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {nextLoading ? "Loading..." : "Next Challenge"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={challenge.language}
            />
          </div>
        </div>

        {/* Right Column - Instructions and Console */}
        <div className="w-1/2 border-l flex flex-col">
          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto p-6"
            style={{ maxHeight: "70vh" }}
          >
            {/* Progress Bar */}
            {conceptProgress && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    Progress: {conceptProgress.completed} /{" "}
                    {conceptProgress.totalChallenges} challenges
                  </span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Challenge Description */}
            <div className="prose max-w-none mb-6">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <p className="text-gray-600">{challenge.description}</p>
            </div>

            {/* Test Results */}
            {results && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Test Case {index + 1}: {result.testCase.description}
                        </span>
                        <span
                          className={
                            result.passed ? "text-green-600" : "text-red-600"
                          }
                        >
                          {result.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      {!result.passed && (
                        <div className="text-sm">
                          <div>
                            Input: {JSON.stringify(result.testCase.input)}
                          </div>
                          <div>
                            Expected: {JSON.stringify(result.testCase.expected)}
                          </div>
                          <div>Received: {JSON.stringify(result.output)}</div>
                          {result.error && (
                            <div className="text-red-600">
                              Error: {result.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge Modal */}
      {showBadgeModal && badgeEarned && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <div className="badge-icon my-4">
              <img
                src={badgeEarned.icon}
                alt="Concept Badge"
                className="w-24 h-24 mx-auto"
              />
            </div>
            <p className="mb-4">
              You've earned the {badgeEarned.name} badge by completing all
              challenges!
            </p>
            <button
              onClick={() => setShowBadgeModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail;
