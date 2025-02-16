import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy credentials for Student
  const credentials = {
    student: {
      email: "student@example.com",
      password: "student123",
    },
  };

  // Handle form submission and authentication
  const handleSubmit = (e) => {
    e.preventDefault();

    // Student Login
    if (
      email === credentials.student.email &&
      password === credentials.student.password
    ) {
      localStorage.setItem("userRole", "student");
      navigate("/student-dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  // Handle input change and hide error if input is empty
  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    // Clear error if input becomes empty
    if (e.target.value === "" || password === "") {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    // Clear error if input becomes empty
    if (e.target.value === "" || email === "") {
      setError("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1682687218982-6c508299e107?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNjZW5lcnklMjBiYWNrZ29ydW5kJTIwY2FydG9vbnxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10">
        <div className="text-center">
          <img
            alt="Your Company"
            src="https://upload.wikimedia.org/wikipedia/en/3/3a/Lovely_Professional_University_logo.png"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-black">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange} // Updated onChange
                required
                autoComplete="email"
                className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange} // Updated onChange
                required
                autoComplete="current-password"
                className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
