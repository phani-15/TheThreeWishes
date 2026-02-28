import React from "react";
import QuizComponent from "../Components/QuizComponent";

const Level1Quiz = () => {

  const questions = [
    {
      question: "1+1?",
      correctAnswer: "2",
    },
    {
      question: "1+1",
      correctAnswer: "2",
    },
    {
      question: "1?",
      correctAnswer: "1",
    },
    {
      question: "0.",
      correctAnswer: "0",
    },
    {
      question: "5?",
      correctAnswer: "5",
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
      <div
  className="absolute inset-0 bg-cover bg-center blur-[2px] scale-110"
  style={{
    backgroundImage: "url('/images/Round1bg.jpg')"
  }}
></div>

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto py-10 px-6 text-white">

        <h1 className="text-4xl font-bold mb-8 text-center tracking-wide">
          Level 1 Quiz
        </h1>

        <QuizComponent questions={questions} />

      </div>
    </div>
  );
};

export default Level1Quiz;