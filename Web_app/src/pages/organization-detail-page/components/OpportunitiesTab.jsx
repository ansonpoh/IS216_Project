import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const OpportunitiesTab = ({ opportunities }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filterOptions = [
    { value: 'all', label: 'All Opportunities' },
    { value: 'urgent', label: 'Urgent Needs' },
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'weekend', label: 'Weekends' },
    { value: 'skills-based', label: 'Skills-based' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date Posted' },
    { value: 'urgency', label: 'Urgency' },
    { value: 'duration', label: 'Duration' },
    { value: 'volunteers', label: 'Volunteers Needed' }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'remote': return 'Monitor';
      case 'onsite': return 'MapPin';
      case 'hybrid': return 'Shuffle';
      default: return 'Calendar';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Filter by Type"
              options={filterOptions}
              value={filter}
              onChange={setFilter}
            />
          </div>
          <div className="flex-1">
            <Select
              label="Sort by"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>
      </div>
      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities?.map((opportunity) => (
          <div key={opportunity?.id} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {opportunity?.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Icon name={getTypeIcon(opportunity?.type)} size={14} className="mr-1" />
                    <span className="capitalize">{opportunity?.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Clock" size={14} className="mr-1" />
                    <span>{opportunity?.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Calendar" size={14} className="mr-1" />
                    <span>{opportunity?.date}</span>
                  </div>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(opportunity?.urgency)}`}>
                {opportunity?.urgency} priority
              </div>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-3">
              {opportunity?.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {opportunity?.skills?.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Icon name="Users" size={14} className="mr-1" />
                  <span>{opportunity?.volunteersNeeded} needed</span>
                </div>
                <div className="flex items-center">
                  <Icon name="UserCheck" size={14} className="mr-1" />
                  <span>{opportunity?.volunteersApplied} applied</span>
                </div>
              </div>
              
              <Button variant="default" size="sm">
                Apply Now
              </Button>
            </div>

            {opportunity?.urgent && (
              <div className="mt-4 p-3 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-center text-error text-sm">
                  <Icon name="AlertTriangle" size={16} className="mr-2" />
                  <span className="font-medium">Urgent Need:</span>
                  <span className="ml-1">We need volunteers by {opportunity?.urgentDeadline}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Load More Opportunities
        </Button>
      </div>
    </div>
  );
};

export default OpportunitiesTab;