import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import styles from "../../styles/VolunteerDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import axios from "axios";
import Navbar from "../../components/Navbar.js";
import Title from '../../components/ui/Title';
import confetti from "canvas-confetti";
import PageTransition from "../../components/Animation/PageTransition";

// const LS_KEY = "volunteer_dashboard_circular_carousel_v3";
const CONFETTI_KEY = "volunteer_dashboard_confetti_count_v1";
/* ---------- Helpers ---------- */
const useAutoplay = (enabled, cb, delay = 4500) => {
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(cb, delay);
    return () => clearInterval(id);
  }, [enabled, cb, delay]);
};

const useKeyControls = (onPrev, onNext) => {
  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) onPrev();
      if (["ArrowRight", "d", "D"].includes(e.key)) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext]);
};

/* ---------- Circular Progress Ring (simpler gradient look) ---------- */
function CircularProgressRing({ value, max, size = 240 }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const v = Math.min(Math.max(0, Number(value) || 0), safeMax);
  const pct = Math.round((v / safeMax) * 100);

  const R = size / 2 - 15;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  const gap = C - dash;

  const [message, setMessage] = useState("");
  const confettiFiredRef = useRef(false);

  // Keep emoji original color by splitting it from the gradient-styled text
  const msgParts = useMemo(() => {
    if (!message) return { emoji: "", text: "" };
    const idx = message.indexOf(" ");
    if (idx === -1) return { emoji: "", text: message };
    return { emoji: message.slice(0, idx), text: message.slice(idx + 1) };
  }, [message]);

  useEffect(() => {
    if (pct === 100) {
      setMessage("🏆 Goal achieved! Amazing work!");
    } else if (pct >= 75) {
      setMessage("💪 Almost there! Keep going!");
    } else if (pct >= 50) {
      setMessage("✨ Halfway done! Great progress!");
    } else if (pct >= 25) {
      setMessage("🔥 Off to a great start!");
    } else {
      setMessage("🌟 Begin your journey!");
    }
  }, [pct]);

  // Fire confetti when pct hits 100, but cap to 3 times (persisted in localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pct === 100) {
      let count = 0;
      try {
        count = Number(localStorage.getItem(CONFETTI_KEY) || 0);
      } catch { }

      if (!confettiFiredRef.current) {
        confettiFiredRef.current = true;
        try {
          localStorage.setItem(CONFETTI_KEY);
        } catch { }

        // celebratory burst
        confetti({
          particleCount: 140,
          spread: 70,
          startVelocity: 35,
          origin: { y: 0.6 }
        });
      }
    } else {
      // reset the one-time guard so a future return to 100 can fire again
      confettiFiredRef.current = false;
    }
  }, [pct]);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="rgba(102, 126, 234, 0.1)"
          strokeWidth="16"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />

        {/* Center text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="-10"
          fontSize="42"
          fontWeight="800"
          fill="#1f2937"
        >
          {pct}%
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="20"
          fontSize="12"
          fill="#9ca3af"
          letterSpacing="2"
        >
          COMPLETE
        </text>
      </svg>

      {message && (
        <div style={{
          marginTop: '16px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          {msgParts.emoji && (
            <span aria-hidden="true" style={{ lineHeight: 1 }}>{msgParts.emoji}</span>
          )}
          {msgParts.emoji ? ' ' : ''}
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {msgParts.text}
          </span>
        </div>
      )}
    </div>
  );
}


/* ---------- Card Carousel (modern gradient styles) ---------- */
function CardCarousel({ title, items, renderCardFooter, emptyText = "Nothing here yet." }) {
  const [idx, setIdx] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (idx >= count && count > 0) setIdx(0);
  }, [count, idx]);

  const prev = () => setIdx((i) => (i - 1 + Math.max(1, count)) % Math.max(1, count));
  const next = () => setIdx((i) => (i + 1) % Math.max(1, count));

  const currentItem = items[idx];

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: '#1f2937'
        }}>
          {title}
        </h3>
        {count > 0 && (
          <span style={{
            fontSize: '14px',
            color: '#9ca3af',
            fontWeight: '600'
          }}>
            {idx + 1} / {count}
          </span>
        )}
      </div>

      {/* Content */}
      {count === 0 || !currentItem ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: '15px',
          padding: '40px 0'
        }}>
          {emptyText}
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {/* Carousel */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '14px',
            padding: '20px 28px',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Event Card */}
            <div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                {currentItem.title}
              </h4>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '6px' }}>
                  📅 {fmtDate(currentItem.start_date, currentItem.end_date)}
                </div>
                <div style={{ marginBottom: '6px' }}>
                  ⏰ {fmtTime(currentItem.start_time, currentItem.end_time)}
                </div>
                {currentItem.location && (
                  <div style={{ marginBottom: '6px' }}>
                    📍 {currentItem.location}
                  </div>
                )}
                <div>
                  ⌛ {currentItem.hours} hours
                </div>
              </div>

              {/* Actions */}
              {renderCardFooter && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {renderCardFooter(currentItem)}
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {count > 1 && (
              <>
                <button
                  onClick={prev}
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.16s ease',
                    zIndex: 5
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.16s ease',
                    zIndex: 5
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Indicators */}
          {count > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px'
            }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  style={{
                    width: idx === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: idx === i
                      ? ' #7494ec'
                      : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Dashboard ---------- */
export default function VolunteerDashboard() {
  // const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [goalHours, setGoalHours] = useState(36);
  const [manualTotalHours, setManualTotalHours] = useState(0);
  const { auth } = useAuth();
  const [serverTotalHours, setServerTotalHours] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await axios.get(`${LOCAL_BASE}/events/get_registered_events_for_user`, { params: { user_id: auth.id } });
      setEvents(result.data.result);
    }
    fetchEvents();
  }, [])

  // Fetch stored total hours from users table (by user id)
  const fetchUserHours = async () => {
    try {
      if (!auth?.id) return;
      const resp = await axios.get(`${LOCAL_BASE}/users/get_user_by_id`, { params: { id: auth.id } });
      const rows = resp.data?.result;
      if (rows && rows.length > 0) {
        const u = rows[0];
        // may be null in DB — coerce to Number when present, otherwise keep null
        if (u.hours !== null && u.hours !== undefined && u.hours !== "") {
          const n = Number(u.hours);
          setServerTotalHours(Number.isNaN(n) ? null : n);
        } else {
          setServerTotalHours(null);
        }
      }
    } catch (err) {
      console.error('Failed to load user hours:', err?.response?.data || err.message || err);
    }
  };

  useEffect(() => {
    if (!auth?.id) return;
    fetchUserHours();
  }, [auth?.id]);

  useEffect(() => {
    let pending = [];
    let active = [];
    let past = [];
    let hours = 0;
    for (let e of events) {
      if (e.status === "pending") pending.push(e);
      else if (e.status === "approved") active.push(e);
      else if (e.status === "attended") {
        past.push(e);
        hours += e.hours;
      }
    }
    setManualTotalHours(hours);
    setPendingEvents(pending);
    setActiveEvents(active);
    setPastEvents(past);
  }, [events]);

  useEffect(() => {
    const hours = pastEvents.reduce((sum, e) => sum + (e.hours || 0), 0);
    setManualTotalHours(hours);
  }, [pastEvents]);

  // const hoursBetween = (s, e) => Math.max(0, (new Date(e) - new Date(s)) / 36e5);
  // const round1 = (n) => Math.round(n * 10) / 10;

  // const syncedTotalHours = useMemo(() => round1(pastEvents.reduce((sum, ev) => sum + hoursBetween(ev.start, ev.end), 0)), [pastEvents]);
  // Display only DB-stored hours. If DB value is null, show a dash (—) in the UI.
  // For components that need a numeric value (progress ring, goal math) use numericHours (0 when DB is null).
  const displayedTotalHours = serverTotalHours !== null && serverTotalHours !== undefined ? serverTotalHours : null;
  const numericHours = displayedTotalHours !== null ? Number(displayedTotalHours) : 0;

  // const syncedMonthlyHours = useMemo(() => {
  //   const now = new Date();
  //   const y = now.getFullYear();
  //   const m = now.getMonth();
  //   const inMonth = pastEvents.filter((ev) => {
  //     const d = new Date(ev.start);
  //     return d.getFullYear() === y && d.getMonth() === m;
  //   });
  //   return round1(inMonth.reduce((s, ev) => s + hoursBetween(ev.start, ev.end), 0));
  // }, [pastEvents]);

  const markAttended = async (identifier) => {
    // identifier may be event_id or id depending on API shape
    const ev = activeEvents.find((e) => (e.event_id ?? e.id) === identifier || e.id === identifier);
    if (!ev) return;
    // Optimistically move local state: add to past and remove from active by same identifier
    setPastEvents((arr) => [{ ...ev }, ...arr]);
    setActiveEvents((arr) => arr.filter((e) => (e.event_id ?? e.id) !== identifier && e.id !== identifier));

    try {
      const res = await axios.post(`${LOCAL_BASE}/events/update_registration_status`, {
        user_id: auth.id,
        event_id: ev.event_id ?? ev.id,
        status: 'attended'
      });
      console.log(res);
      // optimistic local update for displayed DB hours if present
      const hrs = Number(ev.hours || 0);
      if (!Number.isNaN(hrs) && serverTotalHours !== null && serverTotalHours !== undefined) {
        setServerTotalHours((prev) => (prev !== null && prev !== undefined ? prev + hrs : prev));
      }
      // refresh authoritative value from server to stay in sync
      await fetchUserHours();
    } catch (err) {
      console.error('Failed to mark attended on server:', err?.response?.data || err.message || err);
      // rollback optimistic UI changes: remove from pastEvents and re-add to activeEvents
      setPastEvents((arr) => arr.filter((a) => (a.event_id ?? a.id) !== (ev.event_id ?? ev.id)));
      setActiveEvents((arr) => [{ ...ev }, ...arr]);
    }
  };

  // const approvePending = (id) => {
  //   const ev = pendingEvents.find((e) => e.id === id);
  //   if (!ev) return;
  //   setActiveEvents((arr) => [{ ...ev }, ...arr]);
  //   setPendingEvents((arr) => arr.filter((e) => e.id !== id));
  // };
  // const withdrawPending = (id) => setPendingEvents((arr) => arr.filter((e) => e.id !== id));
  const deleteActive = (identifier) => setActiveEvents((arr) => arr.filter((e) => (e.event_id ?? e.id) !== identifier && e.id !== identifier));
  // const deletePast = (id) => setPastEvents((arr) => arr.filter((e) => e.id !== id));

  // const syncHours = () => setManualTotalHours(syncedTotalHours);
  // const clearManual = () => setManualTotalHours(0);

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className={`container py-4 ${styles.vdash}`}>
          <div className="d-flex flex-column align-items-center mb-3 text-center">
            {/* <button className={`btn btn-outline-primary btn-sm me-2 ${styles.vdBack}`} onClick={() => navigate(-1)}>← Back</button> */}
            <Title text="My Impact" subtitle="Track your volunteering hours and manage your events." />
            {/* <div className="ms-auto d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={syncHours}>Sync Hours from Past Events</button>
          {manualTotalHours > 0 && <button className="btn btn-outline-secondary btn-sm" onClick={clearManual}>Clear Manual Override</button>}
        </div> */}
          </div>

          {/* <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className={`card shadow-sm h-100 ${styles.vdCard}`}>
            <div className="card-body">
              <h5 className="card-title mb-2">Total{'\u00A0'} Volunteered Hours</h5>
              <div className="display-6 fw-semibold">{displayedTotalHours ?? '—'}</div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className={`card shadow-sm h-100 ${styles.vdCard}`}>
            <div className="card-body d-flex align-items-center gap-4">
                <div className="flex-shrink-0">
                <CircularProgressRing value={numericHours} max={goalHours} size={260} thickness={18} />
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-2">Goal Progress</h5>
                <p className="text-muted mb-3">{Math.min(numericHours, goalHours)} / {goalHours} hours</p>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <label className="form-label">Set Goal (hours)</label>
                    <input type="number" min={1} className="form-control" value={goalHours} onChange={(e) => setGoalHours(Math.max(1, Number(e.target.value || 1)))} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
          <div className="row g-3 mb-4">
            <div className="col-lg-4">
              <div className={`card shadow-lg h-100 ${styles.vdCard}`} style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '20px'
              }}>
                {/* Animated background circles */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  animation: 'float 6s ease-in-out infinite',
                  zIndex: 0
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  animation: 'float 4s ease-in-out infinite reverse',
                  zIndex: 0
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  animation: 'float 5s ease-in-out infinite',
                  zIndex: 0
                }}></div>

                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center" style={{
                  minHeight: '240px',
                  position: 'relative',
                  zIndex: 1,
                  padding: '2rem'
                }}>
                  {/* Icon/Emoji at top */}
                  {/* <div style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        animation: 'bounce 2s ease-in-out infinite'
      }}>
        ⏱️
      </div> */}

                  <h5 className="card-title mb-3" style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'rgba(0, 0, 0, 0.95)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    Total Volunteered Hours
                  </h5>

                  {/* The Big Number */}
                  <div className="position-relative d-inline-block">
                    <div
                      className="fw-bold"
                      style={{
                        fontSize: '7rem',
                        lineHeight: '1',
                        color: '#ffffff',
                        letterSpacing: '-0.03em',
                        textShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        animation: 'numberPulse 3s ease-in-out infinite'
                      }}
                    >
                      {displayedTotalHours ?? '—'}
                    </div>

                    {/* Decorative sparkles */}
                    <span style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-15px',
                      fontSize: '1.5rem',
                      animation: 'sparkle 1.5s ease-in-out infinite'
                    }}>✨</span>
                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '-20px',
                      fontSize: '1.2rem',
                      animation: 'sparkle 1.5s ease-in-out infinite 0.5s'
                    }}>⭐</span>
                  </div>

                  {/* Bottom message */}
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    🎉 Keep up the amazing work!
                  </div>
                </div>

                <style jsx>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes sparkle {
        0%, 100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2) rotate(180deg);
        }
      }

      @keyframes numberPulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `}</style>
              </div>
            </div>

            <div className="col-lg-8">
              <div className={`card h-100 ${styles.vdCard}`}>
                <div className="card-body d-flex align-items-center gap-4">
                  <div className="flex-shrink-0">
                    <CircularProgressRing
                      value={numericHours}
                      max={goalHours}
                      size={240}
                      thickness={20}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-3" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      Goal Progress
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                      {Math.min(numericHours, goalHours)} / {goalHours} hours
                    </p>
                    <div className="mb-3">
                      <label className="form-label text-muted" style={{ fontSize: '0.9rem' }}>
                        Set Goal (hours)
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        style={{ maxWidth: '200px', fontSize: '0.95rem' }}
                        value={goalHours}
                        onChange={(e) => setGoalHours(Math.max(1, Number(e.target.value || 1)))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <CardCarousel title="Active (Joined) Events" items={activeEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
                <>
                  <button
                    className="btn btn-sm"
                    onClick={() => markAttended(e.event_id ?? e.id)}
                    style={{ background: '#7494ec', borderColor: '#7494ec', color: '#fff' }}
                  >
                    Mark Attended → Past
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteActive(e.event_id ?? e.id)}>Did not attend</button>
                </>
              )} />
            </div>

            <div className="col-lg-6">
              <CardCarousel title="Pending Applications" items={pendingEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
                <>
                  {/* <button className="btn btn-sm btn-primary" onClick={() => approvePending(e.id)}>Approve → Active</button> */}
                </>
              )} />
            </div>

            <div className="col-12">
              <CardCarousel title="Past Events" items={pastEvents} emptyText="Nothing here yet."
              />
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

/* ---------- Utils ---------- */
// function fmtDT(iso) { if (!iso) return "—"; return new Date(iso).toLocaleString(); }
function fmtDate(startDate, endDate) {
  if (!startDate) return "—";
  const s = new Date(startDate);
  const e = endDate ? new Date(endDate) : null;

  const sStr = s.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const eStr = e ? e.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : null;

  if (!eStr || sStr === eStr) return sStr;
  return `${sStr} → ${eStr}`;
}

function fmtTime(startTime, endTime) {
  if (!startTime) return "—";
  try {
    const s = new Date(`1970-01-01T${startTime}`);
    const e = endTime ? new Date(`1970-01-01T${endTime}`) : null;

    const sStr = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const eStr = e ? e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;

    if (!eStr) return sStr;
    return `${sStr} → ${eStr}`;
  } catch {
    return "—";
  }
}