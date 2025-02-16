import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-orange-500 via-white to-orange-300 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left Side: Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-auto"
                src="https://upload.wikimedia.org/wikipedia/en/3/3a/Lovely_Professional_University_logo.png"
                alt="LPU Logo"
              />
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 text-3xl font-extrabold ml-3 tracking-widest hover:from-orange-700 hover:to-black transition-all duration-500"
              >
                My Quiz App
              </motion.span>
            </Link>
          </div>

          {/* Middle: Centered Navigation Links */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="relative group text-gray-800 font-semibold hover:text-orange-600 transition duration-300"
              >
                Dashboard
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-600"></span>
              </Link>

              <Link
                to="/previous-results"
                className="relative group text-gray-800 font-semibold hover:text-orange-600 transition duration-300"
              >
                Previous Results
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-600"></span>
              </Link>
            </div>
          </div>

          {/* Right Side: Login Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 w-0 bg-white opacity-10 transition-all duration-500 ease-in-out group-hover:w-full"></span>
              <Link
                to="/login"
                className="relative group text-white font-semibold hover:text-black transition duration-300"
              >
                Logout
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
              </Link>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
