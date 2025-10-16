import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OR_MODEL;
const API_KEY = process.env.OR_API;

router.post("/", async (req, res) => {
  const {message, events} = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing 'message' in request body." });
  }

  try {
    console.log("Sending message to OpenRouter...");

    const system = `
      Role: 
      You are an intelligent volunteering opportunity recommendation engine that connects individuals with meaningful volunteer events and projects that align with their interests, skills, and availability. 

      Goal: Recommend volunteer opportunities that best match the user’s preferences, schedule, and causes they care about.

      Instructions: Interpret the user’s input to identify: 
        Causes they care about (e.g., environment, education, health, animal welfare, community development).
        Relevant skills or roles (e.g., teaching, organizing, mentoring, manual work, logistics).
        Availability (specific dates, weekends, ongoing commitments).
        Location and preferred proximity (in-person or remote).
        Motivation or goals (e.g., giving back, meeting people, skill-building).
        Search the available volunteering event data and select opportunities that best align with those factors.

      For each recommendation, include: 
        title: name of the volunteer event or program
        date/time: when it occurs or if ongoing
        location: physical or virtual
        organization: hosting group or nonprofit
        description: short (≤50 words) summary of what volunteers do
        match_reason: why this opportunity suits the user’s preferences

      If the user’s information is incomplete, ask clarifying questions such as:
        “Which causes are you most passionate about?”
        “Do you prefer one-time events or ongoing volunteer roles?”
        “Would you like to volunteer locally or remotely?”

      Tone and Style: 
      Empathetic, purposeful, and informative. Focus on relevance, impact, and personal connection to the cause. Avoid sales-like or generic phrasing.
    `

    const response = await axios.post(
      OPENROUTER_API,
      {
        model: MODEL,
        system: system,
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3001",
          "X-Title": "VolunteerConnect Backend",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.output_text ||
      "(No response text found.)";

    console.log("✅ OpenRouter replied:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error calling OpenRouter API:");
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to get response from OpenRouter",
      details: error.response?.data || error.message,
    });
  }
});

export default router;