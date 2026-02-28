import React, { useState, useRef } from "react";

const GRID_SIZE = 10;
const CELL_SIZE = 55;

const DOTS = [
  { row: 0, col: 0, color: "#ef4444" },
  { row: 5, col: 5, color: "#ef4444" },
  { row: 0, col: 9, color: "#3b82f6" },
  { row: 9, col: 0, color: "#3b82f6" },
  { row: 2, col: 2, color: "#22c55e" },
  { row: 7, col: 7, color: "#22c55e" },
  { row: 3, col: 8, color: "#facc15" },
  { row: 8, col: 3, color: "#facc15" }
];

export default function FlowGame({ onWin }) {
  const [paths, setPaths] = useState({});
  const [currentPath, setCurrentPath] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [completed, setCompleted] = useState(false);
  const lastTapRef = useRef({});

  const resetGame = () => {
    setPaths({});
    setCurrentPath([]);
    setActiveColor(null);
    setCompleted(false);
  };

  const isDot = (row, col) =>
    DOTS.find((d) => d.row === row && d.col === col);

  const isAdjacent = (r1, c1, r2, c2) =>
    Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

  const isOccupied = (row, col) => {
    for (let color in paths) {
      if (paths[color].some((p) => p.row === row && p.col === col)) {
        return true;
      }
    }
    return false;
  };

  const getPathColorAtCell = (row, col) => {
    for (let color in paths) {
      if (paths[color].some((p) => p.row === row && p.col === col)) {
        return color;
      }
    }
    return null;
  };

  const handleStart = (row, col) => {
    const now = Date.now();
    const pathColor = getPathColorAtCell(row, col);
    const dot = isDot(row, col);

    // Double tap on path → remove that path
    if (pathColor) {
      const lastTap = lastTapRef.current[pathColor] || 0;

      if (now - lastTap < 300) {
        const updated = { ...paths };
        delete updated[pathColor];
        setPaths(updated);
        setCompleted(false);
        lastTapRef.current[pathColor] = 0;
        return;
      }

      lastTapRef.current[pathColor] = now;
      return;
    }

    // Start drawing only from dot
    if (!dot) return;

    setActiveColor(dot.color);
    setCurrentPath([{ row, col }]);
  };

  const handleEnter = (row, col) => {
    if (!activeColor) return;

    const last = currentPath[currentPath.length - 1];
    if (!isAdjacent(last.row, last.col, row, col)) return;

    const dot = isDot(row, col);

    // Block occupied cells (except backtracking)
    if (
      isOccupied(row, col) &&
      !currentPath.some((p) => p.row === row && p.col === col)
    ) {
      return;
    }

    // Block other color dots
    if (dot && dot.color !== activeColor) return;

    const backIndex = currentPath.findIndex(
      (p) => p.row === row && p.col === col
    );

    // Backtracking
    if (backIndex !== -1) {
      setCurrentPath(currentPath.slice(0, backIndex + 1));
      return;
    }

    const newPath = [...currentPath, { row, col }];

    // Stop immediately at destination
    if (dot && dot.color === activeColor) {
      const updated = { ...paths, [activeColor]: newPath };
      setPaths(updated);
      setCurrentPath([]);
      setActiveColor(null);
      checkCompletion(updated);
      return;
    }

    setCurrentPath(newPath);
  };

  const checkCompletion = (allPaths) => {
    let filled = 0;
    Object.values(allPaths).forEach((path) => {
      filled += path.length;
    });

    if (filled === GRID_SIZE * GRID_SIZE) {
  setCompleted(true);
  onWin && onWin();
}
  };

  const generatePath = (path) => {
    if (!path.length) return "";

    const points = path.map((cell) => ({
      x: cell.col * CELL_SIZE + CELL_SIZE / 2,
      y: cell.row * CELL_SIZE + CELL_SIZE / 2
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold mb-2">Robotic Flows</h1>

      <div className="text-center mb-4 max-w-xl">
        <p className="font-semibold">Objective:</p>
        <p>Connect matching colored dots without crossing lines and fill every block.</p>
        <p className="font-semibold mt-2">Rules:</p>
        <p>
          • Lines cannot intersect<br/>
          • Cannot pass through other dots<br/>
          • All cells must be filled<br/>
          • Double tap a path to remove it
        </p>
      </div>

      <button
        onClick={resetGame}
        className="mb-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
      >
        Reset
      </button>

      {completed && (
        <div className="mb-4 text-green-400 font-bold text-xl">
          Puzzle Completed!
        </div>
      )}

      <div
        className="relative"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        <div className="grid grid-cols-10 absolute top-0 left-0">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;
            const dot = isDot(row, col);

            return (
              <div
                key={index}
                onMouseDown={() => handleStart(row, col)}
                onMouseEnter={() => handleEnter(row, col)}
                className="border border-slate-700 flex items-center justify-center"
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              >
                {dot && (
                  <div
                    className="rounded-full"
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: dot.color
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
        >
          {Object.entries(paths).map(([color, path]) => (
            <path
              key={color}
              d={generatePath(path)}
              stroke={color}
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {currentPath.length > 0 && (
            <path
              d={generatePath(currentPath)}
              stroke={activeColor}
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
}