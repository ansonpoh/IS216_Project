import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import Title from "../components/ui/Title";
import styles from "../styles/Analytics.module.css";

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
        maxIntensity:10
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
      <div className={styles.container}>
        <Title text="Event Sign-up Analytics" />

        <section className={styles.section}>
          <h2>Category Popularity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signup_count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className={styles.section}>
          <h2>Regional Popularity</h2>
          {/* optional: placeholder map */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signup_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className={styles.section}>
          <h2>Regional Popularity Heatmap</h2>
          <div
            ref={mapRef}
            style={{ width: "100%", height: "400px", borderRadius: "12px" }}
          />
        </section>
      </div>
    </div>
  );
}