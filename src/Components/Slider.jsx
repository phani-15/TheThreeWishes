import React, { useState, useEffect } from "react";

const Slider = ({onWin,
    gridSize = 3,
    imageUrl = "/images/cave.jpg",
}) => {
    const totalTiles = gridSize * gridSize;

    const initialBoard = Array.from(
        { length: totalTiles },
        (_, i) => (i + 1) % totalTiles
    );

    const isSolvable = (arr) => {
        let inversions = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
                    inversions++;
                }
            }
        }

        if (gridSize % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            const blankIndex = arr.indexOf(0);
            const rowFromTop = Math.floor(blankIndex / gridSize);
            const rowFromBottom = gridSize - rowFromTop;

            return (
                (rowFromBottom % 2 === 1 && inversions % 2 === 0) ||
                (rowFromBottom % 2 === 0 && inversions % 2 === 1)
            );
        }
    };

    const isSolved = (arr) => {
        return arr.every((val, i) => val === initialBoard[i]);
    };

    const shuffleBoard = () => {
        let arr = [...initialBoard];
        do {
            arr = arr.sort(() => Math.random() - 0.5);
        } while (!isSolvable(arr) || isSolved(arr));
        return arr;
    };

    const [board, setBoard] = useState(shuffleBoard);
    const [moveCount, setMoveCount] = useState(0);

    const isAdjacent = (i1, i2) => {
        const row1 = Math.floor(i1 / gridSize);
        const col1 = i1 % gridSize;
        const row2 = Math.floor(i2 / gridSize);
        const col2 = i2 % gridSize;

        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    };

    const moveTile = (index) => {
        const blankIndex = board.indexOf(0);

        if (isAdjacent(index, blankIndex)) {
            const newBoard = [...board];
            [newBoard[index], newBoard[blankIndex]] = [
                newBoard[blankIndex],
                newBoard[index],
            ];

            setBoard(newBoard);
            setMoveCount((prev) => prev + 1);

            if (isSolved(newBoard)) {
                onWin();
            }
        }
    };

    const resetGame = () => {
        setBoard(shuffleBoard());
        setMoveCount(0);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold">Sliding Puzzle</h2>

            <div className="text-lg font-semibold">
                Moves: {moveCount}
            </div>

            <div
                className="grid gap-1 bg-black p-2 rounded-xl shadow-xl"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: "400px",
                    height: "400px",
                }}
            >
                {board.map((value, index) => {
                    const tileStyle =
                        value !== 0
                            ? {
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                                backgroundPosition: (() => {
                                    const tileIndex = value - 1;
                                    const row = Math.floor(tileIndex / gridSize);
                                    const col = tileIndex % gridSize;
                                    return `-${col * 100}% -${row * 100}%`;
                                })(),
                            }
                            : {};

                    return (
                        <div
                            key={index}
                            onClick={() => moveTile(index)}
                            className={`relative ${value !== 0
                                    ? "cursor-pointer hover:scale-105 transition-transform duration-200"
                                    : "bg-gray-200"
                                }`}
                            style={{
                                paddingTop: "100%",
                            }}
                        >
                            {value !== 0 && (
                                <div
                                    className="absolute inset-0 rounded-md"
                                    style={tileStyle}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={resetGame}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Reset
            </button>
        </div>
    );
};

export default Slider;