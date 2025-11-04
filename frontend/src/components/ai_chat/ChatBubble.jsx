import React, {useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../../styles/ChatBubble.module.css";
import {useNavigate} from "react-router-dom"
import { useAuth } from "../../contexts/AuthProvider";
import profileImg from "../../components/images/profile.png";
import avatar from "../../components/images/avatar.png";
import axios from "axios";

export default function ChatBubble({ message, onOptionClick }) {
  const isUser = message.role === "user";
  const nav = useNavigate();
  const [image, setImage] = useState(null);
  const events = message.events
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"
  const {auth} = useAuth();

  useEffect(() => {
    const fetch_org = async () => {
      try {
        const org = await axios.get(`${API_BASE}/orgs/get_org_by_id`, {params: {id: auth.id}});
        const data = org.data.result?.[0];
        if (data && data.profile_image) {
          setImage(data.profile_image);
        }
      } catch (err) {
        console.error("Error fetching org profile:", err);
      }
    }

    const fetch_user = async () => {
      try {
        const user = await axios.get(`${API_BASE}/users/get_user_by_id`, {params: {id: auth.id}})
        const data = user.data.result?.[0];
        if (data && data.profile_image) {
          setImage(data.profile_image);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }

    if(auth.id.length > 0) {
      if(auth.role === "volunteer") {
        fetch_user();
        console.log("vol")
      } else if(auth.role === "organiser") {
        console.log("org")
        fetch_org();
      }
    }

  }, []);

  return (

    <div className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}>
      {!isUser && (
        <div className={`${styles.avatar} me-2 rounded-circle overflow-hidden d-flex align-items-center justify-content-center`}>
          <img src={profileImg} alt="Assistant" className={`${styles['avatar-img']}`} />
        </div>
      )}
      <div
        className={`${styles['chat-bubble']} p-3 ${
          isUser
            ? `${styles['user-bubble']} text-white`
            : `${styles['bot-bubble']} bg-white`
        }`}

      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>

        {message.options && message.options.length > 0 && (
          <div className={`${styles['options-container']}`}>
            {message.options.map((option, index) => (
              <button key={index} className={`${styles['option-button']}`} onClick={() => onOptionClick("Show me " + option + " events")}>
                {option}
              </button>
            ))}
          </div>
        )}

        {message.events && message.events.length > 0 && (
          <div className={`${styles['event-card-grid']} mt-3`}>
            {message.events.map((event, i) => (
              <div key={i} className={`${styles['event-card']} mb-3 shadow-sm border rounded-4 overflow-hidden`}>

                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <div>
                      <h5 className="fw-semibold mb-2">{event.title}</h5>
                      <div className="text-secondary mb-1">{event.organization}</div>
                    </div>
                  </div>

                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className={`${styles['event-card-img']} mb-3`}/>
                  )}

                  {event.match && (
                    <div className="small mb-2">
                      <span className="fw-bold text-success">{event.match}%</span>{" "}
                      <span className="text-muted">match</span>
                    </div>
                  )}

                  <div className="text-muted small mb-2">
                    <div><span className="me-1" aria-hidden="true">📍</span>{event.location}</div>
                    <div><span className="me-1" aria-hidden="true">⏰</span>{event.date}, {event.time}</div>
                    {event.skills && (
                      <div><span className="me-1" aria-hidden="true">🌟</span>{event.skills}</div>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-4">

                    <button
                      className={`${styles['learn-btn']} btn flex-grow-1`}
                      onClick={() => nav('/opportunities', { state: { eventId: event?.event_id || event?.id || null, title: event?.title || null } })}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className={`${styles['view-all-container']} text-center mt-3`}>
              <button className={`${styles['view-all-btn']} btn btn-outline-secondary`} onClick={() => nav("/map", {state: {events}})}>
                <i className="bi bi-map me-2"></i>View All on Map
              </button>
            </div>
          </div>
        )}

      </div>
      {isUser && (
        <div className={`${styles.avatar} ms-2 rounded-circle overflow-hidden d-flex align-items-center justify-content-center`}>
          <img
            src={image || avatar}
            alt="User"
            className={`${styles['avatar-img']}`}
          />
        </div>
      )}
    </div>
  );
}
