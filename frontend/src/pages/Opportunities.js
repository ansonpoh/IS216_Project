import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../styles/Opportunities.css";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `http://localhost:3001/events/get_all_events`;
    setLoading(true);

    fetch(url)
      .then(async (res) => {
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          console.error("Failed to parse JSON:", text);
          throw new Error("Invalid JSON response");
        }

        const data = Array.isArray(json.result) ? json.result : [];

        const normalized = data.map((it) => {
          const get = (...keys) => {
            for (const k of keys) {
              if (it[k] !== undefined && it[k] !== null) return it[k];
            }
            return undefined;
          };

          const toNumber = (v) => {
            if (v == null || v === "") return null;
            const n = Number(v);
            return Number.isNaN(n) ? null : n;
          };

          return {
            event_id: get("event_id", "id"),
            title: get("title") || "Untitled opportunity",
            description: get("description") || "",
            location: get("location") || "",
            capacity: toNumber(get("capacity")) || null,
            start_date: get("start_date", "date") || null,
            end_date: get("end_date", "date") || null,
            start_time: get("start_time") || null,
            end_time: get("end_time") || null,
            hours: toNumber(get("hours")) || null,
            status: get("status") || "pending",
            category: get("category") || "general",
            region: get("region") || null,
            image_url: get("image_url") || null,
          };
        });

        setOpportunities(normalized);
      })
      .catch((err) => {
        console.error("❌ Failed to load opportunities", err);
        setOpportunities([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading opportunities...</p>
      </>
    );
  }

  if (opportunities.length === 0) {
    return (
      <>
        <Navbar />
        <p>No opportunities found.</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <h1>Opportunities</h1>
      <div className="card-grid">
        {opportunities.map((op) => (
          <div className="event-card" key={op.event_id}>
            <div className="card-image">
              {op.image_url && <img src={op.image_url} alt={op.title} />}
              <span className={`status-badge ${op.status}`}>{op.status}</span>
            </div>

            <div className="card-content">
              <h2 className="event-title">{op.title}</h2>
              <p>{op.description}</p>
              <div className="card-info">
                {/* TODO: possibly change the emojis to icons for cleaner look? */}
                <p>
                  📍 <span className="info-text">{op.location || "N/A"}</span>
                </p>
                <p>
                  🗓️{" "}
                  <span className="info-text">
                    {formatDate(op.start_date)} {formatTime(op.start_time)} -{" "}
                    {formatTime(op.end_time)}
                  </span>
                </p>
                <p>
                  👥Capacity: {op.capacity ?? "N/A"}
                </p>
              </div>
            </div>

            <hr className="card-divider" />

            {/* FIXME: ensure the category tag and sign up button are properly aligned, also need to link to the sign-up page for each opportunity */}

            <div className="card-footer">
              <span className="category-tag">
                {op.category ?? "Uncategorized"}
              </span>
              <button className="signup-btn">Sign Up</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-SG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString("en-SG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
