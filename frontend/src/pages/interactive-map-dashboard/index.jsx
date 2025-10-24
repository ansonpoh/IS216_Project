// Updated Regional Filters and Recategorization for Singapore

// FILE: frontend/src/pages/interactive-map-dashboard/index.jsx
// UPDATE: regions array and category mapping

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar.js";
import MapContainer from "./components/MapContainer";
import "./styles.css";

const InteractiveMapDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const mapRef = useRef(null);

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

          if (window.mapInstance) {
            window.mapInstance.setCenter(pos);
            window.mapInstance.setZoom(15);

            new window.google.maps.Marker({
              position: pos,
              map: window.mapInstance,
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
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      <Navbar />

      <div className="container-fluid flex-grow-1 d-flex flex-column p-4">
        {/* Filter Section */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <div className="row">
              {/* Region Filters */}
              <div className="col-md-6 mb-3 mb-md-0">
                <h6 className="fw-semibold text-dark mb-3">Region</h6>
                <div className="d-flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <button
                      key={region.name}
                      className={`btn btn-sm d-flex align-items-center btn-region-${region.name.toLowerCase().replace('-', '-')} ${
                        activeFilters.includes(region.name) ? 'active' : ''
                      }`}
                      onClick={() => toggleFilter(region.name)}
                    >
                      <i className={`${region.icon} me-1`}></i>
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filters */}
              <div className="col-md-6">
                <h6 className="fw-semibold text-dark mb-3">Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className={`btn btn-sm d-flex align-items-center ${
                        activeFilters.includes(category.name)
                          ? 'btn-info'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => toggleFilter(category.name)}
                    >
                      <i className={`${category.icon} me-1`}></i>
                      {category.name}
                    </button>
                  ))}
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
        />

        {/* Current Location Button */}
        <div className="position-fixed bottom-0 end-0 m-5" style={{ zIndex: 10 }}>
          <button
            id="current-location"
            className="btn btn-light rounded-circle shadow-lg p-3"
            onClick={handleCurrentLocation}
            title="Center on my location"
          >
            <i className="bi bi-compass"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapDashboard;