import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
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
  const [file, setFile] = useState(null);
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
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmit = () => {
    const { quizName, numQuestions, password, negativeMarking } = quizDetails;

    if (!file || !quizName || !numQuestions || !password) {
      alert("⚠️ Please fill all fields before uploading.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rawData.length < 2) {
        alert("⚠️ Invalid file format. Ensure the correct structure.");
        return;
      }

      const parsedQuestions = rawData
        .slice(1)
        .map((row, index) => {
          if (row.length < 7) return null;
          return {
            id: index + 1,
            question: row[1],
            options: {
              a: row[2],
              b: row[3],
              c: row[4],
              d: row[5],
            },
            correctAnswer: row[6].trim().toLowerCase(),
          };
        })
        .filter(Boolean);

      if (parsedQuestions.length < numQuestions) {
        alert("⚠️ The uploaded file contains fewer questions than specified.");
        return;
      }

      const newTest = {
        id: Date.now().toString(),
        quizName,
        numQuestions: parseInt(numQuestions, 10),
        password,
        negativeMarking,
        questions: parsedQuestions.slice(0, numQuestions),
      };

      const updatedTests = [...tests, newTest];
      setTests(updatedTests);
      localStorage.setItem("tests", JSON.stringify(updatedTests));
      localStorage.setItem(
        `quizData_${newTest.id}`,
        JSON.stringify(newTest.questions)
      );
      alert(`✅ Quiz "${quizName}" uploaded successfully!`);

      setQuizDetails({
        quizName: "",
        numQuestions: "",
        password: "",
        negativeMarking: false,
      });
      setFile(null);
      setFileName("");
    };
    reader.readAsArrayBuffer(file);
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
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="numQuestions"
          placeholder="Number of Questions"
          value={quizDetails.numQuestions}
          onChange={handleInputChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
