import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendingTopics = ({ topics, onTopicClick }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="TrendingUp" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Trending Topics</h2>
      </div>
      <div className="space-y-3">
        {topics?.map((topic, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            onClick={() => onTopicClick(topic?.tag)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-muted-foreground">
                #{index + 1}
              </div>
              <div>
                <div className="font-medium text-foreground">#{topic?.tag}</div>
                <div className="text-sm text-muted-foreground">
                  {topic?.posts} posts • {topic?.engagement} engagement
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                topic?.trend === 'up' ? 'bg-success' : 
                topic?.trend === 'down' ? 'bg-destructive' : 'bg-warning'
              }`} />
              <Icon 
                name={topic?.trend === 'up' ? 'TrendingUp' : topic?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
                className={
                  topic?.trend === 'up' ? 'text-success' : 
                  topic?.trend === 'down' ? 'text-destructive' : 'text-warning'
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth>
          View All Trending Topics
          <Icon name="ArrowRight" size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default TrendingTopics;