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

    if (selectedFile) {
      setFile(selectedFile); // ✅ Set file in state
      setFileName(selectedFile.name); // ✅ Set file name for UI

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("🛠️ Raw Parsed Data:", rawData); // Debugging step

        if (rawData.length > 1) {
          const quizTitle = rawData[0][0]; // Extract quiz title from A1
          const parsedQuestions = rawData
            .slice(1)
            .map((row, index) => {
              if (row.length < 7) return null; // Ensure full row

              return {
                id: index + 1,
                question: row[1], // Column B
                options: {
                  a: row[2], // Column C
                  b: row[3], // Column D
                  c: row[4], // Column E
                  d: row[5], // Column F
                },
                correctAnswer: row[6].trim().toLowerCase(), // Column G
              };
            })
            .filter(Boolean);

          console.log("✅ Formatted Questions:", parsedQuestions);

          if (parsedQuestions.length > 0) {
            localStorage.setItem(
              `quizData_${quizTitle}`,
              JSON.stringify(parsedQuestions)
            );
            alert(`✅ Quiz "${quizTitle}" uploaded successfully!`);
          } else {
            alert("⚠️ No valid questions found.");
          }
        } else {
          alert("⚠️ Invalid file format.");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
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
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (parsedData.length < numQuestions) {
        alert("⚠️ The uploaded file contains fewer questions than specified.");
        return;
      }

      const newTest = {
        id: Date.now().toString(),
        quizName,
        numQuestions: parseInt(numQuestions, 10),
        password,
        negativeMarking,
        questions: parsedData.slice(0, numQuestions),
      };

      const updatedTests = [...tests, newTest];
      setTests(updatedTests);
      localStorage.setItem("tests", JSON.stringify(updatedTests));

      // ✅ Store questions separately with an identifiable key
      localStorage.setItem(
        `quizData_${newTest.id}`,
        JSON.stringify(newTest.questions)
      );

      setQuizDetails({
        quizName: "",
        numQuestions: "",
        password: "",
        negativeMarking: false,
      });
      setFile(null);
      setFileName("");

      alert("✅ Test uploaded successfully!");
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-6 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
      >
        🚪 Logout
      </button>

      <h1 className="text-4xl font-extrabold text-center mb-6">
        📚 Teacher Dashboard
      </h1>

      {/* Test Upload Section */}
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

        {/* File Upload */}
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

      {/* Uploaded Tests Section */}
      <QuizManagement />
    </div>
  );
};

export default TeacherDashboard;
