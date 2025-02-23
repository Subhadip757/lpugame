import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Login,
  StudentDashboard,
  TeacherDashboard,
  Quiz,
  PreviousResults,
  QuizDetails,
  QuizAuth,
  QuizManagement,
  ViewResults,
} from "./components";

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));

  // ✅ Watch for changes in localStorage (for login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
      setUserID(localStorage.getItem("userID"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Default Route - Show Login First */}
        <Route
          path="/"
          element={<Login setUserRole={setUserRole} setUserID={setUserID} />}
        />

        {/* ✅ Student Dashboard */}
        <Route
          path="/student-dashboard/:id"
          element={
            userRole === "student" && userID ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Teacher Dashboard */}
        <Route
          path="/teacher-dashboard/:id"
          element={
            userRole === "teacher" && userID ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Other Routes */}
        <Route path="/previous-results" element={<PreviousResults />} />
        <Route path="/quiz-details/:title" element={<QuizDetails />} />
        <Route path="/quiz-management" element={<QuizManagement />} />
        <Route path="/view-results/:quizId" element={<ViewResults />} />

        {/* ✅ Quiz Password Authentication Route */}
        <Route path="/quiz-auth/:quizId" element={<QuizAuth />} />

        {/* ✅ Protected Quiz Route (Only if password is entered) */}
        <Route
          path="/quiz/:quizId"
          element={
            localStorage.getItem("quizAccess") ? <Quiz /> : <Navigate to="/" />
          }
        />

        {/* ✅ Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
