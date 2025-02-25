import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewResults = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "teacher") {
      navigate("/");
    }

    // Fetch results from localStorage
    const storedResults =
      JSON.parse(localStorage.getItem(`quizResults_${quizId}`)) || [];
    setResults(storedResults);
  }, [quizId, navigate]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Quiz Results</h1>

      {results.length > 0 ? (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{result.studentName}</td>
                  <td className="border p-2">
                    {result.score} / {result.total}
                  </td>
                  <td className="border p-2">
                    {((result.score / result.total) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No results available for this quiz.
        </p>
      )}

      <button
        onClick={() => navigate("/quiz-management")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
      >
        🔙 Back to Quizzes
      </button>
    </div>
  );
};

export default ViewResults;
