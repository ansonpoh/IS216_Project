import React, { useState, useEffect, useRef, useMemo } from 'react';

const MapContainer = React.forwardRef(({ activeFilters = [] }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // DEBUG: Log filter changes
  useEffect(() => {
    console.log('=== FILTER DEBUG ===');
    console.log('Active Filters:', activeFilters);
    console.log('Total Opportunities:', opportunities.length);
    console.log('Filtered Opportunities:', filteredOpportunities.length);
    
    if (opportunities.length > 0) {
      console.log('First opportunity:', {
        title: opportunities[0].title,
        region: opportunities[0].region,
        region_type: typeof opportunities[0].region
      });
    }
    
    if (activeFilters.length > 0 && filteredOpportunities.length === 0) {
      console.log('❌ NO MATCHES FOUND');
      console.log('Looking for filters:', activeFilters.map(f => f.toLowerCase()));
      console.log('Available regions in data:', [...new Set(opportunities.map(o => (o.region || '').toLowerCase()))]);
    }
  }, [activeFilters, opportunities]);

  // Filter opportunities based on active filters
  const filteredOpportunities = useMemo(() => {
    if (activeFilters.length === 0) return opportunities;

    return opportunities.filter(opp => {
      // Normalize opportunity data
      const category = (opp.category || '').toLowerCase().trim();
      const region = (opp.region || '').toLowerCase().trim();
      const title = (opp.title || '').toLowerCase().trim();
      const description = (opp.description || '').toLowerCase().trim();

      // Check if this opportunity matches ANY of the active filters
      return activeFilters.some(filter => {
        const filterLower = filter.toLowerCase().trim();

        // Direct category match
        if (category === filterLower) return true;

        // Direct region match (North, South, East, West, Central)
        if (region === filterLower) return true;

        // Feature-based filtering
        switch (filterLower) {
          case 'pwds':
            return category.includes('pwd') || 
                   category.includes('disability') || 
                   category.includes('disabled') ||
                   title.includes('pwd') ||
                   title.includes('disability') ||
                   description.includes('pwd') ||
                   description.includes('disability');

          case 'mental health':
            return category.includes('mental') || 
                   category.includes('mental health') || 
                   category.includes('psychology') ||
                   category.includes('wellbeing') ||
                   title.includes('mental') ||
                   description.includes('mental health');

          case 'event support':
            return category.includes('event support') || 
                   category.includes('carnival') ||
                   category.includes('fair') ||
                   category.includes('support') ||
                   title.includes('carnival') ||
                   title.includes('fair') ||
                   title.includes('booth') ||
                   description.includes('carnival') ||
                   description.includes('booth');

          case 'children':
            return category.includes('youth') || 
                   category.includes('children') || 
                   category.includes('education') ||
                   title.includes('children') ||
                   description.includes('children');

          case 'elderly':
          case 'seniors':
            return category.includes('senior') || 
                   category.includes('elderly') ||
                   category.includes('healthcare') ||
                   title.includes('elderly') ||
                   description.includes('elderly');

          case 'animal':
          case 'animals':
            return category.includes('animal') || 
                   category.includes('pet') ||
                   title.includes('animal') ||
                   description.includes('animal');

          case 'environment':
            return category.includes('environment') || 
                   category.includes('conservation') ||
                   category.includes('green') ||
                   title.includes('environment') ||
                   description.includes('environment');

          // Region filters
          case 'north':
            return region === 'north' || 
                   title.includes('north') ||
                   description.includes('north');

          case 'south':
            return region === 'south' || 
                   title.includes('south') ||
                   description.includes('south');

          case 'east':
            return region === 'east' || 
                   title.includes('east') ||
                   description.includes('east');

          case 'west':
            return region === 'west' || 
                   title.includes('west') ||
                   description.includes('west');

          case 'central':
            return region === 'central' || 
                   title.includes('central') ||
                   description.includes('central');

          default:
            // Generic text search in category, title, description
            return category.includes(filterLower) || 
                   title.includes(filterLower) || 
                   description.includes(filterLower);
        }
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
      console.log('Fetched opportunities:', data);
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
    let geocodedCount = 0;

    filteredOpportunities.forEach((item) => {
      // Check for existing lat/lng first
      if (item.lat && item.lng) {
        const loc = new window.google.maps.LatLng(item.lat, item.lng);
        addMarker(loc, item);
        bounds.extend(loc);
        geocodedCount++;
        fitMapBounds(geocodedCount, filteredOpportunities.length, bounds);
        return;
      }

      const postal = item.postalcode || item.postal || item.postal_code;
      
      if (!postal) {
        console.warn('No postal code or coordinates for item:', item.title);
        geocodedCount++;
        fitMapBounds(geocodedCount, filteredOpportunities.length, bounds);
        return;
      }

      geocoder.geocode(
        { address: postal, componentRestrictions: { country: 'SG' } },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const loc = results[0].geometry.location;
            addMarker(loc, item);
            bounds.extend(loc);
          } else {
            console.warn(`Geocode failed for postal ${postal}: ${status}`);
          }
          
          geocodedCount++;
          fitMapBounds(geocodedCount, filteredOpportunities.length, bounds);
        }
      );
    });

    function addMarker(loc, item) {
      const marker = new window.google.maps.Marker({
        position: loc,
        map: mapInstanceRef.current,
        title: item.title || item.postalcode,
        animation: window.google.maps.Animation.DROP
      });

      // Capitalize category properly
      const capitalizeCategory = (cat) => {
        if (!cat) return '';
        // Handle special cases
        if (cat.toLowerCase() === 'pwds') return 'PWDs';
        if (cat.toLowerCase() === 'mental health') return 'Mental Health';
        // Capitalize first letter of each word
        return cat
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${item.title || 'Opportunity'}</div>
            ${item.organization ? `<div style="font-size: 12px; margin-bottom: 4px; color: #666;">${item.organization}</div>` : ''}
            ${item.description ? `<div style="font-size: 12px; margin-bottom: 4px;">${item.description.substring(0, 100)}...</div>` : ''}
            ${item.category ? `<div style="font-size: 11px; color: #0066cc; margin-bottom: 4px;">📁 ${capitalizeCategory(item.category)}</div>` : ''}
            <div style="font-size: 12px; color: #666;"><strong>📍 Location:</strong> ${item.location}</div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
      });

      markersRef.current.push(marker);
    }

    function fitMapBounds(current, total, bounds) {
      if (current === total) {
        if (total === 1) {
          mapInstanceRef.current.setCenter(bounds.getCenter());
          mapInstanceRef.current.setZoom(14);
        } else {
          mapInstanceRef.current.fitBounds(bounds);
        }
      }
    }
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