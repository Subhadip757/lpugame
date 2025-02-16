import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

const QuizCard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  // Fetch quizzes from localStorage
  useEffect(() => {
    const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    setQuizzes(storedQuizzes);
  }, []);

  const handleQuizClick = (quizTitle) => {
    fetch("/path/to/quiz_questions.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const filteredQuestions = data.filter((row) => row.Title === quizTitle);

        localStorage.setItem(
          "currentQuiz",
          JSON.stringify({ title: quizTitle, questions: filteredQuestions })
        );

        navigate(`/quiz-details/${quizTitle}`);
      })
      .catch((err) => console.error("Error loading Excel file:", err));
  };

  return (
    <section className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-shine text-center mb-8 drop-shadow-lg">
        Available Quizzez
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 hover:from-purple-600 hover:to-red-400 transition-all duration-300 cursor-pointer"
              onClick={() => handleQuizClick(quiz.title)}
            >
              <div className="p-6">
                <h2 className="text-3xl font-bold text-center text-white mb-4">
                  {quiz.title}
                </h2>
                <p className="text-center text-gray-100 text-lg">
                  {quiz.questions.length} Questions
                </p>
                <p className="text-center text-gray-200 mt-3 mb-5 text-sm">
                  Ready to test your knowledge?
                </p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-500 text-gray-800 text-lg font-semibold py-2 px-6 rounded-full shadow-md hover:bg-yellow-400 transition duration-300"
                  >
                    Start Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-700 text-center col-span-full">
            No quizzes available. Please add a quiz first.
          </p>
        )}
      </div>
    </section>
  );
};

export default QuizCard;
