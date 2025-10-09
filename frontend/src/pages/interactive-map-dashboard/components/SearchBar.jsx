import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onLocationSearch, suggestions = [] }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const mockSuggestions = [
    { type: 'opportunity', title: 'Food Bank Volunteer', organization: 'City Food Bank', location: 'Downtown' },
    { type: 'opportunity', title: 'Reading Tutor', organization: 'Public Library', location: 'Midtown' },
    { type: 'organization', title: 'Habitat for Humanity', type: 'Housing', location: 'Various locations' },
    { type: 'location', title: 'Central Park', subtitle: 'Multiple opportunities available' },
    { type: 'category', title: 'Environmental Conservation', subtitle: '23 opportunities' },
    { type: 'skill', title: 'Teaching & Mentoring', subtitle: '45 opportunities' }
  ];

  const filteredSuggestions = query?.length > 0 
    ? mockSuggestions?.filter(item => 
        item?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
        (item?.organization && item?.organization?.toLowerCase()?.includes(query?.toLowerCase()))
      )?.slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef?.current && !suggestionsRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setQuery(value);
    setShowSuggestions(value?.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions?.[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query?.trim()) {
      onSearch(query?.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion?.title);
    setShowSuggestions(false);
    onSearch(suggestion?.title);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          onLocationSearch({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        (error) => {
          console.error('Location access denied:', error);
        }
      );
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'opportunity': return 'MapPin';
      case 'organization': return 'Building2';
      case 'location': return 'Navigation';
      case 'category': return 'Tag';
      case 'skill': return 'Star';
      default: return 'Search';
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={suggestionsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query?.length > 0 && setShowSuggestions(true)}
          placeholder="Search opportunities, organizations, or locations..."
          className="w-full pl-10 pr-20 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLocationClick}
            className="h-8 w-8 p-0"
            title="Use my location"
          >
            <Icon name="Navigation" size={16} />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSearch}
            className="h-8"
          >
            Search
          </Button>
        </div>
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredSuggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-150 flex items-center space-x-3 ${
                index === selectedIndex ? 'bg-muted' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === filteredSuggestions?.length - 1 ? 'rounded-b-lg' : 'border-b border-border'
              }`}
            >
              <div className="flex-shrink-0">
                <Icon 
                  name={getSuggestionIcon(suggestion?.type)} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {suggestion?.title}
                </div>
                {(suggestion?.organization || suggestion?.subtitle) && (
                  <div className="text-sm text-muted-foreground truncate">
                    {suggestion?.organization || suggestion?.subtitle}
                  </div>
                )}
                {suggestion?.location && (
                  <div className="text-xs text-muted-foreground truncate">
                    📍 {suggestion?.location}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <Icon name="ArrowUpRight" size={14} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
      {/* Quick Filters */}
      <div className="flex items-center space-x-2 mt-3">
        <span className="text-sm text-muted-foreground">Quick filters:</span>
        {['Near me', 'This weekend', 'Remote', 'One-time']?.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setQuery(filter);
              onSearch(filter);
            }}
            className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;