import React, { useState } from "react";
import * as XLSX from "xlsx";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Read Excel File
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setQuestions(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle Option Selection
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Handle Next Question
  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].CorrectAnswer) {
      setScore(score + 1);
    }

    setSelectedOption("");
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setIsFinished(true);
    }
  };

  // Restart Quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz App</h1>

      {questions.length === 0 ? (
        <div>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="mb-4 p-2 border rounded-md"
          />
          <p className="text-gray-600">Upload a quiz Excel file to start.</p>
        </div>
      ) : isFinished ? (
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Quiz Finished!</h2>
          <p className="text-xl">
            Your Score: {score} / {questions.length}
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl font-semibold mb-4">
            {questions[currentQuestion].QuestionText}
          </h2>

          <div className="space-y-2">
            {["OptionA", "OptionB", "OptionC", "OptionD"].map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name="option"
                  value={questions[currentQuestion][opt]}
                  checked={selectedOption === questions[currentQuestion][opt]}
                  onChange={() =>
                    handleOptionChange(questions[currentQuestion][opt])
                  }
                  className="mr-2"
                />
                {questions[currentQuestion][opt]}
              </label>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
            disabled={!selectedOption}
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
