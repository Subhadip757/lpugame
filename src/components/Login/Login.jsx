import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = ({ setUserRole, setUserID }) => {
  // ✅ Accept setUserID as a prop
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isTeacherLogin, setIsTeacherLogin] = useState(false);

  // Dummy credentials stored in localStorage (for testing)
  const credentials = {
    students: [
      { id: "s1", email: "student@example.com", password: "student123" },
      { id: "s2", email: "subhadip@gmail.com", password: "abc123" },
      { id: "s3", email: "nilot@gmail.com", password: "nit123" },
    ],
    teachers: [
      { id: "t1", email: "teacher@example.com", password: "teacher123" },
      { id: "t2", email: "admin@gmail.com", password: "admin123" },
    ],
  };

  // Handle login submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const role = isTeacherLogin ? "teacher" : "student"; // 🔹 Singular role string
    const userList = credentials[role + "s"]; // Fetch from "students" or "teachers"

    const user = userList.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // ✅ Store role and ID in localStorage
      localStorage.setItem("userRole", role);
      localStorage.setItem("userID", user.id);

      // ✅ Set global state for real-time updates
      setUserRole(role);
      setUserID(user.id);

      // ✅ Redirect to the correct dashboard
      navigate(
        role === "teacher"
          ? `/teacher-dashboard/${user.id}`
          : `/student-dashboard/${user.id}`
      );
    } else {
      setError("Invalid email or password. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-40 animate-pulse"></div>

      {/* Login Card */}
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isTeacherLogin ? "Teacher Login" : "Student Login"}
          </h2>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Animated Login Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isTeacherLogin ? "teacher" : "student"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6 mt-6"
          >
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 pl-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 pl-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Sign in
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Toggle Button */}
        <p className="mt-4 text-center text-sm">
          {isTeacherLogin ? "Switch to " : "Are you a Teacher? "}
          <button
            onClick={() => {
              setIsTeacherLogin(!isTeacherLogin);
              setError("");
              setEmail("");
              setPassword("");
            }}
            className="text-orange-500 font-semibold hover:underline"
          >
            {isTeacherLogin ? "Student Login" : "Teacher Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
