import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Ask me about volunteer opportunities..." }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e?.target?.value);
    
    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  };

  const startVoiceRecognition = () => {
    if (recognitionRef?.current && !isListening) {
      setIsListening(true);
      recognitionRef?.current?.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef?.current && isListening) {
      recognitionRef?.current?.stop();
      setIsListening(false);
    }
  };

  const hasVoiceSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="bg-card border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-muted border border-border rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {hasVoiceSupport && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
            </Button>
          )}
        </div>
        
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={disabled || !message?.trim()}
          className="h-11 w-11 p-0 flex-shrink-0"
        >
          <Icon name="Send" size={16} />
        </Button>
      </form>
      {isListening && (
        <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          <span>Listening...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;