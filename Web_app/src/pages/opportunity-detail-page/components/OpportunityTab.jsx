import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const OpportunityTabs = ({ opportunity, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'requirements', label: 'Requirements', icon: 'CheckSquare' },
    { id: 'impact', label: 'Impact Stories', icon: 'Heart' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar' }
  ];

  return (
    <div className="bg-card border-b border-border sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab?.id
                  ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpportunityTabs;