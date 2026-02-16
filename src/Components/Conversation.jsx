import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageBubble from "./MessageBubble";

function Conversation({ onStartJourney }) {
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(1);
  const [showStart, setShowStart] = useState(false);
  const bottomRef = useRef(null);

  const dialogue = [
    { sender: "genie", text: "Greetings, Aladdin. You have summoned the guardian of possibilities." },
    { sender: "aladdin", text: "I stand before you with a clear objective — to reach Agrabah." },
    { sender: "genie", text: "Ambition requires preparation." },
    { sender: "genie", text: "You must earn essential assets." },
    { sender: "aladdin", text: "Kindly specify the requirements." },
    { sender: "genie", text: "A camel, jewels, and royal access." },
    { sender: "genie", text: "These will be obtained through three progressive levels." },
    { sender: "aladdin", text: "I accept the challenge." },
    { sender: "genie", text: "Your journey begins now." }
  ];

  useEffect(() => {
    setMessages([dialogue[0]]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const nextMessage = useCallback(() => {
    if (index < dialogue.length) {
      const newMessages = [...messages, dialogue[index]];
      setMessages(newMessages);
      setIndex(prev => prev + 1);

      if (newMessages.length === dialogue.length) {
        setTimeout(() => setShowStart(true), 500);
      }
    }
  }, [index, messages]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") {
        nextMessage();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextMessage]);

  return (
    <div className="conversation">
      {messages.map((msg, i) => (
        <MessageBubble key={i} sender={msg.sender} text={msg.text} />
      ))}

      {showStart && (
        <div className="start-section">
          <button
            className="start-btn"
            onClick={onStartJourney}
          >
            Start Journey
          </button>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default Conversation;
