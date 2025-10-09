import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConversationStarters = ({ onStarterClick, disabled = false }) => {
  const starters = [
    {
      id: 'getting-started',
      title: "I\'m new to volunteering",
      description: "Help me find the perfect first opportunity",
      icon: 'Heart',
      query: "I\'m new to volunteering and want to find opportunities that match my interests and schedule. Can you help me get started?"
    },
    {
      id: 'busy-professional',
      title: "I have limited time",
      description: "Find flexible opportunities that fit my schedule",
      icon: 'Clock',
      query: "I\'m a busy professional with limited time. Can you suggest flexible volunteer opportunities that work around my schedule?"
    },
    {
      id: 'skills-matching',
      title: "Use my professional skills",
      description: "Match my expertise with meaningful causes",
      icon: 'Target',
      query: "I want to volunteer using my professional skills. What opportunities would be a good match for my expertise?"
    },
    {
      id: 'local-impact',
      title: "Make local impact",
      description: "Find ways to help my immediate community",
      icon: 'MapPin',
      query: "I want to make a difference in my local community. What volunteer opportunities are available near me?"
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          How can I help you find the perfect volunteer opportunity?
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a starting point below or ask me anything about volunteering
        </p>
      </div>
      <div className="grid gap-3">
        {starters?.map((starter) => (
          <Button
            key={starter?.id}
            variant="outline"
            disabled={disabled}
            onClick={() => onStarterClick(starter?.query)}
            className="h-auto p-4 text-left hover:bg-muted transition-colors duration-200"
          >
            <div className="flex items-start space-x-3 w-full">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={starter?.icon} size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground mb-1">{starter?.title}</h3>
                <p className="text-sm text-muted-foreground">{starter?.description}</p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted-foreground flex-shrink-0" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ConversationStarters;