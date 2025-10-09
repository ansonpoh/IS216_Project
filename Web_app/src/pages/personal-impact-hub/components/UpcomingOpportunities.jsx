import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const UpcomingOpportunities = ({ opportunities }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
        <Button variant="ghost" size="sm">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {opportunities?.map((opportunity, index) => (
          <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={opportunity?.organizationLogo} 
                  alt={opportunity?.organizationName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground truncate">{opportunity?.title}</h3>
                  <div className="flex items-center space-x-1 text-xs text-warning ml-2">
                    <Icon name="Star" size={12} />
                    <span>{opportunity?.matchScore}% match</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {opportunity?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{opportunity?.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{opportunity?.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{opportunity?.location}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Icon name="ArrowRight" size={14} className="mr-1" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth>
          <Icon name="Search" size={16} className="mr-2" />
          Explore More Opportunities
        </Button>
      </div>
    </div>
  );
};

export default UpcomingOpportunities;