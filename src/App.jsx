import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyTracker from './pages/DailyTracker';
import MockTracker from './pages/MockTracker';
import MockAnalysis from './pages/MockAnalysis';
import SoftSkillsTracker from './pages/SoftSkillsTracker';
import AiMentor from './pages/AiMentor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AnimatedPage from './components/AnimatedPage';
import Navbar from './components/Navbar';
import AuthContainer from './components/AuthContainer';

function AnimatedRoutes() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          {/* Public Routes with Shared Context Flip */}
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/register" element={<AuthContainer />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AnimatedPage><Dashboard /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/daily-tracker"
            element={
              <ProtectedRoute>
                <AnimatedPage><DailyTracker /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-tracker"
            element={
              <ProtectedRoute>
                <AnimatedPage><MockTracker /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-analysis"
            element={
              <ProtectedRoute>
                <AnimatedPage><MockAnalysis /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/soft-skills"
            element={
              <ProtectedRoute>
                <AnimatedPage><SoftSkillsTracker /></AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-mentor"
            element={
              <ProtectedRoute>
                <AnimatedPage><AiMentor /></AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AnimatedPage><Profile /></AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AnimatedPage><Settings /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#0b0616]">
          <AnimatedRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}
