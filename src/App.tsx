import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RankPage from "./pages/RankPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import { AuthGuard } from "./components/AuthGuard";

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <AuthGuard>
              <LoginPage />
            </AuthGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthGuard>
              <SignUpPage />
            </AuthGuard>
          }
        />

        {/* Protected routes */}
        <Route
          path="/rank"
          element={
            <AuthGuard>
              <RankPage />
            </AuthGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />
        <Route
          path="/friends"
          element={
            <AuthGuard>
              <FriendsPage />
            </AuthGuard>
          }
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};
