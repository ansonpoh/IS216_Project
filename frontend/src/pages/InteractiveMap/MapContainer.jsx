import { mdiPaw, mdiBalloon, mdiHumanCane, mdiTree, mdiCalendar, mdiHuman, mdiHeartPulse, } from '@mdi/js';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from "axios";

// Helper function to create custom marker icons based on category
const getCategoryMarkerIcon = (category) => {
  // Normalize category name
  const cat = (category || '').toLowerCase().trim();
  
  // Define colors and icons for each category with simpler, more visible icons
  const categoryConfig = {
    'animal': { 
      color: '#f59e0b', 
      icon: mdiPaw,
      viewBox: '0 0 24 24'
    },
    'children': { 
      color: '#ec4899', 
      icon: mdiBalloon,
      viewBox: '0 0 24 24'
    },
    'youth': { 
      color: '#ec4899', 
      icon: mdiBalloon,
      viewBox: '0 0 24 24'
    },
    'elderly': { 
      color: '#ff6b35', 
      icon: mdiHumanCane,
      viewBox: '0 0 24 24'
    },
    'senior': { 
      color: '#ff6b35', 
      icon: mdiHumanCane,
      viewBox: '0 0 24 24'
    },
    'environment': { 
      color: '#10b981', 
      icon: mdiTree,
      viewBox: '0 0 24 24'
    },
    'event support': { 
      color: '#3b82f6', 
      icon: mdiCalendar,
      viewBox: '0 0 24 24'
    },
    'carnival': { 
      color: '#3b82f6', 
      icon: mdiCalendar,
      viewBox: '0 0 24 24'
    },
    'mental health': { 
      color: '#ef4444', 
      icon: mdiHeartPulse,
      viewBox: '0 0 24 24'
    },
    'pwds': { 
      color: '#6366f1', 
      icon: mdiHuman,
      viewBox: '0 0 24 24'
    },
    'disability': { 
      color: '#6366f1', 
      icon: mdiHuman,
      viewBox: '0 0 24 24'
    },
    'healthcare': { 
      color: '#ef4444', 
      icon: mdiHeartPulse,
      viewBox: '0 0 24 24'
    },
    'education': { 
      color: '#3b82f6', 
      icon: mdiCalendar,
      viewBox: '0 0 24 24'
    }
  };

  // More precise category matching
  let config = categoryConfig['education']; // default
  
  // Check for exact matches first, then partial matches
  if (categoryConfig[cat]) {
    config = categoryConfig[cat];
  } else {
    // Check for partial matches with priority order
    const matchPriority = [
      'mental health',
      'event support',
      'pwds',
      'disability',
      'animal',
      'children',
      'youth',
      'elderly',
      'senior',
      'environment',
      'carnival',
      'healthcare',
      'education'
    ];
    
    for (const key of matchPriority) {
      if (cat.includes(key) || key.includes(cat)) {
        config = categoryConfig[key];
        break;
      }
    }
  }

  // Create larger SVG marker with icon
  const svg = `
  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="26" fill="${config.color}" fill-opacity="0.8" stroke="white" stroke-width="4"/>
    <g transform="translate(12, 12)">
      <svg width="36" height="36" viewBox="${config.viewBox}">
        <path d="${config.icon}" fill="white"/>
      </svg>
    </g>
  </svg>
`;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(30, 30)
  };
};

const MapContainer = React.forwardRef(({ activeFilters = [], onResetFilters, recommendedEvents }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const currentInfoWindowRef = useRef(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mappedEvents, setMappedEvents] = useState([]);
  const [showingRecommended, setShowingRecommended] = useState(false);

  // Filter opportunities based on active filters
  const filteredOpportunities = useMemo(() => {
    if (activeFilters.length === 0) return opportunities;

    const regions = ['central', 'north', 'north-east', 'east', 'west', 'south'];
    const categories = ['animal', 'children', 'elderly', 'environment', 'event support', 'mental health', 'pwds'];
    
    const regionFilters = activeFilters.filter(f => 
      regions.includes(f.toLowerCase())
    );
    const categoryFilters = activeFilters.filter(f => 
      categories.includes(f.toLowerCase())
    );

    return opportunities.filter(opp => {
      const category = (opp.category || '').toLowerCase().trim();
      const region = (opp.region || '').toLowerCase().trim();
      const title = (opp.title || '').toLowerCase().trim();
      const description = (opp.description || '').toLowerCase().trim();

      let regionMatch = regionFilters.length === 0;
      if (regionFilters.length > 0) {
        regionMatch = regionFilters.some(filter => {
          const filterLower = filter.toLowerCase().trim();
          
          switch (filterLower) {
            case 'north-east':
              return region === 'north-east' || 
                     region.includes('north-east') ||
                     title.includes('north-east') ||
                     title.includes('northeast') ||
                     description.includes('north-east') ||
                     description.includes('northeast');
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
              return region === filterLower;
          }
        });
      }

      let categoryMatch = categoryFilters.length === 0;
      if (categoryFilters.length > 0) {
        categoryMatch = categoryFilters.some(filter => {
          const filterLower = filter.toLowerCase().trim();

          // PRIORITY: Match category field first (most reliable)
          switch (filterLower) {
            case 'pwds':
              return category.includes('pwd') || 
                     category.includes('disability') || 
                     category.includes('disabled');
            case 'mental health':
              return category.includes('mental') || 
                     category.includes('mental health') || 
                     category.includes('psychology') ||
                     category.includes('wellbeing');
            case 'event support':
              // Only match if category explicitly contains these keywords
              return category.includes('event support') || 
                     category.includes('event') ||
                     (category.includes('carnival') && !category.includes('children')) ||
                     (category.includes('fair') && !category.includes('environment'));
            case 'children':
              return category.includes('youth') || 
                     category.includes('children') || 
                     category.includes('child');
            case 'elderly':
            case 'seniors':
              return category.includes('senior') || 
                     category.includes('elderly');
            case 'animal':
            case 'animals':
              return category.includes('animal') || 
                     category.includes('pet');
            case 'environment':
              return category.includes('environment') || 
                     category.includes('conservation') ||
                     category.includes('green') ||
                     category.includes('nature');
            default:
              return category.includes(filterLower);
          }
        });
      }

      return regionMatch && categoryMatch;
    });
  }, [opportunities, activeFilters]);

  // Fetch opportunities from backend
  const fetchOpportunities = async () => {
    try {
      const backendBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      // const res = await fetch(`${backendBase}/api/opportunities`);
      const opportunities = await axios.get(`${backendBase}/events/get_all_events`);
      const res = await axios.post(`${backendBase}/events/event_data_modify`, {events: opportunities.data.result});

      const data = res.data;
      console.log('Fetched opportunities:', data);
      setOpportunities(Array.isArray(data) ? data : []);
      setLoading(false);
      setShowingRecommended(false);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const enrichRecommendedEvents = async () => {
      if (!recommendedEvents || recommendedEvents.length === 0) return;

      try {
        const backendBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        console.log("Sending recommendedEvents to event_data_modify...");
        
        const res = await axios.post(`${backendBase}/events/event_data_modify`, {
          events: recommendedEvents
        });

        const modified = res.data?.events || res.data || [];
        console.log("Modified events (with lat/lng):", modified);
        setMappedEvents(modified);
      } catch (err) {
        console.error("Error enriching recommendedEvents:", err);
        setMappedEvents(recommendedEvents); // fallback: show unmodified
      }
    };
    enrichRecommendedEvents();
  }, [recommendedEvents]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    if (!mappedEvents || mappedEvents.length === 0) return;

    console.log("Rendering recommended events on map:", mappedEvents);
    setShowingRecommended(true);
    // Clear previous markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    mappedEvents.forEach(ev => {
      console.log(ev)
      if (!ev.lat|| !ev.lng) return; // Skip if no coords
      const pos = { lat: ev.lat, lng: ev.lng};

      const marker = new window.google.maps.Marker({
        position: pos,
        map: mapInstanceRef.current,
        title: ev.title,
        icon: getCategoryMarkerIcon(ev.category),
        animation: window.google.maps.Animation.DROP,
      });

      const imageUrl = ev.image_url;
      const hasImage = imageUrl && imageUrl.trim() !== '';

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${hasImage ? `
              <div style="margin: -8px -8px 12px -8px; overflow: hidden; border-radius: 8px 8px 0 0;">
                <img 
                  src="${ev.image_url}" 
                  alt="${ev.title || 'Opportunity'}" 
                  style="width: 100%; height: 180px; object-fit: cover; display: block;"
                  onerror="this.style.display='none'; this.parentElement.style.display='none';"
                />
              </div>
            ` : ''}
            <div style="font-weight: 600; font-size: 17px; margin-bottom: 8px; color: #1a1a1a; line-height: 1.3;">
              ${ev.title || 'Opportunity'}
            </div>
            ${ev.organization ? `
              <div style="font-size: 13px; margin-bottom: 10px; color: #666; display: flex; align-items: center;">
                <span style="margin-right: 6px;">🏢</span>
                <span style="font-weight: 500;">${ev.organization}</span>
              </div>
            ` : ''}
            ${ev.description ? `
              <div style="font-size: 13px; margin-bottom: 12px; color: #444; line-height: 1.5;">
                ${ev.description.substring(0, 150)}${ev.description.length > 150 ? '...' : ''}
              </div>
            ` : ''}
            ${ev.category ? `
              <div style="font-size: 11px; color: #0066cc; margin-bottom: 10px; display: inline-block; background: #e6f2ff; padding: 5px 12px; border-radius: 14px; font-weight: 600;">
                🗃️ ${(ev.category)}
              </div>
            ` : ''}
            <div style="font-size: 13px; color: #555; margin-top: 10px; display: flex; align-items: flex-start; padding: 8px 0; border-top: 1px solid #eee;">
              <strong style="margin-right: 6px; font-size: 16px;">📍</strong>
              <span style="line-height: 1.4;">${ev.postalcode}</span>
            </div>
            ${ev.event_id ? `
              <a 
                href="/opportunities" 
                style="display: block; margin-top: 12px; padding: 10px 16px; background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; text-align: center; box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3); transition: transform 0.2s;"
                onmouseover="this.style.transform='translateY(-2px)'"
                onmouseout="this.style.transform='translateY(0)'"
              >
                Learn More →
              </a>
            ` : ''}
          </div>
        `,
        maxWidth: 320
      });

      marker.addListener("click", () => {
        if (currentInfoWindowRef.current) currentInfoWindowRef.current.close();
        infoWindow.open(mapInstanceRef.current, marker);
        currentInfoWindowRef.current = infoWindow;
      });

      markersRef.current.push(marker);
      bounds.extend(pos);
    });

    if (mappedEvents.length === 1) {
      mapInstanceRef.current.setCenter(bounds.getCenter());
      mapInstanceRef.current.setZoom(14);
    } else {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [mappedEvents, mapInstanceRef.current]);


  // Update markers when filtered opportunities change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    if (currentInfoWindowRef.current) {
      currentInfoWindowRef.current.close();
      currentInfoWindowRef.current = null;
    }

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (filteredOpportunities.length === 0) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const bounds = new window.google.maps.LatLngBounds();
    let geocodedCount = 0;

    filteredOpportunities.forEach((item) => {
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
      // Get custom icon based on category
      const customIcon = getCategoryMarkerIcon(item.category);
      
      // Debug: Log category to icon mapping
      console.log(`Marker created - Category: "${item.category}" | Title: "${item.title}"`);
      
      const marker = new window.google.maps.Marker({
        position: loc,
        map: mapInstanceRef.current,
        title: item.title || item.postalcode,
        icon: customIcon,
        animation: window.google.maps.Animation.DROP
      });

      const capitalizeCategory = (cat) => {
        if (!cat) return '';
        if (cat.toLowerCase() === 'pwds') return 'PWDs';
        if (cat.toLowerCase() === 'mental health') return 'Mental Health';
        return cat
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      // Enhanced InfoWindow content with image
      // Check multiple possible image field names from backend
      const imageUrl = item.image_url || item.image || item.imageUrl || item.img;
      const hasImage = imageUrl && imageUrl.trim() !== '';
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${hasImage ? `
              <div style="margin: -8px -8px 12px -8px; overflow: hidden; border-radius: 8px 8px 0 0;">
                <img 
                  src="${imageUrl}" 
                  alt="${item.title || 'Opportunity'}" 
                  style="width: 100%; height: 180px; object-fit: cover; display: block;"
                  onerror="this.style.display='none'; this.parentElement.style.display='none';"
                />
              </div>
            ` : ''}
            <div style="font-weight: 600; font-size: 17px; margin-bottom: 8px; color: #1a1a1a; line-height: 1.3;">
              ${item.title || 'Opportunity'}
            </div>
            ${item.organization ? `
              <div style="font-size: 13px; margin-bottom: 10px; color: #666; display: flex; align-items: center;">
                <span style="margin-right: 6px;">🏢</span>
                <span style="font-weight: 500;">${item.organization}</span>
              </div>
            ` : ''}
            ${item.description ? `
              <div style="font-size: 13px; margin-bottom: 12px; color: #444; line-height: 1.5;">
                ${item.description.substring(0, 150)}${item.description.length > 150 ? '...' : ''}
              </div>
            ` : ''}
            ${item.category ? `
              <div style="font-size: 11px; color: #0066cc; margin-bottom: 10px; display: inline-block; background: #e6f2ff; padding: 5px 12px; border-radius: 14px; font-weight: 600;">
                🗃️ ${capitalizeCategory(item.category)}
              </div>
            ` : ''}
            <div style="font-size: 13px; color: #555; margin-top: 10px; display: flex; align-items: flex-start; padding: 8px 0; border-top: 1px solid #eee;">
              <strong style="margin-right: 6px; font-size: 16px;">📍</strong>
              <span style="line-height: 1.4;">${item.location}</span>
            </div>
            ${item.event_id ? `
              <a 
                href="/opportunities" 
                style="display: block; margin-top: 12px; padding: 10px 16px; background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; text-align: center; box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3); transition: transform 0.2s;"
                onmouseover="this.style.transform='translateY(-2px)'"
                onmouseout="this.style.transform='translateY(0)'"
              >
                Learn More →
              </a>
            ` : ''}
          </div>
        `,
        maxWidth: 320
      });

      marker.addListener('click', () => {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.close();
        }
        
        infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
        currentInfoWindowRef.current = infoWindow;
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

  // Initialize map
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
        if (!recommendedEvents || recommendedEvents.length === 0) {
          fetchOpportunities();
        } else {
          console.log("Skipping fetch — showing recommended events only.");
          setLoading(false);
        }
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
      
      {(activeFilters.length > 0 || showingRecommended) && (
        <button
          // onClick={onResetFilters}
          onClick={() => {
            if(showingRecommended) {
              setShowingRecommended(false);
              setMappedEvents([]);
              fetchOpportunities();
            } else {
              onResetFilters();
            }
          }}
          className="btn btn-sm btn-light position-absolute m-2"
          style={{
            color: '#fff',
            top: '2px',
            right: '52px',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#4891ffff',
            border: '2px solid #0066ffff'
          }}
        >
          <i className="bi bi-x-circle me-1"></i>
          Reset Filters
        </button>
      )}

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