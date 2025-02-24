import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import QuizezArea from "./QuizezArea";
import AnimatedText from "./AnimatedText";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get student ID from URL

  useEffect(() => {
    console.log("Checking authentication...");
    const userRole = localStorage.getItem("userRole");
    const storedID = localStorage.getItem("userID");

    console.log("Stored Role:", userRole);
    console.log("Stored ID:", storedID);
    console.log("URL ID:", id);

    if (!storedID || !userRole || userRole !== "student" || storedID !== id) {
      console.warn("🚨 Unauthorized access. Redirecting to login...");
      navigate("/"); // Redirect to login if not authorized
    }
  }, [navigate, id]);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-white p-8">
        <h1 className="text-3xl font-bold text-center">Welcome 🎉</h1>
        <AnimatedText />
        <QuizezArea studentID={id} />
      </section>
    </>
  );
};

export default StudentDashboard;
