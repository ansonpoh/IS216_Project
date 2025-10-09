import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ContactTab = ({ organization }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'volunteer'
  });

  const inquiryTypes = [
    { value: 'volunteer', label: 'Volunteer Opportunity' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'donation', label: 'Donation' },
    { value: 'media', label: 'Media Inquiry' },
    { value: 'general', label: 'General Question' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6">Get in Touch</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Address</h4>
                <p className="text-muted-foreground">{organization?.contact?.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Phone" size={20} className="text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Phone</h4>
                <p className="text-muted-foreground">{organization?.contact?.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Mail" size={20} className="text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Email</h4>
                <p className="text-muted-foreground">{organization?.contact?.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Clock" size={20} className="text-warning" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Office Hours</h4>
                <div className="text-muted-foreground">
                  {organization?.contact?.hours?.map((hour, index) => (
                    <p key={index}>{hour}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-medium text-foreground mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              {organization?.contact?.social?.map((social, index) => (
                <a
                  key={index}
                  href={social?.url}
                  className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6">Send us a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
              />
              <Select
                label="Inquiry Type"
                options={inquiryTypes}
                value={formData?.inquiryType}
                onChange={(value) => handleInputChange('inquiryType', value)}
              />
            </div>

            <Input
              label="Subject"
              type="text"
              placeholder="What's this about?"
              value={formData?.subject}
              onChange={(e) => handleInputChange('subject', e?.target?.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us more about your inquiry..."
                value={formData?.message}
                onChange={(e) => handleInputChange('message', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
            </div>

            <Button type="submit" variant="default" fullWidth iconName="Send" iconPosition="right">
              Send Message
            </Button>
          </form>
        </div>
      </div>
      {/* Map */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Find Us</h3>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={organization?.name}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${organization?.contact?.coordinates?.lat},${organization?.contact?.coordinates?.lng}&z=14&output=embed`}
          />
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-border text-center">
          <Icon name="Users" size={48} className="text-primary mx-auto mb-4" />
          <h4 className="font-semibold text-foreground mb-2">Volunteer with Us</h4>
          <p className="text-muted-foreground text-sm mb-4">
            Join our community of dedicated volunteers making a difference.
          </p>
          <Button variant="default" size="sm" fullWidth>
            Browse Opportunities
          </Button>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 border border-border text-center">
          <Icon name="Heart" size={48} className="text-secondary mx-auto mb-4" />
          <h4 className="font-semibold text-foreground mb-2">Make a Donation</h4>
          <p className="text-muted-foreground text-sm mb-4">
            Support our mission with a financial contribution.
          </p>
          <Button variant="secondary" size="sm" fullWidth>
            Donate Now
          </Button>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-border text-center">
          <Icon name="Handshake" size={48} className="text-accent mx-auto mb-4" />
          <h4 className="font-semibold text-foreground mb-2">Partner with Us</h4>
          <p className="text-muted-foreground text-sm mb-4">
            Explore partnership opportunities for greater impact.
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;