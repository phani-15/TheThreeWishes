import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Round2Win() {
  const navigate = useNavigate();
  const eventTime = new Date("2026-02-27T16:29:59");

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = eventTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());
  const [isEventStarted, setIsEventStarted] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      if (
        updatedTime.days === 0 &&
        updatedTime.hours === 0 &&
        updatedTime.minutes === 0 &&
        updatedTime.seconds === 0
      ) {
        setIsEventStarted(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Call API to submit Level 2 score
    const submitLevel2 = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          await api.post("/level2/submit", {
            email,
            score: 100, // Fixed score or dynamic if needed
            submissionTime: new Date().toISOString()
          });
        } catch (err) {
          console.error("Failed to submit Level 2 score:", err);
        }
      }
    };
    submitLevel2();
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[url('/images/Round2bg.jpg')] bg-cover bg-center overflow-hidden">

      {/* Blur + Dark Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        {/* Title */}
        <h1 className="
  font-cinzel
  text-4xl md:text-6xl
 font-medium tracking-wide
  tracking-widest
  bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700
  text-transparent bg-clip-text
  drop-shadow-[0_0_25px_rgba(255,215,0,0.9)]
  mb-8
  animate-fadeIn
">
          Bravo!! You did well. Here take this Magical potion to turn invisible

        </h1>

        {/* Potion Image */}
        <img
          src="/images/Round2Win.png"
          alt="Magical Potion"
          className="w-48 md:w-60 mx-auto mb-8 drop-shadow-[0_0_40px_gold] animate-pulse"
        />

        {/* Timer */}
        {isEventStarted ?
          <button
            onClick={() => navigate("/third")}
            className="px-10 py-4 rounded-full font-semibold tracking-[0.15em] uppercase text-sm text-black
              shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:shadow-[0_0_50px_rgba(201,168,76,0.6)]
              hover:scale-105 transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #f0d080 0%, #c9a84c 100%)" }}
          >
            Continue
          </button>
          :
          <p className="text-lg md:text-xl text-yellow-200 font-semibold tracking-wide">
            The Next Round Begins In{" "}
            <span className="text-white text-2xl font-bold">
              {timeLeft.hours}
            </span>{" "}
            hours...<span className="text-white text-2xl font-bold">
              {timeLeft.minutes}
            </span>{" "}
            minutes
            <span className="text-white text-2xl font-bold">
              {timeLeft.seconds}
            </span>{" "}
            Seconds...
          </p>
        }

      </div>
    </div>
  );
}