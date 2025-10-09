import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PostCard from './components/PostCard';
import FilterBar from './components/FilterBar';
import CreatePostModal from './components/CreatePostModal';
import StoryHighlights from './components/StoryHighlights';
import CommunityStats from './components/CommunityStats';
import TrendingTopics from './components/TrendingTopics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    contentType: 'all',
    location: 'all',
    organization: 'all',
    timeRange: 'all'
  });

  // Mock data
  const mockPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face",
        verified: true,
        badge: "Top Volunteer"
      },
      content: `Just completed my 100th hour volunteering at the Downtown Food Bank! 🎉\n\nWhat started as a one-time commitment has become such a meaningful part of my life. Today we served over 200 families and I got to help train three new volunteers.\n\nThe impact we're making together is incredible - seeing families get the support they need never gets old. Thank you to everyone who makes this possible!`,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: "Downtown Food Bank",
      likes: 47,
      shares: 12,
      isLiked: false,
      tags: ["foodbank", "milestone", "community", "volunteer"],
      metrics: [
        { value: "100", label: "Hours" },
        { value: "200", label: "Families" },
        { value: "3", label: "Trained" }
      ],
      comments: [
        {
          id: 1,
          author: {
            name: "Mike Rodriguez",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
          },
          content: "Congratulations Sarah! Your dedication is inspiring. I\'d love to join you next time!",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 2,
          author: {
            name: "Emma Thompson",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
          },
          content: "Amazing work! The food bank is lucky to have you. 💪",
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "David Park",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
        verified: false,
        badge: "New Volunteer"
      },
      content: `Had my first experience with Habitat for Humanity yesterday and WOW! 🏠\n\nI was nervous about not having construction experience, but the team was so welcoming and patient. Spent the day learning how to frame walls and actually contributed to building someone's future home.\n\nMeeting the family who will live there made it all so real. Can't wait to go back next weekend!`,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      location: "Riverside Community",
      likes: 23,
      shares: 5,
      isLiked: true,
      tags: ["habitat", "construction", "firsttime", "housing"],
      comments: [
        {
          id: 3,
          author: {
            name: "Lisa Johnson",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face"
          },
          content: "Welcome to the Habitat family! It\'s addictive in the best way 😊",
          timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 3,
      author: {
        name: "Maria Gonzalez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face",
        verified: true,
        badge: "Team Leader"
      },
      content: `🌟 OPPORTUNITY ALERT 🌟\n\nThe Annual Community Garden Cleanup is happening this Saturday, March 30th from 9 AM - 3 PM!\n\nWe need 50 volunteers to help prepare our community garden for spring planting. Tasks include:\n• Clearing winter debris\n• Preparing soil beds\n• Painting garden signs\n• Setting up new composting area\n\nLunch provided! Perfect for families, groups, or solo volunteers. All skill levels welcome.\n\nWho's in? Comment below or DM me! 🌱`,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: "Riverside Community Garden",
      likes: 31,
      shares: 18,
      isLiked: false,
      tags: ["gardening", "cleanup", "opportunity", "community", "families"],
      comments: [
        {
          id: 4,
          author: {
            name: "Tom Wilson",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
          },
          content: "Count me and my kids in! They love gardening activities.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          id: 5,
          author: {
            name: "Jennifer Lee",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=32&h=32&fit=crop&crop=face"
          },
          content: "I can bring my team from work! We\'ve been looking for a group activity.",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 4,
      author: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face",
        verified: true,
        badge: "Ambassador"
      },
      content: `Incredible news from our literacy program! 📚✨\n\nAfter 6 months of weekly tutoring sessions, my student Jamie just passed their GED exam! Watching their confidence grow week by week has been the most rewarding experience.\n\nThis is why I volunteer - these moments when education truly changes someone's life path. Jamie is now planning to enroll in community college next fall.\n\nShoutout to the amazing team at Learning Center who make these transformations possible every day!`,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      location: "Community Learning Center",
      likes: 89,
      shares: 24,
      isLiked: true,
      tags: ["education", "literacy", "tutoring", "success", "GED"],
      metrics: [
        { value: "6", label: "Months" },
        { value: "1", label: "GED Pass" },
        { value: "24", label: "Sessions" }
      ],
      comments: [
        {
          id: 6,
          author: {
            name: "Rachel Green",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
          },
          content: "This is absolutely amazing! Education really does change lives. Congratulations to both you and Jamie! 🎉",
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000)
        }
      ]
    }
  ];

  const mockHighlights = [
    {
      id: 1,
      author: {
        name: "Community Team",
        avatar: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=40&h=40&fit=crop&crop=face"
      },
      organization: "Red Cross",
      excerpt: "Emergency response team mobilized within 2 hours to help flood victims. 150 families received immediate assistance including food, water, and temporary shelter.",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop",
      likes: 156,
      comments: 23,
      impact: "150 families helped"
    },
    {
      id: 2,
      author: {
        name: "Youth Mentors",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
      },
      organization: "Boys & Girls Club",
      excerpt: "Our mentorship program graduates 25 students this year! 100% college acceptance rate and $2.3M in scholarships earned. Proud of these amazing young leaders.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop",
      likes: 203,
      comments: 45,
      impact: "25 graduates"
    },
    {
      id: 3,
      author: {
        name: "Green Team",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      },
      organization: "Environmental Alliance",
      excerpt: "Beach cleanup success! 500 volunteers removed 2 tons of debris from our coastline. Marine life protection in action with measurable impact.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop",
      likes: 178,
      comments: 31,
      impact: "2 tons removed"
    }
  ];

  const mockStats = {
    activeVolunteers: "2,847",
    hoursThisMonth: "12,456",
    livesImpacted: "8,923",
    organizations: "156"
  };

  const mockTrendingTopics = [
    { tag: "foodbank", posts: 45, engagement: "high", trend: "up" },
    { tag: "education", posts: 38, engagement: "high", trend: "up" },
    { tag: "environment", posts: 32, engagement: "medium", trend: "stable" },
    { tag: "housing", posts: 28, engagement: "high", trend: "up" },
    { tag: "healthcare", posts: 24, engagement: "medium", trend: "down" },
    { tag: "seniors", posts: 19, engagement: "low", trend: "stable" }
  ];

  // Initialize posts
  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  // Infinite scroll handler
  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPosts = mockPosts?.map(post => ({
        ...post,
        id: post?.id + (page * 10),
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
      setLoading(false);
      
      if (page >= 3) {
        setHasMore(false);
      }
    }, 1000);
  }, [loading, hasMore, page]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement?.scrollTop 
          >= document.documentElement?.offsetHeight - 1000) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        contentType: 'all',
        location: 'all',
        organization: 'all',
        timeRange: 'all'
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  // Post interaction handlers
  const handleLike = (postId) => {
    setPosts(prev => prev?.map(post => 
      post?.id === postId 
        ? { 
            ...post, 
            isLiked: !post?.isLiked,
            likes: post?.isLiked ? post?.likes - 1 : post?.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId, comment) => {
    const newComment = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
      },
      content: comment,
      timestamp: new Date()
    };

    setPosts(prev => prev?.map(post => 
      post?.id === postId 
        ? { ...post, comments: [...post?.comments, newComment] }
        : post
    ));
  };

  const handleShare = (postId) => {
    // Simulate share functionality
    navigator.share?.({
      title: 'VolunteerConnect Post',
      text: 'Check out this inspiring volunteer story!',
      url: window.location?.href
    })?.catch(() => {
      // Fallback for browsers without native sharing
      navigator.clipboard?.writeText(window.location?.href);
    });
  };

  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now(),
      author: {
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face",
        verified: false,
        badge: "Community Member"
      },
      content: postData?.content,
      image: postData?.image,
      timestamp: new Date(),
      location: postData?.location,
      likes: 0,
      shares: 0,
      isLiked: false,
      tags: postData?.tags,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const handleTopicClick = (topic) => {
    setFilters(prev => ({ ...prev, contentType: 'all' }));
    // Filter posts by topic (in a real app, this would trigger an API call)
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar onToggle={() => {}} />
        
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Community Feed</h1>
              <p className="text-muted-foreground">
                Celebrate achievements, share stories, and connect with fellow volunteers making a difference.
              </p>
            </div>

            {/* Community Stats */}
            <CommunityStats stats={mockStats} />

            {/* Story Highlights */}
            <StoryHighlights 
              highlights={mockHighlights} 
              onViewAll={() => {}} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                {/* Filter Bar */}
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onCreatePost={() => setIsCreateModalOpen(true)}
                />

                {/* Posts */}
                <div className="space-y-6">
                  {posts?.map((post) => (
                    <PostCard
                      key={post?.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ))}
                </div>

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading more stories...</span>
                    </div>
                  </div>
                )}

                {/* End of Feed */}
                {!hasMore && posts?.length > 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2 text-muted-foreground">
                      <Icon name="CheckCircle" size={16} />
                      <span>You're all caught up!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back later for more inspiring stories from our community.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <TrendingTopics 
                  topics={mockTrendingTopics}
                  onTopicClick={handleTopicClick}
                />

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" fullWidth className="justify-start">
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Start AI Chat
                    </Button>
                    <Button variant="outline" size="sm" fullWidth className="justify-start">
                      <Icon name="Map" size={16} className="mr-2" />
                      Find Opportunities
                    </Button>
                    <Button variant="outline" size="sm" fullWidth className="justify-start">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      View Events
                    </Button>
                    <Button variant="outline" size="sm" fullWidth className="justify-start">
                      <Icon name="Users" size={16} className="mr-2" />
                      Join Groups
                    </Button>
                  </div>
                </div>

                {/* Community Guidelines */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="Shield" size={16} className="text-primary" />
                    <h3 className="font-semibold text-foreground">Community Guidelines</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Be respectful and supportive</li>
                    <li>• Share authentic experiences</li>
                    <li>• Protect privacy and safety</li>
                    <li>• Celebrate all contributions</li>
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto text-primary">
                    Read full guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
      {/* Floating Action Button (Mobile) */}
      <Button
        variant="default"
        size="lg"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden rounded-full w-14 h-14 p-0 shadow-lg z-40"
      >
        <Icon name="Plus" size={24} />
      </Button>
    </div>
  );
};

export default CommunityFeed;