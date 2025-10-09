import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'volunteer': return 'Heart';
      case 'skill': return 'BookOpen';
      case 'mentor': return 'Users';
      case 'achievement': return 'Award';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'volunteer': return 'text-primary';
      case 'skill': return 'text-secondary';
      case 'mentor': return 'text-warning';
      case 'achievement': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recent Activities</h2>
        <Button variant="ghost" size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Log Activity
        </Button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground truncate">{activity?.title}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {activity?.timeAgo}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{activity?.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {activity?.hours && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{activity?.hours} hours</span>
                  </div>
                )}
                {activity?.location && (
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{activity?.location}</span>
                  </div>
                )}
                {activity?.organization && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Building2" size={12} />
                    <span>{activity?.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth>
          <Icon name="History" size={16} className="mr-2" />
          View All Activities
        </Button>
      </div>
    </div>
  );
};

export default RecentActivities;