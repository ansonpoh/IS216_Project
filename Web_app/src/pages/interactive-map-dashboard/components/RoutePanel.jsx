import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoutePanel = ({ 
  selectedOpportunities, 
  onRemoveFromRoute, 
  onOptimizeRoute, 
  onClearRoute,
  isOpen,
  onToggle 
}) => {
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeRoute = async () => {
    if (selectedOpportunities?.length < 2) return;
    
    setIsOptimizing(true);
    
    // Mock route optimization
    setTimeout(() => {
      const optimized = {
        totalDistance: '12.4 miles',
        totalTime: '45 minutes',
        savings: '15 minutes saved',
        route: [...selectedOpportunities]?.sort(() => Math.random() - 0.5)
      };
      setOptimizedRoute(optimized);
      setIsOptimizing(false);
      onOptimizeRoute(optimized);
    }, 2000);
  };

  const getTotalEstimatedTime = () => {
    if (selectedOpportunities?.length === 0) return '0 min';
    const baseTime = selectedOpportunities?.length * 15; // 15 min per stop
    const travelTime = (selectedOpportunities?.length - 1) * 10; // 10 min between stops
    return `${baseTime + travelTime} min`;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-30">
        <Button
          variant="default"
          onClick={onToggle}
          iconName="Route"
          iconPosition="left"
          className="shadow-lg"
        >
          Route ({selectedOpportunities?.length})
        </Button>
      </div>
      {/* Route Panel */}
      <div className={`fixed lg:relative top-0 right-0 h-full w-80 bg-card border-l border-border z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Route" size={20} />
              <h2 className="text-lg font-semibold">Route Planner</h2>
              {selectedOpportunities?.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {selectedOpportunities?.length}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedOpportunities?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="Route" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Plan Your Route</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Select multiple opportunities from the map to create an optimized volunteer route.
                </p>
                <div className="text-xs text-muted-foreground">
                  💡 Tip: Click the "Add to Route" button on opportunity cards
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Route Summary */}
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Route Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Stops</div>
                      <div className="font-medium">{selectedOpportunities?.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Est. Time</div>
                      <div className="font-medium">{getTotalEstimatedTime()}</div>
                    </div>
                    {optimizedRoute && (
                      <>
                        <div>
                          <div className="text-muted-foreground">Distance</div>
                          <div className="font-medium">{optimizedRoute?.totalDistance}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Time Saved</div>
                          <div className="font-medium text-green-600">{optimizedRoute?.savings}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Optimization Controls */}
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    onClick={handleOptimizeRoute}
                    disabled={selectedOpportunities?.length < 2 || isOptimizing}
                    loading={isOptimizing}
                    iconName="Zap"
                    iconPosition="left"
                    className="flex-1"
                  >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClearRoute}
                    iconName="Trash2"
                    size="icon"
                  />
                </div>

                {/* Route List */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Your Route</h4>
                  {(optimizedRoute?.route || selectedOpportunities)?.map((opportunity, index) => (
                    <div key={opportunity?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm line-clamp-1">{opportunity?.title}</h5>
                        <p className="text-xs text-muted-foreground line-clamp-1">{opportunity?.organization}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="MapPin" size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground line-clamp-1">{opportunity?.location}</span>
                        </div>
                        {opportunity?.estimatedTime && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Icon name="Clock" size={12} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{opportunity?.estimatedTime} away</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFromRoute(opportunity?.id)}
                        className="h-6 w-6"
                      >
                        <Icon name="X" size={12} />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Navigation Actions */}
                {selectedOpportunities?.length > 0 && (
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      fullWidth
                      iconName="Navigation"
                      iconPosition="left"
                    >
                      Start Navigation
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Share"
                      iconPosition="left"
                    >
                      Share Route
                    </Button>
                  </div>
                )}

                {/* Route Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-900 mb-1">Route Tips</div>
                      <ul className="text-blue-700 text-xs space-y-1">
                        <li>• Plan for 15-30 minutes at each location</li>
                        <li>• Check organization hours before visiting</li>
                        <li>• Bring required documents or materials</li>
                        <li>• Consider parking availability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default RoutePanel;