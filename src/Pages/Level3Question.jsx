import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogicGrid from "../Components/LogicGrid";
import { useEffect } from "react";

export default function Round3Page() {
  const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(900)

  // Reduced to 4 guardians (easier)
  const guardians = [
    "Desert Nomad",
    "Palace Scholar",
    "Royal Guard",
    "Street Magician",
  ];

  const clues = [
    "The Desert Nomad lives in the Crimson chamber.",
    "The Palace Scholar lives in the Ivory chamber.",
    "Oasis Water is served in the Crimson chamber.",
    "The Royal Guard lives in the Jade chamber.",
    "The Royal Guard keeps the Golden Camel.",
    "The Palace Scholar keeps the White Tiger.",
    "The Desert Nomad keeps the Desert Hawk.",
    "The guardian in the Sapphire chamber drinks Pomegranate Juice.",
    "The guardian in the Jade chamber drinks Spiced Coffee.",
  ];

  const [camelAnswer, setCamelAnswer] = useState("");
  const [waterAnswer, setWaterAnswer] = useState("");
  const [result, setResult] = useState("");
  const [locked, setLocked] = useState(false);
  const [wrongs, setWrongs] = useState(0);

  const checkAnswer = () => {
    if (locked) return;

    // Correct Answer (Easier Version)
    if (
      camelAnswer === "Royal Guard" &&
      waterAnswer === "Desert Nomad"
    ) {
      setLocked(true);

      setTimeout(() => {
        navigate("/win");
      }, 700);
    } else {
      const newWrongs = wrongs + 1;
      setWrongs(newWrongs);

      if (newWrongs >= 5) {
        setLocked(true);
        setResult("❌ Incorrect. The final wish is lost.");
      } else {
        setResult("Incorrect. Try again.");
      }
    }
  };

      useEffect(() => {
        if (timeLeft > 0) {
          const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
          }, 1000);
    
          return () => clearInterval(interval);
        }
        else {
          navigate('/unqualified')
          return
        }
    
      }, [timeLeft, navigate]);

  return (
    <div className="relative min-h-screen text-white">
      
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
        style={{ backgroundImage: "url('/images/treasure_room.jpg')" }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Page Content */}
      <div className="relative z-10 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 tracking-wide">
            Round 3: The Final Wish
          </h1>
        </div>

        {/* INTRO */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8 border border-yellow-500/30">
          <p className="text-lg leading-relaxed">
            Four magical chambers stand before you. Each chamber holds a unique
            guardian, artifact, drink and companion.
            <br />
            <span className="text-yellow-400 font-semibold">
              Discover who guards the Golden Camel and who drinks Oasis Water.
            </span>
          </p>
        </div>
        <div className="absolute top-5 right-6 text-lg font-bold text-yellow-400">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </div>

        {/* CLUES */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8 max-h-96 overflow-y-auto border border-yellow-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
            Clues
          </h2>

          <ol className="space-y-3 list-decimal list-inside">
            {clues.map((clue, index) => (
              <li key={index}>{clue}</li>
            ))}
          </ol>
        </div>

        {/* LOGIC GRID */}
        <LogicGrid />

        {/* FINAL ANSWER */}
        <div className="mt-8 bg-white/10 p-6 rounded-2xl border border-yellow-500/30">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4">
            Final Answer (5 Attempts Only)
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              disabled={locked}
              value={camelAnswer}
              onChange={(e) => {
                setCamelAnswer(e.target.value);
                setResult("");
              }}
              className="bg-black/50 p-3 rounded-lg border border-yellow-500"
            >
              <option value="">Who guards the Golden Camel?</option>
              {guardians.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              disabled={locked}
              value={waterAnswer}
              onChange={(e) => {
                setWaterAnswer(e.target.value);
                setResult("");
              }}
              className="bg-black/50 p-3 rounded-lg border border-yellow-500"
            >
              <option value="">Who drinks Oasis Water?</option>
              {guardians.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={locked}
            onClick={checkAnswer}
            className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            Make Your Final Wish
          </button>

          {result && (
            <p className="mt-4 text-lg font-semibold text-center">
              {result}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}