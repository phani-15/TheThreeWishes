import React, { useState } from "react";

const DISK_COUNT = 4;
const DISK_HEIGHT = 55;

// Generate disks dynamically
const generateDisks = () =>
  Array.from({ length: DISK_COUNT }, (_, i) => ({
    id: `disk${i + 1}`,
    size: DISK_COUNT - i,
    tower: 1,
  }));

export default function HanoiGame({ onWin }) {
  const [disks, setDisks] = useState(generateDisks());
  const [draggedDisk, setDraggedDisk] = useState(null);
  const [message, setMessage] = useState("");
  const [moves, setMoves] = useState(0);

  const getTowerDisks = (towerNum) => {
    return disks
      .filter((d) => d.tower === towerNum)
      .sort((a, b) => b.size - a.size);
  };

  const handleDragStart = (e, disk) => {
    const towerDisks = getTowerDisks(disk.tower);
    const topDisk = towerDisks[towerDisks.length - 1];

    if (topDisk.id !== disk.id) {
      e.preventDefault();
      return;
    }

    setDraggedDisk(disk);
  };

  const handleDrop = (towerNum) => {
    if (!draggedDisk) return;

    const targetTower = getTowerDisks(towerNum);
    const topTarget = targetTower[targetTower.length - 1];

    // Prevent illegal move
    if (topTarget && topTarget.size < draggedDisk.size) {
      setMessage("Illegal move ❌");
      setDraggedDisk(null);
      return;
    }

    const updated = disks.map((d) =>
      d.id === draggedDisk.id ? { ...d, tower: towerNum } : d
    );

    setDisks(updated);
    setDraggedDisk(null);
    setMoves((prev) => prev + 1);
    setMessage("");

    // Win check (dynamic)
   if (updated.filter((d) => d.tower === 3).length === DISK_COUNT) {
  setMessage("Solved! 🎉");
  onWin && onWin();
}
  };

  const handleReset = () => {
    setDisks(generateDisks());
    setDraggedDisk(null);
    setMessage("");
    setMoves(0);
  };

  const minimumMoves = Math.pow(2, DISK_COUNT) - 1;

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 flex flex-col items-center p-10">

      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold mb-3 tracking-wide">
          Tower of Hanoi
        </h1>
        <p className="text-gray-400">
          Move all disks to Tower 3
        </p>
        <p className="text-gray-500 mt-2">
          Moves: {moves} | Minimum: {minimumMoves}
        </p>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="mb-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg transition-all duration-300 shadow-md"
      >
        Reset Game
      </button>

      {/* Towers */}
      <div className="flex gap-24">
        {[1, 2, 3].map((towerNum) => {
          const towerDisks = getTowerDisks(towerNum);

          return (
            <div
              key={towerNum}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(towerNum)}
              className="relative w-72 h-[480px] bg-[#1e293b] rounded-2xl shadow-2xl flex items-end justify-center border border-gray-700"
            >
              {/* Pole */}
              <div className="absolute bottom-0 w-3 h-[400px] bg-gray-600 rounded"></div>

              {/* Disks */}
              {towerDisks.map((disk, index) => (
                <div
                  key={disk.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, disk)}
                  className="absolute h-[50px] bg-indigo-500 hover:bg-indigo-400 rounded-xl shadow-lg cursor-grab transition-all duration-300"
                  style={{
                    width: `${disk.size * 65}px`,
                    bottom: `${index * DISK_HEIGHT}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <div className="mt-10 text-2xl font-semibold text-indigo-400">
          {message}
        </div>
      )}
    </div>
  );
}