import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrganizationHero = ({ organization }) => {
  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Organization Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-card border-2 border-border shadow-sm">
                <Image 
                  src={organization?.logo} 
                  alt={`${organization?.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-inter">
                  {organization?.name}
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{organization?.location}</span>
                  {organization?.verified && (
                    <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full">
                      <Icon name="CheckCircle" size={14} />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {organization?.mission}
            </p>

            <div className="flex flex-wrap gap-2">
              {organization?.categories?.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="default" iconName="Heart" iconPosition="left">
                Volunteer Now
              </Button>
              <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                Contact Us
              </Button>
              <Button variant="ghost" iconName="Share2" iconPosition="left">
                Share
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-6">Our Impact</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {organization?.stats?.volunteersHelped?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Volunteers</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">
                  {organization?.stats?.hoursContributed?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">
                  {organization?.stats?.livesImpacted?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-1">
                  {organization?.stats?.projectsCompleted}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Charity Rating</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon 
                      key={i} 
                      name="Star" 
                      size={16} 
                      className={i < organization?.rating ? "text-warning fill-current" : "text-muted-foreground"} 
                    />
                  ))}
                  <span className="ml-2 font-medium text-foreground">
                    {organization?.rating}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationHero;