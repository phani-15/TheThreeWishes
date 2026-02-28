import React from "react";
import { useNavigate } from "react-router-dom";

function RulesBox({
  show,
  title,
  rules,
  buttonText,
  buttonNavigation,
  time,
  variant = "light"
}) {

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = time - now;

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

  const navigate = useNavigate()
  const lightStyle = `
    backdrop-blur-md 
    bg-white/10 
    border border-white/20
  `;

  const goldenStyle = `
    backdrop-blur-md
    bg-gradient-to-br from-yellow-400/20 via-amber-300/15 to-yellow-600/20
    border border-yellow-400/40
  `;

  const containerPosition = show
    ? "top-36 opacity-100"
    : "top-full opacity-0";

  return (
    <div
      className={`
        absolute left-1/2 transform -translate-x-1/2
        z-20
        w-[650px] max-w-[90%]
        transition-all duration-1000 ease-in-out
        ${containerPosition}
      `}
    >
      {/* Box */}
      <div
        className={`
          ${variant === "gold" ? goldenStyle : lightStyle}
          rounded-2xl
          px-14 py-10
          shadow-2xl
          transition-all duration-300 ease-in-out
          hover:scale-105
        `}
      >
        <h2 className="text-2xl font-semibold tracking-widest text-yellow-300 text-center mb-8 uppercase">
          {title}
        </h2>

        <ul className="space-y-5 text-white text-lg font-light">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="w-2 h-2 mt-2 bg-yellow-400 rounded-full"></span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => {
            if(isEventStarted)
            navigate(buttonNavigation)}}
          className={`px-10 py-4
            bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500
            text-black font-semibold tracking-widest uppercase
            rounded-full
            transition-all duration-300 ease-in-out
            hover:scale-110
            hover:shadow-xl hover:shadow-yellow-400/50
            active:scale-95
            ${isEventStarted?"cursor-pointer" : "cursor-not-allowed"}
            `}
        >
          {isEventStarted?buttonText: `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
        </button>
      </div>
    </div>
  );
}

export default RulesBox;
