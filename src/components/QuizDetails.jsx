import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizDetails = () => {
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [warning, setWarning] = useState("");
  const { title } = useParams();
  const navigate = useNavigate();

  // Fetch quiz from localStorage
  useEffect(() => {
    const storedQuiz = JSON.parse(localStorage.getItem("currentQuiz"));
    if (storedQuiz && storedQuiz.title === title) {
      setQuiz(storedQuiz);
    } else {
      navigate("/"); // Redirect to home if no quiz is found
    }
  }, [title, navigate]);

  // Handle Answer Selection
  const handleAnswerChange = (question, answer) => {
    setUserAnswers({ ...userAnswers, [question]: answer });
  };

  // Submit Quiz
  const handleSubmit = (e) => {
    e.preventDefault();
    const totalQuestions = quiz.questions.length;
    const correctAnswers = quiz.questions.filter(
      (q) => userAnswers[q.question] === q.correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Save result to localStorage with timestamp
    const previousResults =
      JSON.parse(localStorage.getItem("quizResults")) || [];

    const newResult = {
      title: quiz.title,
      score: correctAnswers,
      totalQuestions: totalQuestions,
      percentage: percentage,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(), // Added timestamp for uniqueness
    };

    // Check if the same quiz was attempted before
    const existingIndex = previousResults.findIndex(
      (result) => result.title === quiz.title
    );

    if (existingIndex !== -1) {
      // Overwrite the previous score
      previousResults[existingIndex] = newResult;
    } else {
      // Add new result
      previousResults.push(newResult);
    }

    localStorage.setItem("quizResults", JSON.stringify(previousResults));
    navigate("/previous-results");
  };

  // Cancel Quiz
  const handleCancelQuiz = () => {
    if (window.confirm("Are you sure you want to cancel the quiz?")) {
      navigate("/");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-800 to-orange-600 p-8">
      <h2 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
        {quiz?.title}
      </h2>
      <form onSubmit={handleSubmit}>
        {quiz?.questions.map((q, index) => (
          <div key={index} className="bg-white rounded-lg p-4 mb-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {q.question}
            </h3>
            {q.options.map((option, i) => (
              <label key={i} className="block mb-2">
                <input
                  type="radio"
                  name={q.question}
                  value={option}
                  onChange={() => handleAnswerChange(q.question, option)}
                  checked={userAnswers[q.question] === option}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}

        {warning && (
          <p className="text-red-500 font-semibold mb-4">{warning}</p>
        )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Submit Quiz
          </button>
          <button
            type="button"
            onClick={handleCancelQuiz}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Cancel Quiz
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuizDetails;
