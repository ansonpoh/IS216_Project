import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../components/ui/Button';

const OpportunityCard = ({ 
  opportunity, 
  onSelect, 
  isSelected, 
  routeMode, 
  onAddToRoute, 
  isInRoute 
}) => {
  const {
    id,
    title,
    organization,
    category,
    location,
    timeCommitment,
    skills,
    description,
    image,
    urgency,
    volunteersNeeded,
    volunteersRegistered,
    remote,
    coordinates,
    estimatedTime
  } = opportunity;


  const nav = useNavigate();

  const getCategoryIcon = (category) => {
    const icons = {
      education: 'BookOpen',
      environment: 'Leaf',
      healthcare: 'Heart',
      community: 'Users',
      seniors: 'UserCheck',
      youth: 'Baby',
      animals: 'Dog',
      disaster: 'Shield',
      food: 'Apple',
      housing: 'Home'
    };
    return icons?.[category] || 'MapPin';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTimeCommitmentIcon = (timeCommitment) => {
    switch (timeCommitment) {
      case 'one-time': return 'Clock';
      case 'weekly': return 'Calendar';
      case 'monthly': return 'CalendarDays';
      case 'flexible': return 'Timer';
      default: return 'Clock';
    }
  };

  const spotsRemaining = volunteersNeeded - volunteersRegistered;
  const fillPercentage = (volunteersRegistered / volunteersNeeded) * 100;

  return (
    <div className={`bg-card rounded-lg border transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
        
        {/* Urgency Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
          {urgency} priority
        </div>

        {/* Remote Badge */}
        {remote && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Remote
          </div>
        )}

        {/* Route Selection */}
        {routeMode && (
          <div className="absolute bottom-3 right-3">
            <Button
              variant={isInRoute ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onAddToRoute(opportunity);
              }}
              iconName={isInRoute ? "Check" : "Plus"}
              className="bg-white/90 backdrop-blur-sm"
            >
              {isInRoute ? 'Added' : 'Add to Route'}
            </Button>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={getCategoryIcon(category)} size={16} className="text-primary" />
              <span className="text-xs font-medium text-primary capitalize">{category}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{organization}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {description}
        </p>

        {/* Details */}
        <div className="space-y-3 mb-4">
          {/* Location */}
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{location}</span>
            {estimatedTime && (
              <span className="text-xs text-primary">• {estimatedTime} away</span>
            )}
          </div>

          {/* Time Commitment */}
          <div className="flex items-center space-x-2 text-sm">
            <Icon name={getTimeCommitmentIcon(timeCommitment)} size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground capitalize">{timeCommitment?.replace('-', ' ')}</span>
          </div>

          {/* Skills */}
          {skills && skills?.length > 0 && (
            <div className="flex items-start space-x-2 text-sm">
              <Icon name="Star" size={14} className="text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {skills?.slice(0, 3)?.map((skill, index) => (
                  <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {skills?.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{skills?.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Volunteer Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Volunteers</span>
            <span className="font-medium">
              {volunteersRegistered}/{volunteersNeeded}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {spotsRemaining > 0 ? `${spotsRemaining} spots remaining` : 'Fully booked'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link to="/opportunity-detail-pages" className="flex-1">
            <Button variant="default" fullWidth size="sm" onClick={() => nav("/opportunities", {state: {id}})}>
              Learn More
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(opportunity)}
            iconName="MapPin"
          >
            View on Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;