import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";

const slides = [
  { image: "https://picsum.photos/seed/1/800/480", caption: "Member review: Love this!", alt: "review 1" },
  { image: "https://picsum.photos/seed/2/800/480", caption: "New product spotlight", alt: "spotlight 2" },
  { image: "https://picsum.photos/seed/3/800/480", caption: "Community event highlights", alt: "event 3" },
];

const CommunitySpotlight = ({ slides = [], interval = 4000 }) => {
  const id = "communityCarousel-" + Math.random().toString(36).slice(2, 9);

  return (
    <div className="card mb-3 h-100">
      <div className="card-body d-flex flex-column">
        <h6 className="mb-2 text-center fs-2">Community Spotlight</h6>
        <p className="small text-muted text-center mb-3">
          Share the joy! Highlight memorable moments from your volunteering experiences.
        </p>
        <div className="mb-3">
          <div
            id={id}
            className="carousel slide"
            data-bs-ride={slides.length > 1 ? "carousel" : undefined}
            data-bs-interval={interval}
          >
            <div className="carousel-inner">
              {slides.length === 0 && (
                <div className="carousel-item active">
                  <div className="d-flex align-items-center justify-content-center" style={{ height: "300px", background: "#f0f0f0" }}>
                    <small className="text-muted">No spotlight images yet</small>
                  </div>
                </div>
              )}
              {slides.map((s, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <img
                    src={s.image}
                    className="d-block w-100"
                    alt={s.alt || `slide-${i + 1}`}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  {s.caption && (
                    <div className="carousel-caption d-none d-md-block">
                      <small>{s.caption}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {slides.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PostModal = ({ post, onClose, onLike }) => {
  if (!post) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-0">
            <div className="row g-0">
              {/* Left side - Image */}
              <div className="col-lg-7 bg-dark d-flex align-items-center justify-content-center">
                {post.img ? (
                  <img 
                    src={post.img} 
                    alt={post.subject}
                    className="img-fluid"
                    style={{ maxHeight: "70vh", objectFit: "contain" }}
                  />
                ) : (
                  <div className="text-white p-5">
                    <i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
                    <p className="mt-3">No image available</p>
                  </div>
                )}
              </div>

              {/* Right side - Details */}
              <div className="col-lg-5">
                <div className="p-4">
                  {/* User info */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                         style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                      {post.user_id?.substring(0, 1).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h6 className="mb-0">{post.user_id || "Anonymous"}</h6>
                      <small className="text-muted">
                        {new Date(post.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {/* Post content */}
                  <h5 className="mb-3">{post.subject}</h5>
                  <p className="text-muted mb-4">{post.body}</p>

                  {/* Actions */}
                  <div className="d-flex gap-2 mb-4">
                    <button 
                      className={`btn ${post.isLiked ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
                      onClick={() => onLike(post.feedback_id)}
                    >
                      <i className={`bi ${post.isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      <span>{post.liked_count || 0}</span>
                    </button>
                  </div>

                  {/* Event/Org info if available */}
                  {(post.event_id || post.org_id) && (
                    <div className="border-top pt-3">
                      <small className="text-muted">
                        {post.event_id && <div>Event ID: {post.event_id}</div>}
                        {post.org_id && <div>Organization ID: {post.org_id}</div>}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ForumPage() {
  // Example posts for testing
  const examplePosts = [
    {
      feedback_id: "test-1",
      subject: "Amazing Beach Cleanup Experience!",
      body: "Had an incredible time volunteering at East Coast Park today. Our team collected over 50kg of trash and met so many wonderful people. The sunrise was breathtaking and made the early morning wake-up totally worth it!",
      img: "https://picsum.photos/seed/beach1/800/600",
      user_id: "volunteer_sarah",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      liked_count: 24,
      isLiked: false
    },
    {
      feedback_id: "test-2",
      subject: "Teaching Kids at Community Center",
      body: "Spent my Saturday teaching art to underprivileged children at Yishun Community Center. Their creativity and enthusiasm were so inspiring! One kid made the most beautiful painting of her family. These moments remind me why I volunteer.",
      img: "https://picsum.photos/seed/kids1/800/600",
      user_id: "volunteer_marcus",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      liked_count: 18,
      isLiked: false
    },
    {
      feedback_id: "test-3",
      subject: "Senior Care Home Visit",
      body: "Visited Sunshine Senior Care Home and played board games with the elderly residents. Mr. Tan shared stories from his childhood in kampong days. Such precious memories and wisdom to learn from our seniors!",
      img: "https://picsum.photos/seed/seniors1/800/600",
      user_id: "volunteer_priya",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      liked_count: 31,
      isLiked: false
    },
    {
      feedback_id: "test-4",
      subject: "Animal Shelter Volunteering",
      body: "Spent the day at Happy Paws Animal Shelter helping to bathe and walk the rescue dogs. These furry friends deserve so much love! If you're looking for a new companion, please consider adoption. They're all angels waiting for their forever homes.",
      img: "https://picsum.photos/seed/dogs1/800/600",
      user_id: "volunteer_alex",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      liked_count: 42,
      isLiked: false
    },
    {
      feedback_id: "test-5",
      subject: "Food Bank Distribution Day",
      body: "Helped pack and distribute food supplies to 150 families today at the community food bank. Every smile and thank you made the hard work worthwhile. Together we can fight food insecurity in our community!",
      img: "https://picsum.photos/seed/food1/800/600",
      user_id: "volunteer_jenny",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      liked_count: 27,
      isLiked: false
    }
  ];

  const [posts, setPosts] = useState(examplePosts);
  const [filteredPosts, setFilteredPosts] = useState(examplePosts);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, likes
  const [selectedPost, setSelectedPost] = useState(null);

  // Get current user ID from session storage
  const getCurrentUserId = () => {
    try {
      const authData = sessionStorage.getItem("auth");
      if (authData) {
        const { id } = JSON.parse(authData);
        return id;
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
    return null;
  };

  // Fetch posts from backend API (commented out for testing with example posts)
  useEffect(() => {
    // Uncomment this when backend is ready
    // fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/feedback');
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to fetch posts');

      // Check which posts the current user has liked
      const userId = getCurrentUserId();
      const postsWithLikes = data.map(post => ({
        ...post,
        isLiked: false
      }));

      if (userId) {
        await checkUserLikes(postsWithLikes, userId);
      } else {
        setPosts(postsWithLikes);
        setFilteredPosts(postsWithLikes);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  };

  const checkUserLikes = async (posts, userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/feedback/likes/${userId}`);
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to fetch likes');

      const likedPostIds = new Set(data.map(like => like.feedback_id));
      
      const updatedPosts = posts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post.feedback_id)
      }));

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error("Error checking user likes:", err);
      setPosts(posts);
      setFilteredPosts(posts);
    }
  };

  // Handle like/unlike
  const handleLike = async (postId) => {
    const userId = getCurrentUserId();
    
    if (!userId) {
      alert("Please sign in to like posts");
      return;
    }

    try {
      const post = posts.find(p => p.feedback_id === postId);
      
      if (post.isLiked) {
        // Unlike
        const response = await fetch('http://localhost:3001/api/feedback/unlike', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback_id: postId, user_id: userId })
        });

        if (!response.ok) throw new Error('Failed to unlike post');

        updatePostLikeState(postId, false, -1);
      } else {
        // Like
        const response = await fetch('http://localhost:3001/api/feedback/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback_id: postId, user_id: userId })
        });

        if (!response.ok) throw new Error('Failed to like post');

        updatePostLikeState(postId, true, 1);
      }
    } catch (err) {
      console.error("Error handling like:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  const updatePostLikeState = (postId, isLiked, countChange) => {
    const updatePosts = (postsList) => postsList.map(post => 
      post.feedback_id === postId 
        ? { ...post, isLiked, liked_count: (post.liked_count || 0) + countChange }
        : post
    );

    setPosts(prev => updatePosts(prev));
    setFilteredPosts(prev => updatePosts(prev));
    
    if (selectedPost?.feedback_id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        isLiked,
        liked_count: (prev.liked_count || 0) + countChange
      }));
    }
  };

  // Handle search
  useEffect(() => {
    let result = [...posts];

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(post => 
        post.subject?.toLowerCase().includes(lowerQuery) ||
        post.body?.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply sorting
    if (sortBy === "date") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "likes") {
      result.sort((a, b) => (b.liked_count || 0) - (a.liked_count || 0));
    }

    setFilteredPosts(result);
  }, [query, sortBy, posts]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light">
      <Navbar />

      <div className="container py-4 flex-grow-1">
        {/* Spotlight carousel */}
        <div className="col-lg-12 mb-4">
          <CommunitySpotlight slides={slides} interval={4500} />
        </div>

        {/* Header with search and controls */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
          <h3 className="mb-0">Share the Joy</h3>

          <div className="d-flex gap-2 flex-wrap">
            {/* Search */}
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search posts..."
              style={{ width: 220 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Sort dropdown */}
            <select 
              className="form-select form-select-sm"
              style={{ width: 160 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="likes">Sort by Likes</option>
            </select>

            {/* New post button */}
            <a href="/community/new-discussion" className="btn btn-primary btn-sm">
              <i className="bi bi-plus-circle me-1"></i>
              Add Post
            </a>
          </div>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              {query ? "No posts found matching your search." : "No posts yet. Be the first to share!"}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredPosts.map((post) => (
              <div key={post.feedback_id} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPost(post)}
                >
                  {post.img && (
                    <img 
                      src={post.img} 
                      className="card-img-top" 
                      alt={post.subject}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{post.subject}</h5>
                    <p className="card-text text-muted small">
                      {post.body?.substring(0, 100)}
                      {post.body?.length > 100 && "..."}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {new Date(post.created_at).toLocaleDateString()}
                      </small>
                      <button 
                        className={`btn btn-sm ${post.isLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.feedback_id);
                        }}
                      >
                        <i className={`bi ${post.isLiked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                        {post.liked_count || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
        />
      )}
    </div>
  );
}