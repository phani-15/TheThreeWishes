import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventTime } from "../assets/Data";

const HomePage = () => {
  const navigate = useNavigate();
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

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());
  const [isEventStarted, setIsEventStarted] = React.useState(false);

  React.useEffect(() => {
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

  const [showHeading, setShowHeading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCoordinators, setShowCoordinators] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowHeading(true), 300);
    setTimeout(() => setShowRules(true), 1100);
    setTimeout(() => setShowCoordinators(true), 1900);
    setTimeout(() => setShowButton(true), 2600);
  }, []);

  // Coordinator Data (Easily scalable)
  const coordinators = [
    {
      name: "P.Srinivas",
      role: "Event Coordinator",
      image: "/images/srinivas.jpg", // Replace when friend gives image
    },
    {
      name: "P.Pragna Sudha",
      role: "Event Coordinator",
      image: "/images/pragna.jpg",
    },
    {
      name: "T.Sindhuja",
      role: "Event Coordinator",
      image: "/images/sindhu.jpg",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/cave.jpg"
          alt="Background"
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Page Content */}
      <div className="relative z-10 px-6 sm:px-12 py-12">

        {/* HEADING */}
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ease-out
          ${showHeading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="title-font text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider
                         bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300
                         bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,200,0,0.6)]">
            COME ON !! TAKLE THE CHALLENGE
          </h1>

          <p className="mt-6 text-gray-300 text-lg sm:text-xl leading-relaxed">
            Welcome to an immersive event filled with challenges, strategy and teamwork.
            Read the instructions carefully before beginning your journey.
          </p>
        </div>

      
       {/* RULES */}
<div
  className={`mt-20 max-w-4xl mx-auto transition-all duration-1000 ease-out
  ${showRules ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
>
  <div
    className="bg-white/5 backdrop-blur-xl border border-white/20
               rounded-3xl p-10 sm:p-12
               transition-all duration-500
               hover:bg-white/10
               hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
  >
    <h2 className="title-font text-2xl sm:text-3xl font-semibold text-yellow-400 mb-8 text-center sm:text-left">
      Rules & Instructions
    </h2>

    <ul className="space-y-4 text-gray-300 text-lg sm:text-xl">
      <li>• Each round must be completed within the allotted time.</li>
      <li>• Team coordination is essential for success.</li>
      <li>• No external assistance is allowed.</li>
      <li>• Follow coordinator instructions at all times.</li>
    </ul>
  </div>
</div>
        

        {/* COORDINATORS */}
        <div
          className={`mt-28 max-w-7xl mx-auto transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]
          ${showCoordinators
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-10 blur-sm"
            }`}
        >
          <h2 className="title-font text-3xl sm:text-4xl font-semibold text-yellow-400 text-center mb-16">
            Event Coordinators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {coordinators.map((person, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/20
                           rounded-3xl p-12 text-center
                           transition-all duration-500
                           hover:bg-white/10 hover:scale-105
                           hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                {/* Image */}
                <img
                  src={person.image}
                  draggable={false}
                  alt={person.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover object-[50%_5%] mb-6
                             border-4 border-yellow-400
                             shadow-[0_0_20px_rgba(255,200,0,0.7)]
                             transition-all duration-500 
                             hover:scale-110 hover:shadow-[0_0_35px_rgba(255,200,0,1)]"
                />

                <h3 className="title-font text-2xl font-semibold tracking-wide">
                  {person.name}
                </h3>

                <p className="text-gray-300 text-lg mt-3">
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div
          className={`mt-24 text-center transition-all duration-1000 ease-out
          ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <button
            onClick={() => {
              if (isEventStarted)
                navigate("/login")
            }}
            className="px-12 py-4 rounded-full 
                       bg-gradient-to-r from-yellow-400 to-orange-500 
                       text-black font-bold text-xl
                       hover:scale-110 
                       hover:shadow-[0_0_25px_rgba(255,200,0,0.9)]
                       transition-all duration-300
                       cursor-pointer"
          >
            {isEventStarted
              ? "Login"
              : `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;