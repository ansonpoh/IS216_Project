import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import OpportunityHero from './components/OpportunityHero';
import OpportunityTabs from './components/OpportunityTabs';
import DescriptionTab from './components/DescriptionTab';
import RequirementsTab from './components/RequirementsTab';
import ImpactStoriesTab from './components/ImpactStoriesTab';
import ReviewsTab from './components/ReviewsTab';
import ScheduleTab from './components/ScheduleTab';
import ApplicationForm from './components/ApplicationForm';
import RelatedOpportunities from './components/RelatedOpportunities';
import SocialProof from './components/SocialProof';
import Icon from '../../components/AppIcon';


const OpportunityDetailPages = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Mock opportunity data
  const opportunity = {
    id: 'food-bank-volunteer',
    title: "Food Bank Volunteer - Weekend Meal Distribution",
    shortDescription: "Help distribute nutritious meals to families in need every weekend. Join our dedicated team in making a direct impact on food insecurity in our community.",
    fullDescription: `Join our weekend meal distribution program and be part of a movement that's transforming lives one meal at a time. Every Saturday and Sunday, we serve over 300 families who rely on our food bank for nutritious meals.\n\nAs a volunteer, you'll work alongside our experienced team to sort donations, pack meal boxes, and distribute food directly to community members. This hands-on role offers immediate satisfaction as you see the direct impact of your efforts.\n\nOur food bank operates with dignity and respect at its core. We create a welcoming environment where community members feel valued and supported, not just fed. You'll learn about food insecurity issues while developing valuable skills in logistics, customer service, and community outreach.\n\nThis opportunity is perfect for individuals, families, or groups looking to make a meaningful difference. We provide all necessary training and support to ensure you feel confident and prepared in your volunteer role.`,
    heroImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
    location: "Downtown Community Center, Seattle, WA",
    timeCommitment: "4-6 hours/weekend",
    rating: 4.8,
    reviewCount: 127,
    category: "Food Security",
    organization: {
      name: "Seattle Community Food Bank",
      logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop",
      description: "For over 30 years, Seattle Community Food Bank has been fighting hunger and building community resilience through innovative programs and partnerships.",
      verified: true,
      volunteerCount: "2,500+",
      founded: "1992",
      rating: 4.9
    },
    stats: {
      volunteersNeeded: 15,
      currentVolunteers: 8,
      impactMetric: "1,200+"
    },
    highlights: [
      "Direct impact on food insecurity in your community",
      "Flexible weekend scheduling to fit your lifestyle",
      "Work with a diverse, passionate team of volunteers",
      "Comprehensive training and ongoing support provided",
      "Opportunity to develop leadership skills",
      "Family-friendly environment welcome"
    ],
    skillsGained: [
      "Community Outreach",
      "Food Safety",
      "Customer Service",
      "Team Leadership",
      "Logistics Management",
      "Cultural Sensitivity"
    ],
    requirements: {
      essential: [
        {
          title: "Physical Ability",
          description: "Ability to lift up to 25 pounds and stand for extended periods"
        },
        {
          title: "Reliable Attendance",
          description: "Commit to at least 2 weekends per month for minimum 3 months"
        },
        {
          title: "Age Requirement",
          description: "Must be 16+ years old (14-15 with adult supervision)"
        },
        {
          title: "Background Check",
          description: "Required for all volunteers working directly with vulnerable populations"
        }
      ],
      preferred: [
        "Previous volunteer experience",
        "Bilingual skills (Spanish/English)",
        "Food handling certification",
        "Customer service background",
        "Transportation to volunteer site",
        "Flexible weekend availability"
      ]
    },
    timeDetails: {
      hoursPerWeek: "8-12",
      duration: "3+ months",
      flexibility: "High",
      additionalInfo: "Weekend shifts available Saturday 8AM-2PM and Sunday 10AM-4PM. Choose one or both days based on your availability."
    },
    training: [
      {
        title: "Food Safety & Handling",
        description: "Learn proper food storage, handling, and distribution protocols"
      },
      {
        title: "Community Engagement",
        description: "Develop skills for respectful, dignified client interactions"
      },
      {
        title: "Emergency Procedures",
        description: "Safety protocols and emergency response training"
      }
    ],
    backgroundCheck: true,
    impactMetrics: [
      { value: "45,000+", label: "Meals Distributed", period: "This Year" },
      { value: "1,200+", label: "Families Served", period: "Monthly" },
      { value: "85%", label: "Client Satisfaction", period: "Latest Survey" },
      { value: "300+", label: "Active Volunteers", period: "Current" }
    ],
    volunteerStories: [
      {
        volunteer: {
          name: "Maria Rodriguez",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg",
          role: "Weekend Volunteer"
        },
        rating: 5,
        testimonial: "Volunteering at the food bank has been incredibly rewarding. Seeing the gratitude in families\' eyes when they receive fresh groceries reminds me why this work matters. The team is supportive and the training was excellent.",
        duration: "2 years",
        hoursContributed: "240+"
      },
      {
        volunteer: {
          name: "James Chen",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          role: "Team Leader"
        },
        rating: 5,
        testimonial: "What started as weekend volunteering became a passion. I\'ve grown so much personally and professionally through this experience. The organization truly values volunteers and provides amazing growth opportunities.",
        duration: "3 years",
        hoursContributed: "400+"
      }
    ],
    beneficiaryStories: [
      {
        beneficiary: "Sarah M.",
        relationship: "Single Mother of Two",
        story: "The food bank has been a lifeline for our family during tough times. The volunteers are so kind and respectful - they make you feel like family, not charity."
      },
      {
        beneficiary: "Robert T.",
        relationship: "Senior Community Member",
        story: "I look forward to my weekly visits. The volunteers remember my name and always ask about my grandchildren. It\'s more than food - it\'s community."
      }
    ],
    videoTestimonials: [
      {
        title: "Why I Volunteer - Maria\'s Story",
        thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
        speaker: "Maria Rodriguez",
        duration: "2:45"
      },
      {
        title: "Community Impact Spotlight",
        thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop",
        speaker: "Program Director",
        duration: "3:20"
      }
    ],
    ratingBreakdown: {
      5: 89,
      4: 28,
      3: 8,
      2: 2,
      1: 0
    },
    reviews: [
      {
        reviewer: {
          name: "Jennifer Walsh",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg",
          volunteerSince: "Volunteer since 2022",
          totalHours: "180"
        },
        rating: 5,
        date: "2 weeks ago",
        comment: "This is hands down the best volunteer experience I've had. The organization is well-run, the staff is supportive, and you can see the real impact of your work. I've made lasting friendships and gained valuable skills.",
        helpful: true,
        helpfulCount: 12
      },
      {
        reviewer: {
          name: "Michael Torres",avatar: "https://randomuser.me/api/portraits/men/35.jpg",volunteerSince: "Volunteer since 2021",totalHours: "320"
        },
        rating: 5,
        date: "1 month ago",comment: "Great training program and very organized operations. The team leaders are knowledgeable and always available to help. Perfect for anyone wanting to make a meaningful difference in their community.",
        helpful: true,
        helpfulCount: 8
      }
    ],
    schedule: {
      frequency: "Weekly",duration: "4-6 hours",flexibility: "High"
    },
    availableDates: [
      { day: 1, date: "2024-01-01", fullDate: "January 1, 2024", available: false, spotsLeft: 0 },
      { day: 2, date: "2024-01-02", fullDate: "January 2, 2024", available: true, spotsLeft: 5, timeSlots: [
        { time: "8:00 AM - 12:00 PM", duration: "4 hours", available: true, spotsLeft: 3, volunteers: 5 },
        { time: "12:00 PM - 4:00 PM", duration: "4 hours", available: true, spotsLeft: 2, volunteers: 6 }
      ]},
      { day: 3, date: "2024-01-03", fullDate: "January 3, 2024", available: true, spotsLeft: 8, timeSlots: [
        { time: "10:00 AM - 2:00 PM", duration: "4 hours", available: true, spotsLeft: 4, volunteers: 4 },
        { time: "2:00 PM - 6:00 PM", duration: "4 hours", available: true, spotsLeft: 4, volunteers: 4 }
      ]},
      { day: 4, date: "2024-01-04", fullDate: "January 4, 2024", available: true, spotsLeft: 6, timeSlots: [] },
      { day: 5, date: "2024-01-05", fullDate: "January 5, 2024", available: true, spotsLeft: 3, timeSlots: [] },
      { day: 6, date: "2024-01-06", fullDate: "January 6, 2024", available: true, spotsLeft: 1, timeSlots: [] },
      { day: 7, date: "2024-01-07", fullDate: "January 7, 2024", available: false, spotsLeft: 0 }
    ],
    recurringOptions: [
      {
        title: "Weekly Commitment",description: "Same day and time each week",commitment: "3+ months",flexibility: "Low"
      },
      {
        title: "Bi-weekly Rotation",description: "Every other weekend",commitment: "6+ months",flexibility: "Medium"
      },
      {
        title: "Monthly Volunteer",description: "One weekend per month",commitment: "1+ year",flexibility: "High"
      },
      {
        title: "Substitute Volunteer",description: "Fill in when needed",commitment: "Ongoing",flexibility: "Very High"
      }
    ],
    recentActivity: [
      {
        user: { name: "Alex Johnson", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
        action: "just applied for this opportunity",timestamp: "5 minutes ago",icon: "UserPlus"
      },
      {
        user: { name: "Lisa Park", avatar: "https://randomuser.me/api/portraits/women/41.jpg" },
        action: "left a 5-star review",timestamp: "2 hours ago",icon: "Star"
      },
      {
        user: { name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/38.jpg" },
        action: "completed their first volunteer shift",timestamp: "1 day ago",icon: "CheckCircle"
      }
    ],
    quickStats: {
      totalVolunteers: "2,500+",hoursContributed: "45,000+",livesImpacted: "15,000+",satisfactionRate: "98%"
    }
  };

  // Mock related opportunities
  const relatedOpportunities = [
    {
      id: 'homeless-shelter',
      title: "Homeless Shelter Evening Support",
      description: "Provide evening meals and support services to individuals experiencing homelessness in our downtown shelter.",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop",
      category: "Housing",
      location: "Downtown Seattle",
      timeCommitment: "3-4 hours/evening",
      rating: 4.7,
      reviewCount: 89,
      volunteersNeeded: 8,
      organization: {
        name: "Seattle Shelter Network",
        logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=50&h=50&fit=crop",
        verified: true
      }
    },
    {
      id: 'youth-mentoring',
      title: "Youth Mentoring Program",
      description: "Mentor at-risk youth through educational support, life skills development, and positive relationship building.",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      category: "Education",
      location: "Various Schools",
      timeCommitment: "2 hours/week",
      rating: 4.9,
      reviewCount: 156,
      volunteersNeeded: 12,
      organization: {
        name: "Youth Futures Foundation",
        logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=50&h=50&fit=crop",
        verified: true
      }
    },
    {
      id: 'environmental-cleanup',
      title: "Community Environmental Cleanup",
      description: "Join monthly cleanup events to preserve local parks, beaches, and natural spaces for future generations.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      category: "Environment",
      location: "Various Locations",
      timeCommitment: "4 hours/month",
      rating: 4.6,
      reviewCount: 73,
      volunteersNeeded: 25,
      organization: {
        name: "Green Seattle Partnership",
        logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=50&h=50&fit=crop",
        verified: true
      }
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleApply = () => {
    setIsApplicationOpen(true);
  };

  const handleApplicationSubmit = (formData) => {
    console.log('Application submitted:', formData);
    setIsApplicationOpen(false);
    setApplicationSubmitted(true);
    
    // Show success message for 5 seconds
    setTimeout(() => {
      setApplicationSubmitted(false);
    }, 5000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <DescriptionTab opportunity={opportunity} />;
      case 'requirements':
        return <RequirementsTab opportunity={opportunity} />;
      case 'impact':
        return <ImpactStoriesTab opportunity={opportunity} />;
      case 'reviews':
        return <ReviewsTab opportunity={opportunity} />;
      case 'schedule':
        return <ScheduleTab opportunity={opportunity} />;
      default:
        return <DescriptionTab opportunity={opportunity} />;
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Success Message */}
      {applicationSubmitted && (
        <div className="fixed top-20 right-4 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} />
            <span className="font-medium">Application submitted successfully!</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <OpportunityHero opportunity={opportunity} onApply={handleApply} />

      {/* Navigation Tabs */}
      <OpportunityTabs 
        opportunity={opportunity} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderTabContent()}
      </div>

      {/* Social Proof */}
      <SocialProof opportunity={opportunity} />

      {/* Related Opportunities */}
      <RelatedOpportunities opportunities={relatedOpportunities} />

      {/* Application Form Modal */}
      <ApplicationForm
        opportunity={opportunity}
        isOpen={isApplicationOpen}
        onClose={() => setIsApplicationOpen(false)}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};

export default OpportunityDetailPages;