import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.js";
import FeaturedCard from "./component/FeaturedCard";
import CommunitySpotlight from "./component/CommunitySpotlight";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "../../components/Animation/PageTransition.jsx";
import NewDiscussion from "./component/NewDiscussion.jsx";
import styles from "../../styles/Community.module.css";

const PostModal = ({ post, onClose, onLike }) => {
  if (!post) return null;

   const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles["modal-overlay"]} onClick={handleOverlayClick}>
      <div className={styles["modal-wrapper"]}>
        {/* Close button */}
        <button className={styles["modal-close"]} onClick={onClose}>
          ×
        </button>

        {/* Modal content */}
        <div className={styles["modal-content-row"]}>
          {/* Left side - Image */}
          <div className={styles["modal-left"]}>
            {post.img ? (
              <img
                src={post.img}
                alt={post.subject}
                className={styles["modal-large-image"]}
              />
            ) : (
              <div className="text-muted" style={{ textAlign: "center" }}>
                <i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
                <p className="mt-3">No image available</p>
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className={styles["modal-right"]}>
            {/* User info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#0d6efd",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  fontSize: "1.2rem",
                }}
              >
                {post.profile_image ? (
                  <img
                    src={post.profile_image}
                    alt={post.username}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  post.username?.substring(0, 1).toUpperCase() || "U"
                )}
              </div>
              <div>
                <h6 style={{ margin: 0 }}>{post.username}</h6>
                <small style={{ color: "#6c757d" }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </small>
              </div>
            </div>

            {/* Post content */}
            <h3 className={styles["modal-title"]}>{post.subject}</h3>
            <p className={styles["modal-desc"]}>{post.body}</p>

            {/* Actions */}
            <button
              className={styles["modal-signup-btn"]}
              style={{
                backgroundColor: post.isLiked ? "#0d6efd" : "#fff",
                color: post.isLiked ? "#fff" : "#0d6efd",
                border: "1px solid #0d6efd",
                
              }}
              onClick={() => onLike(post.feedback_id)}
            >
              <i className={`bi ${post.isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
              {post.liked_count || 0}
            </button>

            {/* Event/Org info */}
            {(post.event_id || post.org_id) && (
              <div style={{ marginTop: "16px", borderTop: "1px solid #ddd", paddingTop: "12px" }}>
                <small style={{ color: "#6c757d" }}>
                  {post.event_id && <div>Event ID: {post.event_id}</div>}
                  {post.org_id && <div>Organization ID: {post.org_id}</div>}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, likes
  const [selectedPost, setSelectedPost] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3001/community/get_all_posts"
        );
        const data = response.data.result || [];
        console.log("Posts data:", data);
        const normalised = data.map((item) => ({
          feedback_id: item.feedback_id,
          user_id: item.user_id,
          username: item.username || "Anonymous",
          profile_image: item.profile_image,
          subject: item.subject,
          body: item.body,
          img: item.image,
          created_at: item.created_at,
          liked_count: 0,
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

  // highlight fetching
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/community/get_all_highlights"
        );
        const data = response.data;

        if (data.result) {
          const mappedSlides = data.result.map((highlight) => ({
            image: highlight.image,
            caption: highlight.caption,
          }));
          setSlides(mappedSlides);
        }
      } catch (err) {
        console.error("Error fetching highlights:", err);
      }
    };

    fetchHighlights();
  }, []); // Empty dependency array means this runs once on mount

  // useEffect(() => {
  //   const userId = getCurrentUserId();
  //   if (userId && posts.length > 0) {
  //     checkUserLikes(posts, userId);
  //   }
  // }, [posts]); //run when posts change;

  // const checkUserLikes = async (posts, userId) => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/community/get_post_likes/${userId}`);
  //     const data = await response.json();

  //     if (!response.ok) throw new Error('Failed to fetch likes');

  //     const likedPostIds = new Set(data.map(like => like.feedback_id));

  //     const updatedPosts = posts.map(post => ({
  //       ...post,
  //       isLiked: likedPostIds.has(post.feedback_id)
  //     }));

  //     setPosts(updatedPosts);
  //     setFilteredPosts(updatedPosts);
  //   } catch (err) {
  //     console.error("Error checking user likes:", err);
  //     setPosts(posts);
  //     setFilteredPosts(posts);
  //   }
  // };

  // // Handle like/unlike
  // const handleLike = async (postId) => {
  //   const userId = getCurrentUserId();

  //   if (!userId) {
  //     alert("Please sign in to like posts");
  //     nav("/volunteer/auth");
  //     return;
  //   }

  //   try {
  //     const post = posts.find(p => p.feedback_id === postId);

  //     // Using the correct endpoint from communityRoutes.js
  //     const response = await fetch('http://localhost:3001/community/user_likes_post', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         feedback_id: postId,
  //         user_id: userId,
  //         action: post.isLiked ? 'unlike' : 'like' // Add action to determine like/unlike
  //       })
  //     });

  //     if (!response.ok) throw new Error(`Failed to ${post.isLiked ? 'unlike' : 'like'} post`);

  //     // Update local state
  //     updatePostLikeState(postId, !post.isLiked, post.isLiked ? -1 : 1);

  //   } catch (err) {
  //     console.error("Error handling like:", err);
  //     alert("Failed to update like. Please try again.");
  //   }
  // };

  // const updatePostLikeState = (postId, isLiked, countChange) => {
  //   const updatePosts = (postsList) => postsList.map(post =>
  //     post.feedback_id === postId
  //       ? { ...post, isLiked, liked_count: (post.liked_count || 0) + countChange }
  //       : post
  //   );

  //   setPosts(prev => updatePosts(prev));
  //   setFilteredPosts(prev => updatePosts(prev));

  //   if (selectedPost?.feedback_id === postId) {
  //     setSelectedPost(prev => ({
  //       ...prev,
  //       isLiked,
  //       liked_count: (prev.liked_count || 0) + countChange
  //     }));
  //   }
  // };

  // Handle search
  useEffect(() => {
    let result = [...posts];

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (post) =>
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
    <>
      <Navbar />
      <div className="container-fluid vh-100 d-flex flex-column page-community">
        <PageTransition>
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

                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => nav("/community/new")}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Post
                  </button>
                </div>
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
                  {query
                    ? "No posts found matching your search."
                    : "No posts yet. Be the first to share!"}
                </p>
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-4 justify-content-start">
                {filteredPosts.map((post) => (
                  <div
                    key={post.feedback_id}
                    style={{ flex: "1 1 300px", maxWidth: "350px" }}
                  >
                    <FeaturedCard
                      feedback_id={post.feedback_id}
                      user_id={post.user_id}
                      username={post.username}
                      profile_picture={post.profile_image}
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
        </PageTransition>

        {/* Post Modal */}
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            // onLike={handleLike}
          />
        )}
      </div>
    </>
  );
}
