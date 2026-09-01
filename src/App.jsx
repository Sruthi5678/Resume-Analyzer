import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import Analyzing from './pages/Analyzing';
import Dashboard from './pages/Dashboard';
import JobMatch from './pages/JobMatch';
import Profile from './pages/Profile';

// Styles
import './styles/variables.css';
import './styles/global.css';
import './styles/auth.css';
import './styles/upload.css';
import './styles/analyzing.css';
import './styles/dashboard.css';
import './styles/jobmatch.css';
import './styles/profile.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="page-wrapper">
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Dashboard & Flow Routes */}
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analyzing"
                  element={
                    <ProtectedRoute>
                      <Analyzing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/job-match"
                  element={
                    <ProtectedRoute>
                      <JobMatch />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
