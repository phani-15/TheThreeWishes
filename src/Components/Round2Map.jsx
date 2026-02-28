import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlowGame from "../components/FlowGame";
import Tango from "../components/Tango";
import HanoiGame from "../components/TowersOfHanoi";
import Zip from "../components/Zip";
import BlurBackground from "../Components/BlurBackground";

const GRID_SIZE = 3;

export default function Round2Map() {
  const navigate = useNavigate();

  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [completedBlocks, setCompletedBlocks] = useState({});
  const [activePuzzle, setActivePuzzle] = useState(null);

  const puzzleBlocks = {
    "0-1": "flow",
    "1-1": "tango",
    "2-1": "zip",
    "2-2": "hanoi",
  };

  // 🔥 Check if all puzzles completed
  useEffect(() => {
    const totalPuzzles = Object.keys(puzzleBlocks).length;
    const solvedPuzzles = Object.keys(completedBlocks).length;

    if (solvedPuzzles === totalPuzzles && totalPuzzles > 0) {
      setTimeout(() => {
        navigate("/win2");
      }, 1500); // small victory pause
    }
  }, [completedBlocks, navigate]);

  const isAdjacent = (r, c) => {
    const { row, col } = playerPos;
    return (
      (Math.abs(row - r) === 1 && col === c) ||
      (Math.abs(col - c) === 1 && row === r)
    );
  };

  const handleBlockClick = (r, c) => {
    if (!isAdjacent(r, c)) return;

    const key = `${r}-${c}`;
    const puzzleType = puzzleBlocks[key];

    if (!puzzleType) {
      setPlayerPos({ row: r, col: c });
      return;
    }

    if (!completedBlocks[key]) {
      setActivePuzzle({ key, type: puzzleType });
    } else {
      setPlayerPos({ row: r, col: c });
    }
  };

  const handleWin = () => {
    if (!activePuzzle) return;

    const key = activePuzzle.key;

    setCompletedBlocks((prev) => ({
      ...prev,
      [key]: true,
    }));

    const [row, col] = key.split("-").map(Number);

    setPlayerPos({ row, col });
    setActivePuzzle(null);
  };

  // Puzzle Screen
  if (activePuzzle) {
    switch (activePuzzle.type) {
      case "flow":
        return <FlowGame onWin={handleWin} />;
      case "tango":
        return <Tango onWin={handleWin} />;
      case "zip":
        return <Zip onWin={handleWin} />;
      case "hanoi":
        return <HanoiGame onWin={handleWin} />;
      default:
        return null;
    }
  }

  // Map Screen
  return (
    <div className="relative min-h-screen overflow-hidden text-white flex items-center justify-center">

      {/* Background */}
      <BlurBackground image="/images/Round2bg.jpg" blur="blur-sm" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center">

        <h1 className="text-3xl font-bold mb-10 tracking-wide">
          Round 2 – Puzzle Arena
        </h1>

        <div className="grid grid-cols-3 gap-8">
          {[...Array(GRID_SIZE)].map((_, r) =>
            [...Array(GRID_SIZE)].map((_, c) => {
              const key = `${r}-${c}`;
              const isPlayer = playerPos.row === r && playerPos.col === c;
              const isCompleted = completedBlocks[key];
              const hasPuzzle = puzzleBlocks[key];

              return (
                <div
                  key={key}
                  onClick={() => handleBlockClick(r, c)}
                  className={`w-32 h-32 flex items-center justify-center 
                    rounded-2xl border text-xl font-semibold
                    transition-all duration-300 cursor-pointer
                    ${
                      isPlayer
                        ? "bg-purple-600 shadow-lg scale-105"
                        : isCompleted
                        ? "bg-green-600"
                        : hasPuzzle
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {isPlayer && "🧍"}
                  {!isPlayer && isCompleted && "✔"}
                  {!isPlayer && hasPuzzle && !isCompleted && "🔒"}
                </div>
              );
            })
          )}
        </div>

        <p className="mt-8 text-gray-300 text-sm text-center max-w-md">
          Move only to adjacent blocks (no diagonal).
          Solve puzzles to unlock those blocks.
        </p>

      </div>
    </div>
  );
}