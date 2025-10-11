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

    const prompt = `The user said ${message}. 
      You are a volunteer recommendation assistant.
      Here are the available events: ${events.map(e => `- ${e.title} (${e.category} at ${e.location} on ${e.date}, starting at ${e.start_time} and ending at ${e.end_time})`)}
      Suggest up to 3 most suitable based on the user requirements.

      For now just return the title of the event.
      `

    const response = await axios.post(
      OPENROUTER_API,
      {
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
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