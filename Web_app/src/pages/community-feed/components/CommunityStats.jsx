import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityStats = ({ stats }) => {
  const statItems = [
    {
      icon: 'Users',
      label: 'Active Volunteers',
      value: stats?.activeVolunteers,
      change: '+12%',
      color: 'text-primary'
    },
    {
      icon: 'Clock',
      label: 'Hours This Month',
      value: stats?.hoursThisMonth,
      change: '+8%',
      color: 'text-secondary'
    },
    {
      icon: 'Heart',
      label: 'Lives Impacted',
      value: stats?.livesImpacted,
      change: '+15%',
      color: 'text-destructive'
    },
    {
      icon: 'Building2',
      label: 'Partner Organizations',
      value: stats?.organizations,
      change: '+3',
      color: 'text-accent'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BarChart3" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Community Impact</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems?.map((item, index) => (
          <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background mb-3 ${item?.color}`}>
              <Icon name={item?.icon} size={20} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{item?.value}</div>
            <div className="text-sm text-muted-foreground mb-2">{item?.label}</div>
            <div className="text-xs text-success font-medium">{item?.change}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Updated 2 hours ago</span>
          <div className="flex items-center space-x-1 text-primary">
            <Icon name="TrendingUp" size={14} />
            <span>Growing community</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;