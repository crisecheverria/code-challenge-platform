import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLearningPath } from "../../api/learning";
import Badge from "../ui/Badge";
import {
  LockClosedIcon,
  CheckCircleIcon,
  PlayIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

interface Challenge {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
}

interface Concept {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  order: number;
  resources: { title: string; url: string; type: string }[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  unlocked: boolean;
  challenges: Challenge[];
}

const LearningPath: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("typescript");
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const data = await getLearningPath(activeLanguage);
        setConcepts(data);
      } catch (err) {
        setError("Failed to load learning path");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [activeLanguage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">Error: {error}</p>
        <button
          className="mt-2 text-red-600 underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Your Learning Path
          </h1>
          <p className="text-gray-600 mt-1">
            Master programming concepts step by step
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-1 flex">
          <button
            className={`px-4 py-2 rounded ${activeLanguage === "typescript" ? "bg-blue-100 text-blue-800" : "text-gray-700"}`}
            onClick={() => setActiveLanguage("typescript")}
          >
            TypeScript
          </button>
          <button
            className={`px-4 py-2 rounded ${activeLanguage === "javascript" ? "bg-blue-100 text-blue-800" : "text-gray-700"}`}
            onClick={() => setActiveLanguage("javascript")}
          >
            JavaScript
          </button>
        </div>
      </div>

      {/* Learning path visualization */}
      <div className="relative pb-16">
        {/* Vertical progression line */}
        <div className="absolute left-8 top-8 bottom-0 w-1 bg-gray-200 z-0 hidden md:block"></div>

        {concepts.map((concept) => (
          <div key={concept._id} className="mb-6 relative">
            {/* Connector for desktop */}
            <div
              className={`absolute left-8 top-8 w-8 h-1 bg-gray-200 hidden md:block ${!concept.unlocked && "opacity-50"}`}
            ></div>

            <div
              className={`rounded-lg shadow-sm border-2 transition-all duration-300 hover:shadow-md
                ${concept.unlocked ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200 opacity-75"}
                ${expandedConcept === concept.slug ? "border-blue-300 shadow-md" : ""}
              `}
            >
              {/* Concept header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() =>
                  setExpandedConcept(
                    expandedConcept === concept.slug ? null : concept.slug,
                  )
                }
              >
                <div className="flex items-start">
                  {/* Status indicator */}
                  <div className="flex-shrink-0 mr-4 relative">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-full border-4 
                      ${
                        concept.progress.percentage === 100
                          ? "bg-green-100 border-green-200 text-green-600"
                          : concept.unlocked
                            ? "bg-blue-50 border-blue-200 text-blue-500"
                            : "bg-gray-100 border-gray-200 text-gray-400"
                      }`}
                    >
                      {concept.progress.percentage === 100 ? (
                        <CheckCircleIcon className="w-8 h-8" />
                      ) : concept.unlocked ? (
                        <BookOpenIcon className="w-8 h-8" />
                      ) : (
                        <LockClosedIcon className="w-8 h-8" />
                      )}
                    </div>
                  </div>

                  {/* Concept info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2
                          className={`text-xl font-semibold ${concept.unlocked ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {concept.name}
                        </h2>
                        <p
                          className={`text-sm mt-1 ${concept.unlocked ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {concept.description}
                        </p>
                      </div>

                      {/* Progress indicator */}
                      <div className="ml-4 flex-shrink-0 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {concept.progress.completed}/{concept.progress.total}
                        </div>
                        <div className="text-xs text-gray-500">challenges</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            concept.progress.percentage === 100
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${concept.progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded content - challenges */}
              {expandedConcept === concept.slug && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Challenges
                  </h3>

                  {concept.challenges.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No challenges available yet
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {concept.challenges.map((challenge) => (
                        <Link
                          key={challenge._id}
                          to={`/challenge/${challenge._id}`}
                          className={`flex items-center justify-between p-3 rounded-lg 
                            ${
                              challenge.completed
                                ? "bg-green-50 hover:bg-green-100"
                                : "bg-gray-50 hover:bg-gray-100"
                            } transition-colors`}
                        >
                          <div className="flex items-center">
                            {challenge.completed ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                              <PlayIcon className="w-5 h-5 text-blue-500 mr-3" />
                            )}
                            <span
                              className={
                                challenge.completed
                                  ? "text-gray-700"
                                  : "text-gray-900"
                              }
                            >
                              {challenge.title}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                challenge.difficulty === "easy"
                                  ? "success"
                                  : challenge.difficulty === "medium"
                                    ? "warning"
                                    : "danger"
                              }
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Learning resources section */}
                  {concept.resources && concept.resources.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Learning Resources
                      </h3>
                      <ul className="space-y-2">
                        {concept.resources.map((resource, idx) => (
                          <li key={idx}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                            >
                              <BookOpenIcon className="w-4 h-4 mr-2" />
                              {resource.title}
                              <span className="ml-2 text-xs text-gray-500">
                                ({resource.type})
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
