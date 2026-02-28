import { useState, useEffect } from "react";
import TitleSection from "../Components/TitleSection";
import Conversation from "../Components/Conversation";

import caveBg from "../assets/cave.jpg";
import myVideo from "../assets/myVideo.mp4";

function WelcomePage() {
  const [shrinkTitle, setShrinkTitle] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShrinkTitle(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (shrinkTitle) {
      setShowConversation(true);
    }
  };

  // 🔥 Default Page (Title + Conversation)
  return (
    <div className="app">
      <div
        className="background-layer"
        style={{ backgroundImage: `url(${caveBg})` }}
      ></div>

      <div className="content-layer">
        <TitleSection
          title="THE THREE WISHES"
          shrink={shrinkTitle}
          onTransitionEnd={handleTransitionEnd}
/>


        {showConversation && (
          <Conversation />
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
