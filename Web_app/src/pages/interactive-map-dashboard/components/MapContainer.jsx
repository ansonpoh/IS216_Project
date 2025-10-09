import React, { useState, useEffect, useRef, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({ 
  opportunities, 
  selectedOpportunity, 
  onOpportunitySelect, 
  filters,
  routeMode,
  selectedOpportunities,
  onRouteOptimize 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default

  // Mock map initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
          setCenter({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        () => {
          console.log('Location access denied');
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };

  const handleCenterLocation = () => {
    if (userLocation) {
      setCenter(userLocation);
      setZoom(14);
    }
  };

  const filteredOpportunities = opportunities?.filter(opp => {
    if (filters?.categories?.length > 0 && !filters?.categories?.includes(opp?.category)) return false;
    if (filters?.timeCommitment && opp?.timeCommitment !== filters?.timeCommitment) return false;
    if (filters?.skills?.length > 0 && !filters?.skills?.some(skill => opp?.skills?.includes(skill))) return false;
    if (filters?.remote !== null && opp?.remote !== filters?.remote) return false;
    return true;
  });

  const getClusterColor = (count) => {
    if (count >= 10) return 'bg-red-500';
    if (count >= 5) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const clusters = React.useMemo(() => {
    const clusterMap = new Map();
    
    filteredOpportunities?.forEach(opp => {
      const key = `${Math.floor(opp?.coordinates?.lat * 100)}_${Math.floor(opp?.coordinates?.lng * 100)}`;
      if (!clusterMap?.has(key)) {
        clusterMap?.set(key, {
          id: key,
          coordinates: opp?.coordinates,
          opportunities: [],
          count: 0
        });
      }
      clusterMap?.get(key)?.opportunities?.push(opp);
      clusterMap.get(key).count++;
    });

    return Array.from(clusterMap?.values());
  }, [filteredOpportunities]);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading interactive map...</p>
          </div>
        </div>
      )}
      {/* Google Maps Iframe */}
      <iframe
        ref={mapRef}
        width="100%"
        height="100%"
        loading="lazy"
        title="Volunteer Opportunities Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${center?.lat},${center?.lng}&z=${zoom}&output=embed`}
        className={`transition-opacity duration-500 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Map Overlay with Opportunity Markers */}
      {mapLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          {clusters?.map((cluster) => (
            <div
              key={cluster?.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              style={{
                left: `${((cluster?.coordinates?.lng - center?.lng + 0.1) / 0.2) * 100}%`,
                top: `${((center?.lat - cluster?.coordinates?.lat + 0.1) / 0.2) * 100}%`,
              }}
              onClick={() => {
                if (cluster?.count === 1) {
                  onOpportunitySelect(cluster?.opportunities?.[0]);
                } else {
                  // Zoom in to expand cluster
                  setCenter(cluster?.coordinates);
                  setZoom(prev => prev + 2);
                }
              }}
            >
              {cluster?.count === 1 ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform hover:scale-110 ${
                  selectedOpportunity?.id === cluster?.opportunities?.[0]?.id ? 'bg-primary ring-4 ring-primary/30' : 'bg-secondary'
                }`}>
                  <Icon name="MapPin" size={16} />
                </div>
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform hover:scale-110 ${getClusterColor(cluster?.count)}`}>
                  {cluster?.count}
                </div>
              )}
            </div>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${((userLocation?.lng - center?.lng + 0.1) / 0.2) * 100}%`,
                top: `${((center?.lat - userLocation?.lat + 0.1) / 0.2) * 100}%`,
              }}
            >
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>
          )}
        </div>
      )}
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white shadow-lg"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white shadow-lg"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCenterLocation}
          className="bg-white shadow-lg"
          disabled={!userLocation}
        >
          <Icon name="Navigation" size={16} />
        </Button>
      </div>
      {/* Route Planning Controls */}
      {routeMode && selectedOpportunities?.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <Button
            variant="default"
            onClick={onRouteOptimize}
            iconName="Route"
            iconPosition="left"
            className="shadow-lg"
          >
            Optimize Route ({selectedOpportunities?.length} stops)
          </Button>
        </div>
      )}
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>Single Opportunity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>2-4 Opportunities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>5-9 Opportunities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>10+ Opportunities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>
      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4 bg-white rounded px-2 py-1 text-xs font-mono shadow-lg z-20">
        Zoom: {zoom}
      </div>
    </div>
  );
};

export default MapContainer;