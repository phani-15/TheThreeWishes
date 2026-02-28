import React from "react";
import { useLocation } from "react-router-dom";

export default function UnqualifiedPage() {
  const location = useLocation();
  const { level = "this level" } = location.state || {};

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-start justify-center">

      {/* Background Image with Slight Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
        style={{
          backgroundImage: "url('/images/wasteland.jpg')",
        }}
      />

      {/* Soft Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Transparent Grey Box */}
      <div className="relative z-10 mt-24 px-8 py-10 max-w-3xl w-[90%]
                      bg-gray-500/30
                      backdrop-blur-md
                      border border-gray-400/50
                      rounded-2xl shadow-2xl text-center">

        <h1
          className="text-5xl md:text-6xl tracking-widest mb-6 font-bold text-blue-900 drop-shadow-lg"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          YOU FAILED
        </h1>

        <div className="w-40 h-[2px] bg-blue-900 mx-auto mb-8 opacity-70" />

        <p className="text-xl md:text-2xl font-bold text-blue-950 leading-relaxed">
          You failed {level}.
          <br /><br />
          Now you are deported to the frozen wasteland.
        </p>

        <p className="mt-8 text-sm font-semibold italic text-blue-800">
          The cold does not forgive the unworthy.
        </p>

      </div>
    </div>
  );
}