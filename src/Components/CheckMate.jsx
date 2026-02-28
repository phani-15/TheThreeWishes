import { useState, useCallback, useEffect } from "react";

const PIECES = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

const INITIAL_BOARD = {
  // ── WHITE (you play as these) ──
  "2,7": "wK",  // h6
  "2,6": "wQ",  // g6
  "4,3": "wR",  // e4
  "3,4": "wN",  // e5
  "2,5": "wP",  // f6
  "5,2": "wP",  // c4
  "3,0": "wP",  // a5
  "1,7": "wP",  // h7
  "1,6": "wP",  // g7
  // ── BLACK (opponent) ──
  "7,1": "bK",  // b1
  "0,1": "bQ",  // b8
  "0,6": "bR",  // g8
  "6,7": "bP",  // h2
  "6,2": "bP",  // e2
  "6,1": "bP",  // b2
  "5,1": "bP",  // b3
  "4,6": "bP",  // g4
  "4,5": "bP",  // f5
};

// ── solution move constants ──────────────────────────────────
const MOVE1_FROM = "2,6";  // wQ g6
const MOVE1_TO   = "6,2";  // wQ c2  (check — forces bK to a1)
const BLACK_FROM = "7,1";  // bK b1
const BLACK_TO   = "7,0";  // bK a1  (only legal square)
const MOVE2_FROM = "4,3";  // wR e4
const MOVE2_TO   = "4,0";  // wR a4  (CHECKMATE)

// ── helpers ──────────────────────────────────────────────────
function isCorrectFrom(key, step) {
  return step === 1 ? key === MOVE1_FROM : key === MOVE2_FROM;
}
function isCorrectTo(from, to, step) {
  return step === 1
    ? from === MOVE1_FROM && to === MOVE1_TO
    : from === MOVE2_FROM && to === MOVE2_TO;
}

// ── component ─────────────────────────────────────────────────
export default function CheckmateGame({ onWin }) {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState("white");
  const [alert, setAlert] = useState(null);
  const [blackMoveAnim, setBlackMoveAnim] = useState(null);

  const flashAlert = (type) => {
    setAlert({ type });
    if (type === "wrong") setTimeout(() => setAlert(null), 1800);
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

  // ── Call onWin 5 seconds after congrats appears ─────────────
  useEffect(() => {
    if (phase === "done" && alert?.type === "congrats" && onWin) {
      const timer = setTimeout(() => {
        onWin();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, alert, onWin]);

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setSelected(null);
    setStep(1);
    setPhase("white");
    setAlert(null);
    setBlackMoveAnim(null);
  };

  const files = ["a","b","c","d","e","f","g","h"];
  const ranks = ["8","7","6","5","4","3","2","1"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-serif"
         style={{ background: "radial-gradient(ellipse at center, #2a1a08 0%, #0e0905 100%)" }}>

      {/* ── Title ─────────────────────────────────────────── */}
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-amber-300 m-0"
            style={{ textShadow: "0 0 28px #f59e0b88, 0 2px 0 #000" }}>
          CHECKMATE
        </h1>
        <p className="text-[#78350f] text-[11px] mt-1 tracking-widest uppercase">
          Two-Move Puzzle · You are White
        </p>
      </div>

      {/* ── Board ─────────────────────────────────────────── */}
      <div className="drop-shadow-[0_10px_50px_rgba(0,0,0,0.7)]">
        <div className="p-3 rounded-xl border-[3px] border-[#92400e]"
             style={{ 
               background: "linear-gradient(145deg, #7c3a10, #451a03, #7c3a10)",
               boxShadow: "0 0 44px #000"
             }}>

          {/* file labels — top */}
          <div className="flex mb-1 ml-6">
            {files.map(f => (
              <div key={f} className="w-[50px] text-center text-[11px] text-[#92400e] font-bold">
                {f}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* rank labels — left */}
            <div className="flex flex-col mr-1">
              {ranks.map(r => (
                <div key={r} className="h-[50px] w-5 flex items-center justify-center text-[11px] text-[#92400e] font-bold">
                  {r}
                </div>
              ))}
            </div>

            {/* grid */}
            <div className="grid grid-cols-8 rounded-lg overflow-hidden border border-[#78350f]">
              {Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 8 }, (_, col) => {
                  const key = `${row},${col}`;
                  const piece = board[key];
                  const isLight = (row + col) % 2 === 0;
                  const isSel = selected === key;
                  const isBATo = blackMoveAnim?.to === key;
                  const isBAFr = blackMoveAnim?.from === key;

                  let bgClass = isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]";
                  if (isSel) bgClass = "bg-[#f9f56b]";
                  if (isBATo) bgClass = "bg-[#f87171]";

                  return (
                    <div
                      key={key}
                      onClick={() => handleCellClick(row, col)}
                      className={`w-[50px] h-[50px] ${bgClass} flex items-center justify-center cursor-pointer relative select-none transition-[background] duration-150`}
                    >
                      {/* piece glyph */}
                      {piece && (
                        <span className={`text-[30px] leading-none select-none block transition-all duration-200
                          ${isBAFr ? "opacity-5" : "opacity-100"}
                          ${isSel ? "scale-110" : isBATo ? "scale-115" : "scale-100"}
                          ${piece.startsWith("w") ? "drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]" : "drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"}
                          ${piece.startsWith("b") ? "brightness-90" : ""}`}
                          style={{ filter: piece.startsWith("b") ? "brightness(0.2)" : "" }}>
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
              {ranks.map(r => (
                <div key={r} className="h-[50px] w-5 flex items-center justify-center text-[11px] text-[#92400e] font-bold">
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* file labels — bottom */}
          <div className="flex mt-1 ml-6">
            {files.map(f => (
              <div key={f} className="w-[50px] text-center text-[11px] text-[#92400e] font-bold">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alert overlays ────────────────────────────────── */}
      {alert && (
        <div className={`fixed inset-0 z-60 flex items-center justify-center
          ${alert.type === "congrats" ? "pointer-events-auto bg-black/70" : "pointer-events-none bg-transparent"}`}>

          {/* wrong move */}
          {alert.type === "wrong" && (
            <div className="bg-[#781818f5] border-2 border-red-500 text-red-300 px-9 py-4 rounded-xl text-xl font-bold tracking-wider shadow-[0_8px_40px_#000] animate-shake">
              ✗ Wrong Move
            </div>
          )}

          {/* congratulations */}
          {alert.type === "congrats" && (
            <div className="relative flex items-center justify-center">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-black p-7 px-11 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.6),0_8px_48px_#000] border-4 border-amber-300 animate-pop-in relative z-10 text-center">
                <div className="text-[48px]">♔</div>
                <div className="text-[30px] font-black tracking-wider mt-2">CHECKMATE!</div>
                <div className="text-[13px] font-semibold opacity-70 mt-1">
                  Congratulations, Grandmaster! 🎉
                </div>
                <div className="text-[11px] mt-3 opacity-80 animate-pulse">
                  Continuing in {alert.countdown}s...
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Keyframe CSS (required for custom animations) ─── */}
      <style>{`
        @keyframes shake {
          0%,100%{ transform:translateX(0) }
          20%{ transform:translateX(-12px) }
          40%{ transform:translateX(14px) }
          60%{ transform:translateX(-9px) }
          80%{ transform:translateX(9px) }
        }
        @keyframes pop-in {
          0%{ opacity:0; transform:scale(0.22) rotate(-6deg) }
          100%{ opacity:1; transform:scale(1) rotate(0deg) }
        }
        @keyframes pulse-ring {
          0%,100%{ opacity:0.6; transform:scale(1) }
          50%{ opacity:1; transform:scale(1.1) }
        }
        @keyframes starBurst0{0%{opacity:0;transform:translate(0,0)scale(0)}70%{opacity:1;transform:translate(-82px,-64px)scale(1.4)}100%{opacity:.8;transform:translate(-82px,-64px)scale(1)}}
        @keyframes starBurst1{0%{opacity:0;transform:translate(0,0)scale(0)}70%{opacity:1;transform:translate(82px,-64px)scale(1.4)}100%{opacity:.8;transform:translate(82px,-64px)scale(1)}}
        @keyframes starBurst2{0%{opacity:0;transform:translate(0,0)scale(0)}70%{opacity:1;transform:translate(0,-94px)scale(1.4)}100%{opacity:.8;transform:translate(0,-94px)scale(1)}}
        @keyframes starBurst3{0%{opacity:0;transform:translate(0,0)scale(0)}70%{opacity:1;transform:translate(-58px,58px)scale(1.4)}100%{opacity:.8;transform:translate(-58px,58px)scale(1)}}
        @keyframes starBurst4{0%{opacity:0;transform:translate(0,0)scale(0)}70%{opacity:1;transform:translate(58px,58px)scale(1.4)}100%{opacity:.8;transform:translate(58px,58px)scale(1)}}
        @keyframes starBurst5{0%{opacity:0;transform:translate(0,0)scale(0)}70%{opacity:1;transform:translate(0,90px)scale(1.4)}100%{opacity:.8;transform:translate(0,90px)scale(1)}}
      `}</style>
    </div>
  );
}