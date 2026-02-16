import React from "react";

export default function LoginPage() {
  return (
    <div className="relative h-screen w-screen">
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/cave.jpg')] bg-cover bg-center" />

      {/* Centered Form */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-sm rounded-xl p-8 backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          
          <h1 className="mb-6 text-center text-2xl font-bold text-white">
            Login
          </h1>

          <form className="flex flex-col gap-4">
            
            <input
              type="text"
              placeholder="Username"
              className="rounded-md bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="email"
              placeholder="Email"
              className="rounded-md bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <button
              type="submit"
              className="mt-2 rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Login
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
