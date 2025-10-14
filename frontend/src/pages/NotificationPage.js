// NotificationsPage.jsx
import React, { useMemo, useState } from "react";
import Navbar from "./Navbar";

const seed = [
  { id: "1", title: "Champion badge earned!", body: "You crossed 100 hours 🎉", ts: Date.now()-1000*60*12, read: false, type: "achievement" },
  { id: "2", title: "Event reminder", body: "Beach Cleanup starts tomorrow 9am", ts: Date.now()-1000*60*60*2, read: false, type: "event" },
  { id: "3", title: "Message from Ocean Guardians", body: "Confirm your T-shirt size", ts: Date.now()-1000*60*60*26, read: true, type: "message" },
];

const timeAgo = (t) => {
  const s = Math.max(1, Math.floor((Date.now()-t)/1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s/60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
};

export default function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState("all"); // 'all' | 'unread'

  const visible = useMemo(
    () => items.filter(n => tab === "unread" ? !n.read : true).sort((a,b)=>b.ts-a.ts),
    [items, tab]
  );

  const markAllRead = () => setItems(prev => prev.map(n => ({...n, read:true})));
  const toggleRead = (id) => setItems(prev => prev.map(n => n.id===id ? ({...n, read:!n.read}) : n));

  return (
    <>
    <Navbar/>
    <div className="bg-body-secondary min-vh-100">
      {/* Header */}
      <div className="bg-white border-bottom">
        <div className="container py-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div>
            <h1 className="h5 mb-1">Notifications</h1>
            <div className="text-secondary small">
              {items.filter(i=>!i.read).length} unread • {items.length} total
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group btn-group-sm" role="group" aria-label="Filter">
              <button className={`btn ${tab==="all"?"btn-primary":"btn-outline-primary"}`} onClick={()=>setTab("all")}>All</button>
              <button className={`btn ${tab==="unread"?"btn-primary":"btn-outline-primary"}`} onClick={()=>setTab("unread")}>Unread</button>
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={markAllRead}>Mark all read</button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container py-4">
        {visible.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-secondary">
              <div style={{fontSize:24}} className="mb-2">🔔</div>
              <div className="fw-medium">No notifications</div>
              <div className="small">You're all caught up.</div>
            </div>
          </div>
        ) : (
          <div className="list-group">
            {visible.map(n => (
              <div key={n.id} className="list-group-item d-flex gap-3 align-items-start">
                {/* unread dot */}
                <span
                  className={`rounded-circle mt-2 ${n.read ? "bg-transparent border" : "bg-primary"}`}
                  style={{width:10,height:10, display:"inline-block"}}
                  aria-label={n.read ? "Read" : "Unread"}
                />
                <div className="w-100">
                  <div className="d-flex justify-content-between">
                    <div className="fw-medium">{n.title}</div>
                    <small className="text-secondary">{timeAgo(n.ts)}</small>
                  </div>
                  <div className="text-secondary small">{n.body}</div>
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => toggleRead(n.id)}
                    >
                      {n.read ? "Mark as unread" : "Mark as read"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
    
  );
}
