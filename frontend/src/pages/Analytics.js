import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import Title from "../components/ui/Title";
import styles from "../styles/Analytics.module.css";

export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [regionData, setRegionData] = useState([]);

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
      </div>
    </div>
  );
}