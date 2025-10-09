import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

app.listen(3001, () => console.log(3001));

async function testOpenRouter() {
  const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
  const MODEL = process.env.OR_MODEL;
  const API_KEY = process.env.OR_API;

  try {
    console.log("Sending test request to OpenRouter...");

    const response = await axios.post(
      OPENROUTER_API,
      {
        model: MODEL,
        messages: [{ role: "user", content: "Can you explain why is the sky blue" }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3001",
          "X-Title": "Backend Test",
        },
      }
    );

    // Log the full raw response for inspection
    // console.log("Raw API Response:\n", JSON.stringify(response.data, null, 2));

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.output_text ||
      "(No response text found.)";

    console.log("\n✅ OpenRouter API Response:");
    console.log(reply); 
  } catch (error) {
    console.error("❌ Error calling OpenRouter API:");
    console.error(error.response?.data || error.message);
  } 
}

// Run test immediately when server starts 
// testOpenRouter();

app.get("/", (req, res) => {
  res.send("Backend running. Check console for OpenRouter test output.");
});

// app.use("/api", chatRoute);
