import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import userRoutes from "./routes/userRoutes.js";
import orgsRoutes from "./routes/orgRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import { get_all_events } from "./services/eventServices.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.listen(3001, async () => {
    console.log("Server running on port 3001");
});

app.use("/users", userRoutes);
app.use("/orgs", orgsRoutes);
app.use("/events", eventRoutes);
app.use("/api/chat", chatRoutes);
app.use("/community", communityRoutes);

// Return config values needed by frontend
app.get('/config/google-maps-key', (req, res) => {
    let key = process.env.GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
    if (typeof key === 'string') {
        key = key.replace(/^\s*"|"\s*$/g, '').trim();
    }
    res.json({ key });
});

// Server-side geocoding: return opportunities with lat/lng
app.get('/api/opportunities', async (req, res) => {
    try {
        const events = await get_all_events();

        let key = process.env.GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
        if (typeof key === 'string') {
            key = key.replace(/^\s*"|"\s*$/g, '').trim();
        }

        if (!key) {
            const fallback = events.map(e => ({ 
                title: e.title || null, 
                postalcode: e.postalcode || e.postal || e.postal_code || e.location || null,
                location: e.location || null,
                region: e.region || null,  
                category: e.category || null,  
                organization: e.org_name || null,  
                description: e.description || null,  
                event_id: e.event_id || null  
            }));
            return res.json(fallback);
        }

        const geocodeUrl = (postal) => `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postal)}&components=country:SG&key=${key}`;

        const promises = events.map(async (e) => {
            const postal = e.postalcode || e.postal || e.postal_code || e.location || null;
            if (!postal) return null;

            try {
                const geoRes = await axios.get(geocodeUrl(postal));
                if (geoRes.data && geoRes.data.status === 'OK' && geoRes.data.results && geoRes.data.results.length) {
                    const loc = geoRes.data.results[0].geometry.location;
                    return { 
                        title: e.title || null, 
                        postalcode: postal, 
                        location: e.location || null,
                        region: e.region || null,  
                        category: e.category || null,  
                        organization: e.org_name || null,  
                        description: e.description || null,  
                        event_id: e.event_id || null,  
                        lat: loc.lat, 
                        lng: loc.lng 
                    };
                } else {
                    return { 
                        title: e.title || null, 
                        postalcode: postal, 
                        location: e.location || null,
                        region: e.region || null,  
                        category: e.category || null,  
                        organization: e.org_name || null,  
                        description: e.description || null,  
                        event_id: e.event_id || null,  
                        lat: null, 
                        lng: null, 
                        geocodeStatus: geoRes.data && geoRes.data.status 
                    };
                }
            } catch (err) {
                console.error('Geocode error for', postal, err.message || err);
                return { 
                    title: e.title || null, 
                    postalcode: postal, 
                    location: e.location || null,
                    region: e.region || null,  
                    category: e.category || null,  
                    organization: e.org_name || null,  
                    description: e.description || null,  
                    event_id: e.event_id || null,  
                    lat: null, 
                    lng: null, 
                    geocodeError: true 
                };
            }
        });

        const results = await Promise.all(promises);
        res.json(results.filter(Boolean));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get opportunities' });
    }
});