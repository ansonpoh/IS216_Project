import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReviewsTab = ({ opportunity }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'rating', label: 'Highest Rating' }
  ];

  const ratingFilters = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' }
  ];

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
              <div className="text-4xl font-bold text-foreground">{opportunity?.rating}</div>
              <div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon 
                      key={i} 
                      name="Star" 
                      size={20} 
                      className={i < Math.floor(opportunity?.rating) ? "text-warning fill-current" : "text-border"} 
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Based on {opportunity?.reviewCount} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((rating) => {
              const count = opportunity?.ratingBreakdown?.[rating] || 0;
              const percentage = (count / opportunity?.reviewCount) * 100;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-muted-foreground">{rating}</span>
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-warning rounded-full h-2 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground w-8">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-card text-foreground"
            >
              {sortOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>{option?.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Filter:</label>
            <select 
              value={filterRating}
              onChange={(e) => setFilterRating(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-card text-foreground"
            >
              {ratingFilters?.map((filter) => (
                <option key={filter?.value} value={filter?.value}>{filter?.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Button variant="outline" size="sm" iconName="MessageSquare" iconPosition="left">
          Write a Review
        </Button>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {opportunity?.reviews?.map((review, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <Image 
                src={review?.reviewer?.avatar} 
                alt={review?.reviewer?.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{review?.reviewer?.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{review?.reviewer?.volunteerSince}</span>
                      <span>•</span>
                      <span>{review?.reviewer?.totalHours} hours volunteered</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon 
                          key={i} 
                          name="Star" 
                          size={14} 
                          className={i < review?.rating ? "text-warning fill-current" : "text-border"} 
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">{review?.date}</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {review?.comment}
                </p>
                
                {review?.helpful && (
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="ThumbsUp" size={14} />
                      <span>Helpful ({review?.helpfulCount})</span>
                    </button>
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="MessageCircle" size={14} />
                      <span>Reply</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" iconName="ChevronDown" iconPosition="right">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};

export default ReviewsTab;