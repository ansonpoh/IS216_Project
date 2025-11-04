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
      } catch {}

      if (!confettiFiredRef.current ) {
        confettiFiredRef.current = true;
        try {
          localStorage.setItem(CONFETTI_KEY);
        } catch {}

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
  const {auth} = useAuth();
  const [serverTotalHours, setServerTotalHours] = useState(null);
  
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await axios.get(`${LOCAL_BASE}/events/get_registered_events_for_user`, {params:{user_id: auth.id}});
      setEvents(result.data.result);
    }
    fetchEvents();
  }, [])

  // Fetch stored total hours from users table (by user id)
  useEffect(() => {
    async function fetchUserHours() {
      try {
        if (!auth?.id) return;
        const resp = await axios.get(`${LOCAL_BASE}/users/get_user_by_id`, { params: { id: auth.id } });
        const rows = resp.data?.result;
        if (rows && rows.length > 0) {
          const u = rows[0];
          // may be null in DB
          setServerTotalHours(u.hours ?? null);
        }
      } catch (err) {
        console.error('Failed to load user hours:', err?.response?.data || err.message || err);
      }
    }
    fetchUserHours();
  }, [auth?.id]);

  useEffect(() => {
    let pending = [];
    let active = [];
    let past = [];
    let hours = 0;
    for(let e of events) {
      if(e.status === "pending") pending.push(e);
      else if(e.status === "approved") active.push(e);
      else if(e.status === "attended") {
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

  const hoursBetween = (s, e) => Math.max(0, (new Date(e) - new Date(s)) / 36e5);
  const round1 = (n) => Math.round(n * 10) / 10;

  // const syncedTotalHours = useMemo(() => round1(pastEvents.reduce((sum, ev) => sum + hoursBetween(ev.start, ev.end), 0)), [pastEvents]);
  // Display priority: manual override (if >0) -> server value from users table -> computed synced value -> 0
  const displayedTotalHours = manualTotalHours > 0 ? manualTotalHours : (serverTotalHours ?? 0);

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

  const markAttended = async (id) => {
    const ev = activeEvents.find((e) => e.id === id);
    if (!ev) return;
    // Optimistically move local state
    setPastEvents((arr) => [{ ...ev }, ...arr]);
    setActiveEvents((arr) => arr.filter((e) => e.id !== id));

    try {
      const res = await axios.post(`${LOCAL_BASE}/events/update_registration_status`, {
        user_id: auth.id,
        event_id: ev.event_id,
        status: 'attended'
      });
      console.log(res);
    } catch (err) {
      console.error('Failed to mark attended on server:', err?.response?.data || err.message || err);
    }
  };

  // const approvePending = (id) => {
  //   const ev = pendingEvents.find((e) => e.id === id);
  //   if (!ev) return;
  //   setActiveEvents((arr) => [{ ...ev }, ...arr]);
  //   setPendingEvents((arr) => arr.filter((e) => e.id !== id));
  // };
  // const withdrawPending = (id) => setPendingEvents((arr) => arr.filter((e) => e.id !== id));
  const deleteActive = (id) => setActiveEvents((arr) => arr.filter((e) => e.id !== id));
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

      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className={`card shadow-sm h-100 ${styles.vdCard}`}>
            <div className="card-body">
              <h5 className="card-title mb-2">Total{'\u00A0'} Volunteered Hours</h5>
              <div className="display-6 fw-semibold">{displayedTotalHours}</div>
              {/* <div className="text-muted mt-2">Synced this month: {syncedMonthlyHours}</div> */}
              <div className="mt-3">
                <label className="form-label">Adjust Total (optional)</label>
                <input type="number" min={0} className="form-control" value={manualTotalHours} onChange={(e) => setManualTotalHours(Math.max(0, Number(e.target.value || 0)))} placeholder="0 = show synced value" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className={`card shadow-sm h-100 ${styles.vdCard}`}>
            <div className="card-body d-flex align-items-center gap-4">
              <div className="flex-shrink-0">
                <CircularProgressRing value={displayedTotalHours} max={goalHours} size={260} thickness={18} />
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-2">Goal Progress</h5>
                <p className="text-muted mb-3">{Math.min(displayedTotalHours, goalHours)} / {goalHours} hours</p>
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
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <CardCarousel title="Active (Joined) Events" items={activeEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
            <>
              <button
                className="btn btn-sm"
                onClick={() => markAttended(e.id)}
                style={{ background: '#7494ec', borderColor: '#7494ec', color: '#fff' }}
              >
                Mark Attended → Past
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteActive(e.id)}>Did not attend</button>
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