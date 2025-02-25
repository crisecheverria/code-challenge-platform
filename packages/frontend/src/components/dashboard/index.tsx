import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardBadges from "./DashboardBadges";
import api from "../../api/config";

interface DashboardStats {
  totalChallenges: number;
  completedChallenges: number;
  totalSubmissions: number;
  successRate: number;
  submissionsByLanguage: Record<string, number>;
  recentSubmissions: any[];
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/api/dashboard/stats")
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>No data available</div>;

  // Ensure stats has default values to prevent breaking when empty
  const safeStats = {
    ...stats,
    completedChallenges: stats.completedChallenges || 0,
    totalChallenges: stats.totalChallenges || 0,
    successRate: stats.successRate || 0,
    totalSubmissions: stats.totalSubmissions || 0,
    submissionsByLanguage: stats.submissionsByLanguage || {},
    recentSubmissions: stats.recentSubmissions || [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Completed</h3>
          <p className="text-2xl font-bold">
            {safeStats.completedChallenges}/{safeStats.totalChallenges}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Success Rate</h3>
          <p className="text-2xl font-bold">
            {safeStats.successRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Total Submissions</h3>
          <p className="text-2xl font-bold">{safeStats.totalSubmissions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase">Languages Used</h3>
          <p className="text-2xl font-bold">
            {Object.keys(safeStats.submissionsByLanguage).length}
          </p>
        </div>
        <DashboardBadges />
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
        {safeStats.recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Challenge</th>
                  <th className="text-left py-2">Language</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {safeStats.recentSubmissions.map((submission, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      {submission.challengeId?.title || "Unknown Challenge"}
                    </td>
                    <td className="py-2">{submission.language}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          submission.status === "passed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 py-4 text-center">
            No submissions yet. Start solving challenges to see your progress
            here!
          </div>
        )}
      </div>

      {/* Language Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Submissions by Language</h2>
        {Object.keys(safeStats.submissionsByLanguage).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(safeStats.submissionsByLanguage).map(
              ([lang, count]) => (
                <div key={lang} className="bg-gray-50 p-4 rounded">
                  <h3 className="text-gray-500 text-sm uppercase">{lang}</h3>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="text-gray-500 py-4 text-center">
            No language data available yet. Complete challenges to see
            statistics.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
