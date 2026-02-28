import React, { useEffect, useState } from "react";
import TitleSection from "../Components/TitleSection";
import RulesBox from "../Components/RulesBox";
import BlurBackground from "../Components/BlurBackground";
import { useNavigate } from "react-router-dom";
import { level2Time } from "../assets/Data";

export default function Round2Page() {
  const navigate = useNavigate();
  const [shrink, setShrink] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShrink(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (shrink) setShowRules(true);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      {/* Reusable Blur Background */}
      <BlurBackground image="/images/Round2bg.jpg" />

      <div className="relative z-30 brightness-125 drop-shadow-[0_0_30px_rgba(255,215,0,1)]">
        <div
          className="
            relative z-30
            drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]
            drop-shadow-[0_0_40px_rgba(255,200,0,0.8)]
          "
        >
          <TitleSection
            title="THE SECOND WISH"
            shrink={shrink}
            onTransitionEnd={handleTransitionEnd}
          />
        </div>
      </div>

      <RulesBox
        show={showRules}
        title="Level 2 Rules"
        buttonText="Start Level 2"
        buttonNavigation="/round2"
        variant="gold"
        time={level2Time}
        rules={[
          "The grid contains 9 cells (3 × 3).",
          "Each cell contains one puzzle.",
          "You must solve a puzzle to unlock and move to the next cell.", 
          "You can move only to adjacent cells:", 
         //, 
          "Diagonal movement is NOT allowed.", 
          "You cannot revisit a completed cell."
        ]}
      />

    </div>
  );
}