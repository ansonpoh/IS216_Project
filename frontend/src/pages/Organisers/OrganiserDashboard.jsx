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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const org = await axios.get("http://localhost:3001/orgs/get_org_by_id", {params: {id}})
        setOrg(org.data.result[0]);
        const org_id = org.data.result[0].org_id;
        const res = await axios.get("http://localhost:3001/events/get_events_of_org", {params: {org_id}});
        setEvents(res.data.result);
        setFilteredEvents(res.data.result);
        // if (!cancelled) {
        //   setEvents(Array.isArray(res.data) ? res.data : res.data?.events || []);
        // }
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
    console.log(events);
    setFilteredEvents(list);
  }, [events, query, status, sort]);

  const fmtDate = (iso) => {
    if (!iso) return "-";
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const capacityPct = (e) => {
    const filled = Number(e.approvedCount || 0);
    const cap = Math.max(Number(e.capacity || 0), 0);
    if (!cap) return 0;
    return Math.min(100, Math.round((filled / cap) * 100));
  };


  const goCreate = () => nav("/organiser/opportunities/new"); // <-- point this to your actual form route

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
                  <th style={{ minWidth: 220 }}>Capacity</th>
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
                        <div>{fmtDate(e.startAt)}</div>
                        <div className="text-muted small">Ends: {fmtDate(e.endAt)}</div>
                      </td>
                      <td>{e.location || "-"}</td>
                      <td>
                        <div className="d-flex justify-content-between small">
                          <span>
                            {e.approvedCount || 0}/{e.capacity || 0}
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
                      </td>
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
                          <button className="btn btn-outline-primary btn-sm" onClick={() => nav(`/organiser/opportunities/${e.id}`)}>
                            View
                          </button>
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => duplicate(e)}>
                            Duplicate
                          </button>
                          <button
                            className={`btn btn-sm ${
                              e.status === "published" ? "btn-outline-warning" : "btn-outline-success"
                            }`}
                            onClick={() => togglePublish(e)}
                          >
                            {e.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button className="btn btn-outline-dark btn-sm" onClick={() => copyLink(e)}>
                            Copy Link
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
      </div>
    </>
  );
}
