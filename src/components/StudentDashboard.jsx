import React from "react";
import Navbar from "./Navbar";
import QuizezArea from "./QuizezArea";
import AnimatedText from "./AnimatedText"; // <-- Import the new component

const StudentDashboard = () => {
  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-white p-8">
        <AnimatedText /> {/* <-- Use it here */}
        <QuizezArea />
      </section>
    </>
  );
};

export default StudentDashboard;
