import React from "react";
import genieImg from "../assets/genie.png";
import aladdinImg from "../assets/aladdin1.png";

function MessageBubble({ sender, text }) {
  return (
    <div className={`message-row ${sender}`}>
      {sender === "genie" && (
        <img src={genieImg} alt="Genie" className="character-img" />
      )}

      <div className={`message-box ${sender}`}>
        {text}
      </div>

      {sender === "aladdin" && (
        <img src={aladdinImg} alt="Aladdin" className="character-img" />
      )}
    </div>
  );
}

export default MessageBubble;
