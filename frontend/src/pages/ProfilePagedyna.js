import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";

// Helper: format date -> "Mon YYYY"
const monthLabel = (d) =>
  d.toLocaleString("en-US", { month: "short", year: "numeric" });

// Build the last N months array of labels
const lastNMonths = (n = 6) => {
  const now = new Date();
  return Array.from({ length: n })
    .map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
      return { key: d.toISOString().slice(0, 7), label: monthLabel(d) }; // YYYY-MM
    });
};

const ProfilePage = () => {
  const { auth } = useAuth?.() || {}; // expect { id, role, ... }
  const userId = auth?.id;            // <-- ensure this matches your users.user_id
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---- Live state from DB ----
  const [profile, setProfile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [eventsAttended, setEventsAttended] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState([]); // [{month:'Sep', hours:10}, ...]

  // Optional “skills” derived from user_activity.role, grouped by role
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setErr("");

      try {
        // 1) users table
        const { data: user, error: uErr } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (uErr) throw uErr;

        // 2) event_registration: count events (confirmed/approved)
        const { data: regs, error: rErr } = await supabase
          .from("event_registration")
          .select("event_id,status,registered_at")
          .eq("user_id", userId);

        if (rErr) throw rErr;

        // adjust status filter as you use it
        const confirmedEvents = (regs || []).filter(
          (r) => (r.status || "").toLowerCase() !== "cancelled"
        ).length;

        // 3) user_activity: sum hours, compute monthly buckets, group roles
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // from 1st day of that month

        const { data: acts, error: aErr } = await supabase
          .from("user_activity")
          .select("event_id, role, hours, created_at")
          .eq("user_id", userId)
          .gte("created_at", sixMonthsAgo.toISOString());

        if (aErr) throw aErr;

        const total = (acts || []).reduce((sum, a) => sum + (a.hours || 0), 0);

        // Build month buckets
        const months = lastNMonths(6); // [{key:'YYYY-MM', label:'Sep 2025'}, ...]
        const bucket = Object.fromEntries(months.map((m) => [m.key, 0]));

        (acts || []).forEach((a) => {
          const k = (a.created_at || "").slice(0, 7); // YYYY-MM
          if (bucket[k] != null) bucket[k] += a.hours || 0;
        });

        const monthly = months.map((m) => ({
          month: m.label,
          hours: bucket[m.key] || 0,
        }));

        // "skills" out of roles (sum hours per role)
        const byRole = {};
        (acts || []).forEach((a) => {
          const key = a.role || "General";
          byRole[key] = (byRole[key] || 0) + (a.hours || 0);
        });
        // Normalize to a few items with fake “progress” scaled by hours
        const roles = Object.entries(byRole)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, hours]) => ({
            name,
            level: hours >= 40 ? "Advanced" : hours >= 20 ? "Intermediate" : "Beginner",
            progress: Math.min(Math.round((hours / 50) * 100), 100), // 50h == 100%
            hours,
          }));

        if (!cancelled) {
          setProfile({
            name: user.username || "Anonymous",
            role: "Volunteer", // you can flesh this out from auth/roles
            location: user.region || "—",
            memberSince: user.date_joined
              ? new Date(user.date_joined).toLocaleDateString("en-SG", {
                  month: "short",
                  year: "numeric",
                })
              : "—",
            avatar:
              user.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user.username || "U"
              )}`,
            email: user.email || "",
            bio: user.bio || "",
          });
          setTotalHours(total);
          setEventsAttended(confirmedEvents);
          setMonthlyHours(monthly);
          setSkills(roles);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setErr("Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Derived values
  const hourGoal = 200; // could come from users table later
  const hoursPct = Math.min(Math.round((totalHours / hourGoal) * 100), 100);
  const totalSkillHours = useMemo(
    () => skills.reduce((sum, s) => sum + (s.hours || 0), 0),
    [skills]
  );

  return (
    <>
      <Navbar />
      <div className="bg-body-secondary">
        <section className="py-5 bg-white border-bottom">
          <div className="container">
            {loading ? (
              <div className="text-secondary">Loading profile…</div>
            ) : err ? (
              <div className="alert alert-danger mb-0">{err}</div>
            ) : (
              <div className="row align-items-center gy-4">
                <div className="col-12 col-md-auto text-center text-md-start">
                  <img
                    src={profile?.avatar}
                    alt={profile?.name}
                    className="rounded-circle border"
                    style={{ width: 96, height: 96, objectFit: "cover" }}
                  />
                </div>
                <div className="col">
                  <h1 className="h3 fw-bold mb-1">{profile?.name}</h1>
                  <div className="text-secondary">
                    {profile?.role} · {profile?.location} · Member since{" "}
                    {profile?.memberSince}
                  </div>
                  <div className="text-secondary small">{profile?.email}</div>
                </div>
                <div className="col-12 col-md-auto d-flex gap-2 justify-content-center justify-content-md-end">
                  <a href="/settings" className="btn btn-outline-secondary btn-sm">
                    Edit Profile
                  </a>
                  <a href="/impact" className="btn btn-primary btn-sm">
                    View Full Impact
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {!loading && !err && (
          <section className="py-5">
            <div className="container">
              <div className="row g-4">
                {/* Left column */}
                <div className="col-12 col-lg-8 d-flex flex-column gap-4">
                  {/* Personal Impact */}
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="h5 mb-0">Personal Impact</h2>
                        <span className="small text-secondary">
                          {totalHours}/{hourGoal} hours
                        </span>
                      </div>
                      <div className="mb-3">
                        <div
                          className="progress"
                          role="progressbar"
                          aria-valuenow={hoursPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div className="progress-bar" style={{ width: `${hoursPct}%` }}>
                            {hoursPct}%
                          </div>
                        </div>
                        <div className="d-flex justify-content-between mt-1 small text-secondary">
                          <span>Total Hours</span>
                          <span>Goal</span>
                        </div>
                      </div>

                      {/* KPIs */}
                      <div className="row text-center g-3">
                        <div className="col-4">
                          <div className="h4 mb-0">{eventsAttended}</div>
                          <div className="small text-secondary">Events Attended</div>
                        </div>
                        <div className="col-4">
                          <div className="h4 mb-0">{totalSkillHours}</div>
                          <div className="small text-secondary">Skill Hours</div>
                        </div>
                        <div className="col-4">
                          <div className="h4 mb-0">{Math.max(...monthlyHours.map(m => m.hours), 0)}</div>
                          <div className="small text-secondary">Best Month</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact over time */}
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="h5 mb-0">Impact Over Time</h2>
                        <span className="small text-secondary">Monthly hours</span>
                      </div>
                      <MiniLineChart data={monthlyHours} height={140} />
                    </div>
                  </div>

                  {/* Recent monthly table */}
                  <div className="card">
                    <div className="card-body">
                      <h2 className="h5 mb-3">Recent Records</h2>
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th className="text-end">Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthlyHours.map((r) => (
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
                  <div className="card">
                    <div className="card-body">
                      <h2 className="h6 mb-3">Profile</h2>
                      <ul className="list-unstyled mb-0 small">
                        <li className="mb-2">
                          <span className="fw-medium">Name:</span> {profile?.name}
                        </li>
                        <li className="mb-2">
                          <span className="fw-medium">Role:</span> {profile?.role}
                        </li>
                        <li className="mb-2">
                          <span className="fw-medium">Location:</span> {profile?.location}
                        </li>
                        <li className="mb-2">
                          <span className="fw-medium">Member Since:</span>{" "}
                          {profile?.memberSince}
                        </li>
                        <li className="mb-2">
                          <span className="fw-medium">Email:</span> {profile?.email}
                        </li>
                      </ul>
                    </div>
                  </div>

                    {/* Skill Development */}
                    <div className="card">
                      <div className="card-body">
                        <h2 className="h6 mb-3">Skill Development</h2>
                        <div className="d-flex flex-column gap-3">
                          {skills.length === 0 ? (
                            <div className="text-secondary small">No skill records yet.</div>
                          ) : (
                            skills.map((s) => (
                              <div key={s.name}>
                                <div className="d-flex justify-content-between align-items-end">
                                  <div className="fw-medium">{s.name}</div>
                                  <div className="small text-secondary">
                                    {s.level} · {s.hours}h
                                  </div>
                                </div>
                                <div className="progress" role="progressbar" aria-valuenow={s.progress} aria-valuemin={0} aria-valuemax={100}>
                                  <div className="progress-bar" style={{ width: `${s.progress}%` }}>
                                    {s.progress}%
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                  {/* Goal controls (still local; wire to users table if you want) */}
                  <div className="card">
                    <div className="card-body">
                      <h2 className="h6 mb-3">Adjust Hour Goal</h2>
                      <HourGoalEditor current={hourGoal} />
                      <div className="small text-secondary mt-2">
                        Set a target to keep yourself motivated.
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
        )}
      </div>
    </>
  );
};

/* --------- Inline helpers (unchanged) --------- */

const MiniLineChart = ({ data, width = "100%", height = 140, padding = 16 }) => {
  if (!data?.length) return null;
  const w = 600;
  const h = height;
  const xStep = (w - padding * 2) / (data.length - 1);
  const minY = 0;
  const maxY = Math.max(...data.map((d) => d.hours), 0) * 1.15 || 10;

  const points = data.map((d, i) => {
    const x = padding + i * xStep;
    const y = h - padding - ((d.hours - minY) / (maxY - minY)) * (h - padding * 2);
    return [x, y];
  });
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={width} height={height} className="w-100">
      <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="currentColor" opacity="0.2" />
      <path d={`${path} L ${w - padding},${h - padding} L ${padding},${h - padding} Z`} fill="currentColor" opacity="0.08" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
      {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="currentColor" />)}
      {data.map((d, i) => {
        const x = padding + i * xStep;
        return (
          <text key={d.month} x={x} y={h - padding + 12} fontSize="10" textAnchor="middle" fill="currentColor" opacity="0.6">
            {d.month}
          </text>
        );
      })}
    </svg>
  );
};

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
      <button type="submit" className="btn btn-sm btn-outline-primary">Save</button>
    </form>
  );
};

export default ProfilePage;
