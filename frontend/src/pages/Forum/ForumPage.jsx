// src/pages/ForumPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";   //  
import Navbar from "../Navbar";
import FeaturedCard from "./component/FeaturedCard";
import CommunitySpotlight from "./component/CommunitySpotlight";
import "./component/community.css"; // adjust path if your CSS lives elsewhere

const slides = [
  { image: "https://picsum.photos/seed/1/800/480", caption: "Member review: Love this!", alt: "review 1" },
  { image: "https://picsum.photos/seed/2/800/480", caption: "New product spotlight", alt: "spotlight 2" },
  { image: "https://picsum.photos/seed/3/800/480", caption: "Community event highlights", alt: "event 3" },
];

export default function ForumPage() {
  const [posts, setPosts] = useState([]); // discussion posts
  const [featured, setFeatured] = useState([]); // featured tiles
  const [category, setCategory] = useState("All Categories");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // TODO: replace with real backend calls (supabase / fetch / axios)
    // Example:
    // fetch("/api/forums/featured").then(r => r.json()).then(setFeatured)
    // fetch("/api/forums/popular").then(r => r.json()).then(setPosts)

    // placeholder featured data (renders nicely)
    setFeatured([
      {
        id: "f1",
        image: "https://picsum.photos/seed/featured1/800/480",
        title: "Coming soon: A brand new seller Community Hub",
        excerpt: "Hello, everyone! I'm Vero and I have the joy of leading Etsy's Community En...",
        author: "VeroCraftsCommunity",
        likes: 117,
        comments: 1,
      },
      {
        id: "f2",
        image: "https://picsum.photos/seed/featured2/800/480",
        title: "Community Newsletter: October 9, 2025",
        excerpt: "Discover Upcoming Seller highlights and community events.",
        author: "Community Team",
        likes: 168,
        comments: 0,
      },
      {
        id: "f3",
        image: "https://picsum.photos/seed/featured3/800/480",
        title: "Etsy Up: Watch the replay and see what's next",
        excerpt: "Thanks for tuning in to Etsy Up! We hope you enjoyed this year's event...",
        author: "Iridesent",
        likes: 38,
        comments: 0,
      },
    ]);

    // placeholder discussion posts
    setPosts([
      {
        id: "101",
        image: null,
        title: "$47 Dollar Offsite Fee?",
        snippet: "Question about offsite fee billing and how it's applied to my orders...",
        author: "TechUpCycle",
        likes: 2,
        comments: 24,
        timeAgo: "a week ago",
      },
      {
        id: "102",
        image: null,
        title: "Etsy has deactivated my PDF product",
        snippet: "I uploaded a PDF but it says deactivated. Anyone else had this?",
        author: "SellerOneEmporium",
        likes: 1,
        comments: 5,
        timeAgo: "a week ago",
      },
      {
        id: "103",
        image: null,
        title: "How to photograph shiny objects?",
        snippet: "My photos have reflections. How do you photograph metal pieces cleanly?",
        author: "PhotoGuru",
        likes: 8,
        comments: 3,
        timeAgo: "3 days ago",
      },
    ]);
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light">
      <Navbar />

      <div className="col-lg-12 pt-4">
        <div className="spotlight-wrapper">
          <CommunitySpotlight slides={slides} interval={4500} />
        </div>

      </div>

      <div className="container py-4 flex-grow-1">
        {/* Top controls */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">Share the Joy </h3>

          <div className="d-flex gap-2">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search discussions..."
              style={{ width: 220 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Link to="/community/new-discussion" className="btn btn-primary btn-sm">
              Me Too +
            </Link>
          </div>
        </div>

        {/* Featured cards (top row) */}
        <div className="row mb-4">
          {featured.map((f) => (
            <div key={f.id} className="col-lg-4 col-md-6 mb-3">
              <FeaturedCard {...f} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
