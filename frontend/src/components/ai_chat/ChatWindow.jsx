import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import styles from "../../styles/ChatWindow.module.css";

import { useAuth } from "../../contexts/AuthProvider";

export default function ChatWindow() {
  const { messages, setMessages } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"
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
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("chatMessages");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setLoading(true);
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Hello! I'm Vera, your personal assistant to discover meaningful volunteering opportunities. How can I help you get started today?",
          },
        ]);
        setLoading(false);
      },"");
    }
  }, []); // intentionally only on mount

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);
    setShowSuggestions(false);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        userMessage: userMessage,
        history: messages,
      });

      const data = res.data;
      if (data.success) {
        const reply = data.reply || {};
        const paragraph = reply.paragraph?.trim() || "I'm not sure how to respond.";
        const events = Array.isArray(reply.events) ? reply.events : [];
        const options = Array.isArray(reply.options) ? reply.options : [];
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: paragraph,
            events: events.length > 0 ? events : null,
            options: options.length > 0 ? options : null,
          },
        ]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: `Error: ${data.error}` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Error connecting to AI server." }]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  // handle clicking one of the cards
  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  const handleOptionClick = (option) => {
    setMessages((prev) => {
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === "assistant" && updated[i].options) {
          updated[i] = { ...updated[i], options: null };
          break;
        }
      }
      return updated;
    });
    sendMessage(option);
  };

  return (
    <div className={`${styles['chat-container']} mx-auto mt-4`}>
      <div className={`${styles['chat-box']} p-3`} ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} onOptionClick={handleOptionClick} />
        ))}

        {/* typing animation */}
        {loading && (
          <div className="d-flex align-items-center">
            {/* <div className={`${styles.avatar} me-2 text-white rounded-circle d-flex align-items-center justify-content-center`}>
              <i className="bi bi-person-hearts"></i>
            </div> */}
            <div className={`${styles['bot-bubble']} p-3 bg-light`}>
              <div className={`${styles['typing-dots']}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Quick-response cards */}
        {messages.length < 2 && (
          <div className={`${styles['suggestion-section']} text-center mt-4`}>
            <div className="d-grid gap-3">
              <button
                className={`btn btn-outline-secondary text-start ${styles['suggestion-card']}`}
                onClick={() => handleSuggestionClick("I'm new to volunteering")}
              >
                <span className="me-2" aria-hidden="true">💖</span>
                <strong>I'm new to volunteering</strong>
                <br />
                <small>Help me find the perfect first opportunity</small>
              </button>

              <button
                className={`btn btn-outline-secondary text-start ${styles['suggestion-card']}`}
                onClick={() => handleSuggestionClick("I have limited time")}
              >
                <span className="me-2" aria-hidden="true">⏰</span>
                <strong>I have limited time</strong>
                <br />
                <small>Find flexible opportunities that fit my schedule</small>
              </button>

              {/* <button
                className={`btn btn-outline-secondary text-start ${styles['suggestion-card']}`}
                onClick={() => handleSuggestionClick("Use my professional skills")}
              >
                <i className="bi bi-bullseye text-primary me-2"></i>
                <strong>Use my professional skills</strong>
                <br />
                <small>Match my expertise with meaningful causes</small>
              </button> */}
            </div>
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}