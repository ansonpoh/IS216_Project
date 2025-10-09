import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuggestedQuestions = ({ onQuestionClick, disabled = false }) => {
  const questions = [
    {
      id: 'schedule-flexibility',
      text: "What if my schedule changes?",
      icon: 'Calendar'
    },
    {
      id: 'skill-requirements',
      text: "Do I need special skills?",
      icon: 'Award'
    },
    {
      id: 'time-commitment',
      text: "How much time is required?",
      icon: 'Clock'
    },
    {
      id: 'getting-started',
      text: "How do I get started?",
      icon: 'Play'
    },
    {
      id: 'background-check',
      text: "Is a background check needed?",
      icon: 'Shield'
    },
    {
      id: 'group-volunteering',
      text: "Can I volunteer with friends?",
      icon: 'Users'
    }
  ];

  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="HelpCircle" size={16} className="text-primary" />
        <h3 className="text-sm font-medium text-foreground">Common Questions</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions?.map((question) => (
          <Button
            key={question?.id}
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onQuestionClick(question?.text)}
            className="h-auto px-3 py-2 text-xs bg-card hover:bg-muted border border-border rounded-lg transition-colors duration-200"
          >
            <Icon name={question?.icon} size={12} className="mr-1.5" />
            {question?.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;