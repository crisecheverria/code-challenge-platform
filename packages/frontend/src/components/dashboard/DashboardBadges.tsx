import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserBadges } from "../../api/challenges";
import { Badge } from "../../types";

const DashboardBadges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const userBadges = await getUserBadges();
        setBadges(userBadges);
      } catch (err) {
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return <div>Loading badges...</div>;
  }

  // Show only the most recent 5 badges
  const recentBadges = badges.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Badges</h2>
        <Link
          to="/profile/badges"
          className="text-blue-600 hover:text-blue-800"
        >
          View All
        </Link>
      </div>

      {badges.length === 0 ? (
        <p className="text-gray-600">
          Complete all challenges in a concept to earn badges!
        </p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {recentBadges.map((badge) => (
            <div
              key={badge.conceptTag}
              className="flex-shrink-0 flex flex-col items-center w-20"
            >
              <img
                src={badge.icon}
                alt={badge.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <p className="text-xs text-center font-medium truncate w-full">
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardBadges;
