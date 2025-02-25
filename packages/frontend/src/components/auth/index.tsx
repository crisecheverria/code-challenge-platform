import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/config";

export const Login = () => {
  const location = useLocation();
  const state = location.state as {
    returnTo?: string;
    message?: string;
  } | null;
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

  const handleGitHubLogin = () => {
    // Save return URL in localStorage
    if (state?.returnTo) {
      localStorage.setItem("returnTo", state.returnTo);
    }

    const REDIRECT_URI = import.meta.env.VITE_GITHUB_CALLBACK_URL;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Code Challenges
        </h2>
        {state?.message && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {state.message}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            onClick={handleGitHubLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Initializing authentication...");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) {
          throw new Error("No authorization code received");
        }

        setStatus("Exchanging code for token...");

        const response = await api.post("/api/auth/github", { code });
        const data = response.data;

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Check for return URL
          const returnTo = localStorage.getItem("returnTo");
          localStorage.removeItem("returnTo"); // Clean up

          // Navigate to return URL or dashboard
          navigate(returnTo || "/dashboard");
        } else {
          throw new Error("No token received");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    handleAuth();
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>{status}</div>;
};
