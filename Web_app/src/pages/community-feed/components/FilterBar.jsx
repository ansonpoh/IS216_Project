import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterBar = ({ filters, onFilterChange, onCreatePost }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const contentTypeOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'stories', label: 'Impact Stories' },
    { value: 'opportunities', label: 'Opportunities' },
    { value: 'events', label: 'Events' },
    { value: 'photos', label: 'Photo Stories' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'local', label: 'My Area (5 miles)' },
    { value: 'city', label: 'My City' },
    { value: 'state', label: 'My State' },
    { value: 'national', label: 'National' }
  ];

  const organizationOptions = [
    { value: 'all', label: 'All Organizations' },
    { value: 'following', label: 'Organizations I Follow' },
    { value: 'volunteered', label: 'Where I Volunteered' },
    { value: 'local-nonprofits', label: 'Local Food Bank Network' },
    { value: 'habitat', label: 'Habitat for Humanity' },
    { value: 'red-cross', label: 'American Red Cross' }
  ];

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Main Filter Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Select
              options={contentTypeOptions}
              value={filters?.contentType}
              onChange={(value) => onFilterChange('contentType', value)}
              className="w-40"
            />
            
            <Select
              options={locationOptions}
              value={filters?.location}
              onChange={(value) => onFilterChange('location', value)}
              className="w-40"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            More Filters
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onCreatePost}
            className="flex items-center space-x-2"
          >
            <Icon name="Plus" size={16} />
            <span className="hidden sm:inline">Share Story</span>
          </Button>
        </div>
      </div>
      {/* Expanded Filters */}
      {(isExpanded || window.innerWidth >= 768) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          <div className="md:hidden">
            <Select
              label="Content Type"
              options={contentTypeOptions}
              value={filters?.contentType}
              onChange={(value) => onFilterChange('contentType', value)}
            />
          </div>
          
          <div className="md:hidden">
            <Select
              label="Location"
              options={locationOptions}
              value={filters?.location}
              onChange={(value) => onFilterChange('location', value)}
            />
          </div>
          
          <Select
            label="Organizations"
            options={organizationOptions}
            value={filters?.organization}
            onChange={(value) => onFilterChange('organization', value)}
          />
          
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={filters?.timeRange}
            onChange={(value) => onFilterChange('timeRange', value)}
          />
        </div>
      )}
      {/* Active Filters */}
      {(filters?.contentType !== 'all' || filters?.location !== 'all' || filters?.organization !== 'all' || filters?.timeRange !== 'all') && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters?.contentType !== 'all' && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center space-x-1">
                <span>{contentTypeOptions?.find(opt => opt?.value === filters?.contentType)?.label}</span>
                <button
                  onClick={() => onFilterChange('contentType', 'all')}
                  className="hover:text-primary/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.location !== 'all' && (
              <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full flex items-center space-x-1">
                <span>{locationOptions?.find(opt => opt?.value === filters?.location)?.label}</span>
                <button
                  onClick={() => onFilterChange('location', 'all')}
                  className="hover:text-secondary/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.organization !== 'all' && (
              <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full flex items-center space-x-1">
                <span>{organizationOptions?.find(opt => opt?.value === filters?.organization)?.label}</span>
                <button
                  onClick={() => onFilterChange('organization', 'all')}
                  className="hover:text-accent/70"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onFilterChange('reset')}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;