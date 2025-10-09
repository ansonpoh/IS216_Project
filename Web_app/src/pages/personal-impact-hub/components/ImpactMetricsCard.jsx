import React from 'react';
import Icon from '../../../components/AppIcon';

const ImpactMetricsCard = ({ metrics }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Your Impact Metrics</h2>
        <Icon name="TrendingUp" size={20} className="text-primary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics?.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <Icon name={metric?.icon} size={24} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="text-sm text-muted-foreground mb-2">{metric?.label}</div>
            <div className="flex items-center justify-center text-xs text-success">
              <Icon name="ArrowUp" size={12} className="mr-1" />
              +{metric?.growth} this month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactMetricsCard;