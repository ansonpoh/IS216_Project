import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import "../../styles/ChatWindow.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if(messages.length === 0) {
      setLoading(true);
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content: "Hello! I'm VolunteerConnect AI, your personal assistant to discover meaningful volunteering opportunities. How can I help you get started today?",
          }
        ])
        setLoading(false)
      }, 1000);
    }
  },[])

  const sendMessage = async (userMessage) => {
    if(!userMessage.trim()) return;

    const newMessages = [...messages, {role: "user", content: userMessage}];
    setMessages(newMessages);
    setLoading(true);
    setShowSuggestions(false);

    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        userMessage: userMessage,
        history: messages,
      });

      const data = res.data;
      console.log(data)
      if(data.success) {
        const reply = data.reply || {};
        const paragraph = reply.paragraph?.trim() || "I'm not sure how to respond.";
        const events = Array.isArray(reply.events) ? reply.events : [];

        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: paragraph,
            events: events.length > 0 ? events : null,
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {role: "assistant", content: `Error: ${data.error}`}
        ])
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to AI server." },
      ]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }

  // handle clicking one of the cards
  const handleSuggestionClick = (text) => {
      sendMessage(text);
  };

  return (
    <div className="chat-container mx-auto mt-4">
        <div className="chat-box p-3" ref={chatBoxRef}>
        {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
        ))}

        {/* typing animation */}
        {loading && (
          <div className="d-flex align-items-center">
            <div className="avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
              <i className="bi bi-robot"></i>
            </div>
            <div className="bot-bubble p-3 bg-light">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Quick-response cards */}
        {showSuggestions && (
          <div className="suggestion-section text-center mt-4">
            {/* <h4 className="fw-semibold">Welcome to VolunteerConnect AI</h4>
            <p className="text-muted">
              I'm here to help you discover meaningful volunteer opportunities
              that match your interests, skills, and schedule.
            </p>
            <h5 className="mt-3 mb-3">
              How can I help you find the perfect volunteer opportunity?
            </h5>
            <p className="text-secondary mb-4">
              Choose a starting point below or ask me anything about
              volunteering
            </p> */}

            <div className="d-grid gap-3">
              <button
                className="btn btn-outline-secondary text-start suggestion-card"
                onClick={() => handleSuggestionClick("I'm new to volunteering")}
              >
                <i className="bi bi-heart-fill text-primary me-2"></i>
                <strong>I'm new to volunteering</strong>
                <br />
                <small>Help me find the perfect first opportunity</small>
              </button>

              <button
                className="btn btn-outline-secondary text-start suggestion-card"
                onClick={() => handleSuggestionClick("I have limited time")}
              >
                <i className="bi bi-clock text-primary me-2"></i>
                <strong>I have limited time</strong>
                <br />
                <small>Find flexible opportunities that fit my schedule</small>
              </button>

              <button
                className="btn btn-outline-secondary text-start suggestion-card"
                onClick={() =>
                  handleSuggestionClick("Use my professional skills")
                }
              >
                <i className="bi bi-bullseye text-primary me-2"></i>
                <strong>Use my professional skills</strong>
                <br />
                <small>Match my expertise with meaningful causes</small>
              </button>

              <button
                className="btn btn-outline-secondary text-start suggestion-card"
                onClick={() => handleSuggestionClick("Make local impact")}
              >
                <i className="bi bi-geo-alt text-primary me-2"></i>
                <strong>Make local impact</strong>
                <br />
                <small>Find ways to help my immediate community</small>
              </button>
            </div>
          </div>
        )}
        </div>

        <ChatInput onSend={sendMessage} />
    </div>
  );
}