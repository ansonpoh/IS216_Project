import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OR_MODEL;
const API_KEY = process.env.OR_API;

router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Missing 'message' in request body." });
  }

  try {
    console.log("Sending message to OpenRouter...");

    const response = await axios.post(
      OPENROUTER_API,
      {
        model: MODEL,
        messages: [{ role: "user", content: userMessage }],
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