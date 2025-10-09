import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const OrganizationTabs = ({ activeTab, onTabChange, opportunityCount, testimonialCount }) => {
  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: 'Info',
      count: null
    },
    {
      id: 'opportunities',
      name: 'Opportunities',
      icon: 'Calendar',
      count: opportunityCount
    },
    {
      id: 'impact',
      name: 'Impact Stories',
      icon: 'TrendingUp',
      count: null
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      icon: 'MessageSquare',
      count: testimonialCount
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: 'Image',
      count: null
    },
    {
      id: 'contact',
      name: 'Contact',
      icon: 'Mail',
      count: null
    }
  ];

  return (
    <div className="bg-card border-b border-border sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.name}</span>
              {tab?.count && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationTabs;