import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'AI Chat Interface', 
      path: '/ai-chat-interface', 
      icon: 'MessageCircle',
      description: 'Get personalized volunteer recommendations'
    },
    { 
      name: 'Interactive Map', 
      path: '/interactive-map-dashboard', 
      icon: 'Map',
      description: 'Discover opportunities near you'
    },
    { 
      name: 'Personal Impact Hub', 
      path: '/personal-impact-hub', 
      icon: 'TrendingUp',
      description: 'Track your volunteer journey'
    },
    { 
      name: 'Opportunities', 
      path: '/opportunity-detail-pages', 
      icon: 'Calendar',
      description: 'Browse available volunteer positions'
    },
    { 
      name: 'Organizations', 
      path: '/organization-profiles', 
      icon: 'Building2',
      description: 'Explore partner organizations'
    },
    { 
      name: 'Community Feed', 
      path: '/community-feed', 
      icon: 'Users',
      description: 'Connect with fellow volunteers'
    }
  ];

  const isActivePath = (path) => location?.pathname === path;
  const shouldShowExpanded = !isCollapsed || isHovered;

  return (
    <aside 
      className={`lg:fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 ease-smooth ${
        shouldShowExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        {onToggle && (
          <div className="flex justify-end p-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
              />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems?.map((item) => {
            const isActive = isActivePath(item?.path);
            
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`group flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    className={isActive ? 'text-primary-foreground' : ''}
                  />
                </div>
                {shouldShowExpanded && (
                  <div className="flex-1 min-w-0 animate-fade-in">
                    <div className="font-medium truncate">
                      {item?.name}
                    </div>
                    {!isCollapsed && (
                      <div className="text-xs opacity-75 truncate mt-0.5">
                        {item?.description}
                      </div>
                    )}
                  </div>
                )}
                {isActive && shouldShowExpanded && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse-custom" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {shouldShowExpanded && (
          <div className="p-4 border-t border-border animate-fade-in">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    Welcome back!
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    Ready to make an impact?
                  </div>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <div className="mt-3 space-y-1">
                <Button variant="ghost" size="sm" fullWidth className="justify-start">
                  <Icon name="Settings" size={14} className="mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" fullWidth className="justify-start">
                  <Icon name="HelpCircle" size={14} className="mr-2" />
                  Help & Support
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {shouldShowExpanded && !isCollapsed && (
          <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 animate-fade-in">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Your Impact This Month
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-card rounded">
                <div className="font-bold text-primary">12</div>
                <div className="text-muted-foreground">Hours</div>
              </div>
              <div className="text-center p-2 bg-card rounded">
                <div className="font-bold text-secondary">3</div>
                <div className="text-muted-foreground">Events</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;