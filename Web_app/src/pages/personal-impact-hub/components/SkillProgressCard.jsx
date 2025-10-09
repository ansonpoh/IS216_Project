import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SkillProgressCard = ({ skills }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Skills Development</h2>
        <Button variant="ghost" size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Add Skill
        </Button>
      </div>
      <div className="space-y-4">
        {skills?.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name={skill?.icon} size={16} className="text-primary" />
                <span className="font-medium text-foreground">{skill?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{skill?.level}</span>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${skill?.progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{skill?.hoursSpent} hours practiced</span>
              <span>{skill?.progress}% complete</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth>
          <Icon name="BookOpen" size={16} className="mr-2" />
          Explore Learning Resources
        </Button>
      </div>
    </div>
  );
};

export default SkillProgressCard;