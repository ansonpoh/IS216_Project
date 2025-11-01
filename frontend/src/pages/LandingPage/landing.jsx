import React, { useState, useEffect } from "react";
import {
  mdiPaw,
  mdiBalloon,
  mdiHumanCane,
  mdiTree,
  mdiCalendar,
  mdiHuman,
  mdiHeartPulse,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import styles from "../../styles/LandingPage.module.css";
import mapView from "../../components/images/mapView.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { Nav } from 'react-bootstrap';

// Helper function to render Bootstrap Icon
const BSIcon = ({ name, size = "1em", className = "" }) => (
  <i className={`bi bi-${name} ${className}`} style={{ fontSize: size }} />
);

const getCategoryColors = (category) => {
  switch (category) {
    case "Environment":
      return { background: "#aaf3dbce", text: "#000000ff", icon: mdiTree };
    case "Animals":
      return { background: "#ffd894ff", text: "#000000ff", icon: mdiPaw };
    case "Community":
      return { background: "#ffb498ff", text: "#000000ff", icon: mdiHumanCane };
    default:
      return { background: "#E5E7EB", text: "#000000ff", icon: null };
  }
};

export default function Landing() {
  const navigate = useNavigate();
  const [facts, setFacts] = useState([]);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const FACT_SWITCH_MS = 5000;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // show button after scrolling 300px
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchFacts = async () => {
      setLoadingFacts(true);
      setFetchError(null);

      try {
        const response = await axios.get("http://localhost:3001/facts");
        const data = response.data;

        const rows = Array.isArray(data.facts)
          ? data.facts
          : Array.isArray(data.result)
          ? data.result
          : Array.isArray(data)
          ? data
          : [];

        const parsed = rows.map((r) => ({
          fact_text: r.fact_text ?? r.fact ?? "",
          source: r.source ?? "",
        }));

        if (mounted) {
          setFacts(parsed);
          setCurrentFactIndex(0);
        }
      } catch (err) {
        console.error("Error fetching facts:", err);
        if (mounted) setFetchError(err?.message || "Fetch failed");
      } finally {
        if (mounted) setLoadingFacts(false);
      }
    };

    fetchFacts();
    return () => {
      mounted = false;
    };
  }, []);

  // Scroll reveal animations using GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".fade-section").forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  // rotating fact state (example usage)
  useEffect(() => {
    if (!facts.length || isPaused) return;
    const id = setInterval(() => {
      setCurrentFactIndex((i) => (i + 1) % facts.length);
    }, FACT_SWITCH_MS);
    return () => clearInterval(id);
  }, [facts.length, isPaused]);

  const opportunities = [
    {
      title: "Ang Mo Kio Nature Trail Cleanup",
      location: "Ang Mo Kio Nature Trail",
      date: "Nov 15",
      category: "Environment",
    },
    {
      title: "Hospital Visitations Program",
      location: "Khoo Teck Puat Hospital",
      date: "Nov 18",
      category: "Community",
    },
    {
      title: "Jurong Bird Park Wildlife Education",
      location: "Jurong Bird Park",
      date: "Nov 07",
      category: "Animals",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="landing-page landing-page-bg">
        <section className="position-relative py-5 py-md-5 hero-section min-vh-100 fade-section">
          {/* Parallax Background Effect */}
          <div
            className="hero-bg-overlay"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />

          <div className="container position-relative z-10">
            <div className="text-center space-y-4 animate-fade-in pt-5">
              {/* Callout Badge */}
              <div className="d-inline-flex align-items-center gap-2 px-4 py-3 bg-white rounded-pill border border-purple-200 shadow-sm animate-bounce-slow">
                <BSIcon name="stars" className="text-warning sparkle-pulse" />
                <span className="small text-muted fw-medium">
                  Be the change Today!
                </span>
              </div>

              {/* Main Title */}
              <h1 className="display-3 fw-bolder mb-5 hero-title">
                <span className="gradient-text-blue-purple animate-gradient">
                  Find your cause
                </span>
                <br />
                <span
                  className="gradient-text-purple-pink animate-gradient"
                  style={{ animationDelay: "0.5s" }}
                >
                  Find your community
                </span>
              </h1>

              <p
                className="lead text-muted mx-auto mb-5 animate-fade-in"
                style={{ animationDelay: "0.3s", maxWidth: "700px" }}
              >
                Connect with meaningful opportunities, make lasting impacts!
              </p>
            </div>
          </div>

          {/* floating card */}
          <div className="container mt-7 position-relative">
            {[0, 1, 2].map((i) => {
              // Determine if this card is currently active/focused
              const isFocus = activeCardIndex === i;

              // Calculate dynamic Z-Index: Active card is highest (10), others are normal (3-i)
              const currentZIndex = isFocus ? 10 : 3 - i;

              // Base transform remains the same
              const baseTransform = `translateX(calc(-50% + ${
                (i - 1) * 120
              }px)) translateY(${i * 20}px)`;

              // Focus transform adds a slight shift and scale
              const focusTransform = `translateX(calc(-50% + ${
                (i - 1) * 120
              }px)) translateY(${i * 20 - 15}px) scale(1.05) rotate(0deg)`;

              const colors = getCategoryColors(opportunities[i].category);
              // alias for clarity when rendering icon + colors
              const details = colors;
              const iconPath = details.icon;

              return (
                <div
                  key={i}
                  className={`opportunity-card-float bg-white border border-gray-100 shadow-lg p-4 rounded-3 ${
                    isFocus ? "card-is-focused" : ""
                  }`}
                  onClick={() => setActiveCardIndex(i)}
                  style={{
                    "--x": `${(i - 1) * 120}px`,
                    "--y": `${i * 20}px`,
                    // APPLY dynamic transform and z-index
                    transform: isFocus ? focusTransform : baseTransform,
                    animationDelay: `${i * 0.1}s`,
                    zIndex: currentZIndex,
                    // Ensure smooth transition for the click effect
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer", // Add cursor pointer for better UX
                  }}
                >
                  <div
                    className="d-flex align-items-start gap-3"
                    style={{ minHeight: "125px" }}
                  >
                    <div className="flex-grow-1">
                      {/* Ensure titles are capped or fixed height too for perfect uniformity */}
                      <h3
                        className="fs-6 fw-semibold text-gray-800 mb-1 mt-2"
                        style={{ minHeight: "30px" }}
                      >
                        {opportunities[i].title}
                      </h3>

                      {/* Ensure the description/location area has a min-height */}
                      <p
                        className="text-muted small d-flex align-items-center gap-1 "
                        style={{ minHeight: "20px" }}
                      >
                        <BSIcon name="geo-alt-fill" size="14px" />{" "}
                        {opportunities[i].location}
                      </p>
                      <div className="d-flex gap-2 mt-3">
                        {/* CATEGORY BADGE: icon + label */}
                        <span
                          className="d-inline-block px-2 py-1 rounded-pill small fw-medium"
                          style={{
                            backgroundColor: details.background,
                            color: details.text,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {iconPath && (
                            <Icon
                              path={iconPath}
                              size={0.7}
                              aria-hidden="true"
                            />
                          )}
                          {opportunities[i].category}
                        </span>

                        {/* DATE BADGE (consistent style) */}
                        <span
                          className="d-inline-block px-2 py-1 rounded-pill small fw-medium"
                          style={{
                            backgroundColor: "#F3E8FF",
                            color: "#6B21A8",
                          }}
                        >
                          {opportunities[i].date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Optional: Add an invisible overlay or click outside listener to clear the focus */}
            {activeCardIndex !== null && (
              <div
                className="position-absolute w-100 h-100"
                style={{ top: 0, left: 0, zIndex: 9, pointerEvents: "auto" }}
                onClick={() => setActiveCardIndex(null)}
              />
            )}
          </div>
        </section>

        {/* ai chat */}
        <section className="px-3 py-5 py-md-5 position-relative fade-section">
          <div className="container">
            <div className="row g-4 align-items-center">
              {/* Content Column */}
              <div className="col-12 col-lg-6">
                <div className="pe-lg-5">
                  {/* New: Eye-catching introductory phrase */}

                  {/* Main Heading */}
                  <h2 className="display-5 fw-bolder mb-3 ">
                    <h3>Not sure where to start?</h3>
                    <span className="gradient-text-blue-purple">
                      Meet Vera:
                    </span>
                    <br />
                    Your Personal Volunteer Guide
                  </h2>

                  <p className="lead text-muted mb-4">
                    Stop endlessly scrolling. Vera uses smart AI to instantly
                    filter and find the perfect match for your goals, schedule,
                    and skills.
                  </p>

                  {/* Key Features List from AI Chat Interface */}
                  <ul className="list-unstyled space-y-3 mb-5">
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="check-circle-fill"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          I'm new to volunteering
                        </h4>
                        <p className="small text-muted mb-0">
                          Find beginner-friendly opportunities with clear
                          guidance.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="clock-fill"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          I have limited time
                        </h4>
                        <p className="small text-muted mb-0">
                          Match with micro-volunteering or short-term
                          commitments.
                        </p>
                      </div>
                    </li>
                    {/* <li className="d-flex align-items-start gap-2">
                      <BSIcon name="lightbulb-fill" className="text-primary mt-1" size="1.2em" />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">Use my professional skills</h4>
                        <p className="small text-muted mb-0">Leverage your expertise for maximum impact (e.g., design, coding).</p>
                      </div>
                    </li> */}
                  </ul>

                  {/* Primary CTA */}
                  <button
                    className="btn btn-primary btn-lg custom-btn-primary d-flex align-items-center gap-2 fw-semibold hover-scale-105"
                    onClick={() => navigate("/ai")}
                  >
                    Start Talking to Vera Now
                    <BSIcon
                      name="arrow-right"
                      className="transition-transform"
                    />
                  </button>
                </div>
              </div>

              {/* Visual Column: Placeholder for the screenshot/mockup */}
              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <div
                  className="vera-mockup-container p-4 bg-white rounded-4 shadow-lg border border-gray-100 position-relative w-100"
                  style={{ maxWidth: "450px" }}
                >
                  {/* Simplified Mockup replicating the look of the AI Chat */}
                  <div className="d-flex align-items-center mb-3">
                    <BSIcon
                      name="robot"
                      className="text-primary me-2"
                      size="24px"
                    />
                    <span className="fw-bold">Vera AI Chat</span>
                  </div>

                  <div
                    className="p-3 mb-2 rounded-3 bg-purple-100 d-inline-block"
                    style={{ maxWidth: "85%" }}
                  >
                    Hello! I'm Vera, your personal assistant to discover
                    meaningful volunteering opportunities. How can I help you
                    get started today?
                  </div>

                  {/* Mimic a user selection */}
                  <div className="text-end">
                    <div
                      className="p-3 rounded-3 bg-blue-100 d-inline-block text-start mt-2 border-primary"
                      style={{ maxWidth: "85%" }}
                    >
                      I'm new to volunteering
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    {/* This could be replaced with an actual image of the chat interface */}
                    <small className="text-muted">
                      Real-time matching powered by AI
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* map */}
        <section className="px-3 py-5 py-md-5 position-relative fade-section">
          <div className="container">
            <div className="row g-4 align-items-center flex-row-reverse">
              {/* Content Column (RIGHT) */}
              <div className="col-12 col-lg-6">
                <div className="ps-lg-5">
                  {/* Main Heading */}
                  <h2 className="display-5 fw-bolder mb-3">
                    <span className="gradient-text-purple-pink">
                      See Your Impact
                    </span>
                    <br />
                    Visualize Opportunities Nearby
                  </h2>

                  <p className="lead text-muted mb-4">
                    Filter and browse volunteer events directly on the map. Find
                    opportunities based on geographical region, category, or
                    even proximity to your home.
                  </p>

                  {/* Key Map Features */}
                  <ul className="list-unstyled space-y-3 mb-5">
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="pin-map-fill"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          Location-Based Search
                        </h4>
                        <p className="small text-muted mb-0">
                          Toggle between regions: Central, North, East, and
                          West.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="tags-fill"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          Category Filtering
                        </h4>
                        <p className="small text-muted mb-0">
                          Quickly find causes you care about, from Environment
                          to Mental Health.
                        </p>
                      </div>
                    </li>
                  </ul>

                  {/* Secondary CTA (Action on the Map) */}
                  <button
                    className="btn btn-primary btn-lg custom-btn-primary d-flex align-items-center gap-2 fw-semibold hover-scale-105"
                    onClick={() => navigate("/map")}
                  >
                    Explore the Map Today
                    <BSIcon name="arrow-right" className="ms-2" />
                  </button>
                </div>
              </div>

              {/* Visual Column (LEFT)  */}

              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <div
                  className={`${styles.mapCard} bg-white rounded-4 border border-gray-100 w-100 position-relative p-0`}
                  style={{ maxWidth: 600, cursor: "pointer" }}
                  onClick={() => navigate("/map")}
                  aria-label="Open interactive map"
                  role="button"
                >
                  <div className={styles.aspect169}>
                    <img
                      src={mapView}
                      alt="Volunteer opportunities across Singapore"
                      loading="lazy"
                      className="rounded-3"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      sizes="(max-width: 576px) 100vw, (max-width: 992px) 90vw, 600px"
                    />

                    <span className={styles.mapBorder} />

                    <div
                      className="position-absolute start-0 end-0 bottom-0 p-3"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 100%)",
                        color: "#fff",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="ms-auto small d-none d-sm-inline">
                          Open map
                        </span>
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* opportunities */}
        <section className="px-3 py-5 py-md-5 position-relative fade-section">
          <div className="container">
            <div className="row g-4 align-items-center">
              {/* Content Column (LEFT) */}
              <div className="col-12 col-lg-6">
                <div className="pe-lg-5">
                  {/* Main Heading */}
                  <h2 className="display-5 fw-bolder mb-3">
                    <span className="gradient-text-blue-purple">
                      Explore & Filter
                    </span>
                    <br />
                    Your Next Volunteer Mission
                  </h2>

                  <p className="lead text-muted mb-4">
                    Seamlessly browse a diverse catalog of opportunities. Use
                    simple filters to sort by category, region, and dates, just
                    like a pro. Find everything from one-day events to long-term
                    mentorships.
                  </p>

                  {/* Key Explore Features */}
                  <ul className="list-unstyled space-y-3 mb-5">
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="list-task"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          Quick Filtering Tools
                        </h4>
                        <p className="small text-muted mb-0">
                          Refine results by date, region, and over 10 distinct
                          categories.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="card-checklist"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          Clear Details at a Glance
                        </h4>
                        <p className="small text-muted mb-0">
                          View location, time, and capacity directly on the
                          event cards.
                        </p>
                      </div>
                    </li>
                  </ul>

                  {/* Secondary CTA */}
                  <button
                    className="btn btn-primary btn-lg custom-btn-primary d-flex align-items-center gap-2 fw-semibold hover-scale-105"
                    onClick={() => navigate("/opportunities")}
                  >
                    See All Opportunities
                    <BSIcon name="arrow-right" className="ms-2" />
                  </button>
                </div>
              </div>

              {/* Visual Column (RIGHT) - Mockup Placeholder */}
              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <div
                  className="opportunities-mockup-container p-3 bg-white rounded-4 shadow-xl border border-gray-100 w-100"
                  style={{ maxWidth: "600px", maxHeight: "400px" }}
                >
                  {/* Placeholder for the Opportunities Screenshot */}
                  <div
                    className="opportunities-placeholder-content text-center py-5 rounded-3"
                    style={{
                      backgroundColor: "#f8f9fa",
                      height: "100%",
                      // Use an image if available: backgroundImage: `url(${process.env.PUBLIC_URL}/opportunities_preview.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <BSIcon
                      name="calendar-event-fill"
                      className="text-secondary"
                      size="3em"
                    />
                    <p className="text-muted mt-2 fw-semibold">
                      Opportunities Listing Preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* community */}
        <section className="px-3 py-5 py-md-5 position-relative fade-section">
          <div className="container">
            <div className="row g-4 align-items-center flex-row-reverse">
              {/* Content Column (RIGHT) */}
              <div className="col-12 col-lg-6">
                <div className="ps-lg-5">
                  {/* Main Heading */}
                  <h2 className="display-5 fw-bolder mb-3">
                    <span className="gradient-text-purple-pink">
                      Celebrate Moments
                    </span>
                    <br />
                    Join the Volunteer Community
                  </h2>

                  <p className="lead text-muted mb-4">
                    Connect with fellow volunteers. Share your best volunteer
                    photos, videos, and stories to inspire others and earn
                    recognition badges for your efforts. Every hour of service
                    deserves a spotlight!
                  </p>

                  {/* Key Community Features */}
                  <ul className="list-unstyled space-y-3 mb-5">
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="award-fill"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          Recognition & Badges
                        </h4>
                        <p className="small text-muted mb-0">
                          Get public recognition for milestones and hours
                          volunteered.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <BSIcon
                        name="chat-dots-fill"
                        className="text-primary mt-1"
                        size="1.2em"
                      />
                      <div>
                        <h4 className="fs-6 fw-semibold mb-0">
                          Inspiring Feed
                        </h4>
                        <p className="small text-muted mb-0">
                          See real-time volunteer activity and success stories
                          in your area.
                        </p>
                      </div>
                    </li>
                  </ul>

                  {/* Secondary CTA */}
                  <button
                    className="btn btn-primary btn-lg custom-btn-primary d-flex align-items-center gap-2 fw-semibold hover-scale-105"
                    onClick={() => navigate("/community")}
                  >
                    Explore the Community
                    <BSIcon name="arrow-right" className="ms-2" />
                  </button>
                </div>
              </div>

              {/* Visual Column (LEFT) - Mockup Placeholder */}
              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <div
                  className="community-mockup-container p-3 bg-white rounded-4 shadow-xl border border-gray-100 w-100"
                  style={{ maxWidth: "600px", maxHeight: "400px" }}
                >
                  {/* Placeholder for the Community Feed Image */}
                  <div
                    className="community-placeholder-content text-center py-5 rounded-3"
                    style={{
                      backgroundColor: "#f8f9fa",
                      height: "100%",
                      // Use an image if available: backgroundImage: `url(${process.env.PUBLIC_URL}/community_preview.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <BSIcon
                      name="trophy-fill"
                      className="text-secondary"
                      size="3em"
                    />
                    <p className="text-muted mt-2 fw-semibold">
                      Community Feed Preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facts Section */}
        <section className="px-3 py-5 py-md-5 position-relative fade-section">
          <div className="container">
            <div className="row justify-content-center ">
              <div className="col-12 col-md-8">
                <div
                  className="text-center bg-white border bo shadow-sm p-4 rounded-3 h-100 justify-content-center d-flex flex-column"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  style={{ cursor: "pointer", minHeight: "150px" }}
                >
                  {loadingFacts ? (
                    <h3 className="fs-5 fw-bold mt-3 mb-2">Loading fact...</h3>
                  ) : fetchError ? (
                    <h3 className="fs-5 fw-bold mt-3 mb-2">
                      Failed to load facts
                    </h3>
                  ) : facts.length ? (
                    <>
                      <h3
                        key={currentFactIndex}
                        className="fs-5 fw-bold mt-4 mb-1 animate-fade-in"
                        style={{ maxHeight: "64px" }}
                      >
                        {facts[currentFactIndex]?.fact_text}
                      </h3>
                      <div className="small mt-3 text-muted">
                        {facts[currentFactIndex]?.source
                          ? `Source: ${facts[currentFactIndex].source}`
                          : null}
                      </div>
                    </>
                  ) : (
                    <h3 className="fs-5 fw-bold mt-3 mb-2">
                      No facts available
                    </h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="px-3 py-5 py-md-5 position-relative fade-section">
          <div className="container">
            <div className="mx-auto text-center bg-gradient-blue-purple rounded-3 p-5 shadow-lg cta-section">
              <h2 className="display-5 fw-bolder text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p
                className="text-white lead mb-4 mx-auto"
                style={{ maxWidth: "600px" }}
              >
                Join thousands of volunteers making positive impacts in their
                communities. Your journey starts here, with VolunteerConnect.
              </p>
              <button
                className="text-white btn btn-lg fw-bold text-center custom-btn-cta hover-scale-105"
                onClick={() => navigate("/volunteer/auth")}
              >
                Get Started Today
              </button>
            </div>
          </div>
        </section>

        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={styles.scrollTopButton}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        )}
      </div>
    </>
  );
}
