import React from 'react';
import Icon from '../../../components/AppIcon';


const ChatMessage = ({ message, isUser, timestamp, isTyping = false }) => {
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })?.format(date);
  };

  if (isTyping) {
    return (
      <div className="flex items-start space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="Bot" size={16} color="white" />
        </div>
        <div className="flex-1">
          <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-6 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-to-br from-primary to-secondary'
      }`}>
        <Icon name={isUser ? "User" : "Bot"} size={16} color="white" />
      </div>
      
      <div className="flex-1">
        <div className={`rounded-2xl px-4 py-3 max-w-md ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-md ml-auto' 
            : 'bg-muted text-foreground rounded-tl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        
        {timestamp && (
          <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;