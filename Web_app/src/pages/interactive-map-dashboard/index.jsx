import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MapContainer from './components/MapContainer';
import FilterSidebar from './components/FilterSidebar';
import OpportunityCard from './components/OpportunityCard';
import RoutePanel from './components/RoutePanel';
import SearchBar from './components/SearchBar';

const InteractiveMapDashboard = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [routeMode, setRouteMode] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);
  const [viewMode, setViewMode] = useState('map'); // 'map', 'list', 'split'
  const [filters, setFilters] = useState({
    categories: [],
    timeCommitment: '',
    skills: [],
    remote: null
  });

  // Mock opportunities data
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
    console.log('Searching for:', query);
    // Implement search logic here
  };

  const handleLocationSearch = (coordinates) => {
    console.log('Searching near:', coordinates);
    // Implement location-based search here
  };

  const handleOpportunitySelect = (opportunity) => {
    setSelectedOpportunity(opportunity);
    if (viewMode === 'map') {
      setViewMode('split');
    }
  };

  const handleAddToRoute = (opportunity) => {
    if (selectedOpportunities?.find(opp => opp?.id === opportunity?.id)) {
      setSelectedOpportunities(prev => prev?.filter(opp => opp?.id !== opportunity?.id));
    } else {
      setSelectedOpportunities(prev => [...prev, opportunity]);
    }
  };

  const handleRemoveFromRoute = (opportunityId) => {
    setSelectedOpportunities(prev => prev?.filter(opp => opp?.id !== opportunityId));
  };

  const handleOptimizeRoute = (optimizedRoute) => {
    console.log('Route optimized:', optimizedRoute);
  };

  const handleClearRoute = () => {
    setSelectedOpportunities([]);
    setRouteMode(false);
  };

  const filteredOpportunities = opportunities?.filter(opp => {
    if (filters?.categories?.length > 0 && !filters?.categories?.includes(opp?.category)) return false;
    if (filters?.timeCommitment && opp?.timeCommitment !== filters?.timeCommitment) return false;
    if (filters?.skills?.length > 0 && !filters?.skills?.some(skill => opp?.skills?.includes(skill))) return false;
    if (filters?.remote !== null && opp?.remote !== filters?.remote) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 h-screen flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-card border-b border-border p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 lg:mr-6">
                <SearchBar
                  onSearch={handleSearch}
                  onLocationSearch={handleLocationSearch}
                />
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    iconName="Map"
                  >
                    Map
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    iconName="List"
                  >
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'split' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('split')}
                    iconName="Columns"
                  >
                    Split
                  </Button>
                </div>

                <Button
                  variant={routeMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setRouteMode(!routeMode);
                    if (!routeMode) setShowRoute(true);
                  }}
                  iconName="Route"
                  iconPosition="left"
                >
                  Route Mode
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>{filteredOpportunities?.length} opportunities found</span>
                <span>•</span>
                <span>89 organizations</span>
                <span>•</span>
                <span>Updated 5 min ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/ai-chat-interface" className="text-sm text-primary hover:underline">
                  Need help finding opportunities? Try AI Chat →
                </Link>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Map View */}
            {(viewMode === 'map' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} relative`}>
                <MapContainer
                  opportunities={filteredOpportunities}
                  selectedOpportunity={selectedOpportunity}
                  onOpportunitySelect={handleOpportunitySelect}
                  filters={filters}
                  routeMode={routeMode}
                  selectedOpportunities={selectedOpportunities}
                  onRouteOptimize={handleOptimizeRoute}
                />
              </div>
            )}

            {/* List View */}
            {(viewMode === 'list' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'w-1/2 border-l border-border' : 'flex-1'} overflow-y-auto`}>
                <div className="p-4">
                  {selectedOpportunity && viewMode === 'split' && (
                    <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">Selected Opportunity</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOpportunity(null)}
                          iconName="X"
                        />
                      </div>
                      <OpportunityCard
                        opportunity={selectedOpportunity}
                        onSelect={handleOpportunitySelect}
                        isSelected={true}
                        routeMode={routeMode}
                        onAddToRoute={handleAddToRoute}
                        isInRoute={selectedOpportunities?.some(opp => opp?.id === selectedOpportunity?.id)}
                      />
                    </div>
                  )}

                  <div className="grid gap-6">
                    {filteredOpportunities?.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity?.id}
                        opportunity={opportunity}
                        onSelect={handleOpportunitySelect}
                        isSelected={selectedOpportunity?.id === opportunity?.id}
                        routeMode={routeMode}
                        onAddToRoute={handleAddToRoute}
                        isInRoute={selectedOpportunities?.some(opp => opp?.id === opportunity?.id)}
                      />
                    ))}
                  </div>

                  {filteredOpportunities?.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Search" size={24} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or search terms to find more opportunities.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setFilters({ categories: [], timeCommitment: '', skills: [], remote: null })}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Route Panel */}
        {routeMode && (
          <RoutePanel
            selectedOpportunities={selectedOpportunities}
            onRemoveFromRoute={handleRemoveFromRoute}
            onOptimizeRoute={handleOptimizeRoute}
            onClearRoute={handleClearRoute}
            isOpen={showRoute}
            onToggle={() => setShowRoute(!showRoute)}
          />
        )}
      </div>
    </div>
  );
};

export default InteractiveMapDashboard;