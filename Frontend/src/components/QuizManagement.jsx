import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuizManagement = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState(
    JSON.parse(localStorage.getItem("tests")) || []
  );

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "teacher") {
      navigate("/");
    }
  }, [navigate]);

  // Function to delete a quiz
  const handleDeleteQuiz = (quizId) => {
    const updatedTests = tests.filter((test) => test.id !== quizId);
    setTests(updatedTests);
    localStorage.setItem("tests", JSON.stringify(updatedTests));
    localStorage.removeItem(`quizData_${quizId}`); // Remove questions data
    alert("🗑️ Quiz deleted successfully!");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center mt-5">
      <h1 className="text-3xl font-bold text-center mb-6">
        📊 Quiz Management
      </h1>

      {tests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white p-4 rounded-lg shadow-md text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-h-[120px] flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold truncate">
                {test.quizName}
              </h3>
              <p className="text-sm text-gray-600">
                🔢 Questions: {test.numQuestions}
              </p>
              <p className="text-sm text-gray-600">
                ⚖️ Negative Marking: {test.negativeMarking ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-600">
                🔑 Password: {test.password}
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/view-results/${test.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md text-sm transition"
                >
                  📊 View Results
                </button>
                <button
                  onClick={() => handleDeleteQuiz(test.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md text-sm transition"
                >
                  🗑️ Delete Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizManagement;
