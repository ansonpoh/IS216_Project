import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProof = ({ opportunity }) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recent Activity */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-muted-foreground">
            See what other volunteers are saying about this opportunity
          </p>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Activity" size={18} className="mr-2 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {opportunity?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Image 
                  src={activity?.user?.avatar} 
                  alt={activity?.user?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.user?.name}</span> {activity?.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
                </div>
                <Icon name={activity?.icon} size={16} className="text-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Verification */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Verified Organization</h3>
            <p className="text-sm text-muted-foreground">
              Background checked and verified by our trust & safety team
            </p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <Icon name="CheckCircle" size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">Verified</span>
            </div>
          </div>

          {/* Safety Protocols */}
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Heart" size={24} className="text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Safety First</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive safety protocols and volunteer support systems
            </p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <Icon name="CheckCircle" size={14} className="text-secondary" />
              <span className="text-sm font-medium text-secondary">Protected</span>
            </div>
          </div>

          {/* Community Support */}
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Community Support</h3>
            <p className="text-sm text-muted-foreground">
              Join a supportive community of like-minded volunteers
            </p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <Icon name="CheckCircle" size={14} className="text-accent" />
              <span className="text-sm font-medium text-accent">Supported</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-xl p-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {opportunity?.quickStats?.totalVolunteers}
              </div>
              <div className="text-sm text-muted-foreground">Total Volunteers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {opportunity?.quickStats?.hoursContributed}
              </div>
              <div className="text-sm text-muted-foreground">Hours Contributed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-1">
                {opportunity?.quickStats?.livesImpacted}
              </div>
              <div className="text-sm text-muted-foreground">Lives Impacted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning mb-1">
                {opportunity?.quickStats?.satisfactionRate}
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;