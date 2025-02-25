import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = ({ setUserRole, setUserID }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isTeacherLogin, setIsTeacherLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const role = isTeacherLogin ? "teacher" : "student"; // Define role

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Store JWT token and user details
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userRole", data.user.role);
      sessionStorage.setItem("userID", data.user.id);

      // ✅ Update state in App.js
      setUserRole(data.user.role);
      setUserID(data.user.id);

      // ✅ Redirect to dashboard
      setTimeout(() => {
        navigate(
          data.user.role === "teacher"
            ? `/teacher-dashboard/${data.user.id}`
            : `/student-dashboard/${data.user.id}`
        );
      }, 500);
    } catch (error) {
      setError(error.message);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
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
              disabled={loading}
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {loading ? "Signing in..." : "Sign in"}
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
