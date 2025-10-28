import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import FeaturedCard from "./component/FeaturedCard";
import CommunitySpotlight from "./component/CommunitySpotlight";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const slides = [
  { image: "https://picsum.photos/seed/1/800/480", caption: "Member review: Love this!", alt: "review 1" },
  { image: "https://picsum.photos/seed/2/800/480", caption: "New product spotlight", alt: "spotlight 2" },
  { image: "https://picsum.photos/seed/3/800/480", caption: "Community event highlights", alt: "event 3" },
];

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

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, likes
  const [selectedPost, setSelectedPost] = useState(null);

  const nav = useNavigate();
  

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
        const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/community/get_all_posts');
      const responseData = await response.json();

      // Extract posts array from result property
      const data = responseData.result || [];
      console.log("Posts data:", data);

      const normalised = data.map(item => ({
        feedback_id: item.feedback_id,
        user_id: item.user_id,
        subject: item.subject,
        body: item.body,
        img: item.image, // Map 'image' field to 'img'
        created_at: item.created_at,
        liked_count: 0
      }));

      setPosts(normalised);
      setFilteredPosts(normalised);
      
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, []);
  
  

  const checkUserLikes = async (posts, userId) => {
    try {
      const response = await fetch(`http://localhost:3001/community/get_post_likes/${userId}`);
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
      nav("/volunteer/auth");
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
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredPosts.map((post) => (
              <div key={post.feedback_id} className="col">
                <FeaturedCard
                  feedback_id={post.feedback_id}
                  user_id={post.user_id}
                  subject={post.subject}
                  body={post.body}
                  created_at={post.created_at}
                  image={post.img}
                  likes={post.liked_count || 0}
                  onClick={() => setSelectedPost(post)}
                />
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