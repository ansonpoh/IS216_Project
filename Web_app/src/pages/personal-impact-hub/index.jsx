import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ImpactMetricsCard from './components/ImpactMetricsCard';
import SkillProgressCard from './components/SkillProgressCard';
import AchievementBadges from './components/AchievementBadges';
import RecentActivities from './components/RecentActivities';
import ImpactChart from './components/ImpactChart';
import UpcomingOpportunities from './components/UpcomingOpportunities';
import MentorshipCard from './components/MentorshipCard';
import SocialShareCard from './components/SocialShareCard';

const PersonalImpactHub = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Mock data for impact metrics
  const impactMetrics = [
    {
      icon: "Clock",
      value: "156",
      label: "Total Hours",
      growth: "12"
    },
    {
      icon: "Calendar",
      value: "23",
      label: "Events Attended",
      growth: "3"
    },
    {
      icon: "Users",
      value: "8",
      label: "People Helped",
      growth: "2"
    }
  ];

  // Mock data for skills development
  const skillsData = [
    {
      name: "Community Outreach",
      icon: "Users",
      level: "Advanced",
      progress: 85,
      hoursSpent: 45
    },
    {
      name: "Event Planning",
      icon: "Calendar",
      level: "Intermediate",
      progress: 65,
      hoursSpent: 32
    },
    {
      name: "Fundraising",
      icon: "DollarSign",
      level: "Beginner",
      progress: 30,
      hoursSpent: 18
    },
    {
      name: "Public Speaking",
      icon: "Mic",
      level: "Intermediate",
      progress: 55,
      hoursSpent: 25
    }
  ];

  // Mock data for achievements
  const achievementsData = [
    {
      icon: "Heart",
      title: "First Timer",
      description: "Complete first volunteer activity",
      earned: true,
      earnedDate: "Jan 2024"
    },
    {
      icon: "Clock",
      title: "Time Keeper",
      description: "Log 50+ volunteer hours",
      earned: true,
      earnedDate: "Mar 2024"
    },
    {
      icon: "Users",
      title: "Team Player",
      description: "Participate in 10+ group events",
      earned: true,
      earnedDate: "Aug 2024"
    },
    {
      icon: "Star",
      title: "Rising Star",
      description: "Receive 5+ positive reviews",
      earned: false,
      earnedDate: null
    },
    {
      icon: "Crown",
      title: "Leader",
      description: "Lead a volunteer project",
      earned: false,
      earnedDate: null
    },
    {
      icon: "Award",
      title: "Champion",
      description: "Complete 100+ volunteer hours",
      earned: true,
      earnedDate: "Sep 2024"
    },
    {
      icon: "Zap",
      title: "Mentor",
      description: "Guide 3+ new volunteers",
      earned: false,
      earnedDate: null
    },
    {
      icon: "Target",
      title: "Goal Crusher",
      description: "Achieve monthly goals 6 times",
      earned: false,
      earnedDate: null
    }
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      type: "volunteer",
      title: "Food Bank Distribution",
      description: "Helped distribute meals to 150+ families in downtown community center",
      timeAgo: "2 days ago",
      hours: 4,
      location: "Downtown Community Center",
      organization: "City Food Bank"
    },
    {
      type: "skill",
      title: "Event Planning Workshop",
      description: "Completed advanced workshop on organizing large-scale community events",
      timeAgo: "5 days ago",
      hours: 2,
      location: "Online",
      organization: "Volunteer Skills Academy"
    },
    {
      type: "mentor",
      title: "New Volunteer Orientation",
      description: "Mentored 3 new volunteers during their first community service experience",
      timeAgo: "1 week ago",
      hours: 3,
      location: "Community Center",
      organization: "VolunteerConnect"
    },
    {
      type: "achievement",
      title: "100 Hours Milestone",
      description: "Reached 100+ volunteer hours and earned the Champion badge",
      timeAgo: "2 weeks ago",
      hours: null,
      location: null,
      organization: "VolunteerConnect"
    }
  ];

  // Mock data for impact chart
  const chartData = [
    { month: 'Apr', hours: 12, events: 2 },
    { month: 'May', hours: 18, events: 3 },
    { month: 'Jun', hours: 25, events: 4 },
    { month: 'Jul', hours: 22, events: 3 },
    { month: 'Aug', hours: 35, events: 6 },
    { month: 'Sep', hours: 44, events: 7 }
  ];

  // Mock data for upcoming opportunities
  const upcomingOpportunities = [
    {
      title: "Beach Cleanup Initiative",
      description: "Join us for a morning of environmental conservation at Sunset Beach. Help remove plastic waste and protect marine life while connecting with fellow eco-warriors.",
      organizationName: "Ocean Guardians",
      organizationLogo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center",
      date: "Oct 15, 2024",
      duration: "3 hours",
      location: "Sunset Beach",
      matchScore: 92
    },
    {
      title: "Senior Center Tech Support",
      description: "Help elderly community members learn to use smartphones and tablets. Share your tech skills while building meaningful intergenerational connections.",
      organizationName: "Golden Years Community",
      organizationLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&crop=center",
      date: "Oct 18, 2024",
      duration: "2 hours",
      location: "Senior Center",
      matchScore: 88
    },
    {
      title: "Community Garden Project",
      description: "Help establish a new community garden that will provide fresh produce to local families. Perfect for those who love working outdoors and sustainable living.",
      organizationName: "Green Neighborhoods",
      organizationLogo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop&crop=center",
      date: "Oct 22, 2024",
      duration: "4 hours",
      location: "Community Park",
      matchScore: 85
    }
  ];

  // Mock data for mentorship
  const mentorshipData = {
    mentees: [
      {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        experience: "New volunteer",
        sessions: 3
      },
      {
        name: "Mike Chen",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        experience: "2 months experience",
        sessions: 5
      }
    ],
    leadershipOpportunities: [
      {
        title: "Event Coordinator",
        description: "Lead the planning and execution of our annual community fundraising gala",
        impact: "High",
        teamSize: 8,
        commitment: "3 months"
      },
      {
        title: "Volunteer Team Lead",
        description: "Manage and coordinate a team of 12 volunteers for weekly food distribution",
        impact: "Medium",
        teamSize: 12,
        commitment: "6 months"
      }
    ]
  };

  // Mock data for social sharing milestones
  const sharingMilestones = [
    {
      icon: "Award",
      title: "100 Hours Champion",
      description: "Completed 100+ volunteer hours making a difference in the community",
      achievedDate: "Sep 15, 2024",
      impact: "150+ people helped",
      shareText: "Proud to have contributed 100+ hours to making our community stronger! 💪"
    },
    {
      icon: "Users",
      title: "Team Player Badge",
      description: "Participated in 10+ group volunteer events",
      achievedDate: "Aug 22, 2024",
      impact: "10 events completed",
      shareText: "Teamwork makes the dream work! Just earned my Team Player badge! 🤝"
    },
    {
      icon: "Heart",
      title: "Community Impact",
      description: "Helped serve 500+ meals at local food bank",
      achievedDate: "Sep 8, 2024",
      impact: "500+ meals served",
      shareText: "Every meal matters! Grateful to have helped serve 500+ meals to families in need! 🍽️"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Your Impact Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Track your volunteer journey, celebrate achievements, and discover new ways to make a difference
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">156</div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">23</div>
                  <div className="text-sm text-muted-foreground">Events</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">6</div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/ai-chat-interface">
              <Button variant="outline" size="sm">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Find Opportunities
              </Button>
            </Link>
            <Link to="/interactive-map-dashboard">
              <Button variant="outline" size="sm">
                <Icon name="Map" size={16} className="mr-2" />
                Explore Map
              </Button>
            </Link>
            <Link to="/community-feed">
              <Button variant="outline" size="sm">
                <Icon name="Users" size={16} className="mr-2" />
                Community Feed
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Log Activity
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Export Report
            </Button>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Impact Metrics */}
              <ImpactMetricsCard metrics={impactMetrics} />
              
              {/* Impact Chart */}
              <ImpactChart chartData={chartData} />
              
              {/* Recent Activities */}
              <RecentActivities activities={recentActivities} />
              
              {/* Mentorship Card */}
              <MentorshipCard mentorshipData={mentorshipData} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills Progress */}
              <SkillProgressCard skills={skillsData} />
              
              {/* Achievement Badges */}
              <AchievementBadges achievements={achievementsData} />
              
              {/* Upcoming Opportunities */}
              <UpcomingOpportunities opportunities={upcomingOpportunities} />
              
              {/* Social Share Card */}
              <SocialShareCard milestones={sharingMilestones} />
            </div>
          </div>

          {/* Bottom Section - Goals & Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Goals */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Monthly Goals</h2>
                <Icon name="Target" size={20} className="text-primary" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Volunteer Hours</span>
                    <span className="text-sm text-muted-foreground">12/20 hours</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-3/5"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Events Attended</span>
                    <span className="text-sm text-muted-foreground">2/4 events</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-secondary to-warning h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">New Skills</span>
                    <span className="text-sm text-muted-foreground">1/2 skills</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-warning to-error h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" fullWidth className="mt-4">
                <Icon name="Settings" size={16} className="mr-2" />
                Adjust Goals
              </Button>
            </div>

            {/* AI Insights */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">AI Insights</h2>
                <Icon name="Brain" size={20} className="text-secondary" />
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">Peak Performance</div>
                      <div className="text-xs text-muted-foreground">
                        You're most active on weekends. Consider booking more Saturday events!
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                  <div className="flex items-start space-x-2">
                    <Icon name="BookOpen" size={16} className="text-secondary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">Skill Recommendation</div>
                      <div className="text-xs text-muted-foreground">
                        Based on your interests, try "Grant Writing" to expand your impact.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex items-start space-x-2">
                    <Icon name="Users" size={16} className="text-warning mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">Network Growth</div>
                      <div className="text-xs text-muted-foreground">
                        Connect with 3 more volunteers to unlock the "Connector" badge.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" fullWidth className="mt-4">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Chat with AI Coach
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalImpactHub;