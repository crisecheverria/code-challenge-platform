import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Challenge } from "../../types";
import { getChallenges } from "../../api/challenges";

const ChallengeList: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallenges();
        setChallenges(data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) return <div>Loading challenges...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coding Challenges</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Link
            key={challenge._id}
            to={`/challenge/${challenge._id}`}
            className="block p-6 rounded-lg border hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <div className="flex items-center justify-between">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;
