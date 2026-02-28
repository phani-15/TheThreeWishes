import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Round1WinPage() {
  const [showMap, setShowMap] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // 5 minutes = 300 seconds
  const navigate = useNavigate();

  // Show map after delay
  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setShowMap(true);
    }, 2200);

    // Call API to submit Level 1 time
    const submitLevel1 = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          await api.post("/level1/submit", {
            email,
            score: 5, // Max score based on Level1Quiz having 5 questions
            submissionTime: new Date().toISOString()
          });
        } catch (err) {
          console.error("Failed to submit Level 1 score:", err);
        }
      }
    };
    submitLevel1();

    return () => clearTimeout(revealTimer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/second");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigate]);

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col">

      {/* Royal Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&display=swap"
        rel="stylesheet"
      />

      {/* Blurred Background */}
      <div className="absolute inset-0 bg-[url('/images/Round1bg.jpg')] bg-cover bg-center blur-lg scale-110"></div>
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-20 text-center px-6 flex-grow flex flex-col items-center justify-center">

        <h1
          className="text-3xl md:text-5xl tracking-wide text-yellow-400"
          style={{
            fontFamily: "Cinzel, serif",
            animation: "royalFade 2s ease-out forwards",
          }}
        >
          YOU HAVE WON THE MAP OF AGRABAH FORT
        </h1>

        <p
          className="mt-6 text-lg md:text-xl text-yellow-200"
          style={{
            fontFamily: "Cinzel, serif",
            animation: "royalFade 2.5s ease-out forwards",
          }}
        >
          The treasure path now reveals itself...
        </p>

        {/* Bottom Countdown Timer */}
        {/* Bottom Minimal Timer */}
        <div
          className="absolute bottom-3 left-0 w-full text-center text-sm md:text-base text-red-400 opacity-80"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          Next Level Begins In {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>


        {/* Map Reveal */}
        <div
          className="mt-14"
          style={{
            opacity: showMap ? 1 : 0,
            transform: showMap ? "scale(1)" : "scale(0.6)",
            transition: "all 2.5s ease",
          }}
        >
          <img
            src="/images/Round1Win.png"
            alt="Treasure Map"
            className="mx-auto w-80 md:w-[420px] drop-shadow-[0_0_40px_rgba(255,215,0,0.8)]"
          />
        </div>
      </div>

      {/* Local Animation */}
      <style>
        {`
          @keyframes royalFade {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>



    </div>
  );
}