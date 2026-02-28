import React, { useState, useRef,useEffect } from "react";

const GRID_SIZE = 7;
const CELL_SIZE = 70;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const numberPositions = {
  1: [5, 5],
  2: [4, 4],
  3: [3, 2],
  4: [5, 4],
  5: [3, 5],
  6: [3, 4],
  7: [2, 2],
  8: [3, 1],
  9: [1, 2],
  10: [1, 1],
};

export default function Zip({ onWin }) {
  const [path, setPath] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState(null);
  const [status, setStatus] = useState("playing");

  const boardRef = useRef();

  const isAdjacent = (r1, c1, r2, c2) =>
    (Math.abs(r1 - r2) === 1 && c1 === c2) ||
    (Math.abs(c1 - c2) === 1 && r1 === r2);

  const getNumberAt = (row, col) => {
    for (let num in numberPositions) {
      const [r, c] = numberPositions[num];
      if (r === row && c === col) return Number(num);
    }
    return null;
  };

  const getCellFromMouse = (e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    return { row, col, x, y };
  };

  const stopDragging = () => {
    setIsDragging(false);
    setMousePos(null);
  };

  const handleMouseDown = (e) => {
    if (status !== "playing") return;

    const { row, col } = getCellFromMouse(e);
    const last = path[path.length - 1];
    const [sr, sc] = numberPositions[1];

    // Start new game only from 1
    if (path.length === 0 && row === sr && col === sc) {
      setPath([{ row, col }]);
      setCurrentNumber(1);
      setIsDragging(true);
      return;
    }

    // Continue from last cell
    if (last && row === last.row && col === last.col) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
  if (!isDragging || status !== "playing") return;

  const { row, col, x, y } = getCellFromMouse(e);
  setMousePos({ x, y });

  if (row < 0 || col < 0 || row >= GRID_SIZE || col >= GRID_SIZE) return;

  const last = path[path.length - 1];
  if (!last) return;

  // 🔁 BACKTRACKING
  if (path.length > 1) {
    const prev = path[path.length - 2];

    if (prev.row === row && prev.col === col) {
      const removedCell = path[path.length - 1];
      const numberAtRemoved = getNumberAt(removedCell.row, removedCell.col);

      // If we backtrack from a numbered cell, decrease currentNumber
      if (numberAtRemoved !== null && numberAtRemoved === currentNumber) {
        setCurrentNumber(currentNumber - 1);
      }

      setPath(path.slice(0, -1));
      return;
    }
  }

  // Must be adjacent
  if (!isAdjacent(last.row, last.col, row, col)) return;

  // Cannot revisit older cells
  if (path.some(p => p.row === row && p.col === col)) return;

  const numberAtCell = getNumberAt(row, col);
  const nextNumber = currentNumber + 1;

  // Strict number control
  if (numberAtCell !== null) {
    if (numberAtCell !== nextNumber) {
      stopDragging();
      return;
    }
    setCurrentNumber(nextNumber);
  }

  setPath(prev => [...prev, { row, col }]);
};

  const handleMouseUp = () => {
    stopDragging();

    if (path.length === TOTAL_CELLS) {
      if (currentNumber === 10) {
        setStatus("win");
      } else {
        setStatus("fail");
      }
    }
  };

  const generatePath = () => {
    if (path.length === 0) return "";

    let d = path
      .map((cell, index) => {
        const x = cell.col * CELL_SIZE + CELL_SIZE / 2;
        const y = cell.row * CELL_SIZE + CELL_SIZE / 2;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    if (mousePos && isDragging) {
      d += ` L ${mousePos.x} ${mousePos.y}`;
    }

    return d;
  };

const resetGame = () => {
  setPath([]);
  setCurrentNumber(1);
  setStatus("playing");
};

// 👇 ADD IT RIGHT HERE
useEffect(() => {
  if (status === "win") {
    onWin && onWin();
  }
}, [status]);



  return (
    <div className=" bg-gray-950 text-gray-200 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Zip</h1>

      {status === "win" && <div className="mb-4 text-green-400">🎉 Perfect Path!</div>}
      {status === "fail" && <div className="mb-4 text-red-400">❌ Incorrect full grid.</div>}

      <div
        ref={boardRef}
        className="relative"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="grid bg-gray-900 border border-gray-700"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {[...Array(GRID_SIZE)].map((_, row) =>
            [...Array(GRID_SIZE)].map((_, col) => {
              const number = getNumberAt(row, col);

              return (
                <div
                  key={`${row}-${col}`}
                  className="w-[70px] h-[70px] border border-gray-800 bg-gray-950 relative"
                >
                  {number && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-800 border border-gray-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {number}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
        >
          <path
            d={generatePath()}
            stroke="#a855f7"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-purple-600 rounded-lg"
      >
        Reset
      </button>
    </div>
  );
}