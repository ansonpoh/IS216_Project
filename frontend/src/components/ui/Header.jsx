import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'AI Chat', path: '/ai-chat-interface', icon: 'MessageCircle' },
    { name: 'Map', path: '/interactive-map-dashboard', icon: 'Map' },
    { name: 'My Impact', path: '/personal-impact-hub', icon: 'TrendingUp' },
    { name: 'Opportunities', path: '/opportunity-detail-pages', icon: 'Calendar' },
    { name: 'Community', path: '/community-feed', icon: 'Users' }
  ];

  const secondaryItems = [
    { name: 'Organizations', path: '/organization-profiles', icon: 'Building2' }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} color="white" />
          </div>
          <span className="text-xl font-bold text-foreground font-inter">
            VolunteerConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.name}</span>
            </Link>
          ))}
          
          {/* More Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">
              <Icon name="MoreHorizontal" size={16} />
              <span>More</span>
            </button>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {secondaryItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-popover-foreground'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Icon name="Bell" size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="User" size={16} />
          </Button>
          <Button variant="default" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
        >
          <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <nav className="px-4 py-4 space-y-2">
            {[...navigationItems, ...secondaryItems]?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <Button variant="ghost" fullWidth className="justify-start">
                <Icon name="Bell" size={16} className="mr-3" />
                Notifications
              </Button>
              <Button variant="ghost" fullWidth className="justify-start">
                <Icon name="User" size={16} className="mr-3" />
                Profile
              </Button>
              <Button variant="default" fullWidth className="mt-3">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;