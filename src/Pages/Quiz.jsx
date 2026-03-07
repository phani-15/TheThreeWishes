import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Level1Quiz = () => {

  const [timeLeft, setTimeLeft] = useState(600)
  const navigate = useNavigate()

  const questions = [
    {
      question: "Let there are 15 steps to go upstairs. You can climb 1 or 2 steps at a time. If you take a single step it costs only 2 units otherwise it is 3 units. What is the minimum cost to go up ??",
      correctAnswer: "23",
      options: [
        "30", "28", "23", "48"
      ]
    },
    {
      question: "What is the degree of the array\t [1,3,4,3,2,3,4,2,5,3,4,2,1,3,5,1]",
      correctAnswer: "5",
      options: [
        "1", "4", "3", "5"
      ],
      note: " the Degree of the array is defined as the maximum frequency of any one of its elements."
    },
    {
      question: "Which of the following is an UGLY number ",
      correctAnswer: "48",
      note: "An ugly number is a positive integer which does not have a prime factor other than 2, 3, and 5.",
      options: [
        "95", "51", "84", "48"
      ]
    },
    {
      question: "You have given a binary-tree image below. What is the maximum root-to-leaf sum of the binary tree?",
      correctAnswer: "27",
      image: "/images/binary_tree.jpg",
      options: [
        "25", "26", "27", "28"
      ],
      note: "root is the top most one and leaf is any node from the bottom that has no extension "
    },
    {
      question: "Below image representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      correctAnswer: "6",
      image: "/images/water_bars.jpg",
      note: "edges cannot hold water",
      options: [
        "5", "6", "7", "8"
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState([20, 20, 20, 20, 20])

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    let c = 0;
    let updatedScores = [...scores];
    questions.forEach((q, index) => {
      if (answers[index]) {
        if (
          answers[index].trim().toLowerCase() ===
          q.correctAnswer.trim().toLowerCase()
        ) {
          calculatedScore += updatedScores[index];
        }
        else {
          updatedScores[index] -= 5;
        }
      }
      if (answers[index]) c++;
    });

    setScores(updatedScores)

    setScore(calculatedScore);
    if (c < questions.length) {
      alert("Please answer all the questions");
    } else {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
    else if (score < 80) {
      navigate('/unqualified')
      return
    }
    else {
      const timer = setTimeout(() => {
        navigate("/win1");
      }, 3000);
      return () => clearTimeout(timer);
    }

  }, [timeLeft, navigate]);

  const handleRetry = () => {
    setSubmitted(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (submitted && score === 100) {
      const timer = setTimeout(() => {
        navigate("/win1");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted, score, questions.length, navigate]);

  const correctQuestions = questions.filter(
    (q, index) =>
      answers[index] &&
      answers[index].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
  );

  const wrongQuestions = questions.filter(
    (q, index) =>
      !answers[index] ||
      answers[index].trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase()
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-black to-gray-900 text-white">
      <div className="max-w-6xl mx-auto py-10 px-6">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8 text-center tracking-wide">
          Level 1 Quiz
        </h1>
        <div className="absolute top-5 right-6 text-lg font-bold text-yellow-400">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </div>
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex gap-12 border border-white/10">

          <div className="flex-1">
            {!submitted && (
              <>
                <h2 className="text-2xl font-semibold mb-6">
                  Question {currentIndex + 1} of {questions.length}
                </h2>

                <div className="flex flex-col justify-center items-center gap-5">
                  <div className="w-full text-left">
                    <p className="text-lg mb-6 whitespace-pre-wrap">
                      {questions[currentIndex].question}
                    </p>
                    {questions[currentIndex].note && (
                      <p className="text-left">
                        <b>Note:</b> {questions[currentIndex].note}
                      </p>
                    )}
                  </div>
                  {questions[currentIndex].image && (
                    <img
                      src={questions[currentIndex].image}
                      alt=""
                      className="rounded-2xl w-90"
                    />
                  )}
                  <div className="flex flex-col gap-3 mt-6 w-full">
                    {questions[currentIndex].options.map((option, index) => {
                      const isSelected = answers[currentIndex] === option;

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              [currentIndex]: option,
                            })
                          }
                          className={`flex items-center gap-4 px-5 py-3 rounded-lg border cursor-pointer transition-all duration-200
          
          ${isSelected
                              ? "border-yellow-400 bg-yellow-400/10"
                              : "border-white/20 hover:border-white/40"
                            }
        `}
                        >

                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-md font-semibold text-sm
            ${isSelected
                                ? "bg-yellow-400 text-black"
                                : "bg-white/10 text-white"
                              }
          `}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>

                          <span className="text-base tracking-wide">
                            {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-10 flex justify-between">
                  {currentIndex > 0 ? (
                    <button
                      onClick={goPrevious}
                      className="px-6 py-2 bg-gray-700 rounded-lg cursor-pointer"
                    >
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentIndex === questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg cursor-pointer"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={goNext}
                      className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg cursor-pointer"
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            )}

            {submitted && (
              <div>
                {/* Score Header */}
                <h2 className="text-3xl font-bold mb-2 text-center">
                  Your Score: {score} / 100
                </h2>
                <p className="text-center text-white/50 mb-8">
                  {score === questions.length
                    ? "🎉 Perfect score! Redirecting..."
                    : score >= questions.length / 2
                      ? "Good job! Keep it up."
                      : "Don't give up — try again!"}
                </p>

                {/* Correct Questions */}
                {correctQuestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                      ✅ Correct ({correctQuestions.length})
                    </h3>
                    <div className="space-y-2">
                      {correctQuestions.map((q, i) => {
                        const originalIndex = questions.indexOf(q);
                        return (
                          <div
                            key={i}
                            className="bg-green-500/10 border border-green-500/30 px-4 py-3 rounded-xl"
                          >
                            <p className="font-medium">
                              Q{originalIndex + 1}: {q.question}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Wrong Questions */}
                {wrongQuestions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                      ❌ Wrong ({wrongQuestions.length})
                    </h3>
                    <div className="space-y-2">
                      {wrongQuestions.map((q, i) => {
                        const originalIndex = questions.indexOf(q);
                        return (
                          <div
                            key={i}
                            className="bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl"
                          >
                            <p className="font-medium">
                              Q{originalIndex + 1}: {q.question}
                            </p>
                            <p className="text-sm text-white/50 mt-1">
                              Your answer:{" "}
                              <span className="text-red-300">
                                {answers[originalIndex] || "Not answered"}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer font-semibold"
                  >
                    🔄 Retry
                  </button>
                  <button
                    onClick={() =>{
                      if(score >= 80)
                      navigate("/win1")
                      }}
                    className={`px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg ${score<80 ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Question Numbers */}
          {!submitted && (
            <div className="w-28 flex flex-col items-center gap-5">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-12 cursor-pointer rounded-full font-semibold transition-all
                ${answers[index] ? "bg-green-500" : "bg-gray-700"}
                ${currentIndex === index ? "ring-2 ring-yellow-400" : ""}
              `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level1Quiz;
