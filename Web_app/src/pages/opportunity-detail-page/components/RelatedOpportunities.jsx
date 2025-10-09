import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedOpportunities = ({ opportunities }) => {
  return (
    <div className="bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            More Ways to Make an Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover other volunteer opportunities that match your interests and skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities?.map((opportunity, index) => (
            <div key={index} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image 
                  src={opportunity?.image} 
                  alt={opportunity?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {opportunity?.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Icon name="Bookmark" size={14} className="text-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Image 
                    src={opportunity?.organization?.logo} 
                    alt={opportunity?.organization?.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-muted-foreground">{opportunity?.organization?.name}</span>
                  {opportunity?.organization?.verified && (
                    <Icon name="CheckCircle" size={14} className="text-primary" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {opportunity?.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {opportunity?.description}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{opportunity?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{opportunity?.timeCommitment}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm font-medium text-foreground">{opportunity?.rating}</span>
                    <span className="text-sm text-muted-foreground">({opportunity?.reviewCount})</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {opportunity?.volunteersNeeded} volunteers needed
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link to={`/opportunity-detail-pages/${opportunity?.id}`} className="flex-1">
                    <Button variant="default" size="sm" fullWidth>
                      Learn More
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" iconName="Share2">
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/interactive-map-dashboard">
            <Button variant="outline" size="lg" iconName="Map" iconPosition="left">
              Explore All Opportunities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedOpportunities;