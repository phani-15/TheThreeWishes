import React from "react";
import QuizComponent from "../Components/QuizComponent";

const Level1Quiz = () => {

  const questions = [
  {
    question: "Let there are 15 steps to go upstairs. You can climb 1 or 2 steps at a time. If you take a single step it costs only 2 units otherwise it is 3 units. What is the minimum cost to go up ??",
    correctAnswer: "23",
    options : [
      "30","28","23","48"
    ]
  },
  {
    question: "What is the degree of the array\t [1,3,4,3,2,3,4,2,5,3,4,2,1,3,5,1]",
    correctAnswer: "5",
    options : [
      "1","4","3","5"
    ],
    note :" the Degree of the array is defined as the maximum frequency of any one of its elements."
  },
  {
    question: "Which of the following is an UGLY number ",
    correctAnswer: "48",
    note:"An ugly number is a positive integer which does not have a prime factor other than 2, 3, and 5.",
    options: [
      "95","51","84","48"
    ]
  },
  {
    question: "You have given a binary-tree image below. What is the maximum root-to-leaf sum of the binary tree?",
    correctAnswer: "27",
    image:"/images/binary_tree.jpg",
    options:[
      "25","26","27","28"
    ],
    note:"root is the top most one and leaf is any node from the bottom that has no extension "
  },
  {
    question: "Below image representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    correctAnswer: "6",
    image:"/images/water_bars.jpg",
    note:"edges cannot hold water",
    options:[
      "6","16","26","36"
    ]
  }
];


  return (
    <div className="min-h-screen bg-linear-to-br from-black to-gray-900 text-white">
      <div className="max-w-6xl mx-auto py-10 px-6">
        
        {/* Title */}
        <h1 className="text-4xl font-bold mb-8 text-center tracking-wide">
          Level 1 Quiz
        </h1>

        <QuizComponent questions={questions} />
      </div>
    </div>
  );
};

export default Level1Quiz;
