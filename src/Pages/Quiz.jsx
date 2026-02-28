import React from "react";
import QuizComponent from "../Components/QuizComponent";

const Level1Quiz = () => {

  const questions = [
  {
    question: "Let there are 15 steps to go upstairs. You can climb 1 or 2 steps at a time. If you take a single step it costs only 2 units otherwise it is 3 units. What is the minimum cost to go up ??",
    correctAnswer: "23",
  },
  {
    question: "There is a robot on an 3 x 7 grid. The robot is initially located at the top-left corner and tries to move to the bottom-right corner.The robot can only move either down or right at any point in time.How many number of possible unique paths that the robot can take to reach the bottom-right corner.",
    image :"/images/robot_maze.png",
    correctAnswer: "28",
  },
  {
    question: "You have given a binary-tree image below. What is the maximum root-to-leaf sum of the binary tree?",
    correctAnswer: "27",
    image:"/images/binary_tree.jpg"
  },
  {
    question: "Is 19 a happy number?(yes/no) \n\nA happy number is a number defined as :\nStarting with any positive integer, replace the number by the sum of the squares of its digits.\nRepeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.\nThose numbers for which this process ends in 1 are happy.",
    correctAnswer: "yes",
  },
  {
    question: "Below image representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    correctAnswer: "6",
    image:"/images/water_bars.jpg",
    note:"edges cannot hold water"
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
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
