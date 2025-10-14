import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar.js";

const InteractiveMapDashboard = () => {
  const [activeFilters, setActiveFilters] = useState(["Cafés"]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Filter categories
  const categories = [
    { name: "North", icon: "bi-cup-hot" },
    { name: "South", icon: "bi-bag" },
    { name: "East", icon: "bi-egg-fried" },
    { name: "West", icon: "bi-p-square" },
    { name: "Central", icon: "bi-p-square" }
  ];

  const features = [
    { name: "Children", icon: "bi-emoji-smile" },
    { name: "Elderly", icon: "bi-person-walking" }, //doenst work
    { name: "Animal", icon: "bi-paw" }, //doesnt work
    { name: "Environment", icon: "bi-flower1" }
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

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(pos);
            mapInstanceRef.current.setZoom(15);

            // Add a marker at current location
            new window.google.maps.Marker({
              position: pos,
              map: mapInstanceRef.current,
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

  useEffect(() => {
    // Initialize the map
    const initMap = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // Default to New York
          zoom: 12,
          styles: [
            {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                { "visibility": "off" }
              ]
            }
          ]
        });

        mapInstanceRef.current = map;
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = initMap;
    } else {
      initMap();
    }

    // Cleanup function
    return () => {
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  useEffect(() => {
    // Here you would typically filter map markers based on activeFilters
    console.log('Active filters:', activeFilters);
    // Add your marker filtering logic here
  }, [activeFilters]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      <Navbar />

       <div className="container-fluid flex-grow-1 d-flex flex-column p-4">
        {/* Filter Section - Bootstrap Style */}
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

              {/* Feature Filters */}
              <div className="col-md-6">
                <h6 className="fw-semibold text-dark mb-3">Features</h6>
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
        <div
          id="map"
          ref={mapRef}
          className="rounded-xl shadow-lg flex-grow-1"
          style={{ height: 'calc(100vh - 240px)' }}
        ></div>

        {/* Current Location Button */}
        <div className="absolute bottom-6 right-6 z-10">
          <button
            id="current-location"
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={handleCurrentLocation}
          >
            <i data-feather="navigation"></i>
          </button>
        </div>
      </div>

      {/* Initialize Feather Icons */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              if (typeof feather !== 'undefined') {
                feather.replace();
              }
            });
          `
        }}
      />
    </div>
  );
};

export default InteractiveMapDashboard;