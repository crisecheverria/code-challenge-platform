import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login, AuthCallback } from "./components/auth";
import Dashboard from "./components/dashboard";
import ChallengeList from "./components/challenges/ChallengeList";
import ChallengeDetail from "./components/challenges/ChallengeDetail";
import Layout from "./components/layout/Layout";
import HomePage from "./components/home";
import LearningPath from "./components/learning/LearningPath";
import ConceptDetail from "./components/learning/ConceptDetail";
import ConceptCompletePage from "./components/challenges/ConceptCompletePage";
import UserBadges from "./components/challenges/UserBadges";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/github/callback" element={<AuthCallback />} />

        {/* Main layout with both public and protected routes */}
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="challenges" element={<ChallengeList />} />
          <Route path="challenge/:id" element={<ChallengeDetail />} />

          {/* Learning path routes */}
          <Route path="learning" element={<LearningPath />} />
          <Route path="concept/:slug" element={<ConceptDetail />} />
          <Route
            path="/concept/:conceptTag/complete"
            element={<ConceptCompletePage />}
          />
          {/* Protected routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/badges" element={<UserBadges />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
