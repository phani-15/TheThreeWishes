import React, { useState, useEffect, useCallback } from "react";

const EightBishops = ({ onWin}) => {
  const [bishops, setBishops] = useState([]); // Array of {r, c}
  const [coveredSquares, setCoveredSquares] = useState(new Set());
  const [isSolved, setIsSolved] = useState(false);

  const boardSize = 8;

  const calculateCoverage = useCallback((currentBishops) => {
    const covered = new Set();

    currentBishops.forEach((bishop) => {
      // A bishop covers its own square
      covered.add(`${bishop.r}-${bishop.c}`);

      // Directions: Top-Left, Top-Right, Bottom-Left, Bottom-Right
      const directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];

      directions.forEach(([dr, dc]) => {
        let nr = bishop.r + dr;
        let nc = bishop.c + dc;
        while (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
          covered.add(`${nr}-${nc}`);
          nr += dr;
          nc += dc;
        }
      });
    });

    setCoveredSquares(covered);
    // Solved if all 64 squares are covered and we used exactly 8 bishops
    if (covered.size === 64 && currentBishops.length <= 8) {
      setIsSolved(true);
      onWin()
    } else {
      setIsSolved(false);
    }
  }, []);

  const toggleBishop = (r, c) => {
    if (isSolved) return;
    const exists = bishops.find((b) => b.r === r && b.c === c);
    let newBishops;
    if (exists) {
      newBishops = bishops.filter((b) => !(b.r === r && b.c === c));
    } else {
      if (bishops.length >= 8) return; // Limit to 8 for the challenge
      newBishops = [...bishops, { r, c }];
    }
    setBishops(newBishops);
    calculateCoverage(newBishops);
  };

  const renderBoard = () => {
    const rows = [];
    for (let r = 0; r < boardSize; r++) {
      const cols = [];
      for (let c = 0; c < boardSize; c++) {
        const isBlack = (r + c) % 2 === 1;
        const hasBishop = bishops.some((b) => b.r === r && b.c === c);
        const isCovered = coveredSquares.has(`${r}-${c}`);

        cols.push(
          <div
            key={`${r}-${c}`}
            onClick={() => toggleBishop(r, c)}
            className={`
              relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center cursor-pointer
              transition-colors duration-200 border border-gray-700/30
              ${isBlack ? "bg-slate-700" : "bg-slate-500"}
              ${isCovered && !hasBishop ? 'after:content-[""] after:absolute after:inset-0 after:bg-red-500/20' : ""}
              ${hasBishop ? "bg-green-500 ring-2 ring-inset ring-white" : ""}
              hover:opacity-80
            `}
          >
            {hasBishop && (
              <span className="text-2xl md:text-3xl drop-shadow-md">♗</span>
            )}
            {!isCovered && !hasBishop && (
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full opacity-40"></div>
            )}
          </div>,
        );
      }
      rows.push(
        <div key={r} className="flex">
          {cols}
        </div>,
      );
    }
    return rows;
  };

  return (
    <div className=" text-white">
      <div className="w-full bg-slate-800 p-8 rounded-3xl shadow-2xl border my-5 border-slate-700">
        <h1 className="text-3xl font-black text-center font-serif  tracking-tighter my-5 text-blue-400">
          {" "}
          BISHOP OVERLAY
        </h1>

        <div className="flex justify-center mb-6 gap-20">
          <div className="mb-6 bg-slate-900 p-4 rounded-xl border-l-4 border-blue-500 text-sm  min-w-[25vw]">
            <p className="font-bold text-blue-200 mb-2 underline">
              SECURITY PROTOCOL:
            </p>
            <ul className="list-disc ml-5 space-y-1 text-slate-400">
              <li>
                Deploy exactly{" "}
                <span className="text-white font-bold">8 Bishops</span>.
              </li>
              <li>
                Every square on the grid must be{" "}
                <span className="text-red-400 italic">attacked</span> or
                occupied.
              </li>
              <li>No two bishops should be attacked</li>
              <li>
                Status:{" "}
                <span className="text-white">{coveredSquares.size} / 64</span>{" "}
                squares covered.
              </li>
              <li>
                Current Units:{" "}
                <span className="text-white">{bishops.length} / 8</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="inline-block border-8 border-slate-900 rounded-lg shadow-inner overflow-hidden">
              {renderBoard()}
            </div>
          </div>
        </div>

        {isSolved && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-xl text-center">
            <p className="text-green-400 font-bold animate-pulse text-lg">
              SYSTEM OVERRIDE SUCCESSFUL: ENTIRE BOARD COVERED
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setBishops([]);
              setCoveredSquares(new Set());
              setIsSolved(false);
            }}
            className="mt-8 w-[50%] py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            Reset Grid
          </button>
        </div>
      </div>
    </div>
  );
};

export default EightBishops;
