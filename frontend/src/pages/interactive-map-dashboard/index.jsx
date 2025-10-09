import React, { useState, useEffect } from "react";

/**
 * InteractiveMapDashboard.jsx
 * All Tailwind classes replaced with Bootstrap equivalents.
 * Make sure Bootstrap CSS is loaded (e.g., via CDN or npm bootstrap).
 */

/* ------------------------- Tiny UI primitives (Bootstrap) ------------------------- */
const Icon = ({ name, size = 18, className = "" }) => {
  const icons = {
    Map: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M3 6.5v13L9 18l6 3 6-2.5V4.5L15 7 9 4 3 6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    List: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Columns: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    Route: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M3 12h6l3 6 7-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    X: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };
  return icons[name] || null;
};

const Button = ({ children, variant = "default", size = "md", onClick, icon, iconPosition = "left", className = "" }) => {
  // Map variants -> Bootstrap button classes
  const sizeCls = size === "sm" ? "btn-sm" : "";
  const variantMap = {
    default: "btn btn-primary",
    ghost: "btn btn-light",
    outline: "btn btn-outline-secondary"
  };
  const cls = `${variantMap[variant] || variantMap.default} ${sizeCls} ${className}`;
  return (
    <button type="button" className={cls} onClick={onClick}>
      {icon && iconPosition === "left" && <span className="me-2 d-inline-flex align-items-center">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="ms-2 d-inline-flex align-items-center">{icon}</span>}
    </button>
  );
};

/* ------------------------- Small page header (Bootstrap navbar) ------------------------- */
const SimpleHeader = () => (
  <nav className="navbar navbar-light bg-white border-bottom fixed-top">
    <div className="container-fluid px-3 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-center rounded-circle bg-light text-primary fw-bold" style={{ width: 40, height: 40 }}>V</div>
        <div>
          <div className="fw-semibold">VolunteerHub</div>
          <small className="text-muted">Discover local opportunities</small>
        </div>
      </div>
      <div>
        <a href="/ai-chat-interface" className="text-primary text-decoration-none">AI Chat</a>
      </div>
    </div>
  </nav>
);

/* ------------------------- SearchBar ------------------------- */
const SearchBar = ({ onSearch, onLocationSearch }) => {
  const [q, setQ] = useState("");
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="input-group">
        <span className="input-group-text bg-white"><Icon name="Search" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch && onSearch(q)}
          placeholder="Search opportunities, skills, organizations..."
          className="form-control"
        />
        <button className="btn btn-link" onClick={() => onSearch && onSearch(q)}>Search</button>
      </div>
      <button onClick={() => onLocationSearch && onLocationSearch(null)} className="btn btn-outline-secondary">Near me</button>
    </div>
  );
};

/* ------------------------- Filter Sidebar ------------------------- */
const FilterSidebar = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const [local, setLocal] = useState(filters);
  useEffect(() => setLocal(filters), [filters]);

  const apply = () => {
    onFiltersChange && onFiltersChange(local);
    onToggle && onToggle();
  };

  const clear = () => {
    const empty = { categories: [], timeCommitment: "", skills: [], remote: null };
    setLocal(empty);
    onFiltersChange && onFiltersChange(empty);
  };

  const toggleCategory = (cat) => {
    setLocal(prev => {
      const exists = prev.categories.includes(cat);
      return { ...prev, categories: exists ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat] };
    });
  };

  const sidebarWidth = isOpen ? 240 : 56; // px

  return (
    <aside className="bg-white border-end p-3" style={{ width: sidebarWidth, transition: "width .15s", overflow: "hidden" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <strong>Filters</strong>
        <button className="btn btn-sm btn-light" onClick={onToggle}>{isOpen ? "«" : "»"}</button>
      </div>

      {isOpen ? (
        <>
          <div className="mb-3">
            <label className="form-label small mb-2">Category</label>
            <div className="d-flex flex-column gap-1 small">
              {["environment","education","seniors","food","animals","youth"].map(cat => (
                <label key={cat} className="form-check form-check-inline align-items-center">
                  <input className="form-check-input" type="checkbox" checked={local.categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                  <span className="form-check-label text-capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small mb-2">Time commitment</label>
            <select value={local.timeCommitment} onChange={(e) => setLocal(prev => ({...prev, timeCommitment: e.target.value}))} className="form-select form-select-sm">
              <option value="">Any</option>
              <option value="one-time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label small mb-2">Remote</label>
            <div className="d-flex gap-2 small">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="remote" id="remoteAny" checked={local.remote === null} onChange={() => setLocal(prev => ({...prev, remote: null}))} />
                <label className="form-check-label" htmlFor="remoteAny">Any</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="remote" id="remoteTrue" checked={local.remote === true} onChange={() => setLocal(prev => ({...prev, remote: true}))} />
                <label className="form-check-label" htmlFor="remoteTrue">Remote</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="remote" id="remoteFalse" checked={local.remote === false} onChange={() => setLocal(prev => ({...prev, remote: false}))} />
                <label className="form-check-label" htmlFor="remoteFalse">On-site</label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <Button onClick={apply} variant="default" size="sm">Apply</Button>
            <Button onClick={clear} variant="outline" size="sm">Clear</Button>
          </div>
        </>
      ) : (
        <div className="small text-muted">Open</div>
      )}
    </aside>
  );
};

/* ------------------------- Map container (simple SVG map) ------------------------- */
const SimpleMap = ({ opportunities = [], selectedOpportunity, onOpportunitySelect, routeMode, selectedOpportunities = [] }) => {
  const latRange = [40.68, 40.83];
  const lngRange = [-74.08, -73.94];

  const project = ({ lat, lng }) => {
    const x = ((lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * 100;
    const y = 100 - ((lat - latRange[0]) / (latRange[1] - latRange[0])) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
  };

  return (
    <div className="p-3 bg-light" style={{ height: "100%" }}>
      <div className="bg-white border rounded h-100 position-relative" style={{ minHeight: 300 }}>
        <div className="position-absolute top-50 start-50 translate-middle text-muted small user-select-none">Map preview (SVG)</div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-100 h-100 d-block">
          <rect x="0" y="0" width="100" height="100" fill="#f7fafc" />
          {[0, 25, 50, 75, 100].map((g) => (
            <line key={g} x1={g} y1="0" x2={g} y2="100" stroke="#edf2f7" strokeWidth="0.2" />
          ))}
          {[0, 25, 50, 75, 100].map((g) => (
            <line key={'h'+g} x1="0" y1={g} x2="100" y2={g} stroke="#edf2f7" strokeWidth="0.2" />
          ))}

          {routeMode && selectedOpportunities.length > 1 && (
            <polyline
              fill="none"
              stroke="#0d6efd"
              strokeWidth="0.6"
              points={selectedOpportunities.map(o => {
                const p = project(o.coordinates);
                return `${p.x},${p.y}`;
              }).join(" ")}
            />
          )}

          {opportunities.map((o) => {
            const p = project(o.coordinates);
            const isSelected = selectedOpportunity?.id === o.id;
            const inRoute = selectedOpportunities.some(r => r.id === o.id);
            return (
              <g key={o.id} transform={`translate(${p.x},${p.y})`} style={{ cursor: "pointer" }} onClick={() => onOpportunitySelect && onOpportunitySelect(o)}>
                <circle r={isSelected ? 2.5 : inRoute ? 2.2 : 1.8} fill={isSelected ? "#20c997" : inRoute ? "#f59e0b" : "#dc3545"} stroke="#fff" strokeWidth="0.25" />
                <title>{o.title}</title>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

/* ------------------------- Opportunity Card ------------------------- */
const OpportunityCard = ({ opportunity, onSelect, isSelected, routeMode, onAddToRoute, isInRoute }) => {
  return (
    <div className={`bg-white border rounded p-3 d-flex gap-3 ${isSelected ? "shadow-sm" : ""}`}>
      <img src={opportunity.image} alt="" style={{ width: 112, height: 80, objectFit: "cover", borderRadius: 6 }} />
      <div className="flex-fill d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <div className="fw-semibold">{opportunity.title}</div>
            <small className="text-muted">{opportunity.organization} • <span className="text-capitalize">{opportunity.category}</span></small>
          </div>
          <div className="text-end small">
            <div className="fw-medium">{opportunity.urgency === "high" ? "High" : opportunity.urgency}</div>
            <div className="text-muted">{opportunity.estimatedTime}</div>
          </div>
        </div>

        <p className="mt-2 text-muted mb-2" style={{ maxHeight: 48, overflow: "hidden" }}>{opportunity.description}</p>

        <div className="mt-auto d-flex align-items-center gap-2">
          <button className="btn btn-link p-0" onClick={() => onSelect && onSelect(opportunity)}>View</button>
          {routeMode && (
            <button
              onClick={() => onAddToRoute && onAddToRoute(opportunity)}
              className={`btn btn-sm ${isInRoute ? "btn-warning" : "btn-outline-secondary"}`}
            >
              {isInRoute ? "Remove from route" : "Add to route"}
            </button>
          )}
          <div className="ms-auto small text-muted">{opportunity.volunteersRegistered}/{opportunity.volunteersNeeded} signed</div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------- Route Panel ------------------------- */
const RoutePanel = ({ selectedOpportunities, onRemoveFromRoute, onOptimizeRoute, onClearRoute, isOpen, onToggle }) => {
  return (
    <aside className="bg-white border-start p-3" style={{ width: 320, transition: "transform .15s", transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <strong>Route</strong>
        <div className="d-flex gap-2">
          <button onClick={() => onOptimizeRoute && onOptimizeRoute(selectedOpportunities)} className="btn btn-sm btn-outline-secondary">Optimize</button>
          <button onClick={onToggle} className="btn btn-sm btn-light">{isOpen ? "«" : "»"}</button>
        </div>
      </div>

      <div>
        {selectedOpportunities.length === 0 && <div className="small text-muted mb-2">No stops in route yet</div>}
        {selectedOpportunities.map((o, idx) => (
          <div key={o.id} className="d-flex align-items-start gap-2 mb-2">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>{idx + 1}</div>
            <div className="flex-fill">
              <div className="fw-medium small">{o.title}</div>
              <div className="small text-muted">{o.location}</div>
            </div>
            <div>
              <button onClick={() => onRemoveFromRoute && onRemoveFromRoute(o.id)} className="btn btn-sm btn-link text-danger p-0">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-2 mt-3">
        <button onClick={onClearRoute} className="btn btn-outline-secondary btn-sm">Clear</button>
        <button onClick={() => alert("Start navigation (mock)")} className="btn btn-primary btn-sm">Start</button>
      </div>
    </aside>
  );
};

/* ------------------------- Main Component ------------------------- */
const InteractiveMapDashboard = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [routeMode, setRouteMode] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);
  const [viewMode, setViewMode] = useState("map"); // 'map', 'list', 'split'
  const [filters, setFilters] = useState({
    categories: [],
    timeCommitment: "",
    skills: [],
    remote: null
  });

  const opportunities = [
    {
      id: 1,
      title: "Community Garden Maintenance",
      organization: "Green City Initiative",
      category: "environment",
      location: "Central Park Community Garden, NYC",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      timeCommitment: "weekly",
      skills: ["gardening", "manual"],
      description: `Join our weekly community garden maintenance program where volunteers help maintain organic vegetable gardens that provide fresh produce to local food banks.\n\nTasks include weeding, watering, harvesting, and general garden upkeep. No experience necessary - we provide training and tools.`,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      urgency: "medium",
      volunteersNeeded: 12,
      volunteersRegistered: 8,
      remote: false,
      estimatedTime: "15 min"
    },
    {
      id: 2,
      title: "Reading Buddy Program",
      organization: "City Public Library",
      category: "education",
      location: "Main Library Branch, NYC",
      coordinates: { lat: 40.7614, lng: -73.9776 },
      timeCommitment: "weekly",
      skills: ["teaching", "communication"],
      description: `Help elementary school children improve their reading skills through our one-on-one reading buddy program.\n\nVolunteers spend 1 hour per week reading with assigned children, helping them build confidence and literacy skills. Background check required.`,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      urgency: "high",
      volunteersNeeded: 20,
      volunteersRegistered: 15,
      remote: false,
      estimatedTime: "8 min"
    },
    {
      id: 3,
      title: "Senior Technology Support",
      organization: "ElderTech Connect",
      category: "seniors",
      location: "Community Center, NYC",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      timeCommitment: "flexible",
      skills: ["technology", "teaching"],
      description: `Provide technology support and training to senior citizens in our community.\n\nHelp seniors learn to use smartphones, tablets, and computers for staying connected with family, accessing healthcare, and online services.`,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
      urgency: "low",
      volunteersNeeded: 8,
      volunteersRegistered: 3,
      remote: true,
      estimatedTime: "12 min"
    },
    {
      id: 4,
      title: "Food Bank Distribution",
      organization: "NYC Food Rescue",
      category: "food",
      location: "Downtown Distribution Center, NYC",
      coordinates: { lat: 40.7282, lng: -74.0776 },
      timeCommitment: "one-time",
      skills: ["manual", "organization"],
      description: `Help distribute food packages to families in need during our weekend food distribution events.\n\nVolunteers help sort donations, pack food boxes, and distribute meals to community members. Great for groups and families.`,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
      urgency: "high",
      volunteersNeeded: 25,
      volunteersRegistered: 18,
      remote: false,
      estimatedTime: "20 min"
    },
    {
      id: 5,
      title: "Animal Shelter Care",
      organization: "Happy Paws Rescue",
      category: "animals",
      location: "Brooklyn Animal Shelter, NYC",
      coordinates: { lat: 40.6892, lng: -73.9442 },
      timeCommitment: "weekly",
      skills: ["animal care", "cleaning"],
      description: `Provide care and companionship to rescued animals while they wait for their forever homes.\n\nDuties include feeding, cleaning kennels, socializing animals, and assisting with adoption events. Animal handling training provided.`,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
      urgency: "medium",
      volunteersNeeded: 15,
      volunteersRegistered: 12,
      remote: false,
      estimatedTime: "25 min"
    },
    {
      id: 6,
      title: "Youth Mentorship Program",
      organization: "Future Leaders Foundation",
      category: "youth",
      location: "Youth Center, NYC",
      coordinates: { lat: 40.8176, lng: -73.9482 },
      timeCommitment: "monthly",
      skills: ["mentoring", "leadership"],
      description: `Mentor at-risk youth through our comprehensive development program focusing on education, career guidance, and life skills.\n\nMentors meet monthly with assigned youth for activities, homework help, and goal setting. Long-term commitment preferred.`,
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400",
      urgency: "high",
      volunteersNeeded: 10,
      volunteersRegistered: 7,
      remote: false,
      estimatedTime: "18 min"
    }
  ];

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleLocationSearch = (coordinates) => {
    console.log("Searching near:", coordinates);
  };

  const handleOpportunitySelect = (opportunity) => {
    setSelectedOpportunity((prev) => (prev && prev.id === opportunity.id ? null : opportunity));
    if (viewMode === "map") setViewMode("split");
  };

  const handleAddToRoute = (opportunity) => {
    setSelectedOpportunities((prev) => {
      if (prev.find((opp) => opp.id === opportunity.id)) return prev.filter((opp) => opp.id !== opportunity.id);
      return [...prev, opportunity];
    });
  };

  const handleRemoveFromRoute = (opportunityId) => {
    setSelectedOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
  };

  const handleOptimizeRoute = (list = selectedOpportunities) => {
    if (!list || list.length <= 1) return list;
    const copy = [...list];
    const route = [copy.shift()];
    while (copy.length) {
      const last = route[route.length - 1];
      const idx = copy.reduce((bestIdx, candidate, i) => {
        const dBest = bestIdx === -1 ? Infinity : Math.hypot(last.coordinates.lat - copy[bestIdx].coordinates.lat, last.coordinates.lng - copy[bestIdx].coordinates.lng);
        const dCand = Math.hypot(last.coordinates.lat - candidate.coordinates.lat, last.coordinates.lng - candidate.coordinates.lng);
        return dCand < dBest ? i : bestIdx;
      }, -1);
      route.push(copy.splice(idx, 1)[0]);
    }
    setSelectedOpportunities(route);
    console.log("Route optimized (simple NN):", route);
    return route;
  };

  const handleClearRoute = () => {
    setSelectedOpportunities([]);
    setRouteMode(false);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filters.categories.length > 0 && !filters.categories.includes(opp.category)) return false;
    if (filters.timeCommitment && opp.timeCommitment !== filters.timeCommitment) return false;
    if (filters.skills.length > 0 && !filters.skills.some((skill) => opp.skills.includes(skill))) return false;
    if (filters.remote !== null && opp.remote !== filters.remote) return false;
    return true;
  });

  return (
    <div className="min-vh-100 bg-light" style={{ paddingTop: 64 }}>
      <SimpleHeader />

      <div className="d-flex" style={{ height: "calc(100vh - 64px)" }}>
        <FilterSidebar filters={filters} onFiltersChange={setFilters} isOpen={showFilters} onToggle={() => setShowFilters((s) => !s)} />

        <div className="flex-fill d-flex flex-column">
          <div className="bg-white border-bottom p-3">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="flex-fill me-md-3">
                <SearchBar onSearch={handleSearch} onLocationSearch={handleLocationSearch} />
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="btn-group" role="group" aria-label="View controls">
                  <Button variant={viewMode === "map" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("map")} icon={<Icon name="Map" />}>Map</Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} icon={<Icon name="List" />}>List</Button>
                  <Button variant={viewMode === "split" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("split")} icon={<Icon name="Columns" />}>Split</Button>
                </div>

                <Button
                  variant={routeMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setRouteMode((r) => !r); if (!routeMode) setShowRoute(true); }}
                  icon={<Icon name="Route" />}
                >
                  Route Mode
                </Button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top small text-muted">
              <div className="d-flex align-items-center gap-3">
                <span>{filteredOpportunities.length} opportunities found</span>
                <span>•</span>
                <span>89 organizations</span>
                <span>•</span>
                <span>Updated 5 min ago</span>
              </div>
              <div>
                <a href="/ai-chat-interface" className="text-primary text-decoration-none">Need help finding opportunities? Try AI Chat →</a>
              </div>
            </div>
          </div>

          <div className="d-flex flex-fill">
            {(viewMode === "map" || viewMode === "split") && (
              <div style={{ width: viewMode === "split" ? "50%" : "100%" }} className="border-end">
                <SimpleMap
                  opportunities={filteredOpportunities}
                  selectedOpportunity={selectedOpportunity}
                  onOpportunitySelect={handleOpportunitySelect}
                  routeMode={routeMode}
                  selectedOpportunities={selectedOpportunities}
                />
              </div>
            )}

            {(viewMode === "list" || viewMode === "split") && (
              <div style={{ width: viewMode === "split" ? "50%" : "100%" }} className="overflow-auto">
                <div className="p-3 d-flex flex-column gap-3">
                  {selectedOpportunity && viewMode === "split" && (
                    <div className="p-3 bg-light border rounded">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0 text-primary">Selected Opportunity</h6>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOpportunity(null)} icon={<Icon name="X" />} />
                      </div>
                      <OpportunityCard
                        opportunity={selectedOpportunity}
                        onSelect={handleOpportunitySelect}
                        isSelected={true}
                        routeMode={routeMode}
                        onAddToRoute={handleAddToRoute}
                        isInRoute={selectedOpportunities.some((opp) => opp.id === selectedOpportunity.id)}
                      />
                    </div>
                  )}

                  <div className="d-flex flex-column gap-3">
                    {filteredOpportunities.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        onSelect={handleOpportunitySelect}
                        isSelected={selectedOpportunity?.id === opportunity.id}
                        routeMode={routeMode}
                        onAddToRoute={handleAddToRoute}
                        isInRoute={selectedOpportunities.some((opp) => opp.id === opportunity.id)}
                      />
                    ))}
                  </div>

                  {filteredOpportunities.length === 0 && (
                    <div className="text-center py-5">
                      <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                        <Icon name="Search" size={24} />
                      </div>
                      <h5 className="mb-2">No opportunities found</h5>
                      <p className="text-muted mb-3">Try adjusting your filters or search terms to find more opportunities.</p>
                      <Button variant="outline" onClick={() => setFilters({ categories: [], timeCommitment: "", skills: [], remote: null })}>Clear Filters</Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {routeMode && (
          <RoutePanel
            selectedOpportunities={selectedOpportunities}
            onRemoveFromRoute={handleRemoveFromRoute}
            onOptimizeRoute={() => handleOptimizeRoute()}
            onClearRoute={handleClearRoute}
            isOpen={showRoute}
            onToggle={() => setShowRoute((s) => !s)}
          />
        )}
      </div>
    </div>
  );
};

export default InteractiveMapDashboard;
