import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles/ChatBubble.css";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}>
      {!isUser && (
        <div className="avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
          <i className="bi bi-robot"></i>
        </div>
      )}
      <div
        className={`chat-bubble p-3 ${
          isUser ? "user-bubble bg-primary text-white" : "bot-bubble bg-light"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="avatar ms-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
          <i className="bi bi-person"></i>
        </div>
      )}
    </div>
  );
}
