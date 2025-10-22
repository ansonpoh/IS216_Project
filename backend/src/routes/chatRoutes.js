import { createOpenAI } from '@ai-sdk/openai';
import {streamText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';
import axios from "axios";
import express from "express";

const router = express.Router();

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const BASE = "http://localhost:3001";

const shortened_system = `
You are Vera, a warm-but-practical volunteer matchmaker who turns "I have to" into "I want to." Be friendly, concise, and efficient.

CORE RULES (must be enforced)
1) Acknowledge: Open with a brief, natural acknowledgement (e.g., "Thanks!" or "Got it!"). Avoid clichés or creepy phrasing.
2) Mandatory preference collection BEFORE any search or tool call:
   - Default required fields: region, time availability, beneficiary/cause
   - Ask exactly one question at a time. After each user reply, ask the next missing required question.
3) TOOL USAGE: As soon as the required prefs are collected, call the backend tool immediately (unless Conversational Exception applies).
4) CONVERSATIONAL EXCEPTION: If the user's message is purely conversational/reflective (greeting, thanks, feedback, or "why/how" about prior suggestions), do NOT call tools. You may ask up to one brief clarifying question; otherwise answer from context.
5) RECOMMENDATION RULES:
   - NEVER invent events or attributes.
   - Recommend up to 3 verified events that match **all** user preferences.
   - If backend returns 0 matches, start reply exactly with:
     Not finding good matches now. Would you adjust your preferred causes or broaden the area?
     Then ask ONE single follow-up question about flexibility.
   - Do NOT combine recommendation text with a follow-up-zero message in the same reply.
6) NORMALIZATION, CONFIRMATION & STRICT-MATCH
- Inform the user, in one short acknowledgement, of the normalization before calling the backend (e.g., "Got it — I'll look for 'animals' opportunities.").
7) META-PROMPT SELF-CHECK before any tool call:
   - Intent Check (user wants to see events)
   - Preference Check (region,time,beneficiary present)
   - Tone Check (acknowledgement brief & natural)
   - Data Integrity Check (only verified backend events will be recommended)
   - Error Handling Check (synonyms/misspellings handled)
   If any check fails -> ask one single next question; do not call tools.
`

const format_reminder = `
    What you should return if the user is requesting for events:
      - First, write a short friendly paragraph explaining why you chose them excluding the recommendations.
      - For time, return the start time to the end time and include either AM or PM.
      - Return the data in 'Day Month, Year'
      - Ensure proper capitalisation.
      - Then output a JSON array called "events" in the format :
        [
          {
            "title": "string",
            "date": "string",
            "time": "string",
            "location": "string",
            "organization": "string",
            "image_url": "string",
            "skills": "string",
          },
          ...
        ]
    Important: Do not include markdown lists or bullet points before the JSON.
    Output only one short paragraph (plain text) and then a valid JSON array of events.
`

// Tools
const getAllEventsTool = tool({
  description: "Retreives a list of all volunteering events from the backend api.",
  inputSchema: z.object({}),
  execute: async () => {
    const res = await axios.get(`${BASE}/events/get_all_events`);
    return res.data;
  }
})

const getEventsByCategoryTool = tool({
  description: "Retreives a list of volunteering events that belong to a specific category from the backend api.",
  inputSchema: z.object({
    category: z.string().describe("The event category to filter by")
  }),
  execute: async ({category}) => {
    try {
      const res = await axios.get(`${BASE}/events/get_events_by_category?category=${encodeURIComponent(category.toLowerCase())}`);

      const data = res.data.result || res.data || [];
      if (Array.isArray(data) && data.length > 0) return data;

      const similar = res.data.result.filter(event => {
        event.category.toLowerCase().includes(category.toLowerCase);
      })
      
      return similar.length > 0 ? similar : [];
    } catch (err) {
      console.error("GetEventsByCategoryTool Error: ", err);
      return {error: err};
    }
  }
})

const getEventsByRegionTool = tool({
  description: "Retreive a list of volunteering events that are located in a specific region from backend api.",
  inputSchema: z.object({
    region: z.string().describe("The region to filter by")
  }),
  execute: async ({region}) => {
    try {
      const res = await axios.get(`${BASE}/events/get_events_by_region?region=${encodeURIComponent(region.toLowerCase())}`);
      
      const data = res.data.result || res.data || [];
      if (Array.isArray(data) && data.length > 0) return data;

      const similar = res.data.result.filter(event => {
        event.region.toLowerCase().includes(region.toLowerCase);
      })
      
      return similar.length > 0 ? similar : [];
    } catch (err) {
      console.error("GetEventsByRegionTool Error: ", err);
      return {error: err};
    }
  }
})

async function runAgent(messages) {
  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: {
      getAllEvents: getAllEventsTool,
      getEventsByCategory: getEventsByCategoryTool,
      getEventsByRegion: getEventsByRegionTool,
    },
    response_format: {type: "json_object"},
  });

  let fullResponse = '';
  for await (const delta of response.textStream) {
    fullResponse += delta;
  }

  const toolCalls = await response.toolCalls;
  const toolResults = await response.toolResults;
  console.log(fullResponse)

  if (toolCalls.length > 0 && toolResults.length > 0) {
    const toolResults = await response.toolResults;

    // Push results back into messages for next round
    for (const tool of toolResults) {
      const data = tool.output?.result ?? tool.output ?? [];
      messages.push({
        role: 'assistant',
        content: `Tool "${toolResults[0].toolName}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
      });
    }

    // 🌀 Recursive call (just once more)
    return await runAgent(messages);
  }

  // No tool use — clean output
let parsed = { paragraph: "", events: [] };

try {
  // Attempt to find JSON array anywhere in the text
  const jsonMatch = fullResponse.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    parsed.events = JSON.parse(jsonMatch[0]);
    parsed.paragraph = fullResponse.slice(0, jsonMatch.index).trim();
  } else {
    // No array found — treat whole response as text
    parsed.paragraph = fullResponse.trim();
  }
} catch (err) {
  console.error("Error parsing AI output:", err.message);
  parsed.paragraph = fullResponse.trim();
}

return parsed;

  // if (toolCalls.length === 0 || toolResults.length === 0) {
  //   messages.push({ role: 'assistant', content: fullResponse });
  //   return fullResponse;
  // }

  // for (const tool of toolResults) {
  //   const data = tool.output?.result ?? tool.output ?? [];
  //   messages.push({
  //     role: 'assistant',
  //     content: `Tool "${toolResults[0].toolName}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
  //   });
  // }
  // return await runAgent(messages);
}

router.post("/", async (req,res) => {
  try {
    const {userMessage, history = []} = req.body;

    const messages = [
      {role: "system", content: shortened_system},
      ...history,
      {role: "user", content: `${userMessage}${format_reminder}`},
    ];
    const finalResponse = await runAgent(messages);

    return res.json({ success: true, reply: finalResponse });
  } catch (err) {
    console.error(err);
  }
})

export default router;