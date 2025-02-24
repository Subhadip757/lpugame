import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import Quiz from "./components/Quiz";
import PreviousResults from "./components/PreviousResult";
import QuizDetails from "./components/QuizDetails";
import QuizAuth from "./components/QuizAuth";
import QuizManagement from "./components/QuizManagement";
import ViewResults from "./components/ViewResults";
import Login from "./components/Login/Login";

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));

  // ✅ Watch for localStorage updates (for login/logout changes)
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

  // ✅ Logout function (clears session)
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userID");
    localStorage.removeItem("quizAccess"); // Reset quiz access
    setUserRole(null);
    setUserID(null);
  };

  return (
    <Router>
      <Routes>
        {/* ✅ Default Route - Show Login Page */}
        <Route
          path="/"
          element={<Login setUserRole={setUserRole} setUserID={setUserID} />}
        />

        {/* ✅ Protected Student Dashboard Route */}
        <Route
          path="/student-dashboard/:id"
          element={
            userRole === "student" && userID ? (
              <StudentDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Protected Teacher Dashboard Route */}
        <Route
          path="/teacher-dashboard/:id"
          element={
            userRole === "teacher" && userID ? (
              <TeacherDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Public Routes */}
        <Route path="/previous-results" element={<PreviousResults />} />
        <Route path="/quiz-details/:title" element={<QuizDetails />} />
        <Route path="/quiz-management" element={<QuizManagement />} />
        <Route path="/view-results/:quizId" element={<ViewResults />} />

        {/* ✅ Quiz Password Authentication Route */}
        <Route path="/quiz-auth/:quizId" element={<QuizAuth />} />

        {/* ✅ Protected Quiz Route (Ensures user has entered the correct password) */}
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
