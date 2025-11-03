import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import styles from "./VolunteerProfile.module.css";

export default function VolunteerProfile() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    username: "johndoe",
    bio: "Passionate about making a difference in my community through volunteer work.",
    skills: ["Event Planning", "Photography", "Teaching"],
    languages: ["English", "Mandarin"],
    availability: {
      days: { mon: true, tue: false, wed: true, thu: false, fri: true, sat: true, sun: false },
      startTime: "09:00",
      endTime: "17:00",
    },
    location: "Central Singapore",
    contact: { email: "john@example.com", phone: "+65 9123 4567" },
    emergency: { name: "Jane Doe", relation: "Sister", phone: "+65 9876 5432" },
    avatarDataUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    avatarFile: null,
  });

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setSubmitting(true);

    try {
      const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
      const userId = auth.id || auth.user_id || "";

      const payload = new FormData();
      payload.append("user_id", userId);
      payload.append("username", formData.username || "");
      payload.append("email", formData.contact.email || "");
      payload.append("full_name", formData.fullName || "");
      payload.append("bio", formData.bio || "");
      payload.append("skills", JSON.stringify(formData.skills || []));
      payload.append("languages", JSON.stringify(formData.languages || []));
      payload.append("availability", JSON.stringify(formData.availability || {}));
      payload.append("availability_start_time", formData.availability.startTime || "");
      payload.append("availability_end_time", formData.availability.endTime || "");
      payload.append("location", formData.location || "");
      payload.append("contact", JSON.stringify(formData.contact || {}));
      payload.append("contact_phone", formData.contact.phone || "");
      payload.append("emergency", JSON.stringify(formData.emergency || {}));
      payload.append("emergency_name", formData.emergency.name || "");
      payload.append("emergency_relation", formData.emergency.relation || "");
      payload.append("emergency_phone", formData.emergency.phone || "");

      if (formData.avatarFile) payload.append("avatar", formData.avatarFile);

      const res = await api.post("/update_profile", payload);

      if (res?.data?.status) {
        alert("✅ Profile saved successfully!");
        const updatedUser = res.data.user;
        // If backend returned updated user, update preview fields conservatively
        if (updatedUser) {
          setFormData((prev) => ({
            ...prev,
            fullName: updatedUser.full_name || prev.fullName,
            username: updatedUser.username || prev.username,
            bio: updatedUser.bio || prev.bio,
            avatarDataUrl: updatedUser.profile_image || prev.avatarDataUrl,
            skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : prev.skills,
            languages: updatedUser.languages ? JSON.parse(updatedUser.languages) : prev.languages,
            availability: updatedUser.availability ? JSON.parse(updatedUser.availability) : prev.availability,
            location: updatedUser.location || prev.location,
            contact: updatedUser.contact ? JSON.parse(updatedUser.contact) : prev.contact,
            emergency: updatedUser.emergency ? JSON.parse(updatedUser.emergency) : prev.emergency,
          }));
        }
      } else {
        alert(res?.data?.message || "Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. See console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      keys.slice(0, -1).forEach((k) => {
        if (obj[k] === undefined) obj[k] = {};
        obj = obj[k];
      });
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, avatarDataUrl: ev.target.result, avatarFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields to default?")) {
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
        avatarFile: null,
      });
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <header className={styles.header}>
          <h1 className={styles.title}>Volunteer Profile</h1>
          <p className={styles.subtitle}>Manage your volunteer information and preferences</p>
        </header>

        <div className={styles.grid}>
          <aside className={styles.previewCard}>
            <div className={styles.avatarWrap}>
              <img
                src={formData.avatarDataUrl || "https://via.placeholder.com/160x160?text=No+Photo"}
                alt="Avatar"
                className={styles.avatar}
              />
            </div>

            <div className={styles.previewText}>
              <h2 className={styles.previewName}>{formData.fullName || "Your Name"}</h2>
              <div className={styles.previewHandle}>@{formData.username || "username"}</div>
            </div>

            {formData.bio && <p className={styles.bio}>{formData.bio}</p>}

            <div className={styles.divider} />

            {formData.skills.length > 0 && (
              <section>
                <div className={styles.sectionTitle}>Skills</div>
                <div className={styles.tagsRow}>
                  {formData.skills.map((s) => (
                    <span key={s} className={styles.tagPrimary}>{s}</span>
                  ))}
                </div>
              </section>
            )}

            {formData.languages.length > 0 && (
              <section>
                <div className={styles.sectionTitle}>Languages</div>
                <div className={styles.tagsRow}>
                  {formData.languages.map((l) => (
                    <span key={l} className={styles.tag}>{l}</span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className={styles.sectionTitle}>Availability</div>
              <div className={styles.availabilityText}>
                <div>📅 {Object.entries(formData.availability.days).filter(([_, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(", ") || "—"}</div>
                <div>⏰ {formData.availability.startTime || '—'} – {formData.availability.endTime || '—'}</div>
              </div>
            </section>

            {formData.location && (
              <section>
                <div className={styles.sectionTitle}>Location</div>
                <div className={styles.simpleText}>📍 {formData.location}</div>
              </section>
            )}

            {(formData.contact.email || formData.contact.phone) && (
              <section>
                <div className={styles.sectionTitle}>Contact</div>
                <div className={styles.simpleText}>
                  {formData.contact.email && <div>📧 {formData.contact.email}</div>}
                  {formData.contact.phone && <div>📱 {formData.contact.phone}</div>}
                </div>
              </section>
            )}

            {(formData.emergency.name || formData.emergency.phone) && (
              <section>
                <div className={styles.sectionTitle}>Emergency Contact</div>
                <div className={styles.simpleText}>
                  {formData.emergency.name && <div>👤 {formData.emergency.name}{formData.emergency.relation ? ` (${formData.emergency.relation})` : ''}</div>}
                  {formData.emergency.phone && <div>📞 {formData.emergency.phone}</div>}
                </div>
              </section>
            )}
          </aside>

          <main className={styles.formColumn}>
            <FormCard title="Profile Photo & Name">
              <label className={styles.uploadBox}>
                <div className={styles.uploadEmoji}>📸</div>
                <div className={styles.uploadText}>Click to upload profile photo</div>
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
              <Input placeholder="Full Name" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
              <div style={{ height: 12 }} />
              <Input placeholder="Username" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />
            </FormCard>

            <FormCard title="Bio">
              <TextArea rows={4} placeholder="Tell us about yourself and your volunteer interests..." value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} />
            </FormCard>

            <FormCard title="Skills & Languages">
              <TagInput title="Skills" items={formData.skills} onAdd={(v) => addTag("skills", v)} onRemove={(v) => removeTag("skills", v)} />
              <TagInput title="Languages" items={formData.languages} onAdd={(v) => addTag("languages", v)} onRemove={(v) => removeTag("languages", v)} />
            </FormCard>

            <FormCard title="Availability">
              <div className={styles.daysRow}>
                {Object.keys(formData.availability.days).map((day) => (
                  <label key={day} className={formData.availability.days[day] ? styles.dayActive : styles.day}>
                    <input type="checkbox" checked={formData.availability.days[day]} onChange={(e) => handleChange(`availability.days.${day}`, e.target.checked)} />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                ))}
              </div>

              <div className={styles.timeGrid}>
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" value={formData.availability.startTime} onChange={(e) => handleChange("availability.startTime", e.target.value)} />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" value={formData.availability.endTime} onChange={(e) => handleChange("availability.endTime", e.target.value)} />
                </div>
              </div>
            </FormCard>

            <FormCard title="Location">
              <Input placeholder="e.g. Central, East, West Singapore" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} />
            </FormCard>

            <FormCard title="Contact Information">
              <Input type="email" placeholder="Email" value={formData.contact.email} onChange={(e) => handleChange("contact.email", e.target.value)} />
              <div style={{ height: 12 }} />
              <Input type="tel" placeholder="Phone" value={formData.contact.phone} onChange={(e) => handleChange("contact.phone", e.target.value)} />
            </FormCard>

            <FormCard title="Emergency Contact">
              <Input placeholder="Name" value={formData.emergency.name} onChange={(e) => handleChange("emergency.name", e.target.value)} />
              <div style={{ height: 12 }} />
              <Input placeholder="Relationship" value={formData.emergency.relation} onChange={(e) => handleChange("emergency.relation", e.target.value)} />
              <div style={{ height: 12 }} />
              <Input type="tel" placeholder="Phone" value={formData.emergency.phone} onChange={(e) => handleChange("emergency.phone", e.target.value)} />
            </FormCard>

            <div className={styles.actionsRow}>
              <Button onClick={handleReset} variant="secondary">Reset</Button>
              <Button onClick={handleSave} disabled={submitting}>{submitting ? 'Saving...' : 'Save Profile'}</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function FormCard({ title, children }) {
  return (
    <div className={styles.formCard}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>{children}</label>
  );
}

function Input({ style = {}, ...props }) {
  return (
    <input
      {...props}
      className={styles.inputBase}
      style={style}
      onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
    />
  );
}

function TextArea({ style = {}, ...props }) {
  return (
    <textarea
      {...props}
      className={styles.textareaBase}
      style={style}
      onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
    />
  );
}

function Button({ children, variant = 'primary', disabled = false, ...props }) {
  const isPrimary = variant === 'primary';
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        padding: '14px 32px',
        background: disabled ? '#9ca3af' : (isPrimary ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'),
        border: isPrimary ? 'none' : '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        color: isPrimary ? 'white' : '#6b7280'
      }}
      onMouseOver={(e) => {
        if (!disabled && isPrimary) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)';
        } else if (!disabled) {
          e.currentTarget.style.borderColor = '#9ca3af';
          e.currentTarget.style.color = '#4b5563';
        }
      }}
      onMouseOut={(e) => {
        if (isPrimary) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        } else {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.color = '#6b7280';
        }
      }}
    >
      {children}
    </button>
  );
}

function TagInput({ title, items, onAdd, onRemove }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input);
      setInput("");
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <Label>{title}</Label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }} placeholder={`Add ${title.toLowerCase()}...`} style={{ flex: 1 }} />
        <button type="button" onClick={handleAdd} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>Add</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((t) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>
            {t}
            <button type="button" onClick={() => onRemove(t)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', lineHeight: '1', padding: '0 2px', fontWeight: '700' }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}
