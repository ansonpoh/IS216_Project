import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `http://localhost:3001/events/get_all_events`;
    setLoading(true);
    console.log("Fetching opportunities from:", url);

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

        console.log("Opportunities response:", res.status, json);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

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

          const lat = toNumber(get("latitude", "lat"));
          const lng = toNumber(get("longitude", "lng"));

          return {
            event_id: get("event_id", "id"),
            title: get("title", "name") || "Untitled opportunity",
            description: get("description", "summary", "details", "desc") || "",
            location: get("location", "postalcode", "address") || "",
            capacity: toNumber(get("capacity", "volunteersNeeded")) || null,
            date: get("date", "event_date", "created_at") || null,
            start_time: get("start_time", "start") || null,
            end_time: get("end_time", "end") || null,
            hours: toNumber(get("hours")) || null,
            status: get("status") || null,
            category: get("category") || null,
            latitude: lat,
            longitude: lng,
            image_url: get("image_url", "image", "imageUrl") || null,
            skills:
              Array.isArray(it.skills)
                ? it.skills
                : typeof it.skills === "string" && it.skills.length
                ? it.skills.split(",").map((s) => s.trim())
                : [],
            raw: it,
          };
        });

        console.log("Normalized opportunities sample:", normalized[0]);
        setOpportunities(normalized);
      })
      .catch((err) => {
        console.error("❌ Failed to load opportunities", err);
        setOpportunities([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Render starts here ---
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
      <ul style={{ listStyle: "none", padding: 0 }}>
        {opportunities.map((op) => (
          <li
            key={op.event_id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h2>{op.title}</h2>
            <p>{op.description}</p>
            <p>
              <strong>Location:</strong> {op.location} <br />
              <strong>Capacity:</strong> {op.capacity ?? "N/A"} <br />
              <strong>Date:</strong>{" "}
              {op.date ? new Date(op.date).toLocaleDateString() : "N/A"} <br />
              <strong>Category:</strong> {op.category ?? "N/A"} <br />
              <strong>Skills:</strong>{" "}
              {op.skills.length > 0 ? op.skills.join(", ") : "None"}
            </p>
            {op.image_url && (
              <img
                src={op.image_url}
                alt={op.title}
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
