import React from 'react';
import Icon from '../../../components/AppIcon';

const RequirementsTab = ({ opportunity }) => {
  return (
    <div className="space-y-8">
      {/* Essential Requirements */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Icon name="CheckCircle" size={24} className="mr-3 text-primary" />
          Essential Requirements
        </h2>
        <div className="space-y-4">
          {opportunity?.requirements?.essential?.map((requirement, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
              <Icon name="Check" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1">{requirement?.title}</h4>
                <p className="text-sm text-muted-foreground">{requirement?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Preferred Qualifications */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Star" size={20} className="mr-2 text-secondary" />
          Preferred Qualifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunity?.requirements?.preferred?.map((qualification, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Plus" size={14} className="text-secondary mt-1 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{qualification}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Time Commitment */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="mr-2 text-primary" />
          Time Commitment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{opportunity?.timeDetails?.hoursPerWeek}</div>
            <div className="text-sm text-muted-foreground">Hours per Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{opportunity?.timeDetails?.duration}</div>
            <div className="text-sm text-muted-foreground">Commitment Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">{opportunity?.timeDetails?.flexibility}</div>
            <div className="text-sm text-muted-foreground">Schedule Flexibility</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">
            <Icon name="Info" size={14} className="inline mr-1" />
            {opportunity?.timeDetails?.additionalInfo}
          </p>
        </div>
      </div>
      {/* Training & Support */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="GraduationCap" size={20} className="mr-2 text-secondary" />
          Training & Support Provided
        </h3>
        <div className="space-y-3">
          {opportunity?.training?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="BookOpen" size={14} className="text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{item?.title}</h4>
                <p className="text-sm text-muted-foreground">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Background Check Info */}
      {opportunity?.backgroundCheck && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={18} className="mr-2 text-warning" />
            Background Check Required
          </h3>
          <p className="text-muted-foreground mb-4">
            This position requires a background check for the safety of our community members. We'll guide you through the process after your application is approved.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Clock" size={14} className="text-warning" />
            <span className="text-muted-foreground">Processing time: 3-5 business days</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsTab;