import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const DescriptionTab = ({ opportunity }) => {
  return (
    <div className="space-y-8">
      {/* Main Description */}
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-foreground mb-4">About This Opportunity</h2>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          {opportunity?.fullDescription?.split('\n')?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      {/* Key Highlights */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Sparkles" size={20} className="mr-2 text-primary" />
          Key Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunity?.highlights?.map((highlight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Skills You'll Gain */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-secondary" />
          Skills You'll Develop
        </h3>
        <div className="flex flex-wrap gap-2">
          {opportunity?.skillsGained?.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      {/* Organization Context */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Image 
            src={opportunity?.organization?.logo} 
            alt={opportunity?.organization?.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              About {opportunity?.organization?.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {opportunity?.organization?.description}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} className="text-primary" />
                <span className="text-muted-foreground">{opportunity?.organization?.volunteerCount} volunteers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} className="text-secondary" />
                <span className="text-muted-foreground">Founded {opportunity?.organization?.founded}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Award" size={14} className="text-accent" />
                <span className="text-muted-foreground">{opportunity?.organization?.rating}/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionTab;