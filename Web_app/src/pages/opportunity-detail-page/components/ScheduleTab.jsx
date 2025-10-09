import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleTab = ({ opportunity }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <div className="space-y-8">
      {/* Schedule Overview */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
          <Icon name="Calendar" size={24} className="mr-3 text-primary" />
          Available Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{opportunity?.schedule?.frequency}</div>
            <div className="text-sm text-muted-foreground">Frequency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{opportunity?.schedule?.duration}</div>
            <div className="text-sm text-muted-foreground">Session Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">{opportunity?.schedule?.flexibility}</div>
            <div className="text-sm text-muted-foreground">Flexibility Level</div>
          </div>
        </div>
      </div>
      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Dates */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Icon name="CalendarDays" size={20} className="mr-2 text-primary" />
            Available Dates
          </h3>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {opportunity?.availableDates?.map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={!date?.available}
                  className={`aspect-square p-2 text-sm rounded-lg transition-all duration-200 ${
                    !date?.available
                      ? 'text-muted-foreground cursor-not-allowed'
                      : selectedDate?.date === date?.date
                      ? 'bg-primary text-primary-foreground'
                      : date?.spotsLeft <= 2
                      ? 'bg-warning/10 text-warning hover:bg-warning/20' :'hover:bg-muted text-foreground'
                  }`}
                >
                  {date?.day}
                  {date?.available && date?.spotsLeft <= 2 && (
                    <div className="text-xs mt-1">
                      {date?.spotsLeft} left
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Clock" size={20} className="mr-2 text-secondary" />
            {selectedDate ? `Time Slots for ${selectedDate?.fullDate}` : 'Select a Date First'}
          </h3>
          <div className="space-y-3">
            {selectedDate ? (
              selectedDate?.timeSlots?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotSelect(slot)}
                  disabled={!slot?.available}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                    !slot?.available
                      ? 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                      : selectedTimeSlot?.time === slot?.time
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{slot?.time}</div>
                      <div className="text-sm text-muted-foreground">{slot?.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {slot?.available ? `${slot?.spotsLeft} spots left` : 'Full'}
                      </div>
                      <div className="text-xs text-muted-foreground">{slot?.volunteers} volunteers</div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Please select a date to view available time slots</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Recurring Schedule Options */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Repeat" size={20} className="mr-2 text-secondary" />
          Recurring Schedule Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunity?.recurringOptions?.map((option, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Calendar" size={14} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{option?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{option?.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {option?.commitment} • {option?.flexibility}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Selected Schedule Summary */}
      {selectedDate && selectedTimeSlot && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="CheckCircle" size={18} className="mr-2 text-primary" />
            Your Selected Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
              <div className="font-medium text-foreground">
                {selectedDate?.fullDate} at {selectedTimeSlot?.time}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="font-medium text-foreground">{selectedTimeSlot?.duration}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="default" iconName="Calendar" iconPosition="left" className="flex-1">
              Add to Calendar
            </Button>
            <Button variant="outline" iconName="Bell" iconPosition="left" className="flex-1">
              Set Reminder
            </Button>
          </div>
        </div>
      )}
      {/* Calendar Integration */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Smartphone" size={18} className="mr-2 text-primary" />
          Calendar Integration
        </h3>
        <p className="text-muted-foreground mb-4">
          Sync your volunteer schedule with your personal calendar to never miss an opportunity to make a difference.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
            Google Calendar
          </Button>
          <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
            Outlook
          </Button>
          <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
            Apple Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;