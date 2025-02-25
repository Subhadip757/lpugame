import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const QuizezArea = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const studentID = localStorage.getItem("userID");

  useEffect(() => {
    const storedTests = JSON.parse(localStorage.getItem("tests")) || [];
    const studentQuizzes = storedTests.filter(
      (quiz) => !quiz.assignedTo || quiz.assignedTo.includes(studentID)
    );
    setQuizzes(studentQuizzes);
  }, [studentID]);

  // Redirect to Quiz Authentication Page
  const handleQuizClick = (quiz) => {
    navigate(`/quiz-auth/${quiz.id}`);
  };

  return (
    <section className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-200">
      {quizzes.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="p-6">
                <h3 className="text-3xl font-bold text-center text-black mb-4">
                  {quiz.quizName}
                </h3>
                <p className="text-center text-gray-800 text-lg">
                  {quiz.numQuestions} Questions
                </p>
                <p className="text-center text-gray-600 mt-3 mb-5 text-sm">
                  Negative Marking:{" "}
                  <strong>{quiz.negativeMarking ? "Yes" : "No"}</strong>
                </p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-600 text-white text-lg font-semibold py-2 px-6 rounded-full shadow-md hover:bg-black hover:text-orange-500 transition duration-300"
                    onClick={() => handleQuizClick(quiz)}
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
            Looks like there are no quizzes assigned to you.
          </p>
        </div>
      )}
    </section>
  );
};

export default QuizezArea;
