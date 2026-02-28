import React, { useState } from "react";

export default function PoorPigsGame() {
  const [buckets, setBuckets] = useState(1000);
  const [minutesToDie, setMinutesToDie] = useState(15);
  const [minutesToTest, setMinutesToTest] = useState(60);
  const [result, setResult] = useState(null);

  const calculatePigs = () => {
    if (buckets <= 0 || minutesToDie <= 0 || minutesToTest <= 0) {
      setResult("Please enter valid positive numbers.");
      return;
    }

    const states = Math.floor(minutesToTest / minutesToDie) + 1;
    const pigs = Math.ceil(Math.log(buckets) / Math.log(states));

    setResult({ pigs, states });
  };

  const resetGame = () => {
    setBuckets(1000);
    setMinutesToDie(15);
    setMinutesToTest(60);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      {/* Rules Section */}
      <div className="max-w-2xl bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 mb-8">
        <h1 className="text-2xl font-bold text-yellow-400 text-center mb-4">
          🐷 Poor Pigs Strategy Game
        </h1>
        <h2 className="text-lg font-semibold mb-2 text-gray-200">Objective:</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-400 text-sm">
          <li>Exactly one bucket is poisonous.</li>
          <li>Pigs die after <b>minutesToDie</b> minutes if poisoned.</li>
          <li>You can test multiple rounds within <b>minutesToTest</b>.</li>
          <li>Each pig represents multiple possible states (alive or dead per round).</li>
          <li>Find the minimum pigs needed to guarantee detection.</li>
        </ul>
        <div className="mt-4 p-3 bg-gray-900 rounded-lg border-l-4 border-yellow-500 text-xs text-gray-400">
          <b>Tech Concept:</b> This is information theory. Each pig represents a digit in a multi-state number system.
        </div>
      </div>

      {/* Input Panel */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 w-full max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Buckets</label>
            <input
              type="number"
              value={buckets}
              onChange={(e) => setBuckets(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Minutes To Die</label>
            <input
              type="number"
              value={minutesToDie}
              onChange={(e) => setMinutesToDie(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Minutes To Test</label>
            <input
              type="number"
              value={minutesToTest}
              onChange={(e) => setMinutesToTest(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={calculatePigs}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition"
          >
            Calculate
          </button>
          <button
            onClick={resetGame}
            className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg transition"
          >
            Reset
          </button>
        </div>

        {result && typeof result === "object" && (
          <div className="mt-6 p-4 bg-green-600 text-black rounded-lg text-center font-bold">
            Minimum Pigs Needed: {result.pigs}
            <div className="text-xs mt-2">
              Each pig has {result.states} possible states.
            </div>
          </div>
        )}

        {result && typeof result === "string" && (
          <div className="mt-6 p-4 bg-red-600 text-white rounded-lg text-center">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
