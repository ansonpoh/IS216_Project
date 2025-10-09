import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onActionClick, disabled = false }) => {
  const quickActions = [
    {
      id: 'weekend-opportunities',
      label: 'Weekend Only',
      icon: 'Calendar',
      query: "Show me volunteer opportunities that are only on weekends"
    },
    {
      id: 'skills-based',
      label: 'Skills-Based',
      icon: 'Briefcase',
      query: "I want to use my professional skills to volunteer"
    },
    {
      id: 'nearby-opportunities',
      label: 'Near Me',
      icon: 'MapPin',
      query: "Find volunteer opportunities within 10 miles of my location"
    },
    {
      id: 'short-term',
      label: '2-3 Hours',
      icon: 'Clock',
      query: "I have 2-3 hours available, what can I do?"
    },
    {
      id: 'remote-volunteer',
      label: 'Remote Work',
      icon: 'Laptop',
      query: "Show me remote volunteer opportunities I can do from home"
    },
    {
      id: 'team-building',
      label: 'Group Events',
      icon: 'Users',
      query: "Looking for volunteer opportunities for my team or group"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Zap" size={16} className="text-primary" />
        <h3 className="text-sm font-medium text-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onActionClick(action?.query)}
            className="h-auto p-3 flex flex-col items-center space-y-1 text-center hover:bg-muted transition-colors duration-200"
          >
            <Icon name={action?.icon} size={16} className="text-muted-foreground" />
            <span className="text-xs font-medium">{action?.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;