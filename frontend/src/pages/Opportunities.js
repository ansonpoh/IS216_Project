import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.js";
import styles from "../styles/Opportunities.module.css";
import axios from 'axios';
import PageTransition from "../components/Animation/PageTransition.jsx";
import { useLocation } from "react-router-dom";

export default function Opportunities() {

  const location = useLocation();
  const openEventId = location.state?.eventId;
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);


  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/events/get_all_events");
        const data = Array.isArray(res.data.result) ? res.data.result : [];

        const normalized = data.map((it) => {
          const get = (...keys) => {
            for (const k of keys) if (it[k] != null) return it[k];
            return undefined;
          };
          const toNumber = (v) => (v == null || v === "" ? null : (Number.isNaN(Number(v)) ? null : Number(v)));

          return {
            event_id: get("event_id", "id"),
            title: get("title") || "Untitled opportunity",
            description: get("description") || "",
            location: get("location") || "",
            capacity: toNumber(get("capacity")) || null,
            start_date: get("start_date", "date") || null,
            end_date: get("end_date", "date") || null,
            start_time: get("start_time") || null,
            end_time: get("end_time") || null,
            hours: toNumber(get("hours")) || null,
            status: get("status") || "pending",
            category: get("category") || "general",
            region: get("region") || null,
            image_url: get("image_url") || null,
          };
        });

        setOpportunities(normalized);
      } catch (err) {
        console.error("❌ Failed to load opportunities", err);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3001/events/get_all_categories");
        setCategories(Array.isArray(res.data.result) ? res.data.result : []);
      } catch (err) { console.error("Error loading categories", err); }
    };
    const fetchRegions = async () => {
      try {
        const res = await axios.get("http://localhost:3001/events/get_all_regions");
        setRegions(Array.isArray(res.data.result) ? res.data.result : []);
      } catch (err) { console.error("Error loading regions", err); }
    };

    fetchCategories();
    fetchRegions();
  }, []);

  useEffect(() => {
    console.log(openEventId)
    if(openEventId && opportunities.length > 0) {
      const match = opportunities.find(op => op.event_id === openEventId);
      if(match) {
        setSelectedOpportunity(match);
        setShowModal(true);
      }
    }
  }, [openEventId, opportunities])

  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {  // show button after scrolling 300px
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const resetFilters = () => {
    setCategoryFilter("");
    setRegionFilter("");
    setDateFromFilter("");
    setDateToFilter("");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading opportunities...</p>
      </>
    );
  }

  if (opportunities.length === 0) {
    return (
      <>
        <Navbar />
        <div className={styles['no-opportunities-message']}>
          <p>No opportunities found.</p>
        </div>
      </>
    );
  }

  const filteredOpportunities = opportunities
    .filter((op) => (categoryFilter ? op.category === categoryFilter : true))
    .filter((op) => (regionFilter ? op.region === regionFilter : true))
    .filter((op) => (dateFromFilter ? new Date(op.start_date) >= new Date(dateFromFilter) : true))
    .filter((op) => (dateToFilter ? new Date(op.start_date) <= new Date(dateToFilter) : true));

  return (
    <>
    
      <Navbar />
      <PageTransition>
      <div className={styles['opportunities-container']}>
        <h1>Opportunities</h1>

        <div className={styles.filters}>
          <div className={styles['group-left']}>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter by category">
              <option value="">All Categories</option>
              {categories.map((catObj, idx) => (
                <option key={catObj.id ?? catObj.category ?? idx} value={catObj.category ?? catObj.name ?? ""}>
                  {catObj.category ?? catObj.name ?? "Unknown"}
                </option>
              ))}
            </select>

            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} aria-label="Filter by region">
              <option value="">All Regions</option>
              {regions.map((regObj, idx) => (
                <option key={regObj.id ?? regObj.region ?? idx} value={regObj.region ?? regObj.name ?? ""}>
                  {regObj.region ?? regObj.name ?? "Unknown"}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['group-right']}>
            <div className={styles['date-filter']}>
              <label>
                <span className={styles['date-label']}>Start</span>
                <input type="date" value={dateFromFilter} onChange={(e) => setDateFromFilter(e.target.value)} />
              </label>
              <label>
                <span className={styles['date-label']}>End</span>
                <input type="date" value={dateToFilter} onChange={(e) => setDateToFilter(e.target.value)} />
              </label>
            </div>
            <button className={styles['reset-btn']} onClick={resetFilters}>
              <i className="bi bi-arrow-counterclockwise" style={{ marginRight: "6px" }}></i>
              Reset
            </button>
          </div>
        </div>

        <div className={styles['card-grid']}>
          {filteredOpportunities.length === 0 ? (
            <div className={styles['empty-state-card']}>
              <div className={styles['empty-icon']}></div>
              <h3>No opportunities found</h3>
              <p>Try adjusting your filters or reset to see all available opportunities.</p>
            </div>
          ) : (
            filteredOpportunities.map((op) => (
              <div className={styles['event-card']} key={op.event_id} onClick={() => {setShowModal(true); setSelectedOpportunity(op);}}>
                <div className={styles['card-image']}>
                  {op.image_url && <img src={op.image_url} alt={op.title} />}
                  {/* <span className={`${styles['status-badge']} ${styles[op.status]}`}>{op.status}</span> */}
                </div>

                <div className={styles['card-content']}>
                  <h2 className={styles['event-title']}>{op.title}</h2>
                  <p>{op.description}</p>
                  <div className={styles['card-info']}>
                    <p>
                      <i className="bi bi-geo-alt-fill" style={{ marginRight: "5px" }}></i>
                      <span className={styles['info-text']}>{op.location || "N/A"}</span>
                    </p>
                    <p>
                      <i className="bi bi-calendar-event" style={{ marginRight: "7px" }}></i>
                      <span className={styles['info-text']}>
                        {formatDate(op.start_date)} - {formatTime(op.start_time)} - {formatTime(op.end_time)}
                      </span>
                    </p>
                    <p>
                      <i className="bi bi-people-fill" style={{ marginRight: "5px" }}></i>
                      Capacity: {op.capacity ?? "N/A"}
                    </p>
                  </div>
                </div>

                <hr className={styles['card-divider']} />

                <div className={styles['card-footer']}>
                <span className={`${styles['category-tag']} ${styles[`category-${op.category?.toLowerCase().replace(/\s+/g, "-")}`] || styles['category-general']}`}>
                {op.category ?? "Uncategorized"}
                </span>
                  <button className={styles['signup-btn']}>Sign Up</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && selectedOpportunity && (
        <>
        <div className={styles["modal-overlay"]} onClick={() => setShowModal(false)}>
          <div className={styles["modal-wrapper"]}onClick={(e) => e.stopPropagation()}>
            <button className={styles["modal-close"]} onClick={() => setShowModal(false)}>
              &times;
            </button>

            <div className={styles["modal-content-row"]}>
              <div className={styles["modal-left"]}>
                <img
                  src={selectedOpportunity.image_url}
                  alt={selectedOpportunity.title}
                  className={styles["modal-large-image"]}
                />
              </div>

              <div className={styles["modal-right"]}>
                <h2 className={styles["modal-title"]}>{selectedOpportunity.title}</h2>
                <p className={styles["modal-desc"]}>{selectedOpportunity.description}</p>

                <div className={styles["modal-detail-list"]}>
                  <p>
                    <i className="bi bi-geo-alt-fill"></i>{" "}
                    {selectedOpportunity.location || "N/A"}
                  </p>
                  <p>
                    <i className="bi bi-calendar-event"></i>{" "}
                    {formatDate(selectedOpportunity.start_date)}{" "}
                    {formatTime(selectedOpportunity.start_time)} –{" "}
                    {formatTime(selectedOpportunity.end_time)}
                  </p>
                  <p>
                    <i className="bi bi-people-fill"></i> Capacity:{" "}
                    {selectedOpportunity.capacity ?? "N/A"}
                  </p>
                  <p>Category: {selectedOpportunity.category}</p>
                  <p>Region: {selectedOpportunity.region}</p>
                </div>

                <button className={styles["modal-signup-btn"]}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {showScrollTop && (
  <button 
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
    className={styles.scrollTopButton}
    aria-label="Scroll to top"
  >
    ↑
  </button>
)}

      </PageTransition>
    </>
  );
}

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-SG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString("en-SG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
