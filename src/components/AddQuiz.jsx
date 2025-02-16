import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      score: 1,
    },
  ]);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        score: 1,
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Quiz Added:", { title, questions });

    // Store the quiz data in localStorage for student dashboard
    const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    localStorage.setItem(
      "quizzes",
      JSON.stringify([...storedQuizzes, { title, questions }])
    );

    // Navigate to the home page after submission
    navigate("/");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 via-white to-black p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8 drop-shadow-lg">
          Add New Quiz
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-800 font-semibold mb-2">
            Quiz Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            placeholder="Enter quiz title"
            required
          />

          {questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.2, duration: 0.5 }}
              className="mb-6 p-4 border rounded-lg shadow-md bg-white"
            >
              <label className="block text-gray-800 font-semibold mb-2">
                Question {qIndex + 1}:
              </label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleChange(qIndex, "questionText", e.target.value)
                }
                className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                placeholder="Enter question"
                required
              />

              <label className="block text-gray-800 font-semibold mb-2">
                Options:
              </label>
              {question.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                  placeholder={`Option ${oIndex + 1}`}
                  required
                />
              ))}

              <label className="block text-gray-800 font-semibold mt-4">
                Correct Answer:
              </label>
              <select
                value={question.correctAnswer}
                onChange={(e) =>
                  handleChange(qIndex, "correctAnswer", e.target.value)
                }
                className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                required
              >
                <option value="">Select Correct Answer</option>
                {question.options.map((option, oIndex) => (
                  <option key={oIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="block text-gray-800 font-semibold mb-2">
                Score (Default: 1):
              </label>
              <input
                type="number"
                value={question.score}
                onChange={(e) => handleChange(qIndex, "score", e.target.value)}
                className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                min="1"
              />
            </motion.div>
          ))}

          <motion.button
            type="button"
            onClick={handleAddQuestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 mb-4"
          >
            Add Another Question
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300"
          >
            Complete Quiz
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default AddQuiz;
