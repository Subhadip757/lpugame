import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

const QuizezArea = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/quiz_data.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const groupedQuizzes = data.reduce((acc, row) => {
          const title = row.Title;
          if (!acc[title]) {
            acc[title] = {
              title,
              questions: [],
            };
          }

          acc[title].questions.push({
            question: row.Question,
            options: [row.Option1, row.Option2, row.Option3, row.Option4],
            correctAnswer: row.CorrectAnswer,
          });

          return acc;
        }, {});

        const quizzesArray = Object.values(groupedQuizzes);
        setQuizzes(quizzesArray);
      })
      .catch((err) => console.error("Error loading Excel file:", err));
  }, []);

  const handleQuizClick = (quiz) => {
    localStorage.setItem("currentQuiz", JSON.stringify(quiz));
    navigate(`/quiz-details/${quiz.title}`);
  };

  return (
    <section className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-200">
      {quizzes.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-md bg-gradient-to-br from-orange-500 via-white to-black hover:from-orange-400 hover:to-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleQuizClick(quiz)}
            >
              <div className="p-6">
                <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-white to-black bg-[length:200%_auto] animate-gradient-shine mb-4">
                  {quiz.title}
                </h3>
                <p className="text-center text-gray-800 text-lg">
                  {quiz.questions.length} Questions
                </p>
                <p className="text-center text-gray-700 mt-3 mb-5 text-sm">
                  Test your knowledge and improve your skills.
                </p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-600 text-white text-lg font-semibold py-2 px-6 rounded-full shadow-md hover:bg-orange-500 transition duration-300"
                  >
                    Start Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl text-gray-600">No Quizzes Available</h3>
          <p className="text-gray-500 mt-2">
            Looks like there are no quizzes added yet.
          </p>
          <Link
            to="/add-quiz"
            className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            Add New Quiz
          </Link>
        </div>
      )}
    </section>
  );
};

export default QuizezArea;
