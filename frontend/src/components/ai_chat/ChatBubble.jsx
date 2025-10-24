import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles/ChatBubble.css";
import {useNavigate} from "react-router-dom"

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";
  const nav = useNavigate();

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

        {message.events && message.events.length > 0 && (
          <div className="event-card-grid mt-3">
            {message.events.map((event, i) => (
              <div key={i} className="event-card mb-3 shadow-sm border rounded-4 overflow-hidden">

                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">

                    <div>
                      <h5 className="fw-semibold mb-2">{event.title}</h5>
                      <div className="text-secondary mb-1">{event.organization}</div>
                    </div>

                    {event.priority && (
                      <span
                        className={`badge ${
                          event.priority === "high"
                            ? "bg-danger-subtle text-danger"
                            : event.priority === "medium"
                            ? "bg-warning-subtle text-warning"
                            : "bg-success-subtle text-success"
                        }`}
                      >
                        {event.priority} priority
                      </span>
                    )}
                  </div>

                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="event-card-img mb-3"/>
                  )}

                  {event.match && (
                    <div className="small mb-2">
                      <span className="fw-bold text-success">{event.match}%</span>{" "}
                      <span className="text-muted">match</span>
                    </div>
                  )}

                  <div className="text-muted small mb-2">
                    <div><i className="bi bi-geo-alt me-1"></i>{event.location}</div>
                    <div><i className="bi bi-clock me-1"></i>{event.date}, {event.time}</div>
                    {event.skills && (
                      <div><i className="bi bi-star me-1"></i>{event.skills}</div>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-primary flex-grow-1">
                      Apply Now
                    </button>

                    <button className="event-btn btn-outline-secondary flex-grow-1">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="view-all-container text-center mt-3">
              <button className="btn-outline-secondary view-all-btn" onClick={() => nav("/maps")}>
                <i className="bi bi-map me-2"></i>View All on Map
              </button>
            </div>
          </div>
        )}

      </div>
      {isUser && (
        <div className="avatar ms-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
          <i className="bi bi-person"></i>
        </div>
      )}
    </div>
  );
}
