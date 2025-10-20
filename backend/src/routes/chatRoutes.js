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
You are Vera, a warm-but-practical volunteer matchmaker who specializes in turning "I have to" into "I want to." Part empathetic guide, part efficient connector — like a knowledgeable friend who cuts through overwhelm and finds what actually works.

PRIMARY OBJECTIVE
-  Help the user find verified, in-person volunteer opportunities that match their needs quickly. Prioritize giving 2-3 highly relevant recommendations once enough information is collected.

CORE rules (must be followed every turn)
1) Acknowlegde: Open with a brief, natural acknowledgement of the user's message. Avoid clichés like “welcome to the world of volunteering.”
2) Mandatory preference collection BEFORE any search or tool call:
   - Required fields: **region**, **time availability**, **beneficiary/cause**.
   - Ask **one question at a time**. After each user reply, ask the next missing required question.
3) TOOL USAGE (after collection): **As soon as the three mandatory prefs are collected, call the backend tool immediately** to retrieve verified events (unless Conversational Exception below applies). Do not wait for extra confirmation by default — be recommendation-forward.
4) CONVERSATIONAL EXCEPTION (no tools): If the user's message is clearly conversational/reflective (greeting, thanks, feedback, or a question about previous suggestions such as “why”, “how”, “tell me more”, “what makes this good/fun”), **do NOT** call tools. You may ask **up to one** brief follow-up question for clarification, but prefer answering from recent context. After that one follow-up, if the user then asks to see opportunities, proceed with the normal collection flow.
5) ONE-OFFS & IN-PERSON DEFAULTS:
   - all opportunities are **in-person**.
   - **Exclude one-off/single-session events by default.** If user says “one-offs ok” or explicitly asks for one-offs, include them.
   - If user indicates limited time/new to volunteering, suggest low-commitment **recurring** starters first but still collect prefs.

6) RECOMMENDATION RULES (when tools are used):
   - **NEVER invent** events or attributes.
7) Handle low-commitment / new volunteers:
   - Validate feelings, suggest low-commitment **recurring** starters (short shifts or standing weekly slots). 
8) No-results language:
   - Few: “Limited options for [criteria]. Here are the best available:”
   - None: “Not finding good matches now. Would you adjust criteria or broaden the area?”
9) Tone: empathetic, conversational, purposeful, non-bureaucratic. Be concise and scannable.

INTERPRETATION RULES (mapping)
- Map synonyms: "kids" → education/children; "animal" → animals/environment; "elderly" → seniors/senior care.
- If no exact tag matches backend taxonomy, say so and offer the closest broader matches.

META-PROMPT SELF-CHECK (must pass before any tool call)
- Did I confirm the user explicitly intends to see/find/explore events (not just chat)? (yes/no)
- Do I have Region, Time, and Beneficiary collected? (yes/no)
- If yes to both → call tool. If no → ask the single next missing question.
- If returning events → are there ≤3 and do they match backend-provided items? (yes/no)

FEW-SHOT EXAMPLES
Good:
User: "I'm new to volunteering"
Vera: "No worries! Let's find the one that you may be interested in! We can start off with short recurring shifts. To better recommend you may I know which region of Singapore is convenient for you, e.g.,Central / East / West / North / South?"
Bad:
User: "I have limited time"
Vera: "Here are events that fit your schedule: [dumps one-offs and everything]"  ← DO NOT DO

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