import { useState, useEffect, useRef } from "react";

const DISK_COUNT = 4;
const DISK_HEIGHT = 52;

const DISK_COLORS = [
  { bg: "linear-gradient(135deg, #f97316, #ea580c)", shadow: "rgba(249,115,22,0.6)", border: "#fed7aa" },
  { bg: "linear-gradient(135deg, #a855f7, #7c3aed)", shadow: "rgba(168,85,247,0.6)", border: "#e9d5ff" },
  { bg: "linear-gradient(135deg, #06b6d4, #0891b2)", shadow: "rgba(6,182,212,0.6)", border: "#a5f3fc" },
  { bg: "linear-gradient(135deg, #10b981, #059669)", shadow: "rgba(16,185,129,0.6)", border: "#a7f3d0" },
];

const generateDisks = () =>
  Array.from({ length: DISK_COUNT }, (_, i) => ({
    id: `disk${i + 1}`,
    size: DISK_COUNT - i,
    tower: 1,
    colorIndex: i,
  }));

const OPTIMAL_MOVES = Math.pow(2, DISK_COUNT) - 1;

export default function HanoiGame({ onWin }) {
  const [disks, setDisks] = useState(generateDisks());
  const [draggedDisk, setDraggedDisk] = useState(null);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [message, setMessage] = useState("");
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [shakeTower, setShakeTower] = useState(null);
  const [particles, setParticles] = useState([]);
  const [hoverTower, setHoverTower] = useState(null);
  const msgTimeout = useRef(null);

  const getTowerDisks = (towerNum) =>
    disks.filter((d) => d.tower === towerNum).sort((a, b) => b.size - a.size);

  const flashMessage = (msg) => {
    if (msgTimeout.current) clearTimeout(msgTimeout.current);
    setMessage(msg);
    msgTimeout.current = setTimeout(() => setMessage(""), 1800);
  };

  const spawnParticles = () => {
    const pts = Array.from({ length: 22 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 80,
      y: 50 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 6,
      vy: -(Math.random() * 5 + 2),
      color: DISK_COLORS[i % DISK_COLORS.length].shadow,
      size: Math.random() * 8 + 4,
    }));
    setParticles(pts);
    setTimeout(() => setParticles([]), 1400);
  };

  const attemptMove = (toDisk, toTower) => {
    const moveDisk = selectedDisk || draggedDisk;
    if (!moveDisk) return;

    const targetTower = getTowerDisks(toTower);
    const topTarget = targetTower[targetTower.length - 1];

    if (topTarget && topTarget.size < moveDisk.size) {
      setShakeTower(toTower);
      setTimeout(() => setShakeTower(null), 500);
      flashMessage("Can't place larger on smaller ✗");
      setDraggedDisk(null);
      setSelectedDisk(null);
      return;
    }

    if (moveDisk.tower === toTower) {
      setSelectedDisk(null);
      setDraggedDisk(null);
      return;
    }

    const updated = disks.map((d) =>
      d.id === moveDisk.id ? { ...d, tower: toTower } : d
    );
    setDisks(updated);
    setDraggedDisk(null);
    setSelectedDisk(null);
    setMoves((prev) => prev + 1);
    setMessage("");

    if (updated.filter((d) => d.tower === 3).length === DISK_COUNT) {
      setWon(true);
      spawnParticles();
      onWin && onWin();
    }
  };

  const handleDiskClick = (disk) => {
    if (won) return;
    const towerDisks = getTowerDisks(disk.tower);
    const topDisk = towerDisks[towerDisks.length - 1];
    if (topDisk.id !== disk.id) {
      flashMessage("Only top disk can move");
      return;
    }
    if (selectedDisk?.id === disk.id) {
      setSelectedDisk(null);
    } else {
      setSelectedDisk(disk);
    }
  };

  const handleTowerClick = (towerNum) => {
    if (won) return;
    if (selectedDisk) {
      attemptMove(null, towerNum);
    } else {
      const towerDisks = getTowerDisks(towerNum);
      if (towerDisks.length > 0) {
        const top = towerDisks[towerDisks.length - 1];
        setSelectedDisk(top);
      }
    }
  };

  const handleDragStart = (e, disk) => {
    if (won) return;
    const towerDisks = getTowerDisks(disk.tower);
    const topDisk = towerDisks[towerDisks.length - 1];
    if (topDisk.id !== disk.id) { e.preventDefault(); return; }
    setDraggedDisk(disk);
    setSelectedDisk(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (towerNum) => {
    if (!draggedDisk) return;
    attemptMove(null, towerNum);
  };

  const handleReset = () => {
    setDisks(generateDisks());
    setDraggedDisk(null);
    setSelectedDisk(null);
    setMessage("");
    setMoves(0);
    setWon(false);
    setParticles([]);
  };

  const pct = Math.min(100, Math.round((moves / OPTIMAL_MOVES) * 100));

  return (
    <div
    className="rounded-2xl w-[70vw]"
    style={{
      background: "radial-gradient(ellipse at 20% 10%, #1a0a2e 0%, #0d0d1a 40%, #050510 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "32px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <Stars />

      <div 
      className="rounded-2xl"
      style={{ position:"absolute", top:"-120px", left:"10%",
        background:"radial-gradient(circle, rgba(99,40,180,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-80px", right:"5%", width:"350px", height:"350px",
        background:"radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

      {particles.map(p => (
        <div key={p.id} style={{
          position:"fixed", left:`${p.x}%`, top:`${p.y}%`,
          width:`${p.size}px`, height:`${p.size}px`,
          borderRadius:"50%", background:p.color,
          pointerEvents:"none", zIndex:100,
          animation:"floatUp 1.4s ease-out forwards",
        }} />
      ))}

      <div style={{ textAlign:"center", marginBottom:"28px", position:"relative", zIndex:1 }} >
        <div style={{ fontSize:"11px", letterSpacing:"6px", color:"#7c6fa0", textTransform:"uppercase", marginBottom:"8px" }}>
          Classic Puzzle
        </div>
        <h1 style={{
          fontSize:"clamp(28px, 5vw, 48px)", fontWeight:"normal", margin:0,
          background:"linear-gradient(135deg, #e2d5f8 0%, #a78bfa 40%, #67e8f9 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          letterSpacing:"3px", textShadow:"none",
        }}>
          Towers of Hanoi
        </h1>
        <div style={{ width:"80px", height:"1px", background:"linear-gradient(90deg, transparent, #7c3aed, transparent)", margin:"12px auto 0" }} />
      </div>

      <div 
      className="mb-10"
      style={{
        display:"flex", gap:"24px",
        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:"16px", padding:"14px 32px", backdropFilter:"blur(10px)",
        position:"relative", zIndex:1,
      }}>
        <Stat label="Moves" value={moves} />
        <div style={{ width:"1px", background:"rgba(255,255,255,0.1)" }} />
        <Stat label="Optimal" value={OPTIMAL_MOVES} />
        <div style={{ width:"1px", background:"rgba(255,255,255,0.1)" }} />
        <Stat label="Efficiency" value={moves === 0 ? "—" : (moves <= OPTIMAL_MOVES ? "✦ Perfect" : `+${moves - OPTIMAL_MOVES}`)} accent={moves > 0 && moves <= OPTIMAL_MOVES} />
      </div>

      <div style={{
        display:"flex", gap:"clamp(16px, 4vw, 52px)", position:"relative", zIndex:1,
        alignItems:"flex-end",
      }}>
        {[1, 2, 3].map((towerNum) => {
          const towerDisks = getTowerDisks(towerNum);
          const isShaking = shakeTower === towerNum;
          const isHovered = hoverTower === towerNum;
          const isTarget = towerNum === 3;

          return (
            <div
              key={towerNum}
              onClick={() => handleTowerClick(towerNum)}
              onDragOver={(e) => { e.preventDefault(); setHoverTower(towerNum); }}
              onDragLeave={() => setHoverTower(null)}
              onDrop={() => { handleDrop(towerNum); setHoverTower(null); }}
              style={{
                position:"relative",
                width:"clamp(180px, 22vw, 240px)",
                height:"280px",
                display:"flex", alignItems:"flex-end", justifyContent:"center",
                cursor: selectedDisk ? "pointer" : "default",
                animation: isShaking ? "shake 0.5s ease" : "none",
              }}
            >
              {/* Tower base */}
              <div style={{
                position:"absolute", bottom:0,
                width:"100%", height:"18px",
                background: isTarget
                  ? "linear-gradient(90deg, #064e3b, #10b981, #064e3b)"
                  : "linear-gradient(90deg, #1e1040, #4c1d95, #1e1040)",
                borderRadius:"10px",
                boxShadow: isTarget
                  ? "0 0 18px rgba(16,185,129,0.5), 0 4px 12px rgba(0,0,0,0.6)"
                  : "0 0 12px rgba(124,58,237,0.3), 0 4px 12px rgba(0,0,0,0.6)",
                transition:"all 0.3s",
              }} />

              {/* Pole */}
              <div style={{
                position:"absolute", bottom:"16px",
                width:"10px", height:"250px",
                background: isTarget
                  ? "linear-gradient(180deg, #6ee7b7, #059669, #6ee7b7)"
                  : "linear-gradient(180deg, #a78bfa, #5b21b6, #a78bfa)",
                borderRadius:"6px",
                boxShadow: isTarget
                  ? "0 0 14px rgba(16,185,129,0.4)"
                  : "0 0 10px rgba(139,92,246,0.4)",
              }} />

              {/* Tower label */}
              <div style={{
                position:"absolute", top:"-28px",
                fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase",
                color: isTarget ? "#6ee7b7" : "#9d8ec4",
                fontFamily:"monospace",
              }}>
                {isTarget ? "★ Goal" : `Tower ${towerNum}`}
              </div>

              {/* Drop zone highlight */}
              {(isHovered || (selectedDisk && isHovered)) && (
                <div style={{
                  position:"absolute", inset:0, borderRadius:"12px",
                  background:"rgba(168,85,247,0.08)", border:"1px dashed rgba(168,85,247,0.4)",
                  pointerEvents:"none",
                }} />
              )}

              {/* Disks */}
              {towerDisks.map((disk, index) => {
                const col = DISK_COLORS[disk.colorIndex % DISK_COLORS.length];
                const isTop = index === towerDisks.length - 1;
                const isSelected = selectedDisk?.id === disk.id;
                const w = 40 + disk.size * 38;

                return (
                  <div
                    key={disk.id}
                    draggable={isTop && !won}
                    onDragStart={(e) => handleDragStart(e, disk)}
                    onClick={(e) => { e.stopPropagation(); handleDiskClick(disk); }}
                    style={{
                      position:"absolute",
                      height:`${DISK_HEIGHT - 6}px`,
                      width:`${w}px`,
                      bottom:`${18 + index * DISK_HEIGHT}px`,
                      left:"50%", transform:`translateX(-50%) ${isSelected ? "translateY(-10px) scale(1.06)" : ""}`,
                      background: col.bg,
                      borderRadius:"10px",
                      border:`2px solid ${isSelected ? "white" : col.border}`,
                      boxShadow: isSelected
                        ? `0 0 0 3px white, 0 0 24px ${col.shadow}, 0 8px 20px rgba(0,0,0,0.5)`
                        : `0 0 14px ${col.shadow}, 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)`,
                      cursor: isTop && !won ? "grab" : "default",
                      transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                      zIndex: isSelected ? 20 : 10,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}
                  >
                    {/* Disk shine */}
                    <div style={{
                      position:"absolute", top:"3px", left:"10%", right:"10%", height:"35%",
                      background:"linear-gradient(180deg, rgba(255,255,255,0.3), transparent)",
                      borderRadius:"6px 6px 0 0", pointerEvents:"none",
                    }} />
                    {/* Disk number */}
                    <span style={{ fontSize:"11px", fontWeight:"bold", color:"rgba(255,255,255,0.7)", fontFamily:"monospace", letterSpacing:"1px" }}>
                      {disk.size}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div style={{
        marginTop:"28px", minHeight:"40px", textAlign:"center", position:"relative", zIndex:1,
      }}>
        {message && !won && (
          <div style={{
            fontSize:"15px", color:"#f87171",
            background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)",
            borderRadius:"10px", padding:"8px 20px",
            animation:"fadeSlideIn 0.3s ease",
          }}>
            {message}
          </div>
        )}
        {won && (
          <div style={{
            fontSize:"22px", fontWeight:"normal", letterSpacing:"2px",
            background:"linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"fadeSlideIn 0.5s ease",
          }}>
            ✦ Solved in {moves} moves ✦
          </div>
        )}
      </div>

      {/* Hint */}
      {!won && (
        <p style={{ color:"#4b4069", fontSize:"12px", marginTop:"16px", letterSpacing:"1px", position:"relative", zIndex:1 }}>
          Click a disk to select · drag to move · click a tower to place
        </p>
      )}

      {/* Buttons */}
      <div style={{ display:"flex", gap:"12px", marginTop:"20px", position:"relative", zIndex:1 }}>
        <button
          onClick={handleReset}
          style={{
            padding:"10px 28px",
            background:"linear-gradient(135deg, #4c1d95, #7c3aed)",
            border:"1px solid rgba(167,139,250,0.4)",
            borderRadius:"12px", color:"#e9d5ff",
            fontSize:"14px", letterSpacing:"1.5px", cursor:"pointer",
            boxShadow:"0 0 20px rgba(124,58,237,0.3), 0 4px 12px rgba(0,0,0,0.4)",
            transition:"all 0.2s",
            fontFamily:"inherit",
          }}
          onMouseEnter={e => e.target.style.transform="scale(1.04)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}
        >
          Reset
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        @keyframes fadeSlideIn {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes floatUp {
          0%{opacity:1;transform:translate(0,0) scale(1)}
          100%{opacity:0;transform:translate(calc(var(--vx,0)*60px), -100px) scale(0)}
        }
        @keyframes twinkle {
          0%,100%{opacity:0.2} 50%{opacity:0.9}
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ textAlign:"center", minWidth:"70px" }}>
      <div style={{ fontSize:"22px", fontWeight:"normal", color: accent ? "#6ee7b7" : "#e2d5f8", letterSpacing:"1px" }}>
        {value}
      </div>
      <div style={{ fontSize:"10px", color:"#6b5e8a", letterSpacing:"2px", textTransform:"uppercase", marginTop:"2px" }}>
        {label}
      </div>
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute",
          left:`${s.x}%`, top:`${s.y}%`,
          width:`${s.size}px`, height:`${s.size}px`,
          borderRadius:"50%", background:"white",
          animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}