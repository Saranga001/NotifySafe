import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Dashboard from "./pages/DashboardFirebase";
import Activity from "./pages/Activity";
import TemplateEditor from "./pages/TemplateEditor";
import Inbox from "./pages/Inbox";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { firestoreBackend } from "./lib/appwrite-backend";

export default function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    firestoreBackend.init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Initializing...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Nav user={user} />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/templates" element={<TemplateEditor />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <Activity />
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
              path="/templates"
              element={
                <ProtectedRoute requirePrivileged={true}>
                  <TemplateEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
