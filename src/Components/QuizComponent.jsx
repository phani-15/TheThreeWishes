import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuizComponent = ({ questions }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState([20,20,20,20,20])

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentIndex]: e.target.value,
    });
  };

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
      if ( answers[index] ){
        if(
        answers[index].trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
      ) {
        calculatedScore += updatedScores[index];
      }
      else{
        updatedScores[index] -= 5;
        setScores(updatedScores)
      }}
      if (answers[index]) c++;
    });

    setScore(calculatedScore);
    if (c < questions.length) {
      alert("Please answer all the questions");
    } else {
      setSubmitted(true);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (submitted && score === questions.length) {
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
                onClick={() => navigate("/win1")}
                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg cursor-pointer"
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
  );
};

export default QuizComponent;