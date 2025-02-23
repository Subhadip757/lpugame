import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const QuizAuth = () => {
  const { quizId } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Fetch and Parse Quizzes from LocalStorage
    const storedQuizzes = JSON.parse(localStorage.getItem("tests")) || [];
    console.log("Quizzes in LocalStorage:", storedQuizzes);

    const foundQuiz = storedQuizzes.find(
      (q) => String(q.id) === String(quizId)
    );

    if (foundQuiz) {
      setQuiz(foundQuiz);
    }
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl text-red-600">Quiz Not Found</h3>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === quiz.password) {
      localStorage.setItem(`quizAccess_${quizId}`, "granted");

      // ✅ Fetch Excel file if exists
      const file = localStorage.getItem(`quizExcel_${quizId}`);
      if (file) {
        const workbook = XLSX.read(file, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        localStorage.setItem(`quizData_${quizId}`, JSON.stringify(jsonData));
      }

      // ✅ Redirect to Quiz Details Page
      navigate(`/quiz-details/${quizId}`);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">{quiz.quizName}</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the test password:
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-400"
            placeholder="Enter password"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-orange-600 text-white py-2 rounded-md font-semibold hover:bg-black hover:text-orange-500 transition duration-300"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizAuth;
