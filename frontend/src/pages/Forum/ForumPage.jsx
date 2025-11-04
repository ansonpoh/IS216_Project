import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.js";
import FeaturedCard from "./component/FeaturedCard";
import CommunitySpotlight from "./component/CommunitySpotlight";
import Title from '../../components/ui/Title';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "../../components/Animation/PageTransition.jsx";
import NewDiscussion from "./component/NewDiscussion.jsx";
import styles from "../../styles/Community.module.css";
import { useAuth } from "../../contexts/AuthProvider.js";

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
              onClick={() => onLike(post.feedback_id, post.liked_by_user)}
            >
              <i className={`bi ${post.liked_by_user ? "bi-heart-fill" : "bi-heart"}`}></i>
              {post.like_count || 0}
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
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, likes
  const [selectedPost, setSelectedPost] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL;
  const nav = useNavigate();
  const {auth} = useAuth();
  const userId = auth?.id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/community/get_all_posts`, {params:{user_id: userId}}
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
          like_count: item.like_count,
          liked_by_user: item.liked_by_user,
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

    if(userId.length > 1) fetchPosts();
  }, []);

  // highlight fetching
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/community/get_all_highlights`
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

  const handleLike = async (feedback_id, liked) => {
    if (userId.length < 1) {
      alert("Please sign in to like posts.");
      nav("/volunteer/auth");
      return;
    } else if (auth?.role === "organiser") {
      alert("Only users can like post!");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/community/user_likes_post`, {user_id: userId, feedback_id: feedback_id, liked: liked});
      const outcome = res.data?.status;
      const isLiked = outcome === "liked";

      const safeUpdate = (list = []) => {
        if (!Array.isArray(list)) return [];
        return list.map((post) =>
          post.feedback_id === feedback_id
            ? {
                ...post,
                liked_by_user: isLiked,
                like_count: parseInt(post.like_count) + (isLiked ? 1 : -1),
              }
            : post
        );
      };
      
      setPosts((prev = []) => [...safeUpdate(prev)]);
      
      if(selectedPost?.feedback_id === feedback_id) {
        setSelectedPost((prev) => ({
          ...prev,
          liked_by_user: isLiked,
          like_count: parseInt(prev.like_count) + (isLiked ? 1 : -1),
        }))
      }
    } catch (err) {
      console.error(err);
    }
  }


  // Handle search
  useEffect(() => {
    if (!Array.isArray(posts)) return;
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
      result.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    }

    setFilteredPosts(result);
  }, [query, sortBy, posts]);

  return (
    <>
      <Navbar />
      <div className="container-fluid vh-100 d-flex flex-column page-community">
        <PageTransition>
          <div className="container py-4 flex-grow-1">
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <Title text="Share the Joy" subtitle="Connect with our community and share your volunteer experiences" />
            </div>

            {/* Spotlight Carousel */}
            <div style={{ marginBottom: '60px' }}>
              <CommunitySpotlight slides={slides} interval={4500} />
            </div>

            {/* Header with search and controls */}
            <div className={`d-flex align-items-center justify-content-between mb-4 px-4 py-3 ${styles['community-posts-header']}`}>
              {/* Left Group - Community Posts Title */}
              <h1 className={`${styles.title}`}>Community Posts</h1>

              {/* Right Group - Filters and Button */}
              <div className={styles['group-right']}>
                {/* Search and Sort */}
                <div className={styles.filtersContainer}>
                  {/* Search */}
                  <input
                    type="search"
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput} // Use CSS module for styles
                  />

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect} // Use CSS module for styles
                  >
                    <option value="date">Sort by Date</option>
                    <option value="likes">Sort by Likes</option>
                  </select>
                </div>

                {/* Add Post Button */}
                <button
                  className={styles.addPostButton} // Use CSS module for styles
                  onClick={() => nav('/community/new')}
                >
                  <span style={{ fontSize: '18px' }}>+</span>
                  <span>Add Post</span>
                </button>
              </div>
            </div>

            {/* Posts grid remains the same below... */}

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
                    : "Login to view posts!"}
                </p>
              </div>
            ) : (
              <div className={styles.postsGrid}>
                {filteredPosts.map((post) => (
                  <FeaturedCard
                    key={post.feedback_id}
                    feedback_id={post.feedback_id}
                    user_id={post.user_id}
                    username={post.username}
                    profile_picture={post.profile_image}
                    subject={post.subject}
                    body={post.body}
                    created_at={post.created_at}
                    image={post.img}
                    likes={post.like_count || 0}
                    liked_by_user={post.liked_by_user}
                    onClick={() => setSelectedPost(post)}
                  />
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
            onLike={handleLike}
          />
        )}
      </div>
    </>
  );
}
