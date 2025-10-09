import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialShareCard = ({ milestones }) => {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleShare = (platform, milestone) => {
    const shareText = `🎉 Just reached a new milestone: ${milestone?.title}! ${milestone?.shareText} #VolunteerConnect #MakingADifference`;
    const shareUrl = window.location?.origin;
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Share Your Impact</h2>
        <Icon name="Share2" size={20} className="text-primary" />
      </div>
      <div className="space-y-4">
        {milestones?.map((milestone, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedMilestone === index 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                <Icon name={milestone?.icon} size={18} className="text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">{milestone?.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{milestone?.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{milestone?.achievedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Heart" size={12} />
                    <span>{milestone?.impact}</span>
                  </div>
                </div>
              </div>
              
              <Icon 
                name={selectedMilestone === index ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </div>
            
            {selectedMilestone === index && (
              <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Share on:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare('twitter', milestone)}
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <Icon name="Twitter" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare('facebook', milestone)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Icon name="Facebook" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare('linkedin', milestone)}
                      className="text-blue-700 hover:bg-blue-50"
                    >
                      <Icon name="Linkedin" size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    🎉 Just reached a new milestone: {milestone?.title}! {milestone?.shareText} #VolunteerConnect #MakingADifference
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth>
          <Icon name="Camera" size={16} className="mr-2" />
          Create Custom Share Post
        </Button>
      </div>
    </div>
  );
};

export default SocialShareCard;