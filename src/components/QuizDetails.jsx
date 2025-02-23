import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuizDetails = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null); // Store the score

  useEffect(() => {
    const storedData = localStorage.getItem(`quizData_${quizId}`);
    console.log("🛠️ Fetched Data from localStorage:", storedData); // Debugging

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setQuestions(parsedData);
        } else {
          console.warn("⚠️ No questions available.");
        }
      } catch (error) {
        console.error("❌ Error parsing quiz data:", error);
      }
    }
  }, [quizId]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Grade the quiz
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] && answers[q.id].toLowerCase() === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Quiz Questions</h2>

      {questions.length > 0 ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {questions.map((q, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold">{q.question}</h3>
              <ul className="list-none mt-2">
                {Object.entries(q.options).map(([key, option]) => (
                  <li key={key} className="text-gray-700">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={key}
                        onChange={() => handleAnswerSelect(q.id, key)}
                        className="mr-2"
                      />
                      <strong>{key.toUpperCase()}.</strong> {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Submit Button */}
          <button
            onClick={handleSubmitQuiz}
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg mt-4"
          >
            📝 Submit Quiz
          </button>

          {/* Display Score */}
          {score !== null && (
            <p className="mt-4 text-xl font-semibold text-green-600">
              🎉 You scored {score} / {questions.length}
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">⚠️ No questions available.</p>
      )}
    </div>
  );
};

export default QuizDetails;
