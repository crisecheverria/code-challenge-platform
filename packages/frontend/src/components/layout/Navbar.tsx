import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Code Challenges
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/challenges"
              className={`${isActive("/challenge") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
            >
              Challenges
            </Link>

            <Link
              to="/learning"
              className={`${isActive("/learning") || isActive("/concept") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
            >
              Learning Path
            </Link>

            <Link
              to="/profile/badges"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
              My Badges
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`${isActive("/dashboard") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
              >
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">{/* Mobile menu implementation */}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
