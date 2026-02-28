import React, { useEffect, useState } from "react";
import BlurBackground from "../Components/BlurBackground";

export default function GameWinning() {
  const [removeBlur, setRemoveBlur] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRemoveBlur(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center text-white">

      {/* Background */}
      <div className="absolute inset-0 transition-all duration-1000">
        <BlurBackground
          image="/images/GameWinningbg.png"
          blur={removeBlur ? "blur-none" : "blur-md"}
        />
      </div>

      {/* Coin Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(40)].map((_, i) => {
          const duration = 3 + Math.random() * 4;
          const delay = Math.random() * 5;
          const size = 18 + Math.random() * 20;
          const opacity = 0.3 + Math.random() * 0.7;

          return (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                fontSize: `${size}px`,
                opacity: opacity,
                animation: `coinFall ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              🪙
            </span>
          );
        })}
      </div>

      {/* Center Content */}
      <div className="relative z-30 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-widest
                       text-transparent bg-clip-text
                       bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500
                       drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]">
          YOU HAVE WON THE TREASURE
        </h1>

        <div className="w-48 h-[2px] my-8
                        bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Victory favors the bold. The treasure is yours.
        </p>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes coinFall {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}