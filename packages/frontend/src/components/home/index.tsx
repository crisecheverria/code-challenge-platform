import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Master Programming Fundamentals
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Learn programming concepts step by step through interactive challenges
          and structured learning paths.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/challenges"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md transition-colors text-lg"
          >
            Explore Challenges
          </Link>
          <Link
            to="/learning"
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md transition-colors text-lg"
          >
            Start Learning Path
          </Link>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Code Challenges Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Improve your coding skills with practical challenges
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/challenges"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Challenges
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Feature Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Multiple Languages</h3>
              <p className="text-gray-600">
                Practice with TypeScript, JavaScript, and more languages coming
                soon.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Real-time Testing</h3>
              <p className="text-gray-600">
                Get immediate feedback on your solutions with our test suite.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your improvement with detailed statistics and insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
