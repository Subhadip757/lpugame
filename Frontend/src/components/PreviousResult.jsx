import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PreviousResults = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Get the logged-in student's ID (Example: stored in localStorage)
  const studentID = localStorage.getItem("loggedInStudentID");

  useEffect(() => {
    if (!studentID) return; // If no student is logged in, do nothing

    // Get results for the specific student
    const storedResults =
      JSON.parse(localStorage.getItem(`quizResults_${studentID}`)) || [];

    // Filter out expired results (older than 24 hours)
    const currentTime = Date.now();
    const updatedResults = storedResults.filter((result) => {
      return currentTime - result.timestamp < 24 * 60 * 60 * 1000;
    });

    // Update localStorage with non-expired results
    if (updatedResults.length !== storedResults.length) {
      localStorage.setItem(
        `quizResults_${studentID}`,
        JSON.stringify(updatedResults)
      );
    }

    setResults(updatedResults);
  }, [studentID]);

  // Navigate to Student Dashboard
  const handleReturnHome = () => {
    navigate("/student-dashboard");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-orange-800 p-8">
      {/* Return to Dashboard Button */}
      <div className="flex justify-start mb-8">
        <motion.button
          onClick={handleReturnHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
        >
          Return to Dashboard
        </motion.button>
      </div>

      <h2 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
        Previous Results
      </h2>

      {results.length > 0 ? (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <ul className="space-y-4">
            {results.map((result, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {result.title}
                </h3>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>
                    <span className="font-semibold">Score:</span> {result.score}{" "}
                    / {result.totalQuestions}
                  </li>
                  <li>
                    <span className="font-semibold">Percentage:</span>{" "}
                    {result.percentage}%
                  </li>
                  <li>
                    <span className="font-semibold">Date:</span> {result.date}
                  </li>
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl text-gray-300">No Results Available</h3>
          <p className="text-gray-400 mt-2">
            You haven't taken any quizzes yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default PreviousResults;
