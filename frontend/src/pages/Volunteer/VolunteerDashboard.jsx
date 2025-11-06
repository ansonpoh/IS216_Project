import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import styles from "../../styles/VolunteerDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import axios from "axios";
import Navbar from "../../components/Navbar.js";
import Title from '../../components/ui/Title';
import confetti from "canvas-confetti";
import PageTransition from "../../components/Animation/PageTransition";
import { gsap } from 'gsap';

// const LS_KEY = "volunteer_dashboard_circular_carousel_v3";
const CONFETTI_KEY = "volunteer_dashboard_confetti_count_v1";
/* ---------- Helpers ---------- */
// --- NEW HELPER: Tilt Wrapper Component ---
// This is defined outside the main component to avoid re-creating it on every render,
// but it is conceptually integrated.

const TiltDiv = ({ children, className, style }) => {
  const tiltRef = useRef(null);
  const MOBILE_BREAKPOINT = 768; // Define mobile breakpoint for disabling effect

  useEffect(() => {
    const element = tiltRef.current;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (!element || isMobile) return;

    const handleMouseMove = e => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

  // Tilt Calculation (subtler max 6 degrees)
  const rotateX = ((y - centerY) / centerY) * -4;
  const rotateY = ((x - centerX) / centerX) * 4;

      gsap.to(element, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000 // Key for 3D tilt
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Apply necessary base styles for 3D perspective
    element.style.transformStyle = 'preserve-3d';
    element.style.transition = 'transform 0.3s ease-out'; // Keep a base transition for smooth exit

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element); // Cleanup GSAP animations
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      ref={tiltRef}
      className={className}
      style={{ ...style, position: 'relative' }} // Must be relative for internal positioning if needed
    >
      {children}
    </div>
  );
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
      {/* constrain the inner container to the requested size so long messages don't expand layout */}
      <div style={{ width: size, maxWidth: size, margin: '0 auto', textAlign: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
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

        {/* Center text (use dominantBaseline/textAnchor + percentage y positions for reliable centering) */}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="42"
          fontWeight="800"
          fill="#1f2937"
        >
          {pct}%
        </text>
        <text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#9ca3af"
          letterSpacing="2"
        >
          COMPLETE
        </text>
      </svg>

        {message && (
          <div style={{
            marginTop: 16,
            fontSize: 16,
            fontWeight: 600,
            // ensure long messages wrap inside the fixed-width container
            wordBreak: 'break-word',
            whiteSpace: 'normal'
          }}>
            {msgParts.emoji && (
              <span aria-hidden="true" style={{ lineHeight: 1 }}>{msgParts.emoji}</span>
            )}
            {msgParts.emoji ? ' ' : ''}
            <span style={{
              display: 'inline-block',
              maxWidth: '100%',
              overflowWrap: 'break-word',
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
    <div className={styles['vd-panel']}>
      {/* Header */}
      <div className={styles['vd-panel-header']}>
        <h3 className={styles['vd-panel-title']}>
          {title}
        </h3>
        {count > 0 && (
          <span className={styles['vd-panel-count']}>
            {idx + 1} / {count}
          </span>
        )}
      </div>

      {/* Content */}
      {count === 0 || !currentItem ? (
        <div className={styles['vd-empty']}>
          {emptyText}
        </div>
      ) : (
  <div className={styles['vd-panel-content']}>
          {/* Carousel */}
          <div className={styles['vd-carousel-stage']}>
            {/* Event Card */}
            <div>
              <h4 className={styles['vd-event-title']}>
                {currentItem.title}
              </h4>
              <div className={styles['vd-event-meta']}>
                <div className={styles['vd-meta-row']}>
                  📅 {fmtDate(currentItem.start_date, currentItem.end_date)}
                </div>
                  <div className={styles['vd-meta-row']}>
                  ⏰ {fmtTime(currentItem.start_time, currentItem.end_time)}
                </div>
                {currentItem.location && (
                    <div className={styles['vd-meta-row']}>
                    📍 {currentItem.location}
                  </div>
                )}
                <div>
                  ⌛ {currentItem.hours} hours
                </div>
              </div>

              {/* Actions */}
              {renderCardFooter && (
                <div className={styles['vd-actions']}>
                  {renderCardFooter(currentItem)}
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {count > 1 && (
              <>
                <button onClick={prev} className={`${styles['vd-carousel-nav']} ${styles['vd-carousel-nav-left']}`}>‹</button>
                <button onClick={next} className={`${styles['vd-carousel-nav']} ${styles['vd-carousel-nav-right']}`}>›</button>
              </>
            )}
          </div>

          {/* Indicators */}
          {count > 1 && (
            <div className={styles['vd-indicators']}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`${styles['vd-indicator']} ${i === idx ? styles['vd-indicator-active'] : ''}`}
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
  }, [auth.id])

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

  const displayedTotalHours = serverTotalHours !== null && serverTotalHours !== undefined ? serverTotalHours : null;
  const numericHours = displayedTotalHours !== null ? Number(displayedTotalHours) : 0;

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

  const deleteActive = (identifier) => setActiveEvents((arr) => arr.filter((e) => (e.event_id ?? e.id) !== identifier && e.id !== identifier));

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className={`container py-4 ${styles.vdash}`}>
          <div className="d-flex flex-column align-items-center mb-3 text-center">
            <Title text="My Impact" subtitle="Track your volunteering hours and manage your events." />
          </div>
          <div className="row g-3 mb-4">

            {/* CARD 1: TOTAL HOURS (COL-LG-4) - Keeping all original style/animation for this one */}
            <div className="col-lg-4">
              <TiltDiv style={{height: '100%', borderRadius: '1rem', overflow: 'hidden'}}>
              <div className={`card shadow-lg h-100 ${styles.vdCard} ${styles['vd-total-card']}`}>
                {/* Animated background circles */}
                <div className={`${styles['vd-total-bg-circle']} ${styles['vd-total-bg-top-right']}`} />
                <div className={`${styles['vd-total-bg-circle']} ${styles['vd-total-bg-bottom-left']}`} />
                <div className={`${styles['vd-total-bg-circle']} ${styles['vd-total-bg-mid-left']}`} />

                <div className={`card-body d-flex flex-column justify-content-center align-items-center text-center ${styles['vd-total-card-body']}`}>
                  <h5 className={`card-title mb-3 ${styles['vd-total-title']}`}>
                    Total Volunteered Hours
                  </h5>

                  {/* The Big Number */}
                  <div className="position-relative d-inline-block">
                    <div className={`fw-bold ${styles['vd-total-number']}`}>
                      {displayedTotalHours ?? '—'}
                    </div>

                    {/* Decorative sparkles */}
                    <span className={styles['vd-sparkle-top']}>✨</span>
                    <span className={styles['vd-sparkle-bottom']}>⭐</span>
                  </div>

                  {/* Bottom message */}
                  <div className={styles['vd-bottom-message']}>
                    🎉 Keep up the amazing work!
                  </div>
                </div>
              </div>
              </TiltDiv>
            </div>

            {/* CARD 2: GOAL PROGRESS (COL-LG-8) - APPLYING TILT EFFECT HERE */}
            <div className="col-lg-8">
              <TiltDiv className={`card h-100 ${styles.vdCard_2}`} style={{borderRadius: '1rem', overflow: 'hidden'}}>
                <div className="card-body d-flex align-items-center gap-4">
                  <div className="flex-shrink-0">
                    {/* Reserve fixed space for the ring + message so the card height stays stable */}
                    <div style={{ width: 260, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
                      <CircularProgressRing
                        value={numericHours}
                        max={goalHours}
                        size={260}
                        thickness={20}
                      />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className={`mb-3 ${styles['vd-goal-title']}`}>
                      Goal Progress
                    </h5>
                    <p className={`text-muted mb-3 ${styles['vd-goal-note']}`}>
                      {Math.min(numericHours, goalHours)} / {goalHours} hours
                    </p>
                    <div className="mb-3">
                      <label className={`form-label text-muted ${styles['vd-goal-label']}`}>
                        Set Goal (hours)
                      </label>
                      <input
                        type="number"
                        min={1}
                        className={`form-control ${styles['vd-goal-input']}`}
                        value={goalHours}
                        onChange={(e) => setGoalHours(Math.max(1, Number(e.target.value || 1)))}
                      />
                    </div>
                  </div>
                </div>
              </TiltDiv>
            </div>
          </div>

          <div className="row g-3">
            {/* CAROUSEL 1: ACTIVE EVENTS (COL-LG-6) - APPLYING TILT EFFECT HERE (optional, but good for consistency) */}
            <div className="col-lg-6">
              <TiltDiv style={{height: '100%', borderRadius: '1rem', overflow: 'hidden'}}>
                  <CardCarousel title="Active (Joined) Events" items={activeEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
                    <>
                      <button
                        className={`btn btn-sm ${styles['vd-mark-attended']}`}
                        onClick={() => markAttended(e.event_id ?? e.id)}
                      >
                        Mark Attended → Past
                      </button>
                      <button className={`btn btn-sm ${styles['vd-mark-didnot-attended']}`} onClick={() => deleteActive(e.event_id ?? e.id)}>Did not attend</button>
                    </>
                  )} />
              </TiltDiv>
            </div>

            {/* CAROUSEL 2: PENDING APPLICATIONS (COL-LG-6) - NOTE: CardCarousel is likely an external component, 
                so we wrap it in a div or use TiltDiv if it renders the root element. 
                Assuming CardCarousel renders a div, we'll wrap it in a simple div for clean sizing here. */}
            <div className="col-lg-6">
              {/* Optional: You can apply TiltDiv here too if desired */}
              <TiltDiv style={{height: '100%', borderRadius: '1rem', overflow: 'hidden'}}>
              <div style={{height: '100%'}}> 
                  <CardCarousel title="Pending Applications" items={pendingEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
                    <>
                      {/* <button className="btn btn-sm btn-primary" onClick={() => approvePending(e.id)}>Approve → Active</button> */}
                    </>
                  )} />
              </div>
              </TiltDiv>
            </div>

            {/* CAROUSEL 3: PAST EVENTS (COL-12) */}
            <div className="col-12">
              <TiltDiv style={{height: '100%', borderRadius: '1rem', overflow: 'hidden'}}>
              <CardCarousel title="Past Events" items={pastEvents} emptyText="Nothing here yet."
              />
              </TiltDiv>
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