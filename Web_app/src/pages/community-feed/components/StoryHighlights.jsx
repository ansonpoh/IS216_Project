import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StoryHighlights = ({ highlights, onViewAll }) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Featured Stories</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights?.map((story) => (
          <div
            key={story?.id}
            className="bg-card rounded-lg p-4 border border-border hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src={story?.author?.avatar}
                alt={story?.author?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-sm text-foreground">{story?.author?.name}</div>
                <div className="text-xs text-muted-foreground">{story?.organization}</div>
              </div>
            </div>

            {story?.image && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <Image
                  src={story?.image}
                  alt="Story image"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            <p className="text-sm text-foreground mb-3 line-clamp-3">
              {story?.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={12} className="text-destructive" />
                  <span>{story?.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MessageCircle" size={12} />
                  <span>{story?.comments}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-primary">
                <Icon name="TrendingUp" size={12} />
                <span>{story?.impact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryHighlights;