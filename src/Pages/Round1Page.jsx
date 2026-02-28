import React, { useEffect, useState } from "react";
import TitleSection from "../Components/TitleSection";
import RulesBox from "../Components/RulesBox";
import BlurBackground from "../Components/BlurBackground";
import { level1Time } from "../assets/Data";

export default function Round1Page() {
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

     <BlurBackground image="/images/Round1bg.jpg" blur="blur-[2px]" />
     <div className="relative z-30 brightness-125 drop-shadow-[0_0_30px_rgba(255,215,0,1)]">
  <div
  className="
    relative z-30
    drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]
    drop-shadow-[0_0_40px_rgba(255,200,0,0.8)]
  "
>
  <TitleSection
    title="THE FIRST WISH"
    shrink={shrink}
    onTransitionEnd={handleTransitionEnd}
  />
</div>

</div>
      <RulesBox
        show={showRules}
        title="Level 1 Rules"
        buttonText="Start Level 1"
        buttonNavigation = "/quiz"
        time = {level1Time}
        rules={[
          "Solve logical challenges within the time limit",
          "No external help is allowed",
          "Each question is worth 5 points",
          "You can retry but it costs 2 points deduction"
        ]}
      />
    </div>
  );
}
