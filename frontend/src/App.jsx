import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import AI from "./pages/AI";
import PYQs from "./pages/PYQs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";   // ✅ Import SignUp
import Navbar from "./components/Navbar/Navbar";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />   {/* ✅ SignUp route added */}

        {/* Protected Routes - Require Login */}
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai" 
          element={
            <ProtectedRoute>
              <AI />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pyqs" 
          element={
            <ProtectedRoute>
              <PYQs />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;