import { createOpenAI } from '@ai-sdk/openai';
import {streamText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';
import axios from "axios";
import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});


const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const BASE = "http://localhost:3001";

const shortened_system = `
You are Vera, a warm-but-practical volunteer matchmaker who turns "I have to" into "I want to." Be friendly, conversational, and persuasive for reluctant users—BUT follow the output contract so the frontend can parse you.

====================
RELUCTANT USERS (paragraph only)
- Validate briefly (one short line) and highlight one practical benefit (convenience, skills, social).
- Ask EXACTLY ONE question per turn while collecting preferences.

====================
STRICT OUTPUT CONTRACT (matches parser)
You must output EXACTLY TWO parts, in this order, and NOTHING else:
1) One short paragraph (plain text; no bullets, no code fences).
2) ONE JSON structure:
   - For options: an OBJECT containing "values" (the parser looks for "values"):
     {
       "options": {
         "type": "regions" | "availability" | "categories",
         "values": ["Option1", "Option2", "Option3"]
     }}
   - For events: an ARRAY of event objects:
     [
       {
         "title": "string",
         "date": "Day Mon, Year",
         "time": "Start–End AM/PM",
         "location": "string",
         "organization": "string",
         "image_url": "string",
         "skills": "string"
       }
     ]
Rules:
- Do NOT wrap the paragraph in JSON.
- Do NOT output more than one JSON structure.
- No markdown fences, no extra commentary after the JSON.
- Never quote or stringify JSON.

====================
COLLECTION FLOW (MANDATORY)
Ask in this order: Region → Availability → Causes (Categories).
While collecting:
- ALWAYS call getSelectableOptions with the correct "type" ("regions", "availability", "categories") and present exactly those results in "values".
- Include "Any" / "Any time" in availability if supported by the backend.
As soon as AT LEAST TWO of the three are known:
- Call getFilteredEvents with all known filters and return up to 3 events as a JSON ARRAY.

====================
ZERO MATCHES
If getFilteredEvents returns zero:
1) Paragraph: brief, upbeat nudge to tweak (nearby region OR different cause).
2) JSON OBJECT: show ONE dimension to adjust using getSelectableOptions:
   {
     "options": { "type": "regions" | "categories", "values": ["..."] }
   }

====================
DATA INTEGRITY
- NEVER invent events/fields; only format tool results.
- Dates: "12 Nov, 2025"; Times: "9:00 AM–12:00 PM"; Proper capitalization.
`;


const format_reminder = `
Output EXACTLY TWO THINGS in this order:

1) One short paragraph (plain text). Keep empathy/persuasion here. Ask only ONE question if collecting.

2) Then EITHER:
   a) For selectable options (from getSelectableOptions):
      {
        "options": {
          "type": "regions" | "availability" | "categories",
          "values": ["Option1", "Option2", "Option3"]
        }
      }
   b) For events (from getFilteredEvents):
      [
        {
          "title": "string",
          "date": "Day Mon, Year",
          "time": "Start–End AM/PM",
          "location": "string",
          "organization": "string",
          "image_url": "string",
          "skills": "string"
        }
      ]

ABSOLUTE RULES:
- No code fences. No extra text after JSON. No nested/quoted JSON.
- If < 2 prefs known → ask next missing (Region → Availability → Causes) and show options via (a).
- If ≥ 2 prefs known → show events via (b).
`;


// Tools
const getAllEventsTool = tool({
  description: "Retreives a list of all volunteering events from the backend api.",
  inputSchema: z.object({}),
  execute: async () => {
    const res = await axios.get(`${BASE}/events/get_all_events`);
    return res.data;
  }
})

const getSelectableOptionsTool = tool({
  description: `
    Retrieve predefined selectable options (regions, categories, availability) for user interaction when the AI needs clarification.
    Use this when the assistant needs to ask the user to choose from a known list.
    If the user asks for type of acivities / groups, use this tool with the categories type.
  `,
  inputSchema: z.object({
    type: z.string().describe("The type of options to retrieve. Example: 'regions', 'categories', 'availability'")
  }),
  execute: async ({type}) => {
    try {
      const res = await axios.get(`${BASE}/events/get_selectable_options`);
      const data = res.data?.result ?? res.data ?? {};
      const options = data[type.toLowerCase()] ?? [];
      if (Array.isArray(options) && options.length > 0) return options;
      return [];
      
    } catch (err) {
      console.error("GetSelectableOptionsTool Error: ", err);
      return {error: err?.message ?? String(err)};
    }
  }
})


const getEventsByCategoryTool = tool({
  description: "Retrieve volunteering events filtered by category only. Use this when the user specifies a single category ONLY.",
  inputSchema: z.object({
    category: z.string().describe("The event category to filter by")
  }),
  execute: async ({category}) => {
    try {
      const res = await axios.get(`${BASE}/events/get_events_by_category?category=${encodeURIComponent(category.toLowerCase())}`);
      const data = res.data?.result ?? res.data ?? [];
      if (Array.isArray(data) && data.length > 0) return data;

      const resultArray = res.data?.result ?? [];
      const similar = resultArray.filter(event => {
        return event?.category && event.category.toLowerCase().includes(category.toLowerCase());
      })

      return similar.length > 0 ? similar : [];
    } catch (err) {
      console.error("GetEventsByCategoryTool Error: ", err);
      return {error: err?.message ?? String(err)};
    }
  }
})

const getEventsByRegionTool = tool({
  description: "Retrieve volunteering events located in a specific region. Use this when the only region is mentioned in the history.",
  inputSchema: z.object({
    region: z.string().describe("The region to filter by")
  }),
  execute: async ({region}) => {
    try {
      const res = await axios.get(`${BASE}/events/get_events_by_region?region=${encodeURIComponent(region.toLowerCase())}`);
      const data = res.data?.result ?? res.data ?? [];
      if (Array.isArray(data) && data.length > 0) return data;

      const resultArray = res.data?.result ?? [];
      const similar = resultArray.filter(event => {
        return event?.region && event.region.toLowerCase().includes(region.toLowerCase());
      })

      return similar.length > 0 ? similar : [];
    } catch (err) {
      console.error("GetEventsByRegionTool Error: ", err);
      return {error: err?.message ?? String(err)};
    }
  }
})

const getEventsByTimeTool = tool({
  description: "Retreive a list of volunteering events filtered by time only (weekday, weekend, or date range) from backend api. Use this when the user’s request focuses ONLY on timing.",
  inputSchema: z.object({
    filter: z.enum(["weekday", "weekend", "range"]).describe("The time filter to apply. Can be 'weekday', 'weekend', or 'range'."),
    start_date: z.string().optional().describe("Start date for the range filter (YYYY-MM-DD). Optional unless filter = 'range'."),
    end_date: z.string().optional().describe("End date for the range filter (YYYY-MM-DD). Optional unless filter = 'range'."),
  }),
  execute: async({filter, start_date, end_date}) => {
    try {
      const params = new URLSearchParams({ filter });
      if (filter === "range" && start_date && end_date) {
        params.append("start_date", start_date);
        params.append("end_date", end_date);
      }
      const res = await axios.get(`${BASE}/events/get_events_by_time?${params.toString()}`);
      const data = res.data?.result ?? res.data ?? [];

      if (Array.isArray(data) && data.length > 0) return data;

      return [];
    } catch (err) {
      console.error("GetEventsByTimeTool Error: ", err);
    }
  }
})

const getFilteredEventsTools = tool({
  description: `Retrieve volunteering events filtered by one or more conditions —
    including category, region, and time.
    This tool MUST be used when the user asks for events that combine multiple filters,
    If the user only specifies one filter (just category, region, or time),
    use the corresponding single-parameter tool instead.
  `,
  inputSchema: z.object({
    category: z.string().optional().describe("Category of the event"),
    region: z.string().optional().describe("Region where the event is located in. e.g. east, west"),
    filter: z.enum(["weekday", "weekend", "range", "any"]).optional().describe("Time filter: weekday, weekend or range."),
    start_date: z.string().optional().describe("Start date for range filter (YYYY-MM-DD)."),
    end_date: z.string().optional().describe("End date range filter (YYYY-MM-DD)."),
  }),
  execute: async({category, region, filter, start_date, end_date}) => {
    try {
      const params = new URLSearchParams();
      if(category) params.append("category", category);
      if(region) params.append("region", region);
      if(filter) params.append("filter", filter);
      if(filter === "range" && start_date && end_date) {
        params.append("start_date", start_date);
        params.append("end_date", end_date);
      }
      console.log(params.toString())
      const res = await axios.get(`${BASE}/events/get_filtered_events?${params.toString()}`);
      const data = res.data?.result ?? res.data ?? [];

      if (Array.isArray(data) && data.length > 0) return data;
      return [];
    } catch (err) {
      console.error("GetFilteredEventsTool Error: ", err);
    }
  }
})

async function runAgent(messages, attempt = 0) {
  const MAX_RECURSION = 1;
  const allowTools = attempt === 0;
  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    ...(allowTools && {
      tools: {
        // getEventsByCategory: getEventsByCategoryTool,
        // getEventsByRegion: getEventsByRegionTool,
        // getEventsByTime: getEventsByTimeTool,
        getFilteredEvents: getFilteredEventsTools,
        getSelectableOptions: getSelectableOptionsTool,
      }
    }),
    // response_format: {type: "json_object"},
  });

  let fullResponse = '';
  for await (const delta of response.textStream) {
    fullResponse += delta;
  }

  const toolCalls = allowTools ? await response.toolCalls : [];
  const toolResults = allowTools ? await response.toolResults : [];
  console.log(fullResponse);

  if (toolCalls.length > 0 && attempt <= MAX_RECURSION) {
    console.log(toolCalls);
    console.log(toolResults);

    for (const tool of toolResults) {
      const data = tool.output?.result ?? tool.output ?? [];
      messages.push({
        role: 'assistant',
        content: `Tool "${tool.toolName}" was used and returned the following data: ${JSON.stringify(data, null, 2)}`,
      });
    }

    return await runAgent(messages, attempt + 1);
  }

  // No more tool usage — parse final text into paragraph + JSON events (if present)
  let parsed = { paragraph: "", events: [], options: [] };
  try {
    const optionsMatch = fullResponse.match(/\{[\s\S]*"values"[\s\S]*\}/);
    const jsonMatch = fullResponse.match(/\[[\s\S]*\]/);
    if (optionsMatch) {
      const optionsObj = JSON.parse(optionsMatch[0]);
      if (optionsObj.options && Array.isArray(optionsObj.options.values)) {
        parsed.options = optionsObj.options.values;
      } else if (Array.isArray(optionsObj.values)) {
        parsed.options = optionsObj.values;
      }
      parsed.paragraph = fullResponse.slice(0, optionsMatch.index).trim();
    } else if (jsonMatch) {
      parsed.events = JSON.parse(jsonMatch[0]);
      parsed.paragraph = fullResponse.slice(0, jsonMatch.index).trim();
    } else {
      parsed.paragraph = fullResponse.trim();
    }
  } catch (err) {
    console.error("Error parsing AI output:", err.message);
    parsed.paragraph = fullResponse.trim();
  }

  console.log(parsed)
  return parsed;
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
    return res.status(500).json({ success: false, error: 'server error' });
  }
})


export default router;