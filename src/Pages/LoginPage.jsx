import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventTime } from "../assets/Data";
import api from "../api"; // Custom axios instance

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = eventTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isEventStarted, setIsEventStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      if (
        updatedTime.days === 0 &&
        updatedTime.hours === 0 &&
        updatedTime.minutes === 0 &&
        updatedTime.seconds === 0
      ) {
        setIsEventStarted(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEventStarted) {
      alert(
        `Event will start in ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
      );
      return;
    }
    setErrorMsg("");

    try {
      const response = await api.post("/users/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("teamName", response.data.user.teamName);
        navigate("/welcome");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute inset-0 bg-[url('/images/cave.jpg')] bg-cover bg-center" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-sm rounded-xl p-8 backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">
            LOGIN
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-slate-200 text-sm">
                UserName / eMail
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md w-full placeholder-slate-400 bg-white/20 border border-white/30 p-3 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="text-slate-200 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-md w-full placeholder-slate-400 bg-white/20 border border-white/30 p-3 focus:outline-none text-white"
              />
            </div>

            {errorMsg && (
              <div className="text-red-400 text-sm text-center font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!isEventStarted}
              className={`mt-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-900 py-3 font-semibold text-white transition ${isEventStarted
                  ? "cursor-pointer hover:from-purple-700 hover:to-blue-800"
                  : "cursor-not-allowed opacity-70"
                }`}
            >
              {isEventStarted
                ? "Login"
                : `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
