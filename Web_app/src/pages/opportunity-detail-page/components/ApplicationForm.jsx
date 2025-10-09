import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ApplicationForm = ({ opportunity, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    motivation: '',
    experience: '',
    availability: [],
    emergencyContact: '',
    backgroundCheck: false,
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAvailabilityChange = (day, checked) => {
    setFormData(prev => ({
      ...prev,
      availability: checked 
        ? [...prev?.availability, day]
        : prev?.availability?.filter(d => d !== day)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData?.motivation?.trim()) newErrors.motivation = 'Please share your motivation';
    if (formData?.availability?.length === 0) newErrors.availability = 'Please select your availability';
    if (!formData?.terms) newErrors.terms = 'You must agree to the terms';
    if (opportunity?.backgroundCheck && !formData?.backgroundCheck) {
      newErrors.backgroundCheck = 'Background check consent is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onSubmit(formData);
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Apply for Opportunity</h2>
              <p className="text-muted-foreground mt-1">{opportunity?.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="User" size={18} className="mr-2 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData?.firstName}
                onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                error={errors?.firstName}
                required
              />
              <Input
                label="Last Name"
                type="text"
                value={formData?.lastName}
                onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                error={errors?.lastName}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Email Address"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
              />
            </div>
          </div>

          {/* Motivation */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Heart" size={18} className="mr-2 text-secondary" />
              Tell Us About Yourself
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Why are you interested in this opportunity? *
                </label>
                <textarea
                  value={formData?.motivation}
                  onChange={(e) => handleInputChange('motivation', e?.target?.value)}
                  placeholder="Share what motivates you to volunteer for this cause..."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground placeholder-muted-foreground resize-none ${
                    errors?.motivation ? 'border-destructive' : 'border-border'
                  }`}
                />
                {errors?.motivation && (
                  <p className="text-sm text-destructive mt-1">{errors?.motivation}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Relevant Experience (Optional)
                </label>
                <textarea
                  value={formData?.experience}
                  onChange={(e) => handleInputChange('experience', e?.target?.value)}
                  placeholder="Share any relevant experience or skills..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground resize-none"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Calendar" size={18} className="mr-2 text-accent" />
              Availability
            </h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Which days are you typically available? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']?.map((day) => (
                  <Checkbox
                    key={day}
                    label={day}
                    checked={formData?.availability?.includes(day)}
                    onChange={(e) => handleAvailabilityChange(day, e?.target?.checked)}
                  />
                ))}
              </div>
              {errors?.availability && (
                <p className="text-sm text-destructive mt-2">{errors?.availability}</p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <Input
              label="Emergency Contact"
              type="text"
              value={formData?.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
              placeholder="Name and phone number"
              description="Required for safety purposes"
            />
          </div>

          {/* Agreements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="Shield" size={18} className="mr-2 text-warning" />
              Agreements & Consent
            </h3>
            
            {opportunity?.backgroundCheck && (
              <Checkbox
                label="I consent to a background check"
                description="Required for this position to ensure community safety"
                checked={formData?.backgroundCheck}
                onChange={(e) => handleInputChange('backgroundCheck', e?.target?.checked)}
                error={errors?.backgroundCheck}
              />
            )}
            
            <Checkbox
              label="I agree to the terms and conditions"
              description="By checking this box, you agree to our volunteer guidelines and policies"
              checked={formData?.terms}
              onChange={(e) => handleInputChange('terms', e?.target?.checked)}
              error={errors?.terms}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <Button
              type="submit"
              variant="default"
              size="lg"
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
              className="flex-1"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;