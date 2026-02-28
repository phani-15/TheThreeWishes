import React, { useState } from "react";
import FlowGame from "../Components/FlowGame";
import Tango from "../Components/Tango";
import HanoiGame from "../Components/TowersOfHanoi";
import Zip from "../Components/Zip";
import Checkmate from "../Components/CheckMate";
import Sudoku from "../Components/Sudoku"
import Slider from "../Components/Slider";
import EightBishops from "../Components/EightBishops";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 3;

const PUZZLE_META = {
  flow: { label: "Flow", icon: "🌊", accent: "bg-sky-400" },
  checkmate: { label: "Checkmate", icon: "♟️", accent: "bg-pink-400" },
  sudoku: { label: "Sudoku", icon: "🔢", accent: "bg-orange-400" },
  bishops: { label: "Bishops", icon: "⛪", accent: "bg-violet-400" },
  tango: { label: "Tango", icon: "🎴", accent: "bg-emerald-400" },
  slider: { label: "Slider", icon: "🧩", accent: "bg-amber-400" },
  zip: { label: "Zip", icon: "⚡", accent: "bg-red-400" },
  hanoi: { label: "Hanoi", icon: "🗼", accent: "bg-blue-400" },
};

const puzzleBlocks = {
  "1-1": "flow",
  "1-2": "sudoku",
  "2-0": "slider",
  "0-1": "bishops",
  "0-2": "checkmate",
  "1-0": "tango",
  "2-1": "zip",
  "2-2": "hanoi",
};

export default function Round2() {
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [completedBlocks, setCompletedBlocks] = useState({});
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [ripple, setRipple] = useState(null);

  const completedCount = Object.keys(completedBlocks).length;
  const totalPuzzles = Object.keys(puzzleBlocks).length;
  const progressPct = Math.round((completedCount / totalPuzzles) * 100);

  // Track the path from 0-0 to 2-2 based on solved puzzles
  const path = ["0-0", ...Object.keys(completedBlocks)];

  // Only allow movement to adjacent tiles that are either solved or have a puzzle to solve
  const isAdjacent = (r, c) => {
    const { row, col } = playerPos;
    return (
      (Math.abs(row - r) === 1 && col === c) ||
      (Math.abs(col - c) === 1 && row === r)
    );
  };

  const handleBlockClick = (r, c) => {
    const key = `${r}-${c}`;
    if (!isAdjacent(r, c)) return;
    const puzzleType = puzzleBlocks[key];

    setRipple(key);
    setTimeout(() => setRipple(null), 400);

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
    const type = activePuzzle.type;
    setCompletedBlocks((prev) => ({ ...prev, [key]: true }));
    const [row, col] = key.split("-").map(Number);
    setPlayerPos({ row, col });
    setActivePuzzle(null);

    if (type === "hanoi") {
      navigate('/win2')
    }
  };

  const navigate = useNavigate()

  const renderPuzzle = () => {
    if (!activePuzzle) return null;
    switch (activePuzzle.type) {
      case "flow":
        return <FlowGame onWin={handleWin} />;
      case "tango":
        return <Tango onWin={handleWin} />;
      case "zip":
        return <Zip onWin={handleWin} />;
      case "hanoi":
        return <HanoiGame onWin={handleWin} />;
      case "checkmate":
        return <Checkmate onWin={handleWin} />;
      case "sudoku":
        return <Sudoku onWin={handleWin} />;
      case "slider":
        return <Slider onWin={handleWin} />;
      case "bishops":
        return <EightBishops onWin={handleWin} />;
      default:
        return null;
    }
  };

  const getTileClasses = (isPlayer, isCompleted, hasPuzzle, inactive) => {
    const base =
      "relative w-36 h-36 flex flex-col items-center justify-center gap-1.5 " +
      "rounded-2xl border cursor-pointer select-none overflow-hidden " +
      "transition-all duration-300";

    if (inactive)
      return `${base} bg-gray-950 border-white/5 opacity-30 cursor-not-allowed`;
    if (isPlayer)
      return (
        `${base} bg-gradient-to-br from-violet-950 to-indigo-950 ` +
        "border-amber-500/50 scale-105 shadow-[0_0_40px_rgba(139,92,246,0.4),0_0_0_1px_rgba(201,168,76,0.3)]"
      );
    if (isCompleted)
      return (
        `${base} bg-gradient-to-br from-emerald-950 to-teal-950 ` +
        "border-emerald-500/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(52,211,153,0.25)] hover:border-emerald-400/60"
      );
    if (hasPuzzle)
      return (
        `${base} bg-gradient-to-br from-gray-900 to-slate-950 ` +
        "border-violet-500/20 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(80,60,180,0.3)] hover:border-violet-400/35"
      );
    return `${base} bg-gray-900 border-white/5 hover:-translate-y-1 hover:bg-gray-800/80 hover:shadow-lg`;
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8e0d0] flex flex-col items-center overflow-hidden pb-16">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(ellipse, #c9a84c 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* ── Header ── */}
        <div className="text-center pt-14 mb-2">
          <p className="text-[11px] tracking-[0.35em] text-amber-500/80 uppercase font-light mb-3">
            Challenge Series
          </p>
          <h1
            className="text-5xl font-black tracking-wide leading-tight"
            style={{
              background:
                "linear-gradient(135deg, #f0d080 0%, #c9a84c 50%, #8a6320 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Georgia, serif",
            }}
          >
            Puzzle Arena
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-4 mx-auto w-64">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="w-1.5 h-1.5 bg-amber-500/70 rotate-45" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-8 w-72 text-center">
          <p className="text-[11px] tracking-[0.2em] text-amber-500/60 uppercase mb-2">
            {completedCount} / {totalPuzzles} Solved
          </p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(201,168,76,0.5)]"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #c9a84c, #f0d080)",
              }}
            />
          </div>
          <div className="flex justify-center gap-2 mt-2.5">
            {Array.from({ length: totalPuzzles }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full border border-amber-500 transition-all duration-500 ${
                  i < completedCount
                    ? "bg-amber-500 shadow-[0_0_6px_rgba(201,168,76,0.7)]"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Puzzle view OR arena map ── */}
        {activePuzzle ? (
          <div className="w-full flex flex-col items-center pt-8">
            <button
              onClick={() => setActivePuzzle(null)}
              className="flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full
                border border-amber-500/20 text-amber-500
                text-xs tracking-[0.15em] uppercase
                hover:bg-amber-500/10 hover:border-amber-500/40
                hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]
                transition-all duration-200"
            >
              ← Back to Arena
            </button>
            <div className="w-full flex justify-center">{renderPuzzle()}</div>
          </div>
        ) : (
          <>
            <div className="mt-14">
              <div className="grid grid-cols-3 gap-5">
                {[...Array(GRID_SIZE)].map((_, r) =>
                  [...Array(GRID_SIZE)].map((_, c) => {
                    const key = `${r}-${c}`;
                    const isPlayer = playerPos.row === r && playerPos.col === c;
                    const isCompleted = completedBlocks[key];
                    const puzzleType = puzzleBlocks[key];
                    const meta = puzzleType ? PUZZLE_META[puzzleType] : null;
                    const adjacent = isAdjacent(r, c);
                    const inactive = !isPlayer && !adjacent;

                    return (
                      <div
                        key={key}
                        className={getTileClasses(
                          isPlayer,
                          isCompleted,
                          !!puzzleType,
                          inactive,
                        )}
                        onClick={() => handleBlockClick(r, c)}
                      >
                        {/* Ripple ring */}
                        {ripple === key && (
                          <div
                            className="absolute inset-0 rounded-2xl border-2 border-amber-400 pointer-events-none"
                            style={{
                              animation: "rippleOut 0.4s ease-out forwards",
                            }}
                          />
                        )}

                        {/* Player corner ornaments */}
                        {isPlayer && (
                          <>
                            <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/60" />
                            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-500/60" />
                            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/60" />
                            <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-500/60" />
                          </>
                        )}

                        {/* Completed badge */}
                        {isCompleted && !isPlayer && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] shadow-[0_0_8px_rgba(52,211,153,0.6)] z-10">
                            ✓
                          </div>
                        )}

                        {/* Icon */}
                        <span className="text-3xl leading-none relative z-10">
                          {isPlayer
                            ? "🧭"
                            : isCompleted
                              ? (meta?.icon ?? "✦")
                              : puzzleType
                                ? "🔒"
                                : "·"}
                        </span>

                        {/* Label */}
                        <span
                          className={`text-[10px] tracking-[0.15em] uppercase font-semibold relative z-10 ${
                            isPlayer
                              ? "text-amber-400/80"
                              : isCompleted
                                ? "text-emerald-400/80"
                                : "text-white/40"
                          }`}
                        >
                          {isPlayer
                            ? "You"
                            : isCompleted
                              ? meta?.label
                              : puzzleType
                                ? meta?.label
                                : `${r},${c}`}
                        </span>

                        {/* Puzzle accent bar */}
                        {meta && (
                          <div
                            className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-t opacity-70 ${
                              isCompleted ? "bg-emerald-400" : meta.accent
                            }`}
                          />
                        )}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            <p className="mt-9 text-[11px] tracking-[0.12em] text-white/20 uppercase text-center">
              Move to adjacent tiles · Solve to unlock
            </p>
          </>
        )}
      </div>

      {/* Single keyframe needed for the ripple animation — not achievable with Tailwind alone */}
      <style>{`@keyframes rippleOut { from { transform:scale(0.85); opacity:0.75; } to { transform:scale(1.2); opacity:0; } }`}</style>
    </div>
  );
}