import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar.js";
import MapContainer from "./MapContainer.jsx";
import styles from "../../styles/MapStyles.module.css"
import { useLocation } from "react-router-dom";

const InteractiveMapDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const mapRef = useRef(null);
  const location = useLocation();
  const recommendedEvents = location.state?.events || [];

  // Add map instance ref
  const mapInstanceRef = useRef(null);

  // UPDATED REGIONS - Singapore regions
  const regions = [
    { name: "Central", icon: "bi-compass" },
    { name: "North", icon: "bi-arrow-up" },
    { name: "North-East", icon: "bi-arrow-up-right" },
    { name: "East", icon: "bi-arrow-right" },
    { name: "West", icon: "bi-arrow-left" }
  ];

  // CATEGORIES
  const categories = [
    { name: "Animal", icon: "fa-solid fa-paw" },
    { name: "Children", icon: "bi-balloon-fill" },
    { name: "Elderly", icon: "bi-person-walking" },
    { name: "Environment", icon: "bi-tree-fill" },
    { name: "Event Support", icon: "bi-calendar-event" },
    { name: "Mental Health", icon: "bi-heart-pulse" },
    { name: "PWDs", icon: "bi-universal-access" }
  ];

  const toggleFilter = (filterName) => {
    setActiveFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Use mapRef.current instead of window.mapInstance
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(pos);
            mapInstanceRef.current.setZoom(15);

            new window.google.maps.Marker({
              position: pos,
              map: mapInstanceRef.current,
              title: "Your Location",
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }
            });
          }
        },
        () => {
          alert('Unable to get your location');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleResetFilters = () => {
    setActiveFilters([]);
  };

  return (
    <>
      <Navbar />
      {/* <PageTransition> */}
        <div className="container-fluid vh-100 d-flex flex-column">
          <div className="flex-grow-1 d-flex flex-column p-4">
            {/* Filter Section */}
            <div className={`card mb-4 ${styles['map-filter-card']}`}>
              <div className={`card-body`}>
                <div className="row">
                  {/* Region Filters */}
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h6 className="fw-semibold mb-3" style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.1rem' }}>Region</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {regions.map((region) => {
                        const regionClass = styles[`btn-region-${region.name.toLowerCase().replace(' ', '-')}`];
                        const isActive = activeFilters.includes(region.name);
                        return (
                          <button
                            key={region.name}
                            className={`${regionClass} ${isActive ? styles.active : ''} btn btn-sm d-flex align-items-center`}
                            onClick={() => toggleFilter(region.name)}
                          >
                            <i className={`${region.icon} me-1`}></i>
                            {region.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-3" style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.1rem' }}>Category</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const categoryClass = styles[`btn-category-${category.name.toLowerCase().replace(' ', '-')}`];
                        const isActive = activeFilters.includes(category.name);
                        return (
                          <button
                            key={category.name}
                            className={`${categoryClass} ${isActive ? styles.active : ''} btn btn-sm d-flex align-items-center`}
                            onClick={() => toggleFilter(category.name)}
                          >
                            <i className={`${category.icon} me-1`}></i>
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <MapContainer
              ref={mapRef}
              activeFilters={activeFilters}
              onResetFilters={handleResetFilters}
              recommendedEvents={recommendedEvents}
              onCurrentLocation={handleCurrentLocation}
              onMapLoad={(mapInstance) => {
                mapInstanceRef.current = mapInstance;
                window.mapInstance = mapInstance; // For backward compatibility
              }}
            />
          </div>
        </div>
      {/* </PageTransition> */}
    </>
  );
};

export default InteractiveMapDashboard;