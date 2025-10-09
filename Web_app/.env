import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ConversationStarters from './components/ConversationStarters';
import QuickActions from './components/QuickActions';
import OpportunityCard from './components/OpportunityCard';
import SuggestedQuestions from './components/SuggestedQuestions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AIChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Mock opportunities data
  const mockOpportunities = [
    {
      id: 1,
      title: "Weekend Food Bank Volunteer",
      organization: "Community Food Network",
      location: "Downtown Community Center",
      timeCommitment: "3 hours, Saturdays",
      skills: ["Customer Service", "Organization"],
      impact: "Helps feed 200+ families weekly",
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400",
      urgency: "high",
      matchScore: 95
    },
    {
      id: 2,
      title: "Skills-Based Marketing Support",
      organization: "Youth Education Foundation",
      location: "Remote/Hybrid Available",
      timeCommitment: "2-4 hours/week, flexible",
      skills: ["Marketing", "Social Media", "Content Creation"],
      impact: "Reach 1000+ students with educational content",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
      urgency: "medium",
      matchScore: 88
    },
    {
      id: 3,
      title: "Environmental Cleanup Team",
      organization: "Green City Initiative",
      location: "Riverside Park",
      timeCommitment: "2 hours, Sunday mornings",
      skills: ["Teamwork", "Physical Activity"],
      impact: "Clean 5 miles of riverbank monthly",
      image: "https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=400",
      urgency: "low",
      matchScore: 76
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateAIResponse = (userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let aiResponse = "";
      let shouldShowOpportunities = false;

      // Simple keyword matching for demo purposes
      const lowerMessage = userMessage?.toLowerCase();
      
      if (lowerMessage?.includes('weekend') || lowerMessage?.includes('saturday') || lowerMessage?.includes('sunday')) {
        aiResponse = `Great! I found several weekend volunteer opportunities that match your preferences. Weekend volunteering is perfect for busy professionals like yourself.\n\nI've curated some options that offer flexible scheduling and meaningful impact. Take a look at these opportunities below:`;
        shouldShowOpportunities = true;
      } else if (lowerMessage?.includes('skill') || lowerMessage?.includes('professional') || lowerMessage?.includes('expertise')) {
        aiResponse = `Excellent! Using your professional skills for volunteering is incredibly valuable. Skills-based volunteering allows you to make a significant impact while developing your expertise further.\n\nHere are some opportunities that would benefit from your professional background:`;
        shouldShowOpportunities = true;
      } else if (lowerMessage?.includes('time') || lowerMessage?.includes('hour') || lowerMessage?.includes('busy')) {
        aiResponse = `I understand you have limited time - that's completely normal! Many of our most impactful volunteers are busy professionals who contribute just a few hours when they can.\n\nLet me show you some flexible opportunities that respect your schedule:`;
        shouldShowOpportunities = true;
      } else if (lowerMessage?.includes('new') || lowerMessage?.includes('first') || lowerMessage?.includes('start')) {
        aiResponse = `Welcome to the wonderful world of volunteering! It's exciting that you want to get started. I'll help you find the perfect first opportunity that matches your interests and comfort level.\n\nHere are some beginner-friendly options to consider:`;
        shouldShowOpportunities = true;
      } else if (lowerMessage?.includes('near') || lowerMessage?.includes('local') || lowerMessage?.includes('location')) {
        aiResponse = `I'd love to help you find local opportunities! Based on your location preferences, I've found several nearby volunteer positions that could be perfect for you.\n\nHere are some opportunities in your area:`;
        shouldShowOpportunities = true;
      } else if (lowerMessage?.includes('remote') || lowerMessage?.includes('home') || lowerMessage?.includes('virtual')) {
        aiResponse = `Remote volunteering is a fantastic option! You can make a meaningful impact from the comfort of your home while maintaining flexibility in your schedule.\n\nHere are some remote volunteer opportunities:`;
        shouldShowOpportunities = true;
      } else if (lowerMessage?.includes('group') || lowerMessage?.includes('team') || lowerMessage?.includes('friends')) {
        aiResponse = `Team volunteering is wonderful for building relationships and having shared impact! Many organizations welcome groups and have special team-building volunteer activities.\n\nHere are some group-friendly opportunities:`;
        shouldShowOpportunities = true;
      } else {
        aiResponse = `Thank you for your question! I'm here to help you find the perfect volunteer opportunity. Based on what you've shared, I can suggest several options that might interest you.\n\nLet me show you some opportunities that could be a great fit:`;
        shouldShowOpportunities = true;
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        message: aiResponse,
        isUser: false,
        timestamp: new Date()
      }]);

      if (shouldShowOpportunities) {
        setOpportunities(mockOpportunities);
      }

      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setShowWelcome(false);
    setOpportunities([]);
    
    simulateAIResponse(message);
  };

  const handleStarterClick = (query) => {
    handleSendMessage(query);
  };

  const handleQuickAction = (query) => {
    handleSendMessage(query);
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  const handleApplyOpportunity = (opportunityId) => {
    navigate('/opportunity-detail-pages', { state: { opportunityId } });
  };

  const handleLearnMore = (opportunityId) => {
    navigate('/opportunity-detail-pages', { state: { opportunityId } });
  };

  const clearChat = () => {
    setMessages([]);
    setOpportunities([]);
    setShowWelcome(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
          {/* Chat Header */}
          <div className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Icon name="Bot" size={20} color="white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">VolunteerConnect AI</h1>
                <p className="text-sm text-muted-foreground">Your personal volunteer matching assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={clearChat}>
                <Icon name="RotateCcw" size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="MoreVertical" size={16} />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {showWelcome && messages?.length === 0 ? (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Heart" size={24} color="white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome to VolunteerConnect AI
                  </h2>
                  <p className="text-muted-foreground">
                    I'm here to help you discover meaningful volunteer opportunities that match your interests, skills, and schedule. Let's find the perfect way for you to make an impact!
                  </p>
                </div>
                
                <ConversationStarters 
                  onStarterClick={handleStarterClick}
                  disabled={isTyping}
                />
              </div>
            ) : (
              <>
                {messages?.map((message) => (
                  <ChatMessage
                    key={message?.id}
                    message={message?.message}
                    isUser={message?.isUser}
                    timestamp={message?.timestamp}
                  />
                ))}
                
                {isTyping && <ChatMessage message="" isUser={false} timestamp={new Date()} isTyping={true} />}
                
                {opportunities?.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {opportunities?.map((opportunity) => (
                        <OpportunityCard
                          key={opportunity?.id}
                          opportunity={opportunity}
                          onApply={handleApplyOpportunity}
                          onLearnMore={handleLearnMore}
                        />
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/interactive-map-dashboard')}
                      >
                        <Icon name="Map" size={16} className="mr-2" />
                        View All on Map
                      </Button>
                    </div>
                  </div>
                )}
                
                {messages?.length > 0 && !isTyping && (
                  <div className="space-y-4">
                    <SuggestedQuestions 
                      onQuestionClick={handleQuestionClick}
                      disabled={isTyping}
                    />
                    
                    <QuickActions 
                      onActionClick={handleQuickAction}
                      disabled={isTyping}
                    />
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            placeholder={showWelcome ? "Ask me about volunteer opportunities..." : "Continue the conversation..."}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;