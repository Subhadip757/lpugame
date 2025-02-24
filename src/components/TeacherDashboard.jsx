import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizManagement from "./QuizManagement";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState(
    JSON.parse(localStorage.getItem("tests")) || []
  );
  const [quizDetails, setQuizDetails] = useState({
    quizName: "",
    numQuestions: "",
    password: "",
    negativeMarking: false,
  });
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "teacher") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFileName(selectedFile.name);
    } else {
      alert("⚠️ Please upload a valid Excel file (.xlsx).");
    }
  };

  const handleSubmit = () => {
    const { quizName, numQuestions, password } = quizDetails;
    if (!quizName || !numQuestions || !password || !fileName) {
      alert("⚠️ Please fill all fields before uploading.");
      return;
    }

    const newTest = {
      id: Date.now().toString(),
      quizName,
      numQuestions: parseInt(numQuestions, 10),
      password,
      negativeMarking: quizDetails.negativeMarking,
    };

    const updatedTests = [...tests, newTest];
    setTests(updatedTests);
    localStorage.setItem("tests", JSON.stringify(updatedTests));

    setQuizDetails({
      quizName: "",
      numQuestions: "",
      password: "",
      negativeMarking: false,
    });
    setFileName("");
    alert("✅ Test uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-6 relative">
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
      >
        🚪 Logout
      </button>
      <h1 className="text-4xl font-extrabold text-center mb-6">
        📚 Teacher Dashboard
      </h1>
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create a New Quiz
        </h2>
        <input
          type="text"
          name="quizName"
          placeholder="Quiz Name"
          value={quizDetails.quizName}
          onChange={handleInputChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="number"
          name="numQuestions"
          placeholder="Number of Questions"
          value={quizDetails.numQuestions}
          onChange={handleInputChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Excel File
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded-lg cursor-pointer bg-gray-100"
          />
          {fileName && (
            <p className="mt-2 text-sm text-gray-500">📄 {fileName}</p>
          )}
        </div>
        <input
          type="password"
          name="password"
          placeholder="Set test password"
          value={quizDetails.password}
          onChange={handleInputChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            name="negativeMarking"
            checked={quizDetails.negativeMarking}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-gray-700">Enable Negative Marking</label>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg transition-all duration-300 shadow-md"
        >
          📤 Upload Test
        </button>
      </div>
      <QuizManagement />
    </div>
  );
};

export default TeacherDashboard;
