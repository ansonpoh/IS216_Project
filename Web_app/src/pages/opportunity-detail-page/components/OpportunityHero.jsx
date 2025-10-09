import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OpportunityHero = ({ opportunity, onApply }) => {
  return (
    <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
                <Icon name="MapPin" size={14} className="text-primary" />
                <span className="text-sm font-medium text-primary">{opportunity?.location}</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 px-3 py-1 rounded-full">
                <Icon name="Clock" size={14} className="text-secondary" />
                <span className="text-sm font-medium text-secondary">{opportunity?.timeCommitment}</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {opportunity?.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {opportunity?.shortDescription}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image 
                  src={opportunity?.organization?.logo} 
                  alt={opportunity?.organization?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-foreground">{opportunity?.organization?.name}</span>
                {opportunity?.organization?.verified && (
                  <Icon name="CheckCircle" size={16} className="text-primary" />
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="default" 
                size="lg"
                iconName="Heart"
                iconPosition="left"
                onClick={onApply}
                className="flex-1 sm:flex-none"
              >
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                iconName="Share2"
                iconPosition="left"
                className="flex-1 sm:flex-none"
              >
                Share Opportunity
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                iconName="Bookmark"
                className="flex-1 sm:flex-none"
              >
                Save for Later
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{opportunity?.stats?.volunteersNeeded}</div>
                <div className="text-sm text-muted-foreground">Volunteers Needed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{opportunity?.stats?.currentVolunteers}</div>
                <div className="text-sm text-muted-foreground">Already Joined</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{opportunity?.stats?.impactMetric}</div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src={opportunity?.heroImage} 
                alt={opportunity?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={16} className="text-warning fill-current" />
                <span className="font-bold text-foreground">{opportunity?.rating}</span>
                <span className="text-sm text-muted-foreground">({opportunity?.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityHero;