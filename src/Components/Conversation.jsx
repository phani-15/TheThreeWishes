import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import { useNavigate } from "react-router-dom";

function Conversation({}) {
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
    { sender: "genie", text: "The Map to Agrabah, The Invisible Magic Potion and the Key of Golden Treasure." },
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

  const navigate  = useNavigate()

  return (
    <div className="conversation">
      {messages.map((msg, i) => (
        <MessageBubble key={i} sender={msg.sender} text={msg.text} />
      ))}

      {showStart && (
        <div className="start-section">
          <button
          onClick={()=>navigate('/round1')}
            className="py-3 px-9 text-[18px] border-none rounded-[30px] bg-linear-to-r italic from-blue-950 via-indigo-900 to-purple-900 cursor-pointer transition duration-300 ease-in-out transform hover:from-purple-800 hover:to-blue-800 hover:scale-105"
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
