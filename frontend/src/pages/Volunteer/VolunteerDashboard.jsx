import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import styles from "../../styles/VolunteerDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import axios from "axios";

const LS_KEY = "volunteer_dashboard_circular_carousel_v3";
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

/* ---------- Circular Progress Ring ---------- */
function CircularProgressRing({ value, max, size = 200, thickness = 16, title = "Goal Progress" }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const v = Math.min(Math.max(0, Number(value) || 0), safeMax);
  const pct = Math.round((v / safeMax) * 100);
  const R = size / 2 - 10;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  const gap = C - dash;

  return (
    <div
      className={styles.vdMeter}
      title={title}
      style={{ width: size, height: size, display: "grid", placeItems: "center" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${title}: ${pct}%`}>
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#49E2FF" />
            <stop offset="55%" stopColor="#43B2FF" />
            <stop offset="100%" stopColor="#FF5A9F" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="#000" floodOpacity="0.35" />
            <feComposite operator="in" in2="inverse" />
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="#1b2a3a"
          strokeOpacity="0.15"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        <g filter="url(#softGlow)">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={R}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset="0"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dasharray 500ms ease" }}
          />
        </g>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R - thickness - 6}
          fill="#0f1b28"
          filter="url(#innerShadow)"
          opacity="0.06"
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="800" fill="#6b7a8d" opacity="0.9">
          {pct}%
        </text>
        <text x="50%" y={size / 2 + 18} textAnchor="middle" fontSize="10" fill="#8fa1b6" letterSpacing="1.5">
          COMPLETE
        </text>
      </svg>
    </div>
  );
}

/* ---------- Card Carousel ---------- */
function CardCarousel({ title, items, renderCardFooter, emptyText = "Nothing here yet.", autoplay = true }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => { if (idx >= count) setIdx(Math.max(0, count - 1)); }, [count, idx]);

  const prev = useCallback(() => setIdx((i) => (i - 1 + Math.max(1, count)) % Math.max(1, count)), [count]);
  const next = useCallback(() => setIdx((i) => (i + 1) % Math.max(1, count)), [count]);

  useKeyControls(prev, next);
  useAutoplay(autoplay && !paused && count > 1, next, 5000);

  const touch = useRef({ x: 0 });
  const onTouchStart = (e) => (touch.current.x = e.changedTouches[0].clientX);
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
  };

  return (
    <div className={`card shadow-sm h-100 ${styles.vdCard}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{title}</h5>
          {count > 0 && <small className="text-muted">{idx + 1} / {count}</small>}
        </div>

        {count === 0 ? (
          <div className="text-muted">{emptyText}</div>
        ) : (
          <div
            className={styles.vdCarousel}
            style={{ height: 200, perspective: "900px", overflow: "hidden" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            tabIndex={0}
          >
            <CarouselCard event={items[idx]} style={{ transform: "translateZ(0) rotateY(0deg) scale(1)", opacity: 1, zIndex: 3 }} footer={renderCardFooter?.(items[idx])} />

            <button type="button" className={`btn btn-light ${styles.vdNav} position-absolute top-50 start-0 translate-middle-y`} onClick={prev} aria-label="Previous">‹</button>
            <button type="button" className={`btn btn-light ${styles.vdNav} position-absolute top-50 end-0 translate-middle-y`} onClick={next} aria-label="Next">›</button>

            <div className="position-absolute w-100 text-center" style={{ bottom: 6 }}>
              {Array.from({ length: count }).map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Go to ${i + 1}`} aria-current={i === idx ? "true" : undefined} className={`p-0 border-0 ${styles.vdDot}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CarouselCard({ event, style, footer }) {
  if (!event) return null;
  return (
    <div className={`position-absolute top-50 start-50 translate-middle p-3 rounded-4 ${styles.vdSlide}`} style={{ width: 420, maxWidth: "94%", transformStyle: "preserve-3d", ...style }}>
      <div className="fw-semibold">{event.title}</div>
      <div className="small text-muted">{fmtDate(event.start_date, event.end_date)} · {fmtTime(event.start_time, event.end_time)}{event.location ? ` · ${event.location}` : ""} · {event.hours} hrs</div>
      {!!footer && <div className="mt-3 d-flex gap-2 flex-wrap">{footer}</div>}
    </div>
  );
}

/* ---------- Dashboard ---------- */
export default function VolunteerDashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [goalHours, setGoalHours] = useState(36);
  const [manualTotalHours, setManualTotalHours] = useState(0);
  const {auth} = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await axios.get("http://localhost:3001/events/get_registered_events_for_user", {params:{user_id: auth.id}});
      setEvents(result.data.result);
    }
    fetchEvents();
  }, [])

  useEffect(() => {
    let pending = [];
    let active = [];
    let past = [];

    for(let e of events) {
      if(e.status === "pending") pending.push(e);
      else if(e.status === "approved") active.push(e);
      else past.push(e);
    }

    setPendingEvents(pending);
    setActiveEvents(active);
    setPastEvents(past);
  }, [events]);

  const hoursBetween = (s, e) => Math.max(0, (new Date(e) - new Date(s)) / 36e5);
  const round1 = (n) => Math.round(n * 10) / 10;

  const syncedTotalHours = useMemo(() => round1(pastEvents.reduce((sum, ev) => sum + hoursBetween(ev.start, ev.end), 0)), [pastEvents]);
  const displayedTotalHours = manualTotalHours || syncedTotalHours;

  const syncedMonthlyHours = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const inMonth = pastEvents.filter((ev) => {
      const d = new Date(ev.start);
      return d.getFullYear() === y && d.getMonth() === m;
    });
    return round1(inMonth.reduce((s, ev) => s + hoursBetween(ev.start, ev.end), 0));
  }, [pastEvents]);

  const markAttended = (id) => {
    const ev = activeEvents.find((e) => e.id === id);
    if (!ev) return;
    setPastEvents((arr) => [{ ...ev }, ...arr]);
    setActiveEvents((arr) => arr.filter((e) => e.id !== id));
  };
  const approvePending = (id) => {
    const ev = pendingEvents.find((e) => e.id === id);
    if (!ev) return;
    setActiveEvents((arr) => [{ ...ev }, ...arr]);
    setPendingEvents((arr) => arr.filter((e) => e.id !== id));
  };
  const withdrawPending = (id) => setPendingEvents((arr) => arr.filter((e) => e.id !== id));
  const deleteActive = (id) => setActiveEvents((arr) => arr.filter((e) => e.id !== id));
  const deletePast = (id) => setPastEvents((arr) => arr.filter((e) => e.id !== id));

  const syncHours = () => setManualTotalHours(syncedTotalHours);
  const clearManual = () => setManualTotalHours(0);

  return (
    <div className={`container py-4 ${styles.vdash}`}>
      <div className="d-flex align-items-center mb-3">
        <button className={`btn btn-outline-primary btn-sm me-2 ${styles.vdBack}`} onClick={() => navigate(-1)}>← Back</button>
        <h2 className="h4 mb-0">Volunteer Dashboard</h2>
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={syncHours}>Sync Hours from Past Events</button>
          {manualTotalHours > 0 && <button className="btn btn-outline-secondary btn-sm" onClick={clearManual}>Clear Manual Override</button>}
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className={`card shadow-sm h-100 ${styles.vdCard}`}>
            <div className="card-body">
              <h5 className="card-title mb-2">Total Volunteered Hours</h5>
              <div className="display-6 fw-semibold">{displayedTotalHours}</div>
              <div className="text-muted mt-2">Synced this month: {syncedMonthlyHours}</div>
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
              <button className="btn btn-sm btn-success" onClick={() => markAttended(e.id)}>Mark Attended → Past</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteActive(e.id)}>Delete</button>
            </>
          )} />
        </div>

        <div className="col-lg-6">
          <CardCarousel title="Pending Applications" items={pendingEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
            <>
              {/* <button className="btn btn-sm btn-primary" onClick={() => approvePending(e.id)}>Approve → Active</button> */}
              <button className="btn btn-sm btn-outline-danger" onClick={() => withdrawPending(e.id)}>Withdraw</button>
            </>
          )} />
        </div>

        <div className="col-12">
          <CardCarousel title="Past Events" items={pastEvents} emptyText="Nothing here yet." renderCardFooter={(e) => (
            <button className="btn btn-sm btn-outline-danger" onClick={() => deletePast(e.id)}>Delete</button>
          )} />
        </div>
      </div>
    </div>
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