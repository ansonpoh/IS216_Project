import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { AuthProvider, useAuth } from "../../contexts/AuthProvider"; // optional if you guard by role

export default function OrganiserDashboard() {
  const nav = useNavigate();
  const { auth } = useAuth?.() || {}; // safe in case hook shape differs
  const id = auth.id;

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | draft | published | closed
  const [sort, setSort] = useState("startAt"); // startAt | createdAt | capacity
  const [org, setOrg] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingModal, setLoadingModal] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [approved, setApproved] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const org = await axios.get("http://localhost:3001/orgs/get_org_by_id", {params: {id}})
        setOrg(org.data.result[0]);
        const res = await axios.get("http://localhost:3001/events/get_events_of_org", {params: {org_id: id}});
        setEvents(res.data.result);
        setFilteredEvents(res.data.result);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load events.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let list = [...events];

    if (status !== "all") list = list.filter((e) => (e.status || "draft") === status);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sort === "capacity") {
        const pa = capacityPct(a);
        const pb = capacityPct(b);
        return pb - pa; // most filled first
      }
      const av = a[sort];
      const bv = b[sort];
      return (av || "").localeCompare?.(bv || "") || new Date(av) - new Date(bv);
    });
    setFilteredEvents(list);
  }, [events, query, status, sort]);

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

  const capacityPct = (e) => {
    const filled = Number(approved || 0);
    const cap = Math.max(Number(e.capacity || 0), 0);
    if (!cap) return 0;
    return Math.min(100, Math.round((filled / cap) * 100));
  };

  const goCreate = () => nav("/organiser/opportunities/new");

  const openModal = async (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setLoadingModal(true);
    try {
      const res = await axios.get("http://localhost:3001/events/get_registered_users_for_event", {params: {event_id: event.event_id}})
      setRegistrations(res.data.result);
      let approved = 0;
      for(let r of res.data.result) {
        if(r.status === "approved") approved++;
      }
      setApproved(approved);
    } catch(err) {
      console.error("Failed to load registrations.");
    } finally {
      setLoadingModal(false);
    }
  };

  const handleUpdate = async (user_id, event_id, newStatus) => {
    try {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.user_id === user_id ? { ...r, status: newStatus } : r
        )
      );

      await axios.post("http://localhost:3001/events/update_registration_status", {
        user_id,
        event_id,
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
      alert("Error updating registration");

      setRegistrations((prev) =>
        prev.map((r) =>
          r.user_id === user_id ? { ...r, status: "pending" } : r
        )
      );
    }
  }

  const togglePublish = async (ev) => {
    const id = ev.id;
    const next = ev.status === "published" ? "draft" : "published";
    // optimistic UI
    setEvents((arr) => arr.map((e) => (e.id === id ? { ...e, status: next } : e)));
    try {
      await axios.post(`/organisers/events/${id}/${next === "published" ? "publish" : "unpublish"}`);
    } catch {
      // revert on error
      setEvents((arr) => arr.map((e) => (e.id === id ? { ...e, status: ev.status } : e)));
      alert("Could not change publish state.");
    }
  };

  const duplicate = async (ev) => {
    try {
      const res = await axios.post(`/organisers/events/${ev.id}/duplicate`);
      const newEvent = res.data?.event || { ...ev, id: `${ev.id}-copy`, title: ev.title + " (Copy)", status: "draft" };
      setEvents((arr) => [newEvent, ...arr]);
    } catch {
      // fallback optimistic copy
      const newEvent = { ...ev, id: `${ev.id}-copy-${Date.now()}`, title: ev.title + " (Copy)", status: "draft" };
      setEvents((arr) => [newEvent, ...arr]);
    }
  };

  const copyLink = async (ev) => {
    // Prefer slug/publicId if you have one; fallback to id
    const slug = ev.slug || ev.publicId || ev.id;
    const url = `${window.location.origin}/opportunities/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Public link copied!");
    } catch {
      prompt("Copy this link:", url);
    }
  };


  // ---- UI ------------------------------------------------------------------
  return (
    <>
      <Navbar />
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="mb-1">Organiser Dashboard</h2>
            <div className="text-muted">
              Welcome {org ? org.org_name : ""}. Manage your opportunities and volunteers.
            </div>
          </div>
          <button className="btn btn-success" onClick={goCreate}>
            + Create Opportunity
          </button>
        </div>

        {/* Filters */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Search by title, location, or description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="startAt">Sort by start time</option>
              <option value="createdAt">Sort by created time</option>
              <option value="capacity">Sort by capacity filled</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="card p-4">
            <div className="placeholder-wave">
              <div className="placeholder col-8 mb-2"></div>
              <div className="placeholder col-6 mb-2"></div>
              <div className="placeholder col-10"></div>
            </div>
          </div>
        )}

        {!loading && err && (
          <div className="alert alert-danger" role="alert">
            {err}
          </div>
        )}

        {!loading && !err && filteredEvents.length === 0 && (
          <div className="text-center text-muted py-5">
            <h5 className="mb-2">No opportunities yet</h5>
            <p className="mb-3">Create your first event and start collecting signups.</p>
            <button className="btn btn-primary" onClick={goCreate}>
              Create Opportunity
            </button>
          </div>
        )}

        {!loading && !err && filteredEvents.length > 0 && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: 220 }}>Title</th>
                  <th>Schedule</th>
                  <th>Location</th>
                  {/* <th style={{ minWidth: 150 }}>Capacity</th> */}
                  <th>Status</th>
                  <th style={{ width: 230 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((e) => {
                  const pct = capacityPct(e);
                  return (
                    <tr key={e.id}>
                      <td>
                        <div className="fw-semibold">{e.title || "Untitled"}</div>
                        <div className="text-muted small">{e.description?.slice(0, 80)}</div>
                      </td>
                      <td>
                        <div className="text-muted small">{fmtDate(e.start_date, e.end_date)} · {fmtTime(e.start_time, e.end_time)}</div>
                      </td>
                      <td>{e.location || "-"}</td>
                      {/* <td>
                        <div className="d-flex justify-content-between small">
                          <span>
                            {e.registration_count || 0}/{e.capacity || 0}
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <div className="progress" style={{ height: 8 }}>
                          <div
                            className={`progress-bar ${pct >= 100 ? "bg-success" : pct >= 70 ? "bg-info" : "bg-primary"}`}
                            role="progressbar"
                            style={{ width: `${pct}%` }}
                            aria-valuenow={pct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td> */}
                      <td>
                        <span
                          className={`badge ${
                            e.status === "published"
                              ? "text-bg-success"
                              : e.status === "closed"
                              ? "text-bg-secondary"
                              : "text-bg-warning"
                          }`}
                        >
                          {e.status || "draft"}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(e)}>
                            View
                          </button>
                          <button
                            className={`btn btn-sm ${
                              e.status === "published" ? "btn-outline-warning" : "btn-outline-success"
                            }`}
                            onClick={() => togglePublish(e)}
                          >
                            {e.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedEvent && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedEvent.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <p><strong>Description:</strong> {selectedEvent.description || "No description"}</p>
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                  <p><strong>Schedule:</strong> {fmtDate(selectedEvent.start_date, selectedEvent.end_date)} · {fmtTime(selectedEvent.start_time, selectedEvent.end_time)}</p>
                  
                  <hr />

                  <h6>Capacity</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>{approved || 0} / {selectedEvent.capacity || 0}</span>
                    <span>{capacityPct(selectedEvent)}%</span>
                  </div>
                  <div className="progress mb-3" style={{ height: 8 }}>
                    <div
                      className={`progress-bar ${capacityPct(selectedEvent) >= 100 ? "bg-success" : "bg-primary"}`}
                      style={{ width: `${capacityPct(selectedEvent)}%` }}
                    ></div>
                  </div>

                  <h6>Registered Volunteers</h6>
                  {loadingModal ? (
                    <div>Loading...</div>
                  ) : registrations.length > 0 ? (
                    <ul className="list-group">
                      {registrations.map((r) => (
                        <li key={r.user_id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{r.username}&nbsp; &nbsp;</strong> 
                            <span className="text-muted small">{r.email}</span>
                          </div>
                          <span
                            className={`badge ${
                              r.status === "approved"
                                ? "bg-success"
                                : r.status === "pending"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {r.status}
                          </span>

                          {r.status === "pending" && (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-success"
                                onClick={() =>
                                  handleUpdate(r.user_id, selectedEvent.event_id, "approved")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() =>
                                  handleUpdate(r.user_id, selectedEvent.event_id, "denied")
                                }
                              >
                                Deny
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted">No volunteers yet.</div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
