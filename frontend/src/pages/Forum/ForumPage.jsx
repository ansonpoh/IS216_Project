// forumPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // changed code
import Navbar from ".././Navbar"; // your navbar component
import FeaturedCard from "./component/FeaturedCard"; // the separate small card component
import "./component/community.css"; // optional custom CSS for small helpers
// If you use react-router, you can swap the <a> to <Link> from 'react-router-dom'
import CommunitySpotlight from "./component/CommunitySpotlight";

const slides = [
  { image: "https://picsum.photos/seed/1/800/480", caption: "Member review: Love this!", alt: "review 1" },
  { image: "https://picsum.photos/seed/2/800/480", caption: "New product spotlight", alt: "spotlight 2" },
  { image: "https://picsum.photos/seed/3/800/480", caption: "Community event highlights", alt: "event 3" },
];

export default function ForumPage() {
  const [posts, setPosts] = useState([]); // popular discussions list (from backend)
  const [featured, setFeatured] = useState([]); // featured cards on top (from backend)
  const [category, setCategory] = useState("All Categories");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // TODO: replace with your real backend calls (axios / fetch)
    // Example (uncomment and adapt):
    // fetch("/api/forums/featured")
    //   .then((res) => res.json())
    //   .then((data) => setFeatured(data))
    //   .catch((err) => console.error(err));
    //
    // fetch("/api/forums/popular")
    //   .then((res) => res.json())
    //   .then((data) => setPosts(data))
    //   .catch((err) => console.error(err));

    // Temporary placeholder sample data so layout renders:
    setFeatured([
      {
        id: 1,
        image: null,
        title: "Coming soon: A brand new seller Community Hub",
        excerpt: "Hello, everyone! I'm Vero and I have the joy of leading Etsy's Community En...",
        author: "VeroCraftsCommunity",
        likes: 117,
        comments: 1,
      },
      {
        id: 2,
        image: null,
        title: "Community Newsletter: October 9, 2025",
        excerpt: "Discover Upcoming Seller",
        likes: 168,
        comments: 0,
      },
      {
        id: 3,
        image: null,
        title: "Etsy Up: Watch the replay and see what's next.",
        excerpt: "Thanks for tuning in to Etsy Up! We hope you enjoyed this year's event...",
        author: "Iridesent",
        likes: 38,
        comments: 0,
      },
    ]);

    setPosts([
      {
        id: 101,
        title: "$47 Dollar Offsite Fee?",
        snippet: "Question about offsite fee billing and how it's applied to my orders...",
        author: "TechUpCycle",
        likes: 2,
        comments: 24,
        timeAgo: "a week ago",
      },
      {
        id: 102,
        title: "Etsy has deactivated my PDF product",
        snippet: "I uploaded a PDF but it says deactivated. Anyone else had this?",
        author: "SellerOneEmporium",
        likes: 1,
        comments: 5,
        timeAgo: "a week ago",
      },
      // ...more placeholders
    ]);
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      <Navbar />

      <div className="container py-4 flex-grow-1">
        {/* Top controls */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">Community Forum</h3>
        </div>

        {/* Featured cards */}
        <div className="row mb-4">
          {featured.map((f) => (
            <div key={f.id} className="col-lg-4 col-md-6 mb-3">
              <FeaturedCard {...f} />
            </div>
          ))}
        </div>

        {/* Main content: Popular discussions + sidebar */}
        <div className="container py-4">
          {/* ROW containing left (discussions) and right (sidebar) */}
          <div className="row gx-4">
            {/* LEFT: header + controls above posts */}
            <div className="col-lg-8">
              {/* Title + controls (placed here so they appear above the posts) */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h1 className="h4 mb-0">Popular Discussions</h1>

                {/* controls block:
                - stays inline on lg and up
                - on smaller screens you can let these wrap (they will naturally stack)
            */}
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm d-none d-lg-block"
                    style={{ width: 180 }}
                    aria-label="Sort discussions"
                  >
                    <option>Latest activity</option>
                    <option>Most replied</option>
                    <option>Most liked</option>
                  </select>

                  <a href="/new-discussion" className="btn btn-primary btn-sm">
                    Start a discussion
                  </a>
                </div>
              </div>

              {/* Discussion list card */}
              <div className="card mb-3">
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {posts.map((p) => (
                      <li
                        key={p.id}
                        className="list-group-item d-flex justify-content-between align-items-start"
                      >
                        <div>
                          <div className="fw-bold">{p.title}</div>
                          <div className="text-muted small">{p.snippet}</div>
                          <div className="text-muted small mt-1">
                            by {p.author} · {p.timeAgo}
                          </div>
                        </div>

                        <div className="text-end">
                          <div className="small">👍 {p.likes}</div>
                          <div className="small">💬 {p.comments}</div>
                        </div>
                      </li>
                    ))}

                    {posts.length === 0 && (
                      <li className="list-group-item text-center text-muted">
                        No discussions yet — be the first to start one.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT: sidebar */}
            <div className="col-lg-4">
              <CommunitySpotlight slides={slides} interval={4500} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
