import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImpactStoriesTab = ({ impactStories }) => {
  return (
    <div className="space-y-8">
      {/* Featured Impact Story */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center mb-4">
              <Icon name="Star" size={20} className="text-warning mr-2" />
              <span className="text-sm font-medium text-warning">Featured Story</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {impactStories?.featured?.title}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {impactStories?.featured?.description}
            </p>
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {impactStories?.featured?.metrics?.volunteers}
                </div>
                <div className="text-sm text-muted-foreground">Volunteers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {impactStories?.featured?.metrics?.hours}
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {impactStories?.featured?.metrics?.beneficiaries}
                </div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
            </div>
            <Button variant="outline" iconName="ExternalLink" iconPosition="right">
              Read Full Story
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden">
              <Image 
                src={impactStories?.featured?.image} 
                alt={impactStories?.featured?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
              <Button variant="default" size="lg" iconName="Play" className="bg-white/90 text-black hover:bg-white">
                Watch Video
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Impact Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {impactStories?.stories?.map((story) => (
          <div key={story?.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-video relative">
              <Image 
                src={story?.image} 
                alt={story?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                  {story?.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {story?.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {story?.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Icon name="Calendar" size={12} className="mr-1" />
                  <span>{story?.date}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Clock" size={12} className="mr-1" />
                  <span>{story?.readTime} min read</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-xs">
                    <Icon name="Heart" size={12} className="mr-1 text-error" />
                    <span>{story?.likes}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Icon name="MessageCircle" size={12} className="mr-1 text-primary" />
                    <span>{story?.comments}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
                  Read More
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Impact Metrics Dashboard */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Impact Over Time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {impactStories?.metrics?.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
              <div className={`text-3xl font-bold mb-2 ${
                index === 0 ? 'text-primary' : 
                index === 1 ? 'text-secondary' : 
                index === 2 ? 'text-accent' : 'text-warning'
              }`}>
                {metric?.value}
              </div>
              <div className="text-sm text-muted-foreground mb-1">{metric?.label}</div>
              <div className="flex items-center justify-center text-xs">
                <Icon 
                  name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                  className={metric?.trend === 'up' ? 'text-success mr-1' : 'text-error mr-1'} 
                />
                <span className={metric?.trend === 'up' ? 'text-success' : 'text-error'}>
                  {metric?.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive Impact Chart</p>
            <p className="text-sm text-muted-foreground">Showing volunteer hours and lives impacted over time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStoriesTab;