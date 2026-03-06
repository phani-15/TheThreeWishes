import { useState, useCallback, useEffect } from "react";

const PIECES = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

const INITIAL_BOARD = {
  // ── WHITE (you play as these) ──
  "2,7": "wK",
  "2,6": "wQ",
  "4,3": "wR",
  "3,4": "wN",
  "2,5": "wP",
  "5,2": "wP",
  "3,0": "wP",
  "1,7": "wB",
  "1,6": "wP",
  // ── BLACK (opponent) ──
  "7,1": "bK",
  "0,1": "bQ",
  "0,6": "bR",
  "6,7": "bP",
  "6,2": "bP",
  "6,1": "bP",
  "5,1": "bP",
  "4,6": "bP",
  "4,5": "bP",
};

// ── solution move constants ──────────────────────────────────
const MOVE1_FROM = "2,6";  // wQ
const MOVE1_TO   = "6,2";  // wQ → check, forces bK to corner
const BLACK_FROM = "7,1";  // bK
const BLACK_TO   = "7,0";  // bK → only legal square
const MOVE2_FROM = "4,3";  // wR
const MOVE2_TO   = "4,0";  // wR → CHECKMATE

function isCorrectFrom(key, step) {
  return step === 1 ? key === MOVE1_FROM : key === MOVE2_FROM;
}
function isCorrectTo(from, to, step) {
  return step === 1
    ? from === MOVE1_FROM && to === MOVE1_TO
    : from === MOVE2_FROM && to === MOVE2_TO;
}

export default function CheckmateGame({ onWin }) {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState("white");
  const [alert, setAlert] = useState(null);
  const [blackMoveAnim, setBlackMoveAnim] = useState(null);
  const [winFired, setWinFired] = useState(false);

  const flashAlert = (type) => {
    setAlert({ type });
    if (type === "wrong") setTimeout(() => setAlert(null), 1500);
  };

  const triggerBlackMove = useCallback((currentBoard) => {
    setBlackMoveAnim({ from: BLACK_FROM, to: BLACK_TO });
    setTimeout(() => {
      const nb = { ...currentBoard };
      nb[BLACK_TO] = nb[BLACK_FROM];
      delete nb[BLACK_FROM];
      setBoard(nb);
      setBlackMoveAnim(null);
      setStep(2);
      setPhase("white");
    }, 1300);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (phase !== "white") return;
    const key = `${row},${col}`;
    const piece = board[key];

    if (!selected) {
      if (!piece || !piece.startsWith("w")) return;
      if (!isCorrectFrom(key, step)) { flashAlert("wrong"); return; }
      setSelected(key);
      return;
    }
    if (selected === key) { setSelected(null); return; }

    if (isCorrectTo(selected, key, step)) {
      const nb = { ...board };
      nb[key] = nb[selected];
      delete nb[selected];
      setSelected(null);
      if (step === 1) {
        setBoard(nb);
        setPhase("black-anim");
        setTimeout(() => triggerBlackMove(nb), 900);
      } else {
        setBoard(nb);
        setPhase("done");
        setTimeout(() => flashAlert("congrats"), 400);
      }
    } else {
      if (piece?.startsWith("w") && isCorrectFrom(key, step)) {
        setSelected(key);
      } else {
        setSelected(null);
        flashAlert("wrong");
      }
    }
  }, [board, selected, step, phase, triggerBlackMove]);

  // Fire onWin after congrats shows briefly
  useEffect(() => {
    if (phase === "done" && alert?.type === "congrats" && !winFired) {
      setTimeout(()=>onWin(),2000)
    }
  }, [phase, alert, onWin, winFired]);

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setSelected(null);
    setStep(1);
    setPhase("white");
    setAlert(null);
    setBlackMoveAnim(null);
    setWinFired(false);
  };

  const files = ["a","b","c","d","e","f","g","h"];
  const ranks = ["8","7","6","5","4","3","2","1"];

  return (
    <div
      className="flex flex-col items-center justify-center p-6 font-serif"
      style={{ background: "transparent" }}
    >
      {/* ── Title ─────────────────────────────────────────── */}
      <div className="mb-5 text-center">
        <h1
          className="text-3xl font-bold tracking-widest text-amber-300"
          style={{ textShadow: "0 0 20px #f59e0b66, 0 2px 0 #000" }}
        >
          CHECKMATE
        </h1>
        <p className="text-amber-700 text-[11px] mt-1 tracking-widest uppercase">
          Two-Move Puzzle · You are Black
        </p>
        <p className="text-slate-400 text-[11px] mt-0.5">
          Step {step}/2 — {step === 1 ? "Find the decisive first move" : "Deliver checkmate!"}
        </p>
      </div>

      {/* ── Board ─────────────────────────────────────────── */}
      <div className="drop-shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
        <div
          className="p-3 rounded-xl border-[3px] border-[#92400e]"
          style={{
            background: "linear-gradient(145deg, #7c3a10, #451a03, #7c3a10)",
            boxShadow: "0 0 44px #000",
          }}
        >
          {/* file labels — top */}
          <div className="flex mb-1 ml-6">
            {files.map((f) => (
              <div key={f} className="w-[48px] text-center text-[11px] text-[#92400e] font-bold">
                {f}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* rank labels — left */}
            <div className="flex flex-col mr-1">
              {ranks.map((r) => (
                <div key={r} className="h-[48px] w-5 flex items-center justify-center text-[11px] text-[#92400e] font-bold">
                  {r}
                </div>
              ))}
            </div>

            {/* grid */}
            <div className="grid grid-cols-8 rounded-lg overflow-hidden border-2 border-[#78350f]">
              {Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 8 }, (_, col) => {
                  const key = `${row},${col}`;
                  const piece = board[key];
                  const isLight = (row + col) % 2 === 0;
                  const isSel = selected === key;
                  const isBATo = blackMoveAnim?.to === key;
                  const isBAFr = blackMoveAnim?.from === key;
                  const isWhitePiece = piece?.startsWith("w");
                  const isBlackPiece = piece?.startsWith("b");

                  let bg = isLight ? "#f0d9b5" : "#b58863";
                  if (isSel) bg = "#f9f56b";
                  else if (isBATo) bg = "#f87171";

                  return (
                    <div
                      key={key}
                      onClick={() => handleCellClick(row, col)}
                      className="w-[48px] h-[48px] flex items-center justify-center cursor-pointer relative select-none"
                      style={{ background: bg, transition: "background 0.15s" }}
                    >
                      {piece && (
                        <span
                          className={`text-[28px] leading-none select-none block
                            ${isBAFr ? "opacity-5" : "opacity-100"}
                            ${isSel ? "scale-110" : isBATo ? "scale-110" : "scale-100"}
                          `}
                          style={{
                            display: "block",
                            transition: "transform 0.15s, opacity 0.2s",
                            // White pieces: ivory fill with dark stroke for contrast on any square
                            color: isWhitePiece ? "#fffff0" : "#1a1008",
                            WebkitTextStroke: isWhitePiece
                              ? "1.5px #5a3a10"   // warm dark border on white pieces
                              : "1px #c8a870",    // light border on black pieces
                            textShadow: isWhitePiece
                              ? "0 1px 6px rgba(0,0,0,0.7), 0 0 12px rgba(245,200,80,0.25)"
                              : "0 1px 4px rgba(0,0,0,0.5)",
                            filter: isSel ? "drop-shadow(0 0 6px #facc15)" : "none",
                          }}
                        >
                          {PIECES[piece]}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* rank labels — right */}
            <div className="flex flex-col ml-1">
              {ranks.map((r) => (
                <div key={r} className="h-[48px] w-5 flex items-center justify-center text-[11px] text-[#92400e] font-bold">
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* file labels — bottom */}
          <div className="flex mt-1 ml-6">
            {files.map((f) => (
              <div key={f} className="w-[48px] text-center text-[11px] text-[#92400e] font-bold">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend ────────────────────────────────────────── */}
      <div className="mt-4 flex gap-6 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span style={{ color: "#fffff0", WebkitTextStroke: "1px #5a3a10", fontSize: 18 }}>♔</span>
          White (You)
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ color: "#1a1008", WebkitTextStroke: "1px #c8a870", fontSize: 18 }}>♚</span>
          Black (Opponent)
        </span>
      </div>

      {/* ── Reset ─────────────────────────────────────────── */}
      <button
        onClick={resetGame}
        className="mt-4 px-5 py-1.5 text-[11px] tracking-widest uppercase rounded-full border border-amber-700/40 text-amber-600 hover:bg-amber-900/20 transition-all"
      >
        Reset Puzzle
      </button>

      {/* ── Alert overlays ────────────────────────────────── */}
      {alert && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center
            ${alert.type === "congrats" ? "bg-black/70" : "pointer-events-none"}`}
        >
          {alert.type === "wrong" && (
            <div
              className="bg-[#781818f5] border-2 border-red-500 text-red-300 px-9 py-4 rounded-xl text-xl font-bold tracking-wider shadow-[0_8px_40px_#000]"
              style={{ animation: "shake 0.4s ease" }}
            >
              ✗ Wrong Move
            </div>
          )}

          {alert.type === "congrats" && (
            <div
              className="bg-gradient-to-br from-amber-400 to-amber-600 text-black p-7 px-11 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.6),0_8px_48px_#000] border-4 border-amber-300 text-center"
              style={{ animation: "popIn 0.4s cubic-bezier(0.22,1,0.36,1)" }}
            >
              <div className="text-[48px]">♔</div>
              <div className="text-[28px] font-black tracking-wider mt-1">CHECKMATE!</div>
              <div className="text-[13px] font-semibold opacity-70 mt-1">
                Congratulations, Grandmaster! 🎉
              </div>
              <div className="text-[11px] mt-3 opacity-70 animate-pulse">
                Continuing...
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%,100%{ transform:translateX(0) }
          20%{ transform:translateX(-10px) }
          40%{ transform:translateX(12px) }
          60%{ transform:translateX(-8px) }
          80%{ transform:translateX(8px) }
        }
        @keyframes popIn {
          0%{ opacity:0; transform:scale(0.3) rotate(-4deg) }
          100%{ opacity:1; transform:scale(1) rotate(0deg) }
        }
      `}</style>
    </div>
  );
}