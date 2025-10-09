import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { value: 'education', label: 'Education & Literacy', icon: 'BookOpen' },
    { value: 'environment', label: 'Environment & Conservation', icon: 'Leaf' },
    { value: 'healthcare', label: 'Healthcare & Wellness', icon: 'Heart' },
    { value: 'community', label: 'Community Development', icon: 'Users' },
    { value: 'seniors', label: 'Senior Care', icon: 'UserCheck' },
    { value: 'youth', label: 'Youth & Children', icon: 'Baby' },
    { value: 'animals', label: 'Animal Welfare', icon: 'Dog' },
    { value: 'disaster', label: 'Disaster Relief', icon: 'Shield' },
    { value: 'food', label: 'Food & Nutrition', icon: 'Apple' },
    { value: 'housing', label: 'Housing & Homelessness', icon: 'Home' }
  ];

  const timeCommitments = [
    { value: 'one-time', label: 'One-time Event' },
    { value: 'weekly', label: 'Weekly Commitment' },
    { value: 'monthly', label: 'Monthly Commitment' },
    { value: 'flexible', label: 'Flexible Schedule' }
  ];

  const skills = [
    { value: 'teaching', label: 'Teaching & Mentoring' },
    { value: 'technology', label: 'Technology & IT' },
    { value: 'marketing', label: 'Marketing & Communications' },
    { value: 'fundraising', label: 'Fundraising & Events' },
    { value: 'administration', label: 'Administration & Office' },
    { value: 'manual', label: 'Manual Labor & Construction' },
    { value: 'creative', label: 'Creative & Arts' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'legal', label: 'Legal & Professional' },
    { value: 'language', label: 'Language & Translation' }
  ];

  const handleCategoryChange = (category, checked) => {
    const newCategories = checked 
      ? [...localFilters?.categories, category]
      : localFilters?.categories?.filter(c => c !== category);
    
    const newFilters = { ...localFilters, categories: newCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSkillChange = (skill, checked) => {
    const newSkills = checked 
      ? [...localFilters?.skills, skill]
      : localFilters?.skills?.filter(s => s !== skill);
    
    const newFilters = { ...localFilters, skills: newSkills };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTimeCommitmentChange = (value) => {
    const newFilters = { ...localFilters, timeCommitment: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRemoteChange = (checked) => {
    const newFilters = { ...localFilters, remote: checked ? true : null };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      timeCommitment: '',
      skills: [],
      remote: null
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return localFilters?.categories?.length + 
           localFilters?.skills?.length + 
           (localFilters?.timeCommitment ? 1 : 0) + 
           (localFilters?.remote !== null ? 1 : 0);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <Button
          variant="default"
          size="sm"
          onClick={onToggle}
          iconName="Filter"
          iconPosition="left"
          className="shadow-lg"
        >
          Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>
      </div>
      {/* Sidebar */}
      <div className={`fixed lg:relative top-0 left-0 h-full w-80 bg-card border-r border-border z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={20} />
              <h2 className="text-lg font-semibold">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                disabled={getActiveFilterCount() === 0}
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="lg:hidden"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
              <div className="space-y-2">
                {categories?.map((category) => (
                  <Checkbox
                    key={category?.value}
                    label={
                      <div className="flex items-center space-x-2">
                        <Icon name={category?.icon} size={16} />
                        <span>{category?.label}</span>
                      </div>
                    }
                    checked={localFilters?.categories?.includes(category?.value)}
                    onChange={(e) => handleCategoryChange(category?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            {/* Time Commitment */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Time Commitment</h3>
              <Select
                options={[
                  { value: '', label: 'Any time commitment' },
                  ...timeCommitments
                ]}
                value={localFilters?.timeCommitment}
                onChange={handleTimeCommitmentChange}
                placeholder="Select time commitment"
              />
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Skills Needed</h3>
              <div className="space-y-2">
                {skills?.map((skill) => (
                  <Checkbox
                    key={skill?.value}
                    label={skill?.label}
                    checked={localFilters?.skills?.includes(skill?.value)}
                    onChange={(e) => handleSkillChange(skill?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            {/* Remote Options */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Location Type</h3>
              <div className="space-y-2">
                <Checkbox
                  label="Remote/Virtual opportunities"
                  checked={localFilters?.remote === true}
                  onChange={(e) => handleRemoteChange(e?.target?.checked)}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Quick Stats</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Total Opportunities:</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Organizations:</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span>This Week:</span>
                  <span className="font-medium">34 new</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="default"
              fullWidth
              onClick={onToggle}
              className="lg:hidden"
            >
              Apply Filters
            </Button>
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

export default FilterSidebar;