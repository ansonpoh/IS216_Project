import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import modalStyles from "../../styles/Modals.module.css";
import "../../styles/VolunteerProfile.css";

export default function VolunteerProfile() {
  const STORAGE_KEY = "volunteer_profile_v1";
  // get auth early so we can seed user_id
  const auth = JSON.parse(sessionStorage.getItem("auth")) || {};

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  // Fetch user profile from backend when authenticated
  useEffect(() => {
    async function fetchUser() {
      try {
        if (!auth?.id) return;
        setStatus("Loading profile from server...");
        const resp = await api.get(`/users/get_user_by_id`, { params: { id: auth.id } });
        const rows = resp.data?.result;
        if (!rows || rows.length === 0) {
          setStatus("No profile found on server");
          return;
        }

        const u = rows[0];

        // helper to safely parse JSON strings returned from DB
        const parseMaybeJson = (v) => {
          if (v === null || v === undefined) return null;
          if (typeof v === "object") return v;
          try {
            return JSON.parse(v);
          } catch {
            return v;
          }
        };

        const availability = parseMaybeJson(u.availability) || {
          days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
          startTime: u.availability_start_time || "",
          endTime: u.availability_end_time || "",
        };

        // Map backend fields to formData shape
        const mapped = {
          fullName: u.full_name || u.fullName || "",
          username: u.username || "",
          bio: u.bio || "",
          skills: parseMaybeJson(u.skills) || [],
          languages: parseMaybeJson(u.languages) || [],
          availability: {
            days: (availability.days) || { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
            startTime: u.availability_start_time || availability.startTime || "",
            endTime: u.availability_end_time || availability.endTime || "",
          },
          location: u.location || "",
          contact: parseMaybeJson(u.contact) || { email: u.email || "", phone: u.contact_phone || "" },
          emergency: parseMaybeJson(u.emergency) || { name: u.emergency_name || "", relation: u.emergency_relation || "", phone: u.emergency_phone || "" },
          avatarDataUrl: u.profile_image || u.profileImage || "",
          date_joined: u.date_joined || null,
          hours: u.hours || null,
          user_id: u.user_id || auth.id,
        };

        setFormData((prev) => ({ ...prev, ...mapped }));
        setStatus("");
      } catch (err) {
        console.error("Failed to load profile:", err);
        setStatus("Failed to load profile from server");
      }
    }

    fetchUser();
  }, [auth?.id]);

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
      // keep user_id as the auth value (string UUID) or null
      user_id: auth.id || null,
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
          // skip null/undefined and invalid numbers
          if (v === null || v === undefined) return;
          if (typeof v === 'number' && Number.isNaN(v)) return;

          // For objects/arrays encode as JSON string so backend can parse
          if (typeof v === "object") fd.append(k, JSON.stringify(v));
          else fd.append(k, String(v));
        });
        fd.append("avatar", formData.avatarFile);

        const resp = await api.post(`/users/update_profile`, fd, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            // DO NOT set Content-Type when sending FormData — browser will set multipart boundary
          },
        });

        if (resp.data?.status) {
          // show success modal instead of alert
          setShowSuccessModal(true);
          setStatus("Saved");
        } else {
          console.error("Server response:", resp.data);
          setStatus("Server returned an error. Local copy saved.");
          alert("Profile saved locally but server reported an error.");
        }
      } else {
        // send JSON
        const resp = await api.post(`/users/update_profile`, payloadFields, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        if (resp.data?.status) {
          // show success modal instead of alert
          setShowSuccessModal(true);
          setStatus("Saved");
        } else {
          console.error("Server response:", resp.data);
          setStatus("Server returned an error. Local copy saved.");
          alert("Profile saved locally but server reported an error.");
        }
      }
    } catch (err) {
      // improved logging: print server response body when available
      console.error("Save error:", err);
      console.error("axios error response data:", err.response?.data);
      const serverMessage = err.response?.data?.message;
      setStatus(serverMessage || err.message || "Failed to save profile to server.");
      alert(`Error saving to server: ${serverMessage || err.message}. Local copy saved.`);
    } finally {
      setSubmitting(false);
    }
  };

  function handleSuccessOk() {
    setShowSuccessModal(false);
  }

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

  // fixed display order for days to ensure Mon -> Sun
  const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <><Navbar />
    <div className="volunteer-root">
      <div className="vp-hero">
        <div className="vp-container">

          <div className="vp-grid">
            {/* LEFT PREVIEW */}
            <aside className="vp-left">
              <div className="vp-card vp-preview">
                <div className="vp-avatar-wrap">
                  <img
                    src={formData.avatarDataUrl || "https://via.placeholder.com/160x160?text=No+Photo"}
                    alt="Avatar"
                    className="vp-avatar"
                  />
                </div>

                <div className="vp-name">
                  <h2>{formData.fullName || "Your Name"}</h2>
                  <div className="vp-username">@{formData.username || "username"}</div>
                </div>

                {formData.bio && <p className="vp-bio">{formData.bio}</p>}

                <div className="vp-divider" />

                <div className="vp-details">
                  {formData.skills.length > 0 && (
                    <div>
                      <div className="vp-label">Skills</div>
                      <div className="vp-tags">{formData.skills.map(s => <span key={s} className="vp-tag primary">{s}</span>)}</div>
                    </div>
                  )}

                  {formData.languages.length > 0 && (
                    <div>
                      <div className="vp-label">Languages</div>
                      <div className="vp-tags">{formData.languages.map(l => <span key={l} className="vp-tag">{l}</span>)}</div>
                    </div>
                  )}

                  <div>
                    <div className="vp-label">Availability</div>
                    <div className="vp-text">{Object.entries(formData.availability.days).filter(([_,v])=>v).map(([k])=>k.charAt(0).toUpperCase()+k.slice(1)).join(', ') || '—'}</div>
                    <div className="vp-text">{formData.availability.startTime || '—'} – {formData.availability.endTime || '—'}</div>
                  </div>

                  {formData.location && (
                    <div>
                      <div className="vp-label">Location</div>
                      <div className="vp-text">{formData.location}</div>
                    </div>
                  )}

                  {(formData.contact.email || formData.contact.phone) && (
                    <div>
                      <div className="vp-label">Contact</div>
                      <div className="vp-text">{formData.contact.email && `📧 ${formData.contact.email}`}{formData.contact.phone && <div>📱 {formData.contact.phone}</div>}</div>
                    </div>
                  )}

                  {(formData.emergency.name || formData.emergency.phone) && (
                    <div>
                      <div className="vp-label">Emergency Contact</div>
                      <div className="vp-text">
                        {formData.emergency.name && <div>👤 {formData.emergency.name}{formData.emergency.relation && ` (${formData.emergency.relation})`}</div>}
                        {formData.emergency.phone && <div>📞 {formData.emergency.phone}</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* RIGHT FORM */}
            <main className="vp-right">
              <form onSubmit={handleSave} className="vp-form">
                <FormCard title="Profile Photo & Name">
                  <label className="vp-upload">
                    <div className="vp-upload-emoji">📸</div>
                    <div className="vp-upload-text">Click to upload profile photo</div>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="vp-upload-input" />
                  </label>
                  <Input placeholder="Full Name" value={formData.fullName} onChange={(e)=>handleChange('fullName', e.target.value)} />
                  <Input placeholder="Username" value={formData.username} onChange={(e)=>handleChange('username', e.target.value)} />
                </FormCard>

                <FormCard title="Bio">
                  <TextArea rows={4} placeholder="Tell us about yourself and your volunteer interests..." value={formData.bio} onChange={(e)=>handleChange('bio', e.target.value)} />
                </FormCard>

                <FormCard title="Skills & Languages">
                  <TagInput title="Skills"  items={formData.skills} onAdd={(v)=>addTag('skills', v)} onRemove={(v)=>removeTag('skills', v)} />
                  <TagInput title="Languages" items={formData.languages} onAdd={(v)=>addTag('languages', v)} onRemove={(v)=>removeTag('languages', v)} />
                </FormCard>

                <FormCard title="Availability">
                  <div className="vp-days">
                    {DAY_ORDER.map((day) => (
                      <label
                        key={day}
                        className={"vp-day " + (formData.availability.days?.[day] ? 'active' : '')}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.availability.days?.[day]}
                          onChange={(e) => handleChange(`availability.days.${day}`, e.target.checked)}
                        />
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    ))}
                  </div>
                  <div className="vp-time-grid">
                    <div>
                      <Label>Start Time</Label>
                      <Input type="time" value={formData.availability.startTime} onChange={(e)=>handleChange('availability.startTime', e.target.value)} />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input type="time" value={formData.availability.endTime} onChange={(e)=>handleChange('availability.endTime', e.target.value)} />
                    </div>
                  </div>
                </FormCard>

                <FormCard title="Location">
                  <Input placeholder="e.g. Central, East, West Singapore" value={formData.location} onChange={(e)=>handleChange('location', e.target.value)} />
                </FormCard>

                <FormCard title="Contact Information">
                  <Input type="email" placeholder="Email" value={formData.contact.email} onChange={(e)=>handleChange('contact.email', e.target.value)} />
                  <Input type="tel" placeholder="Phone" value={formData.contact.phone} onChange={(e)=>handleChange('contact.phone', e.target.value)} />
                </FormCard>

                <FormCard title="Emergency Contact">
                  <Input placeholder="Name" value={formData.emergency.name} onChange={(e)=>handleChange('emergency.name', e.target.value)} />
                  <Input placeholder="Relationship" value={formData.emergency.relation} onChange={(e)=>handleChange('emergency.relation', e.target.value)} />
                  <Input type="tel" placeholder="Phone" value={formData.emergency.phone} onChange={(e)=>handleChange('emergency.phone', e.target.value)} />
                </FormCard>

                <div className="vp-actions">
                  <Button disabled={submitting}>{submitting ? 'Saving...' : 'Save Profile'}</Button>
                </div>
              </form>
            </main>
          </div>
        </div>
      </div>
    </div>
      <SuccessModal open={showSuccessModal} onClose={handleSuccessOk} />
    </>
  );
}

{/* Success modal (uses shared modal styles) */}
function SuccessModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.icon} style={{ color: 'green' }}>✓</div>
        <div className={modalStyles.title}>Profile Saved</div>
        <div className={modalStyles.body}>Your profile was saved successfully.</div>
        <div className={modalStyles.buttons}>
          <button className={modalStyles.btnPrimary} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
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
        <button type="button" className="vp-add-btn" onClick={handleAdd}>
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

// Reusable Components
function FormCard({ title, children }) {
  return (
    <div className="form-card">
      <h3 className="form-card-title">{title}</h3>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="label-small">{children}</label>;
}

function Input({ style = {}, ...props }) {
  return (
    <input
      {...props}
      className="input-base"
      style={style}
    />
  );
}

function TextArea({ style = {}, ...props }) {
  return (
    <textarea
      {...props}
      className="textarea-base"
      style={style}
    />
  );
}

function Button({ children, variant = 'primary', disabled = false, ...props }) {
  const cls = `btn-custom ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`;
  return (
    <button {...props} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
