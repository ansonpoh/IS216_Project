import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OpportunityCard = ({ opportunity, onApply, onLearnMore }) => {
  const {
    id,
    title,
    organization,
    location,
    timeCommitment,
    skills,
    impact,
    image,
    urgency,
    matchScore
  } = opportunity;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-success bg-success/10';
    if (score >= 70) return 'text-primary bg-primary/10';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            {matchScore && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(matchScore)}`}>
                {matchScore}% match
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{organization}</p>
        </div>
        
        {urgency && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
            {urgency} priority
          </span>
        )}
      </div>
      {image && (
        <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
          <Image 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={14} />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>{timeCommitment}</span>
        </div>
        
        {skills && skills?.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Star" size={14} />
            <span>{skills?.join(', ')}</span>
          </div>
        )}
        
        {impact && (
          <div className="flex items-center space-x-2 text-sm text-success">
            <Icon name="TrendingUp" size={14} />
            <span>{impact}</span>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onApply(id)}
          className="flex-1"
        >
          Apply Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLearnMore(id)}
          className="flex-1"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default OpportunityCard;