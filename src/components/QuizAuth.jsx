import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizManagement from "./QuizManagement";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [quizDetails, setQuizDetails] = useState({
    quizName: "",
    numQuestions: "",
    password: "",
    negativeMarking: false,
  });
  const [fileName, setFileName] = useState("");

  // ✅ Load tests once, avoiding repeated reads from localStorage
  useEffect(() => {
    const savedTests = localStorage.getItem("tests");
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    }
  }, []);

  // ✅ Redirect users if they are not teachers (Prevent unnecessary redirects)
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "teacher") {
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [navigate]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // ✅ Handle input change for quiz details
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Fix: Handle file upload correctly
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Generate a unique file name (storing only metadata)
    const newFileName = `exams/${Date.now()}_${selectedFile.name}`;
    setFileName(newFileName);
  };

  // ✅ Optimized quiz submission
  const handleSubmit = () => {
    if (
      !fileName ||
      !quizDetails.quizName ||
      !quizDetails.numQuestions ||
      !quizDetails.password
    ) {
      alert("⚠️ Please fill all fields before uploading.");
      return;
    }

    const newTest = {
      id: Date.now().toString(),
      ...quizDetails,
      filePath: fileName, // ✅ Store only file name, not actual file
      numQuestions: parseInt(quizDetails.numQuestions, 10),
    };

    const updatedTests = [...tests, newTest];

    try {
      localStorage.setItem("tests", JSON.stringify(updatedTests));
      setTests(updatedTests);
      alert(`✅ Quiz "${quizDetails.quizName}" uploaded successfully!`);

      // ✅ Reset state
      setQuizDetails({
        quizName: "",
        numQuestions: "",
        password: "",
        negativeMarking: false,
      });
      setFileName("");
    } catch (error) {
      alert("❌ Error saving quiz. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6">
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        🚪 Logout
      </button>

      <h1 className="text-4xl font-bold text-center mb-6">
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
          className="w-full mb-3 p-3 border rounded-lg"
        />
        <input
          type="number"
          name="numQuestions"
          placeholder="Number of Questions"
          value={quizDetails.numQuestions}
          onChange={handleInputChange}
          className="w-full mb-3 p-3 border rounded-lg"
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
          className="w-full mb-3 p-3 border rounded-lg"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all duration-300 shadow-md"
        >
          📤 Upload Test
        </button>
      </div>

      <QuizManagement />
    </div>
  );
};

export default TeacherDashboard;
