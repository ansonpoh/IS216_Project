import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TestimonialsTab = ({ testimonials }) => {
  const [filter, setFilter] = useState('all');

  const filterTestimonials = (type) => {
    if (type === 'all') return testimonials;
    return testimonials?.filter(testimonial => testimonial?.type === type);
  };

  const filteredTestimonials = filterTestimonials(filter);

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-wrap gap-2">
          {['all', 'volunteer', 'beneficiary', 'partner']?.map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className="capitalize"
            >
              {type === 'all' ? 'All Testimonials' : `${type}s`}
            </Button>
          ))}
        </div>
      </div>
      {/* Featured Testimonial */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 border border-border">
        <div className="flex items-center mb-4">
          <Icon name="Quote" size={24} className="text-primary mr-2" />
          <span className="text-sm font-medium text-primary">Featured Testimonial</span>
        </div>
        
        <blockquote className="text-xl text-foreground font-medium mb-6 leading-relaxed">
          "{testimonials?.featured?.quote}"
        </blockquote>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image 
              src={testimonials?.featured?.avatar} 
              alt={testimonials?.featured?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-foreground">{testimonials?.featured?.name}</div>
            <div className="text-sm text-primary">{testimonials?.featured?.role}</div>
            <div className="text-xs text-muted-foreground">{testimonials?.featured?.date}</div>
          </div>
          <div className="ml-auto">
            <div className="flex items-center">
              {[...Array(5)]?.map((_, i) => (
                <Icon 
                  key={i} 
                  name="Star" 
                  size={16} 
                  className={i < testimonials?.featured?.rating ? "text-warning fill-current" : "text-muted-foreground"} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials?.map((testimonial) => (
          <div key={testimonial?.id} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <Image 
                    src={testimonial?.avatar} 
                    alt={testimonial?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial?.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial?.role}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon 
                      key={i} 
                      name="Star" 
                      size={14} 
                      className={i < testimonial?.rating ? "text-warning fill-current" : "text-muted-foreground"} 
                    />
                  ))}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testimonial?.type === 'volunteer' ? 'bg-primary/10 text-primary' :
                  testimonial?.type === 'beneficiary'? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                }`}>
                  {testimonial?.type}
                </span>
              </div>
            </div>

            <blockquote className="text-muted-foreground mb-4 leading-relaxed">
              "{testimonial?.quote}"
            </blockquote>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Icon name="Calendar" size={12} className="mr-1" />
                <span>{testimonial?.date}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center hover:text-foreground transition-colors">
                  <Icon name="ThumbsUp" size={12} className="mr-1" />
                  <span>{testimonial?.helpful}</span>
                </button>
                <button className="flex items-center hover:text-foreground transition-colors">
                  <Icon name="MessageCircle" size={12} className="mr-1" />
                  <span>Reply</span>
                </button>
              </div>
            </div>

            {testimonial?.program && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center text-sm">
                  <Icon name="Tag" size={14} className="mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Program:</span>
                  <span className="ml-1 font-medium text-foreground">{testimonial?.program}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Video Testimonials */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Video Testimonials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.videos?.map((video) => (
            <div key={video?.id} className="relative group cursor-pointer">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <Image 
                  src={video?.thumbnail} 
                  alt={video?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Icon name="Play" size={20} className="text-black ml-1" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="font-medium text-foreground">{video?.title}</h4>
                <p className="text-sm text-muted-foreground">{video?.speaker}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} className="mr-1" />
                  <span>{video?.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add Testimonial CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center border border-border">
        <Icon name="MessageSquare" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Share Your Experience</h3>
        <p className="text-muted-foreground mb-6">
          Help others discover the impact of volunteering with us by sharing your story.
        </p>
        <Button variant="default" iconName="Plus" iconPosition="left">
          Add Your Testimonial
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsTab;