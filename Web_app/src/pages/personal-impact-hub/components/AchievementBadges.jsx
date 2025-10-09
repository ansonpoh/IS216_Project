import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Achievement Badges</h2>
        <Icon name="Award" size={20} className="text-warning" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements?.map((achievement, index) => (
          <div 
            key={index} 
            className={`text-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              achievement?.earned 
                ? 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20' :'bg-muted/50 border-border'
            }`}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
              achievement?.earned 
                ? 'bg-gradient-to-br from-warning to-warning/80' :'bg-muted'
            }`}>
              <Icon 
                name={achievement?.icon} 
                size={20} 
                className={achievement?.earned ? 'text-white' : 'text-muted-foreground'} 
              />
            </div>
            <div className={`text-sm font-medium mb-1 ${
              achievement?.earned ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {achievement?.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {achievement?.description}
            </div>
            {achievement?.earned && achievement?.earnedDate && (
              <div className="text-xs text-warning mt-2 font-medium">
                Earned {achievement?.earnedDate}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress to next badge:</span>
          <span className="font-medium text-foreground">2 more hours needed</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div className="bg-gradient-to-r from-warning to-warning/80 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;