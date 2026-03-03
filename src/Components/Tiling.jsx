import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 8;

const BASE_SHAPE = [[0, 0], [1, 0], [0, 1]];
const rotate = (shape) => shape.map(([r, c]) => [c, -r]);
const normalize = (shape) => {
    const minR = Math.min(...shape.map(([r]) => r));
    const minC = Math.min(...shape.map(([, c]) => c));
    return shape.map(([r, c]) => [r - minR, c - minC]);
};
const getRotations = () => {
    let result = [], current = BASE_SHAPE;
    for (let i = 0; i < 4; i++) { result.push(normalize(current)); current = rotate(current); }
    return result;
};
const SHAPES = getRotations();

const TILE_COLORS = [
    { bg: "#ff6b6b", glow: "#ff6b6b", text: "#fff" },
    { bg: "#ffd93d", glow: "#ffd93d", text: "#1a1a2e" },
    { bg: "#6bcb77", glow: "#6bcb77", text: "#1a1a2e" },
    { bg: "#4d96ff", glow: "#4d96ff", text: "#fff" },
    { bg: "#c77dff", glow: "#c77dff", text: "#fff" },
    { bg: "#ff9a3c", glow: "#ff9a3c", text: "#1a1a2e" },
    { bg: "#00f5d4", glow: "#00f5d4", text: "#1a1a2e" },
    { bg: "#f15bb5", glow: "#f15bb5", text: "#fff" },
];
const getColor = (id) => TILE_COLORS[(id - 1) % TILE_COLORS.length];

// Pick a random blocked cell
const randomBlocked = () => {
    const value = Math.floor(Math.random() * GRID_SIZE);
    return {
        r: value,
        c: value
    };
};

// Build a fresh grid with one blocked cell
const makeGrid = ({ r, c }) =>
    Array(GRID_SIZE).fill(null).map((_, gr) =>
        Array(GRID_SIZE).fill(null).map((_, gc) =>
            gr === r && gc === c ? "BLOCKED" : null
        )
    );

/**
 * Try each cell of the shape as the part that "lands on" the clicked cell.
 * Returns the first anchor [ar, ac] that yields a fully valid placement,
 * or null if none exists. Treats "BLOCKED" as occupied.
 */
const findAnchor = (row, col, shape, grid) => {
    for (const [dr, dc] of shape) {
        const ar = row - dr, ac = col - dc;
        const ok = shape.every(([r, c]) => {
            const nr = ar + r, nc = ac + c;
            return nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc] === null;
        });
        if (ok) return [ar, ac];
    }
    return null;
};

/** Return hover preview cells + whether placement is valid. */
const getHoverInfo = (row, col, shape, grid) => {
    for (const [dr, dc] of shape) {
        const ar = row - dr, ac = col - dc;
        const cells = shape.map(([r, c]) => [ar + r, ac + c]);
        const ok = cells.every(([nr, nc]) =>
            nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc] === null
        );
        if (ok) return { cells: new Set(cells.map(([nr, nc]) => `${nr}-${nc}`)), valid: true };
    }
    // Show invalid preview using default anchor
    const ar = row - shape[0][0], ac = col - shape[0][1];
    const cells = shape
        .map(([r, c]) => [ar + r, ac + c])
        .filter(([nr, nc]) => nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE);
    return { cells: new Set(cells.map(([nr, nc]) => `${nr}-${nc}`)), valid: false };
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');

  .tiling-root {
    min-height: 100vh;
    background: #0a0a1a;
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(77,150,255,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(199,125,255,0.08) 0%, transparent 50%),
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 32px 32px, 32px 32px;
    font-family: 'Rajdhani', sans-serif;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    color: #e0e0ff;
  }

  .tiling-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(1.4rem, 4vw, 2.2rem);
    font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;
    background: linear-gradient(135deg, #4d96ff 0%, #c77dff 50%, #ff6b6b 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    margin-bottom: 0.25rem; text-align: center;
  }
  .tiling-subtitle {
    font-size: 0.85rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(180,180,255,0.45); margin-bottom: 1rem; text-align: center;
  }

  .mission-badge {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.4rem 1rem; border-radius: 20px;
    border: 1px solid rgba(199,125,255,0.3);
    color: #c77dff; background: rgba(199,125,255,0.07);
    margin-bottom: 1.4rem; text-align: center;
  }

  .progress-bar-wrap { width: 100%; max-width: 380px; margin-bottom: 1.2rem; }
  .progress-label {
    display: flex; justify-content: space-between;
    font-size: 0.7rem; letter-spacing: 0.1em; color: rgba(180,180,255,0.4);
    margin-bottom: 0.35rem; font-family: 'Orbitron', sans-serif;
  }
  .progress-track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4d96ff, #c77dff);
    border-radius: 3px; transition: width 0.4s ease;
    box-shadow: 0 0 8px rgba(199,125,255,0.6);
  }

  .top-row {
    display: flex; gap: 1rem; align-items: center;
    margin-bottom: 1.5rem; flex-wrap: wrap; justify-content: center;
  }
  .controls-row {
    display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; justify-content: center;
  }

  .btn {
    font-family: 'Orbitron', sans-serif; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.6rem 1.4rem; border: none; border-radius: 4px;
    cursor: pointer; transition: all 0.15s ease; outline: none;
  }
  .btn-rotate {
    background: transparent; color: #4d96ff; border: 1.5px solid #4d96ff;
    box-shadow: 0 0 12px rgba(77,150,255,0.3), inset 0 0 12px rgba(77,150,255,0.05);
  }
  .btn-rotate:hover {
    background: rgba(77,150,255,0.15);
    box-shadow: 0 0 24px rgba(77,150,255,0.5), inset 0 0 16px rgba(77,150,255,0.1);
    transform: translateY(-1px);
  }
  .btn-reset {
    background: transparent; color: #ff6b6b; border: 1.5px solid #ff6b6b;
    box-shadow: 0 0 12px rgba(255,107,107,0.3), inset 0 0 12px rgba(255,107,107,0.05);
  }
  .btn-reset:hover {
    background: rgba(255,107,107,0.15);
    box-shadow: 0 0 24px rgba(255,107,107,0.5), inset 0 0 16px rgba(255,107,107,0.1);
    transform: translateY(-1px);
  }

  .panel {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 0.9rem 1.2rem; backdrop-filter: blur(10px);
  }
  .panel-label {
    font-family: 'Orbitron', sans-serif; font-size: 0.6rem; letter-spacing: 0.2em;
    color: rgba(180,180,255,0.45); text-transform: uppercase; text-align: center; margin-bottom: 0.6rem;
  }
  .preview-grid { display: grid; grid-template-columns: repeat(2, 26px); grid-template-rows: repeat(2, 26px); gap: 3px; }
  .preview-cell { width: 26px; height: 26px; border-radius: 3px; transition: all 0.2s ease; }
  .preview-cell.filled { background: #4d96ff; box-shadow: 0 0 10px rgba(77,150,255,0.8), 0 0 20px rgba(77,150,255,0.4); }
  .preview-cell.empty { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); }

  .stat-pill {
    font-family: 'Orbitron', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em;
    color: rgba(180,180,255,0.5); padding: 0.4rem 0.9rem;
    border: 1px solid rgba(255,255,255,0.07); border-radius: 20px;
    background: rgba(255,255,255,0.025);
  }
  .stat-pill span { color: #c77dff; font-weight: 700; }

  .grid-wrapper {
    padding: 6px; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
    box-shadow: 0 0 40px rgba(77,150,255,0.07), 0 20px 60px rgba(0,0,0,0.5);
  }
  .puzzle-grid { display: grid; gap: 3px; }

  .grid-cell {
    width: 44px; height: 44px; border-radius: 5px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', sans-serif; font-size: 0.55rem; font-weight: 700;
    transition: background 0.12s ease, box-shadow 0.12s ease, transform 0.08s ease;
    position: relative; user-select: none;
  }
  .grid-cell.empty {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: transparent;
  }
  .grid-cell.empty:hover { background: rgba(77,150,255,0.15); border-color: rgba(77,150,255,0.4); transform: scale(1.05); }
  .grid-cell.preview-valid  { background: rgba(77,150,255,0.22) !important; border-color: rgba(77,150,255,0.6) !important; transform: scale(1.05); }
  .grid-cell.preview-invalid{ background: rgba(255,107,107,0.18) !important; border-color: rgba(255,107,107,0.5) !important; transform: scale(1.04); }
  .grid-cell.filled { border: none; animation: tilePlace 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* Blocked cell — permanently off-limits */
  .grid-cell.blocked {
    background: #0f0f22;
    border: 2px dashed rgba(255,100,100,0.35);
    cursor: not-allowed;
    position: relative;
    overflow: hidden;
  }
  .grid-cell.blocked::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent, transparent 4px,
      rgba(255,80,80,0.08) 4px, rgba(255,80,80,0.08) 6px
    );
  }
  .grid-cell.blocked::after {
    content: '✕';
    position: absolute;
    font-size: 1.1rem; font-family: sans-serif;
    color: rgba(255,100,100,0.4);
  }

  @keyframes tilePlace {
    0%   { transform: scale(0.6); opacity: 0.4; }
    60%  { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Win overlay */
  .win-overlay {
    position: fixed; inset: 0; z-index: 50;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(10,10,26,0.92); backdrop-filter: blur(14px);
    animation: fadeIn 0.4s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .win-title {
    font-family: 'Orbitron', sans-serif; font-weight: 900; text-align: center;
    font-size: clamp(2rem, 6vw, 3.5rem);
    background: linear-gradient(135deg, #ffd93d, #ff6b6b, #c77dff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: winGlow 1.4s ease infinite alternate; margin-bottom: 0.5rem;
  }
  @keyframes winGlow { from { filter: brightness(1); } to { filter: brightness(1.4); } }
  .win-sub { font-size: 0.9rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(180,180,255,0.5); margin-bottom: 2rem; }
  .btn-play-again {
    font-family: 'Orbitron', sans-serif; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.85rem 2.2rem; border: none; border-radius: 6px; cursor: pointer; color: #fff;
    background: linear-gradient(135deg, #4d96ff, #c77dff);
    box-shadow: 0 0 30px rgba(77,150,255,0.45);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-play-again:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 0 44px rgba(199,125,255,0.55); }

  /* Confetti */
  .confetti-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 40; overflow: hidden; }
  .confetti-dot { position: absolute; width: 8px; height: 8px; border-radius: 2px; animation: confettiFall linear forwards; }
  @keyframes confettiFall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }

  .hint-bar {
    margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.75rem; color: rgba(180,180,255,0.35); letter-spacing: 0.08em;
    flex-wrap: wrap; justify-content: center; text-align: center;
  }
  .kbd {
    font-family: 'Orbitron', sans-serif; font-size: 0.6rem; padding: 0.15rem 0.45rem;
    border: 1px solid rgba(180,180,255,0.2); border-radius: 3px;
    color: rgba(180,180,255,0.6); background: rgba(255,255,255,0.04);
  }
`;

const CONFETTI_COLORS = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff","#00f5d4","#f15bb5"];
const makeConfetti = () =>
    Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        duration: `${1.2 + Math.random() * 1.8}s`,
        delay: `${Math.random() * 0.9}s`,
    }));

const TriominoTiling = ({ onWin }) => {
    const [blocked, setBlocked]   = useState(() => randomBlocked());
    const [grid, setGrid]         = useState(() => makeGrid(randomBlocked()));
    const [rotationIndex, setRot] = useState(0);
    const [tileId, setTileId]     = useState(1);
    const [hoverCell, setHover]   = useState(null);
    const [won, setWon]           = useState(false);
    const [confetti]              = useState(makeConfetti);

    const TOTAL = GRID_SIZE * GRID_SIZE - 1; // 63
    const filledCount = grid.flat().filter((c) => c !== null && c !== "BLOCKED").length;
    const pct = Math.round((filledCount / TOTAL) * 100);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key.toLowerCase() === "r") setRot((p) => (p + 1) % SHAPES.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (filledCount === TOTAL) { setWon(true); if (onWin) onWin(); }
    }, [filledCount]);

    const hoverInfo = useCallback(() => {
        if (!hoverCell) return { cells: new Set(), valid: false };
        return getHoverInfo(hoverCell[0], hoverCell[1], SHAPES[rotationIndex], grid);
    }, [hoverCell, rotationIndex, grid]);

    const { cells: hoverSet, valid: hoverValid } = hoverInfo();

    const handleClick = (row, col) => {
        if (grid[row][col] !== null) return;
        const anchor = findAnchor(row, col, SHAPES[rotationIndex], grid);
        if (!anchor) return;
        const [ar, ac] = anchor;
        const newGrid = grid.map((r) => [...r]);
        SHAPES[rotationIndex].forEach(([r, c]) => { newGrid[ar + r][ac + c] = tileId; });
        setGrid(newGrid);
        setTileId((p) => p + 1);
    };

    const reset = () => {
        const b = randomBlocked();
        setBlocked(b);
        setGrid(makeGrid(b));
        setTileId(1);
        setRot(0);
        setWon(false);
        setHover(null);
    };

    const currentShape = SHAPES[rotationIndex];

    return (
        <>
            <style>{styles}</style>

            {/* Confetti */}
            {won && (
                <div className="confetti-wrap">
                    {confetti.map((c) => (
                        <div key={c.id} className="confetti-dot"
                            style={{ left: c.left, background: c.color, animationDuration: c.duration, animationDelay: c.delay }} />
                    ))}
                </div>
            )}

            {/* Win overlay */}
            {won && (
                <div className="win-overlay">
                    <div className="win-title">Puzzle Complete!</div>
                    <div className="win-sub">21 trominoes · 63 cells filled</div>
                    <button className="btn-play-again" onClick={reset}>Play Again</button>
                </div>
            )}

            <div className="tiling-root">
                <h1 className="tiling-title">Triomino</h1>
                <p className="tiling-subtitle">Tiling Puzzle</p>

                <div className="mission-badge">
                    Fill all 63 cells with 21 L-trominoes — the ✕ cell is permanently blocked
                </div>

                {/* Progress */}
                <div className="progress-bar-wrap">
                    <div className="progress-label">
                        <span>Coverage</span>
                        <span>{pct}% &mdash; {filledCount} / {TOTAL}</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                </div>

                {/* Controls */}
                <div className="top-row">
                    <div className="controls-row">
                        <button className="btn btn-rotate" onClick={() => setRot((p) => (p + 1) % SHAPES.length)}>
                            ↻ Rotate
                        </button>
                        <button className="btn btn-reset" onClick={reset}>
                            ⟳ New Game
                        </button>
                    </div>

                    <div className="panel">
                        <div className="panel-label">Orientation</div>
                        <div className="preview-grid">
                            {[0, 1].flatMap((r) =>
                                [0, 1].map((c) => {
                                    const active = currentShape.some(([sr, sc]) => sr === r && sc === c);
                                    return <div key={`${r}-${c}`} className={`preview-cell ${active ? "filled" : "empty"}`} />;
                                })
                            )}
                        </div>
                    </div>

                    <div className="stat-pill">Tiles: <span>{tileId - 1}</span> / 21</div>
                </div>

                {/* Grid */}
                <div className="grid-wrapper">
                    <div className="puzzle-grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 44px)` }}>
                        {grid.map((row, r) =>
                            row.map((cell, c) => {
                                const key = `${r}-${c}`;
                                const isBlocked = cell === "BLOCKED";
                                const inHover   = !isBlocked && !cell && hoverSet.has(key);
                                const color     = (!isBlocked && cell) ? getColor(cell) : null;

                                let cls = "grid-cell";
                                if (isBlocked)      cls += " blocked";
                                else if (cell)      cls += " filled";
                                else if (inHover)   cls += hoverValid ? " preview-valid" : " preview-invalid";
                                else                cls += " empty";

                                return (
                                    <div key={key} className={cls}
                                        style={color ? {
                                            background: color.bg,
                                            boxShadow: `0 0 10px ${color.glow}99, 0 0 3px ${color.glow}`,
                                            color: color.text,
                                        } : {}}
                                        onClick={() => handleClick(r, c)}
                                        onMouseEnter={() => !isBlocked && !cell && setHover([r, c])}
                                        onMouseLeave={() => setHover(null)}>
                                        {cell && !isBlocked ? cell : ""}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="hint-bar">
                    Press <span className="kbd">R</span> to rotate &nbsp;·&nbsp;
                    click any cell the tromino should cover &nbsp;·&nbsp;
                    <span style={{ color: "rgba(255,100,100,0.6)" }}>✕ = blocked cell</span>
                </div>
            </div>
        </>
    );
};

export default TriominoTiling;