import React, { useEffect, useState } from "react";
import { getUserBadges } from "../../api/challenges";
import { Badge } from "../../types";

const UserBadges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const userBadges = await getUserBadges();
        setBadges(userBadges);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError("Failed to load badges. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading your badges...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">
          You haven't earned any badges yet.
        </p>
        <p className="mt-2">
          Complete all challenges in a concept to earn badges!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Earned Badges</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.conceptTag}
            className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="w-24 h-24 mb-3">
              <img
                src={badge.icon}
                alt={badge.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-semibold text-lg text-center mb-1">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {badge.description}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Earned on {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBadges;
