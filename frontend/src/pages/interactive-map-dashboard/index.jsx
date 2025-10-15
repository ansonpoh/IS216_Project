import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar.js";

const InteractiveMapDashboard = () => {
  const [activeFilters, setActiveFilters] = useState(["Cafés"]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

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
          center: { lat: 1.3521, lng: 103.8198 }, // Default to Singapore
          zoom: 11,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                { visibility: "off" }
              ]
            }
          ]
        });

        mapInstanceRef.current = map;

        // After map is ready, fetch backend data and place markers
        fetchAndPlaceMarkers();
      }
    };

    // Fetch items from backend and place markers using postal codes
    const fetchAndPlaceMarkers = async () => {
      if (!window.google || !mapInstanceRef.current) return;

      // Backend base URL. Set REACT_APP_API_URL in your frontend/.env if needed.
      const backendBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const endpoint = `${backendBase}/api/opportunities`;

      try {
        const res = await fetch(endpoint);
        if (!res.ok) {
          console.warn(`Failed to fetch opportunities: ${res.status}`);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          console.warn('Expected an array from the opportunities endpoint');
          return;
        }

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        const geocoder = new window.google.maps.Geocoder();
        const bounds = new window.google.maps.LatLngBounds();

        data.forEach((item) => {
          // Backend returns `title` and `postalcode`
          const postal = item.postalcode;
          if (!postal) return;

          // Geocode the postal code in Singapore
          geocoder.geocode({ address: postal, componentRestrictions: { country: 'SG' } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const loc = results[0].geometry.location;
              const marker = new window.google.maps.Marker({
                position: loc,
                map: mapInstanceRef.current,
                title: item.title || postal
              });

              // Create (or reuse) an info window for marker
              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div class="fw-semibold">${(item.title || postal)}</div>`
              });

              marker.addListener('click', () => {
                infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
              });

              markersRef.current.push(marker);
              bounds.extend(loc);

              // If there is only one marker, center and zoom in
              if (markersRef.current.length === 1) {
                mapInstanceRef.current.setCenter(loc);
                mapInstanceRef.current.setZoom(14);
              } else {
                mapInstanceRef.current.fitBounds(bounds);
              }
            } else {
              console.warn(`Geocode failed for postal ${postal}: ${status}`);
            }
          });
        });
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      }
    };

    // Fetch the API key from backend configuration endpoint
    const loadScriptWithKey = async () => {
      try {
        const backendBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const cfgRes = await fetch(`${backendBase}/config/google-maps-key`);
        if (!cfgRes.ok) {
          console.error('Failed to fetch Google Maps key from backend');
          return;
        }
        const json = await cfgRes.json();
        const apiKey = (json && json.key) ? json.key.trim() : '';
        if (!apiKey) {
          console.warn('No Google Maps API key returned from backend');
          return;
        }

        // Helper to check if script already exists
        const scriptId = 'google-maps-script';
        const existing = document.getElementById(scriptId);

        if (!existing) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
          script.async = true;
          script.defer = true;
          // Attach initMap to window so the callback can find it
          window.initMap = initMap;
          script.onerror = () => {
            console.error('Failed to load Google Maps script. Check your API key and network.');
          };
          document.head.appendChild(script);
        } else {
          // If google is already available, just init
          if (window.google) initMap();
          else {
            // If script exists but google not ready, ensure initMap is set
            window.initMap = initMap;
          }
        }
      } catch (err) {
        console.error('Error loading Google Maps key:', err);
      }
    };

    loadScriptWithKey();

    // Cleanup function
    return () => {
      if (window.initMap) delete window.initMap;
      // We intentionally don't remove the script tag because other pages might rely on it
      // Clear markers
      if (markersRef.current && markersRef.current.length) {
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];
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