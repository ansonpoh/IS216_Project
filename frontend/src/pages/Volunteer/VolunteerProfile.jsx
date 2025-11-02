import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";

export default function VolunteerProfile() {
  const STORAGE_KEY = "volunteer_profile_v1";
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

  // get auth early so we can seed user_id
  const auth = JSON.parse(sessionStorage.getItem("auth")) || {};

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    skills: [],
    languages: [],
    availability: {
      days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      startTime: "",
      endTime: "",
    },
    location: "",
    contact: { email: "", phone: "" },
    emergency: { name: "", relation: "", phone: "" },
    avatarDataUrl: "",
    avatarFile: null,        // new: file object when user selects image
    date_joined: null,
    hours: null,
    user_id: auth?.id || null,
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Save to localStorage + backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    // keep local copy
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    // require auth
    if (!auth?.id) {
      setStatus("Please sign in to save to the server. Local save complete.");
      alert("Please sign in to save profile to server. Local save complete.");
      setSubmitting(false);
      return;
    }

    // compute simple hours (if start/end present) as decimal hours
    function computeHours(start, end) {
      if (!start || !end) return null;
      try {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        let startMinutes = sh * 60 + (sm || 0);
        let endMinutes = eh * 60 + (em || 0);
        // if end earlier than start assume next day
        if (endMinutes < startMinutes) endMinutes += 24 * 60;
        const hours = (endMinutes - startMinutes) / 60;
        return Number(hours.toFixed(2));
      } catch {
        return null;
      }
    }

    const hours = computeHours(formData.availability.startTime, formData.availability.endTime);

    // build payload
    const payloadFields = {
      user_id: auth.id,
      username: formData.username || null,
      email: formData.contact.email || null,
      bio: formData.bio || null,
      date_joined: formData.date_joined || new Date().toISOString(),
      hours: hours,
      full_name: formData.fullName || null,
      skills: formData.skills || [],
      languages: formData.languages || [],
      availability: formData.availability || {},
      availability_start_time: formData.availability.startTime || null,
      availability_end_time: formData.availability.endTime || null,
      location: formData.location || null,
      contact: formData.contact || {},
      contact_phone: formData.contact.phone || null,
      emergency: formData.emergency || {},
      emergency_name: formData.emergency.name || null,
      emergency_relation: formData.emergency.relation || null,
      emergency_phone: formData.emergency.phone || null,
      profile_image: formData.avatarDataUrl || null, // data URL; backend can store or decode
    };

    try {
      // if there's an avatar file, send multipart/form-data so backend can save file
      if (formData.avatarFile) {
        const fd = new FormData();
        Object.entries(payloadFields).forEach(([k, v]) => {
          // For objects/arrays encode as JSON string so backend can parse
          if (v !== null && typeof v === "object") fd.append(k, JSON.stringify(v));
          else if (v !== null) fd.append(k, String(v));
          else fd.append(k, "");
        });
        fd.append("avatar", formData.avatarFile);

        const resp = await axios.post(
          `${LOCAL_BASE}/users/update_profile`,
          fd,
          {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              // DO NOT set Content-Type when sending FormData — browser will set multipart boundary
            },
          }
        );

        if (resp.data?.status) {
          alert("✅ saved will work on this later");
          setStatus("Saved");
        } else {
          console.error("Server response:", resp.data);
          setStatus("Server returned an error. Local copy saved.");
          alert("Profile saved locally but server reported an error.");
        }
      } else {
        // send JSON
        const resp = await axios.post(
          `${LOCAL_BASE}/users/update_profile`,
          payloadFields,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (resp.data?.status) {
          alert("✅ Profile saved to server and localStorage!");
          setStatus("Saved");
        } else {
          console.error("Server response:", resp.data);
          setStatus("Server returned an error. Local copy saved.");
          alert("Profile saved locally but server reported an error.");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus(err.response?.data?.message || err.message || "Failed to save profile to server.");
      alert(`Error saving to server: ${status || err.message}. Local copy saved.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle text field changes
  const handleChange = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      keys.slice(0, -1).forEach((k) => (obj = obj[k]));
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Add/remove tag
  const addTag = (type, tag) => {
    if (!tag.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(tag.trim()) ? prev[type] : [...prev[type], tag.trim()],
    }));
  };

  const removeTag = (type, tag) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t !== tag),
    }));
  };

  // Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // store the File object for upload and the data URL for preview
    setFormData((prev) => ({ ...prev, avatarFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      // update both data url and keep file
      setFormData((prev) => ({ ...prev, avatarDataUrl: ev.target.result, avatarFile: file }));
    };
    reader.readAsDataURL(file);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      fullName: "",
      username: "",
      bio: "",
      skills: [],
      languages: [],
      availability: {
        days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        startTime: "",
        endTime: "",
      },
      location: "",
      contact: { email: "", phone: "" },
      emergency: { name: "", relation: "", phone: "" },
      avatarDataUrl: "",
    });
  };

  return (
    <>
    <Navbar/>
    <div className="container py-4">
      <div className="row g-4">
        {/* === LEFT PREVIEW === */}
        <div className="col-lg-4">
          <div className="card shadow-sm text-center p-3">
            <img
              src={
                formData.avatarDataUrl ||
                "https://via.placeholder.com/140x140?text=No+Photo"
              }
              alt="Avatar"
              className="rounded-circle mb-3"
              style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />
            <h5>{formData.fullName || "Your Name"}</h5>
            <small className="text-muted">@{formData.username || "username"}</small>
            <p className="mt-3 small text-muted">{formData.bio || "Your short bio appears here."}</p>
            <hr />
            <div className="text-start">
              <strong>Skills:</strong>{" "}
              {formData.skills.map((s) => (
                <span key={s} className="badge bg-light text-dark me-1">{s}</span>
              ))}
              <br />
              <strong>Languages:</strong>{" "}
              {formData.languages.map((l) => (
                <span key={l} className="badge bg-light text-dark me-1">{l}</span>
              ))}
              <br />
              <strong>Availability:</strong>{" "}
              {Object.entries(formData.availability.days)
                .filter(([_, v]) => v)
                .map(([k]) => k.toUpperCase())
                .join(", ") || "—"}{" "}
              | {formData.availability.startTime || "—"}–
              {formData.availability.endTime || "—"}
              <br />
              <strong>Location:</strong> {formData.location || "—"} <br />
              <strong>Contact:</strong>{" "}
              {formData.contact.email || "—"} {formData.contact.phone && `· ${formData.contact.phone}`}
              <br />
              <strong>Emergency:</strong>{" "}
              {[formData.emergency.name, formData.emergency.relation, formData.emergency.phone]
                .filter(Boolean)
                .join(" · ") || "—"}
            </div>
          </div>
        </div>

        {/* === RIGHT FORM === */}
        <div className="col-lg-8">
          <form onSubmit={handleSave}>
            {/* Profile Photo & Name */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Profile Photo & Name</h5>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="form-control mb-3"
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Bio / Short Description</h5>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>
            </div>

            {/* Skills & Languages */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Skills & Languages</h5>
                <TagInput
                  title="Skills"
                  items={formData.skills}
                  onAdd={(v) => addTag("skills", v)}
                  onRemove={(v) => removeTag("skills", v)}
                />
                <TagInput
                  title="Languages"
                  items={formData.languages}
                  onAdd={(v) => addTag("languages", v)}
                  onRemove={(v) => removeTag("languages", v)}
                />
              </div>
            </div>

            {/* Availability */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Availability</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {Object.keys(formData.availability.days).map((day) => (
                    <div key={day} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.availability.days[day]}
                        onChange={(e) =>
                          handleChange(`availability.days.${day}`, e.target.checked)
                        }
                        id={day}
                      />
                      <label htmlFor={day} className="form-check-label">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="row">
                  <div className="col">
                    <label>Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.availability.startTime}
                      onChange={(e) => handleChange("availability.startTime", e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label>End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.availability.endTime}
                      onChange={(e) => handleChange("availability.endTime", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Location / Preferred Area</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Central, East, etc."
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Contact Info</h5>
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.contact.email}
                  onChange={(e) => handleChange("contact.email", e.target.value)}
                />
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone"
                  value={formData.contact.phone}
                  onChange={(e) => handleChange("contact.phone", e.target.value)}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5>Emergency Contact</h5>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Name"
                  value={formData.emergency.name}
                  onChange={(e) => handleChange("emergency.name", e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Relationship"
                  value={formData.emergency.relation}
                  onChange={(e) => handleChange("emergency.relation", e.target.value)}
                />
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone"
                  value={formData.emergency.phone}
                  onChange={(e) => handleChange("emergency.phone", e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>

  );
}

// === Subcomponent: TagInput ===
function TagInput({ title, items, onAdd, onRemove }) {
  const [input, setInput] = useState("");
  const handleAdd = () => {
    onAdd(input);
    setInput("");
  };

  return (
    <div className="mb-3">
      <label className="form-label">{title}</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder={`Add ${title.toLowerCase()}...`}
        />
        <button type="button" className="btn btn-outline-primary" onClick={handleAdd}>
          Add
        </button>
      </div>
      <div>
        {items.map((t) => (
          <span key={t} className="badge bg-light text-dark me-1 mb-1">
            {t}{" "}
            <button
              type="button"
              className="btn btn-sm btn-link p-0 text-danger"
              onClick={() => onRemove(t)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
