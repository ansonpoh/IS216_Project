import React, { useState, useEffect, useRef, useMemo } from 'react';

const MapContainer = React.forwardRef(({ activeFilters = [] }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map filter names to opportunity categories
// In MapContainer.jsx - Replace the filteredOpportunities useMemo

  const categoryMap = {
    'North': ['education', 'community', 'literacy', 'youth'],
    'South': ['healthcare', 'wellness', 'medical', 'seniors'],
    'East': ['youth', 'children', 'education', 'animals'],
    'West': ['animals', 'pets', 'environment', 'conservation'],
    'Central': ['food', 'disaster', 'emergency', 'relief', 'housing']
  };

  const featureMap = {
    'Children': ['youth', 'children', 'education'],
    'Elderly': ['seniors', 'healthcare'],
    'Animal': ['animals', 'pets'],
    'Environment': ['environment', 'conservation', 'disaster']
  };

  const filteredOpportunities = useMemo(() => {
    if (activeFilters.length === 0) return opportunities;

    return opportunities.filter(opp => {
      const category = (opp.category || '').toLowerCase();

      // Check if this opportunity matches ANY of the active filters
      return activeFilters.some(filter => {
        // Check region filters
        const regionMatches = categoryMap[filter]?.some(cat => 
          category.includes(cat.toLowerCase())
        ) || false;

        // Check feature filters
        const featureMatches = featureMap[filter]?.some(cat => 
          category.includes(cat.toLowerCase())
        ) || false;

        return regionMatches || featureMatches;
      });
    });
  }, [opportunities, activeFilters]);

  // Fetch opportunities from backend
  const fetchOpportunities = async () => {
    try {
      const backendBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const res = await fetch(`${backendBase}/api/opportunities`);
      
      if (!res.ok) {
        console.error(`Failed to fetch opportunities: ${res.status}`);
        return;
      }

      const data = await res.json();
      setOpportunities(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setLoading(false);
    }
  };

  // Update markers when filtered opportunities change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (filteredOpportunities.length === 0) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const bounds = new window.google.maps.LatLngBounds();
    let gecodedCount = 0;

    filteredOpportunities.forEach((item) => {
      const postal = item.postalcode || item.postal || item.postal_code;
      
      if (!postal) {
        console.warn('No postal code for item:', item.title);
        return;
      }

      geocoder.geocode(
        { address: postal, componentRestrictions: { country: 'SG' } },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const loc = results[0].geometry.location;
            
            const marker = new window.google.maps.Marker({
              position: loc,
              map: mapInstanceRef.current,
              title: item.title || postal,
              animation: window.google.maps.Animation.DROP
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 250px;">
                  <div style="font-weight: bold; margin-bottom: 4px;">${item.title || postal}</div>
                  ${item.description ? `<div style="font-size: 12px; margin-bottom: 4px;">${item.description.substring(0, 100)}...</div>` : ''}
                  <div style="font-size: 12px; color: #666;">📍 ${postal}</div>
                </div>
              `
            });

            marker.addListener('click', () => {
              // Close all other info windows by creating a new one
              infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
            });

            markersRef.current.push(marker);
            bounds.extend(loc);
            gecodedCount++;

            // When all markers are geocoded, fit bounds
            if (gecodedCount === filteredOpportunities.length) {
              if (gecodedCount === 1) {
                mapInstanceRef.current.setCenter(bounds.getCenter());
                mapInstanceRef.current.setZoom(14);
              } else {
                mapInstanceRef.current.fitBounds(bounds);
              }
            }
          } else {
            console.warn(`Geocode failed for postal ${postal}: ${status}`);
            gecodedCount++;
          }
        }
      );
    });
  }, [filteredOpportunities]);

  // Initialize map once on component mount
  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 1.3521, lng: 103.8198 },
          zoom: 11,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Store map instance globally for access in parent component
        window.mapInstance = mapInstanceRef.current;

        fetchOpportunities();
      }
    };

    const loadScriptWithKey = async () => {
      try {
        const backendBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const cfgRes = await fetch(`${backendBase}/config/google-maps-key`);
        
        if (!cfgRes.ok) {
          console.error('Failed to fetch Google Maps key from backend');
          setLoading(false);
          return;
        }

        const json = await cfgRes.json();
        const apiKey = json?.key?.trim();

        if (!apiKey) {
          console.error('No Google Maps API key returned from backend');
          setLoading(false);
          return;
        }

        const scriptId = 'google-maps-script';
        const existing = document.getElementById(scriptId);

        if (!existing) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = initMap;
          script.onerror = () => {
            console.error('Failed to load Google Maps script');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else if (window.google) {
          initMap();
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setLoading(false);
      }
    };

    loadScriptWithKey();

    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, []);

  return (
    <div className="position-relative flex-grow-1">
      <div
        ref={mapRef}
        id="map"
        className="rounded"
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ marginBottom: '12px' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading map...</p>
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && filteredOpportunities.length === 0 && activeFilters.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px',
            textAlign: 'center'
          }}
        >
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>
            No opportunities found for selected filters.
          </p>
          <p style={{ marginBottom: 0, fontSize: '12px', color: '#666' }}>
            Try selecting different regions or features.
          </p>
        </div>
      )}
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;