import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import StudentDashboard from "./components/StudentDashboard";
import AddQuiz from "./components/AddQuiz";
import Quiz from "./components/Quiz";
import PreviousResults from "./components/PreviousResult";
import QuizDetails from "./components/QuizDetails";

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  // Sync userRole from localStorage on mount
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Route - Redirect based on user role */}
        <Route
          path="/"
          element={
            userRole === "student" ? (
              <Navigate to="/student-dashboard" />
            ) : (
              <Login />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/add-quiz" element={<AddQuiz />} />
        <Route path="/previous-results" element={<PreviousResults />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-details/:title" element={<QuizDetails />} />

        {/* Student Dashboard Route */}
        <Route
          path="/student-dashboard"
          element={
            userRole === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
