import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar.js";
import MapContainer from "./components/MapContainer";
import "./styles.css";

const InteractiveMapDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const mapRef = useRef(null);

  const categories = [
    { name: "North", icon: "fa-solid fa-arrow-up" },
    { name: "South", icon: "fa-solid fa-arrow-down" },
    { name: "East", icon: "fa-solid fa-arrow-right" },
    { name: "West", icon: "fa-solid fa-arrow-left" },
    { name: "Central", icon: "fa-solid fa-asterisk" }
  ];

  const features = [
    { name: "Children", icon: "bi-balloon-fill" },
    { name: "Elderly", icon: "bi-person-walking" },
    { name: "Animal", icon: "fa-solid fa-paw" }, 
    { name: "Environment", icon: "bi-tree-fill" }
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

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      <Navbar />

      <div className="container-fluid flex-grow-1 d-flex flex-column p-4">
        {/* Filter Section */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <div className="row">
              {/* Category Filters */}
              <div className="col-md-6 mb-3 mb-md-0">
                <h6 className="fw-semibold text-dark mb-3">Region</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className={`btn btn-sm d-flex align-items-center btn-region-${category.name.toLowerCase()} ${
                        activeFilters.includes(category.name) ? 'active' : ''
                      }`}
                      onClick={() => toggleFilter(category.name)}
                    >
                      <i className={`${category.icon} me-1`}></i>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Filters */}
              <div className="col-md-6">
                <h6 className="fw-semibold text-dark mb-3">Category</h6>
                <div className="d-flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <button
                      key={feature.name}
                      className={`btn btn-sm d-flex align-items-center ${
                        activeFilters.includes(feature.name)
                          ? 'btn-info'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => toggleFilter(feature.name)}
                    >
                      <i className={`${feature.icon} me-1`}></i>
                      {feature.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <MapContainer ref={mapRef} activeFilters={activeFilters} />

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