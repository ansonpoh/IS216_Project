import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import Title from "../components/ui/Title";
import styles from "../styles/Analytics.module.css";
import PageTransition from "../components/Animation/PageTransition";
import { gsap } from 'gsap';


const TiltDiv = ({ children, className, style }) => {
  const tiltRef = useRef(null);
  const MOBILE_BREAKPOINT = 768; // Define mobile breakpoint for disabling effect

  useEffect(() => {
    const element = tiltRef.current;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (!element || isMobile) return;

    const handleMouseMove = e => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Tilt Calculation (subtler max 6 degrees)
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;

      gsap.to(element, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000 // Key for 3D tilt
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Apply necessary base styles for 3D perspective
    element.style.transformStyle = 'preserve-3d';
    element.style.transition = 'transform 0.3s ease-out'; // Keep a base transition for smooth exit

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element); // Cleanup GSAP animations
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      ref={tiltRef}
      className={className}
      style={{ ...style, position: 'relative' }} // Must be relative for internal positioning if needed
    >
      {children}
    </div>
  );
};


export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const mapRef = useRef(null);
  const heatmapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, regRes] = await Promise.all([
          axios.get(`${API_BASE}/events/get_categories_analytics`),
          axios.get(`${API_BASE}/events/get_region_analytics`)
        ]);
        setCategoryData(catRes.data.result);
        setRegionData(regRes.data.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!regionData.length) return;
    const loadGoogleMaps = async () => {
      // dynamically load Maps API (only once)
      if (!window.google) {
        const keyRes = await fetch(`${API_BASE}/config/google-maps-key`);
        const { key } = await keyRes.json();

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=visualization`;
        document.body.appendChild(script);

        await new Promise((resolve) => (script.onload = resolve));
      }
      initMap();
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 1.3521, lng: 103.8198 },
        mapTypeId: "roadmap",
      });
      mapInstanceRef.current = map;

      const regionCoordinates = {
        "Central": { lat: 1.3521, lng: 103.8198 },
        "East": { lat: 1.3400, lng: 103.9500 },
        "West": { lat: 1.3500, lng: 103.7000 },
        "North": { lat: 1.4300, lng: 103.8300 },
        "North-East": { lat: 1.3800, lng: 103.9000 },
      };

      const heatmapPoints = regionData
        .filter((r) => regionCoordinates[r.region])
        .map((r) => ({
          location: new window.google.maps.LatLng(
            regionCoordinates[r.region].lat,
            regionCoordinates[r.region].lng
          ),
          weight: r.signup_count,
        }));

      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapPoints,
        radius: 50,
        // dissipating: true,
        opacity: 0.7,
        maxIntensity: 10
      });

      heatmap.setMap(map);
      heatmapRef.current = heatmap;

      heatmap.set('gradient', [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]);
    };

    loadGoogleMaps();
  }, [regionData]);

  return (
    <div>
      <Navbar />
      <PageTransition>
        <div className={`container py-4 ${styles.container}`}>
          <div className="d-flex flex-column align-items-center mb-3 text-center">
            <Title text="See What's Hot!" />
          </div>
          <div className="row g-3 mb-4">
            <div className="col-lg-6 col-md-12">
              <TiltDiv style={{ height: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                <section className={styles.section}>
                  <h2>Category Popularity</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis allowDecimals={false}/>
                      <Tooltip />
                      <Bar dataKey="signup_count" fill="#82ca9d" name="Total Signups"/>
                    </BarChart>
                  </ResponsiveContainer>
                </section>
              </TiltDiv>
            </div>
            {/* <div className="col-lg-4">
              <TiltDiv style={{ height: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                something here
              </TiltDiv>
            </div> */}

            <div className="col-lg-6 col-md-12">
                <TiltDiv style={{ height: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                  <section className={styles.section}>
                    <h2>Regional Popularity</h2>
                    {/* optional: placeholder map */}
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis allowDecimals={false}/>
                        <Tooltip />
                        <Bar dataKey="signup_count" fill="#8884d8" name="Total Signups"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </section>
                </TiltDiv>
              </div>
              <div className="col-12">
                <TiltDiv style={{ height: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                  <section className={styles.section}>
                    <h2>Regional Popularity Heatmap</h2>
                    <div
                      ref={mapRef}
                      style={{ width: "100%", height: "301px", borderRadius: "12px" }}
                    />
                  </section>
                </TiltDiv>
              </div>
          </div>
        </div>
      </PageTransition>
    </div>


  );
}