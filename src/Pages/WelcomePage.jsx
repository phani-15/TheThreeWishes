import { useState, useEffect } from "react";
import TitleSection from "../components/TitleSection";
import Conversation from "../components/Conversation";

import caveBg from "../assets/cave.jpg";
import myVideo from "../assets/myVideo.mp4";
import map1 from "../assets/map1.jpg";

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

  const handleStartJourney = () => {
    setShowVideo(true);
  };

  // 🔥 Video Page with Blurred Background
  if (showVideo) {
    return (
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Blurred Map Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${map1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(10px)",
            transform: "scale(1.1)", // prevents blur edges
          }}
        ></div>

        {/* Video Layer */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            src={myVideo}
            autoPlay
            playsInline
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    );
  }

  // 🔥 Default Page (Title + Conversation)
  return (
    <div className="app">
      <div
        className="background-layer"
        style={{ backgroundImage: `url(${caveBg})` }}
      ></div>

      <div className="content-layer">
        <TitleSection
          shrink={shrinkTitle}
          onTransitionEnd={handleTransitionEnd}
        />

        {showConversation && (
          <Conversation onStartJourney={handleStartJourney} />
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
