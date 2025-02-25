import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import PreviousResults from "./components/PreviousResult";
import QuizDetails from "./components/QuizDetails";
import QuizManagement from "./components/QuizManagement";
import ViewResults from "./components/ViewResults";
import Login from "./components/Login/Login";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if the user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Token is valid:", data.user);
          setUserRole(data.user.role); // ✅ Set role from backend
          setUserID(data.user.id); // ✅ Set user ID from backend
        } else {
          console.error("Invalid token:", data.message);
          sessionStorage.removeItem("token"); // ✅ Remove invalid token
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        setLoading(false);
      });
  }, []);

  // ✅ Logout function (clears session)
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // ✅ Correct key
    sessionStorage.removeItem("userRole"); // ✅ Remove role
    sessionStorage.removeItem("userID"); // ✅ Remove ID
    setUserRole(null);
    setUserID(null);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <Router>
      <Routes>
        {/* ✅ Default Route - Login Page */}
        <Route
          path="/"
          element={<Login setUserRole={setUserRole} setUserID={setUserID} />}
        />

        {/* ✅ Student Dashboard (Protected) */}
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

        {/* ✅ Teacher Dashboard (Protected) */}
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

        {/* ✅ Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
