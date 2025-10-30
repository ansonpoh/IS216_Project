import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
// Optional: reuse your existing chart (comment out if you don't have it)
// import ImpactChart from "./components/ImpactChart";

const ProfilePage = () => {
  // --- Mock profile data (wire to your API later) ---
  const [profile] = useState({
    name: "Alicia Tan",
    role: "Volunteer • Team Lead",
    location: "Singapore",
    memberSince: "Jan 2024",
    avatar: "https://i.pravatar.cc/120?img=5",
    email: "alicia.tan@example.com",
  });

  const [impact] = useState({
    totalHours: 156,
    hourGoal: 200,
    eventsAttended: 23,
    beneficiariesHelped: 150,
  });

  const [skills] = useState([
    { name: "Community Outreach", level: "Advanced", progress: 85, hours: 45 },
    { name: "Event Planning", level: "Intermediate", progress: 65, hours: 32 },
    { name: "Fundraising", level: "Beginner", progress: 30, hours: 18 },
    { name: "Public Speaking", level: "Intermediate", progress: 55, hours: 25 },
  ]);

  const [trend] = useState([
    { month: "Apr", hours: 12 },
    { month: "May", hours: 18 },
    { month: "Jun", hours: 25 },
    { month: "Jul", hours: 22 },
    { month: "Aug", hours: 35 },
    { month: "Sep", hours: 44 },
  ]);

  // Derived
  const hoursPct = Math.min(Math.round((impact.totalHours / impact.hourGoal) * 100), 100);

  const totalSkillHours = useMemo(
    () => skills.reduce((sum, s) => sum + (s.hours || 0), 0),
    [skills]
  );

  return (
    <>
    <Navbar/>
    <div className="bg-body-secondary">
      {/* Header */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-md-auto text-center text-md-start">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="rounded-circle border"
                style={{ width: 96, height: 96, objectFit: "cover" }}
              />
            </div>
            <div className="col">
              <h1 className="h3 fw-bold mb-1">{profile.name}</h1>
              <div className="text-secondary">
                {profile.role} · {profile.location} · Member since {profile.memberSince}
              </div>
              <div className="text-secondary small">{profile.email}</div>
            </div>
            <div className="col-12 col-md-auto d-flex gap-2 justify-content-center justify-content-md-end">
              <a href="/settings" className="btn btn-outline-secondary btn-sm">Edit Profile</a>
              <a href="/impact" className="btn btn-primary btn-sm">View Full Impact</a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Left column */}
            <div className="col-12 col-lg-8 d-flex flex-column gap-4">

              {/* Personal Impact Meter */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h2 className="h5 mb-0">Personal Impact</h2>
                    <span className="small text-secondary">
                      {impact.totalHours}/{impact.hourGoal} hours
                    </span>
                  </div>

                  {/* Hours vs Goal (meter/progress) */}
                  <div className="mb-3">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label="Hours vs Goal"
                      aria-valuenow={hoursPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-bar"
                        style={{ width: `${hoursPct}%` }}
                      >
                        {hoursPct}%
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-1 small text-secondary">
                      <span>Total Hours</span>
                      <span>Goal</span>
                    </div>
                  </div>

                  {/* KPI tiles */}
                  <div className="row text-center g-3">
                    <div className="col-4">
                      <div className="h4 mb-0">{impact.eventsAttended}</div>
                      <div className="small text-secondary">Events Attended</div>
                    </div>
                    <div className="col-4">
                      <div className="h4 mb-0">{impact.beneficiariesHelped}</div>
                      <div className="small text-secondary">Beneficiaries Helped</div>
                    </div>
                    <div className="col-4">
                      <div className="h4 mb-0">{totalSkillHours}</div>
                      <div className="small text-secondary">Skill Hours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Over Time */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h2 className="h5 mb-0">Impact Over Time</h2>
                    <span className="small text-secondary">Monthly hours</span>
                  </div>

                  {/* If you have your ImpactChart component, use it: */}
                  {/* <ImpactChart chartData={trend.map(t => ({ month: t.month, hours: t.hours, events: 0 }))} /> */}

                  {/* Lightweight inline SVG line chart (no deps) */}
                  <MiniLineChart data={trend} height={140} />
                </div>
              </div>

              {/* Records / recent highlights (simple table) */}
              <div className="card">
                <div className="card-body">
                  <h2 className="h5 mb-3">Recent Records</h2>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th scope="col">Month</th>
                          <th scope="col" className="text-end">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trend.map((r) => (
                          <tr key={r.month}>
                            <td>{r.month}</td>
                            <td className="text-end">{r.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* Right column */}
            <div className="col-12 col-lg-4 d-flex flex-column gap-4">

              {/* Quick profile info */}
              <div className="card">
                <div className="card-body">
                  <h2 className="h6 mb-3">Profile</h2>
                  <ul className="list-unstyled mb-0 small">
                    <li className="mb-2"><span className="fw-medium">Name:</span> {profile.name}</li>
                    <li className="mb-2"><span className="fw-medium">Role:</span> {profile.role}</li>
                    <li className="mb-2"><span className="fw-medium">Location:</span> {profile.location}</li>
                    <li className="mb-2"><span className="fw-medium">Member Since:</span> {profile.memberSince}</li>
                    <li className="mb-2"><span className="fw-medium">Email:</span> {profile.email}</li>
                  </ul>
                </div>
              </div>

              {/* Skill Development */}
              <div className="card">
                <div className="card-body">
                  <h2 className="h6 mb-3">Skill Development</h2>
                  <div className="d-flex flex-column gap-3">
                    {skills.map((s) => (
                      <div key={s.name}>
                        <div className="d-flex justify-content-between align-items-end">
                          <div className="fw-medium">{s.name}</div>
                          <div className="small text-secondary">
                            {s.level} · {s.hours}h
                          </div>
                        </div>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-label={`${s.name} Progress`}
                          aria-valuenow={s.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div className="progress-bar" style={{ width: `${s.progress}%` }}>
                            {s.progress}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goal controls (optional) */}
              <div className="card">
                <div className="card-body">
                  <h2 className="h6 mb-3">Adjust Hour Goal</h2>
                  <HourGoalEditor current={impact.hourGoal} />
                  <div className="small text-secondary mt-2">
                    Set a monthly or yearly target to keep yourself motivated.
                  </div>
                </div>
              </div>

            </div>
          </div>

          <p className="text-center text-secondary small mt-4 mb-0">
            © {new Date().getFullYear()} VolunteerConnect
          </p>
        </div>
      </section>
    </div>
    </>

  );
};

/* --------- Small helper components (no external deps) --------- */

// Tiny inline line-chart (hours by month) using SVG
const MiniLineChart = ({ data, width = "100%", height = 140, padding = 16 }) => {
  if (!data?.length) return null;

  const w = 600; // internal drawing width (scaled by viewBox)
  const h = height;
  const xStep = (w - padding * 2) / (data.length - 1);
  const minY = 0;
  const maxY = Math.max(...data.map((d) => d.hours)) * 1.15; // headroom

  const points = data.map((d, i) => {
    const x = padding + i * xStep;
    const y = h - padding - ((d.hours - minY) / (maxY - minY)) * (h - padding * 2);
    return [x, y];
  });

  const path = points.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={width} height={height} className="w-100">
      {/* Axis baseline */}
      <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="currentColor" opacity="0.2" />
      {/* Area fill */}
      <path d={`${path} L ${w - padding},${h - padding} L ${padding},${h - padding} Z`} fill="currentColor" opacity="0.08" />
      {/* Line */}
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Points */}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="currentColor" />
      ))}
      {/* X labels */}
      {data.map((d, i) => {
        const x = padding + i * xStep;
        return (
          <text
            key={d.month}
            x={x}
            y={h - padding + 12}
            fontSize="10"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.6"
          >
            {d.month}
          </text>
        );
      })}
    </svg>
  );
};

// Simple “edit goal” UI (local-only; wire to API as needed)
const HourGoalEditor = ({ current }) => {
  const [goal, setGoal] = useState(current || 200);
  return (
    <form
      className="d-flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        alert(`Stub: saved new goal ${goal} hours`);
      }}
    >
      <input
        type="number"
        min={1}
        className="form-control form-control-sm"
        value={goal}
        onChange={(e) => setGoal(parseInt(e.target.value || "0", 10))}
        aria-label="Hour Goal"
      />
      <button type="submit" className="btn btn-sm btn-outline-primary">
        Save
      </button>
    </form>
  );
};

export default ProfilePage;
