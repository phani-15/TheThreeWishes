import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Level3WinPage() {
  const navigate = useNavigate();

  // Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/gamewin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // Call API to submit Level 3 score
    const submitLevel3 = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          await api.post("/level3/submit", {
            email,
            score: 1, // Final round score
            submissionTimes: [new Date().toISOString()]
          });
        } catch (err) {
          console.error("Failed to submit Level 3 score:", err);
        }
      }
    };
    submitLevel3();
  }, []);

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center overflow-hidden">

      {/* Background with Slow Zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/treasure_room.jpg')",
          animation: "slowZoom 25s ease-in-out forwards"
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content with Fade In */}
      <div
        className="relative z-10 text-center px-6"
        style={{
          animation: "fadeIn 1.2s ease-out forwards"
        }}
      >
        <h1 className="text-5xl font-bold text-yellow-400 mb-10">
          You Have Won The Key to the treasure room!
        </h1>

        <img
          src="/images/key.png"
          alt="Golden Key"
          className="w-60 mx-auto drop-shadow-2xl mb-8"
        />

        <p className="text-xl text-neutral-300 max-w-xl mx-auto">
          The final key has been revealed.
          Your wisdom has unlocked the last chamber.
        </p>
      </div>

      {/* Local Keyframes */}
      <style>
        {`
          @keyframes slowZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
}