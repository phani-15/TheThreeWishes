import React, { useState, useEffect } from "react";


const initialPuzzle = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const solution = [
  [4, 3, 5, 2, 6, 9, 7, 8, 1],
  [6, 8, 2, 5, 7, 1, 4, 9, 3],
  [1, 9, 7, 8, 3, 4, 5, 6, 2],
  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],
  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
];

export default function Sudoku({ onWin }) {
  const [board, setBoard] = useState(initialPuzzle);
  const [completed, setCompleted] = useState(false);

  const handleChange = (row, col, value) => {
    if (initialPuzzle[row][col] !== 0) return;
    const val = value === "" ? 0 : parseInt(value.slice(-1));
    if (isNaN(val) || val < 0 || val > 9) return;

    const newBoard = board.map((r, rIdx) => 
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? val : cell))
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    const isComplete = board.every((row, r) => 
      row.every((cell, c) => cell === solution[r][c])
    );
    if (isComplete) {
      setCompleted(true);
      onWin && onWin();
    }
  }, [board]);

  return (
    <div className="flex flex-col items-center justify-center bg-cover bg-center overflow-hidden p-4" 
         style={{ backgroundImage: "url('/your-bg-image.jpg')" }}>
      
      <div className="bg-purple-950/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl max-h-full flex flex-col items-center">
        
        <h2 className="text-xl font-bold text-yellow-400 mb-4 tracking-tighter uppercase">Sudoku Pro</h2>

        <div className="grid grid-cols-9 border-2 border-yellow-600/50 aspect-square h-[55vh] max-h-[400px] bg-black/30">
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isFixed = initialPuzzle[rIdx][cIdx] !== 0;
              // ERROR LOGIC: If a user has entered a number (not 0) and it doesn't match the solution
              const isWrong = !isFixed && cell !== 0 && cell !== solution[rIdx][cIdx];

              return (
                <input
                  key={`${rIdx}-${cIdx}`}
                  type="text"
                  value={cell === 0 ? "" : cell}
                  onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                  className={`
                    w-full h-full text-center text-lg md:text-xl outline-none transition-all
                    border-[0.5px] border-purple-400/10
                    /* Separator lines for 3x3 grid */
                    ${(cIdx + 1) % 3 === 0 && cIdx !== 8 ? 'border-r-2 border-r-yellow-600/40' : ''}
                    ${(rIdx + 1) % 3 === 0 && rIdx !== 8 ? 'border-b-2 border-b-yellow-600/40' : ''}
                    
                    /* Styling based on state */
                    ${isFixed ? 'bg-purple-900/80 text-yellow-500 font-bold' : 'bg-transparent text-white'}
                    ${isWrong ? 'bg-red-500/60 text-white animate-shake' : 'focus:bg-white/10'}
                  `}
                />
              );
            })
          )}
        </div>

        {completed && (
          <div className="mt-4 text-green-400 font-bold animate-bounce drop-shadow-lg">
            ✓ CHALLENGE COMPLETE!
          </div>
        )}
      </div>
    </div>
  );
}