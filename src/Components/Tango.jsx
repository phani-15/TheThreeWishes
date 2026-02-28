import React, { useState, useEffect, useRef, useMemo } from "react";

const size = 6;

const initialCells = [
  ["", "", "", "", "", ""],
  ["", "", "", "", "X", ""],
  ["", "", "", "X", "", "O"],
  ["", "", "", "X", "", "X"],
  ["", "", "", "", "O", ""],
  ["", "", "", "", "", ""],
];

const horizontal = [
  ["", "", "×", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "=", "", ""],
];

const vertical = [
  ["", "×", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "×", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "×", "", "", "", ""],
];

export default function Tango({ onWin }) {
  const [cells, setCells] = useState(initialCells);

  const [invalidRows, setInvalidRows] = useState([]);
  const [invalidCols, setInvalidCols] = useState([]);

  const timeoutRef = useRef(null);

  const toggleCell = (r, c) => {
    if (initialCells[r][c] !== "") return;

    const updated = cells.map(row => [...row]);

    if (updated[r][c] === "") updated[r][c] = "X";
    else if (updated[r][c] === "X") updated[r][c] = "O";
    else updated[r][c] = "";

    setCells(updated);
  };

  // ===== VALIDATION LOGIC =====

  const validateBoard = () => {
    const badRows = new Set();
    const badCols = new Set();

    // Equal count + consecutive check
    for (let i = 0; i < size; i++) {
      const row = cells[i];
      const col = cells.map(r => r[i]);

      const rowX = row.filter(v => v === "X").length;
      const rowO = row.filter(v => v === "O").length;
      const colX = col.filter(v => v === "X").length;
      const colO = col.filter(v => v === "O").length;

      if (rowX > 3 || rowO > 3) badRows.add(i);
      if (colX > 3 || colO > 3) badCols.add(i);

      for (let j = 0; j < size - 2; j++) {
        if (row[j] && row[j] === row[j+1] && row[j] === row[j+2]) {
          badRows.add(i);
        }
        if (col[j] && col[j] === col[j+1] && col[j] === col[j+2]) {
          badCols.add(i);
        }
      }
    }

    // Horizontal constraints
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size - 1; c++) {
        const symbol = horizontal[r][c];
        if (!symbol) continue;

        const a = cells[r][c];
        const b = cells[r][c+1];
        if (!a || !b) continue;

        if (symbol === "=" && a !== b) badRows.add(r);
        if (symbol === "×" && a === b) badRows.add(r);
      }
    }

    // Vertical constraints
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size; c++) {
        const symbol = vertical[r][c];
        if (!symbol) continue;

        const a = cells[r][c];
        const b = cells[r+1][c];
        if (!a || !b) continue;

        if (symbol === "=" && a !== b) badCols.add(c);
        if (symbol === "×" && a === b) badCols.add(c);
      }
    }

    setInvalidRows([...badRows]);
    setInvalidCols([...badCols]);
  };

  // ===== DELAYED VALIDATION (2 seconds after last move) =====

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      validateBoard();
    }, 500);

    return () => clearTimeout(timeoutRef.current);
  }, [cells]);

  // ===== COMPLETE CHECK =====

const isComplete = useMemo(() => {
  const filled = cells.every(row => row.every(cell => cell !== ""));
  return (
    filled &&
    invalidRows.length === 0 &&
    invalidCols.length === 0
  );
}, [cells, invalidRows, invalidCols]);

// 👇 ADD THIS RIGHT HERE
useEffect(() => {
  if (isComplete) {
    onWin && onWin();
  }
}, [isComplete]);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center text-gray-200">

    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-10 max-w-5xl">

      {/* ===== TITLE ===== */}
      <h1 className="text-3xl font-bold text-center mb-6 tracking-wide text-indigo-400">
        Tango 6×6
      </h1>

      {/* ===== OBJECTIVE & RULES ===== */}
      <div className="mb-8 text-gray-400 text-sm space-y-4 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">

        <div>
          <h2 className="text-indigo-300 font-semibold mb-2">Objective</h2>
          <p>
            Fill the grid using only <span className="text-indigo-400 font-semibold">X</span> and 
            <span className="text-pink-400 font-semibold"> O</span> so that all rules are satisfied.
          </p>
        </div>

        <div>
          <h2 className="text-indigo-300 font-semibold mb-2">Rules</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Each row must contain exactly 3 X’s and 3 O’s.</li>
            <li>Each column must contain exactly 3 X’s and 3 O’s.</li>
            <li>No more than two identical symbols can appear consecutively (no XXX or OOO).</li>
            <li>Cells connected by <span className="font-semibold">=</span> must contain the same symbol.</li>
            <li>Cells connected by <span className="font-semibold">×</span> must contain different symbols.</li>
          </ul>
        </div>

        <p className="text-gray-500">
          Click a cell to cycle between X → O → empty.
        </p>
      </div>

      {/* ===== BOARD ===== */}
      <div className="flex flex-col gap-3">

        {cells.map((row, r) => (
          <div key={r} className="flex flex-col gap-3">

            <div className="flex items-center gap-3">
              {row.map((cell, c) => (
                <React.Fragment key={c}>
                  <div
                    onClick={() => toggleCell(r, c)}
                    className={`w-14 h-14 flex items-center justify-center
                      rounded-xl font-semibold text-lg transition-all duration-200
                      ${
                        invalidRows.includes(r) || invalidCols.includes(c)
                          ? "bg-red-900/60 border border-red-500 text-red-300"
                          : initialCells[r][c]
                          ? "bg-gray-800 border border-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gray-800 border border-gray-700 hover:border-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.6)] cursor-pointer"
                      }`}
                  >
                    {cell === "X" && (
                      <span className="text-indigo-400 font-bold">X</span>
                    )}
                    {cell === "O" && (
                      <span className="text-pink-400 font-bold">O</span>
                    )}
                  </div>

                  {c < size - 1 && (
                    <div className="w-6 text-center text-gray-500 font-bold text-sm">
                      {horizontal[r][c]}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {r < size - 1 && (
              <div className="flex items-center gap-3">
                {vertical[r].map((symbol, c) => (
                  <React.Fragment key={c}>
                    <div className="w-14 text-center text-gray-500 font-bold text-sm">
                      {symbol}
                    </div>
                    {c < size - 1 && <div className="w-6"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

          </div>
        ))}

      </div>

      {/* ===== SUCCESS MESSAGE ===== */}
      {isComplete && (
        <div className="mt-8 text-center text-green-400 font-semibold text-lg animate-pulse">
          🎉 Puzzle Completed!
        </div>
      )}

    </div>
  </div>
);
}