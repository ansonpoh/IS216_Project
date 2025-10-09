import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MentorshipCard = ({ mentorshipData }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Mentorship & Leadership</h2>
        <Icon name="Users" size={20} className="text-secondary" />
      </div>
      <div className="space-y-6">
        {/* Mentoring Others */}
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="UserCheck" size={16} className="mr-2 text-secondary" />
            Mentoring Others ({mentorshipData?.mentees?.length})
          </h3>
          
          <div className="space-y-3">
            {mentorshipData?.mentees?.map((mentee, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image 
                      src={mentee?.avatar} 
                      alt={mentee?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{mentee?.name}</div>
                    <div className="text-xs text-muted-foreground">{mentee?.experience}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground">{mentee?.sessions} sessions</div>
                  <Button variant="ghost" size="sm">
                    <Icon name="MessageCircle" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Leadership Opportunities */}
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Crown" size={16} className="mr-2 text-warning" />
            Leadership Opportunities
          </h3>
          
          <div className="space-y-3">
            {mentorshipData?.leadershipOpportunities?.map((opportunity, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{opportunity?.title}</h4>
                  <div className="flex items-center space-x-1 text-xs text-primary">
                    <Icon name="TrendingUp" size={12} />
                    <span>{opportunity?.impact} impact</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{opportunity?.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span>{opportunity?.teamSize} team members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{opportunity?.commitment}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Icon name="ArrowRight" size={14} className="mr-1" />
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Icon name="UserPlus" size={14} className="mr-2" />
            Find Mentees
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Crown" size={14} className="mr-2" />
            Leadership Hub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorshipCard;