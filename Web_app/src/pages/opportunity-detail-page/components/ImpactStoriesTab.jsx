import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ImpactStoriesTab = ({ opportunity }) => {
  return (
    <div className="space-y-8">
      {/* Impact Metrics */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Icon name="BarChart3" size={24} className="mr-3 text-primary" />
          Our Impact Together
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {opportunity?.impactMetrics?.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{metric?.value}</div>
              <div className="text-sm text-muted-foreground">{metric?.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric?.period}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Volunteer Stories */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <Icon name="MessageSquare" size={20} className="mr-2 text-secondary" />
          Stories from Our Volunteers
        </h3>
        <div className="space-y-6">
          {opportunity?.volunteerStories?.map((story, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <Image 
                  src={story?.volunteer?.avatar} 
                  alt={story?.volunteer?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-foreground">{story?.volunteer?.name}</h4>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{story?.volunteer?.role}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon 
                          key={i} 
                          name="Star" 
                          size={12} 
                          className={i < story?.rating ? "text-warning fill-current" : "text-border"} 
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic mb-3">
                    "{story?.testimonial}"
                  </blockquote>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{story?.duration} volunteer</span>
                    <span>•</span>
                    <span>{story?.hoursContributed} hours contributed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Beneficiary Stories */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <Icon name="Heart" size={20} className="mr-2 text-accent" />
          Impact on Our Community
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {opportunity?.beneficiaryStories?.map((story, index) => (
            <div key={index} className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{story?.beneficiary}</h4>
                  <p className="text-sm text-muted-foreground">{story?.relationship}</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic">
                "{story?.story}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
      {/* Video Testimonials */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <Icon name="Play" size={20} className="mr-2 text-primary" />
          Video Testimonials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunity?.videoTestimonials?.map((video, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <Image 
                  src={video?.thumbnail} 
                  alt={video?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <Icon name="Play" size={24} className="text-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="font-medium text-foreground">{video?.title}</h4>
                <p className="text-sm text-muted-foreground">{video?.speaker} • {video?.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactStoriesTab;