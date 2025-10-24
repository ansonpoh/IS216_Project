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
  description: "Retrieve volunteering events filtered by category only. Use this when the user specifies a single category (e.g., 'environment', 'education') without mentioning region or time.",
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
  description: "Retrieve volunteering events located in a specific region only. Use this when the user mentions only the region (e.g., 'north', 'east', 'central') without specifying a category or date.",
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
  description: "Retreive a list of volunteering events filtered by time only (weekday, weekend, or date range) from backend api. Use this when the user’s request focuses purely on timing without mentioning category or region.",
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
    including category (e.g. environment, education), region (e.g. east, west, central),
    and time (weekday, weekend, or specific date range).
    Use this tool when the user asks for events that combine multiple filters,
    If the user only specifies one filter (just category, region, or time),
    use the corresponding single-parameter tool instead.
  `,
  inputSchema: z.object({
    category: z.string().optional().describe("Category of the event"),
    region: z.string().optional().describe("Region where the event is located in. e.g. east, west"),
    filter: z.enum(["weekday", "weekend", "range"]).optional().describe("Time filter: weekday, weekend or range."),
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

      const res = await axios.get(`${BASE}/events/get_filtered_events?${params.toString()}`);
      const data = res.data?.result ?? res.data ?? [];

      if (Array.isArray(data) && data.length > 0) return data;
      return [];
    } catch (err) {
      console.error("GetFilteredEventsTool Error: ", err);
    }
  }
})

// --- NEW: filter events by weekdays/weekends using start_date / end_date ---
// const getEventsByWeekTool = tool({
//   description: "Retrieves events filtered by week type: 'weekdays' (Mon-Fri) or 'weekends' (Sat-Sun). Uses start_date and end_date fields and handles multi-day events.",
//   inputSchema: z.object({
//     weekType: z.enum(['weekdays','weekends']).describe("Either 'weekdays' or 'weekends'")
//   }),
//   execute: async ({ weekType }) => {
//     try {
//       const res = await axios.get(`${BASE}/events/get_all_events`);
//       const data = res.data?.result ?? res.data ?? [];

//       const parseDate = (val) => {
//         if (!val) return null;
//         // Accept Date object, ISO string, or SQL date string
//         const d = (val instanceof Date) ? val : new Date(val);
//         return (d && !isNaN(d)) ? d : null;
//       };

//       const rangeHasWeekend = (start, end) => {
//         if (!start || !end) return null;
//         // iterate day by day to detect any weekend day
//         const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
//         const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
//         for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
//           const dow = d.getDay(); // 0 = Sun, 6 = Sat
//           if (dow === 0 || dow === 6) return true;
//         }
//         return false;
//       };

//       const filtered = data.filter(event => {
//         // prefer explicit fields start_date/end_date; if end_date missing use start_date
//         const rawStart = event.start_date ?? event.startDate ?? event.date ?? null;
//         const rawEnd = event.end_date ?? event.endDate ?? null;

//         const start = parseDate(rawStart);
//         const end = parseDate(rawEnd) || start;

//         // If recurring_days present, use that
//         if (!start && Array.isArray(event.recurring_days) && event.recurring_days.length) {
//           const days = event.recurring_days.map(d => String(d).toLowerCase());
//           const wantsWeekend = weekType === 'weekends';
//           const hasWeekend = days.includes('saturday') || days.includes('sunday') || days.includes('sat') || days.includes('sun');
//           return wantsWeekend ? hasWeekend : !hasWeekend;
//         }

//         // If we can't parse dates, exclude (or change to include)
//         if (!start) return false;

//         const hasWeekend = rangeHasWeekend(start, end);
//         if (hasWeekend === null) return false;

//         return weekType === 'weekends' ? hasWeekend : !hasWeekend;
//       });

//       return filtered;
//     } catch (err) {
//       console.error("GetEventsByWeekTool Error:", err?.message ?? err);
//       return { error: err?.message ?? String(err) };
//     }
//   }
// });

async function runAgent(messages) {

  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: {
      // getAllEvents: getAllEventsTool,
      getEventsByCategory: getEventsByCategoryTool,
      getEventsByRegion: getEventsByRegionTool,
      getEventsByTime: getEventsByTimeTool,
      getFilteredEvents: getFilteredEventsTools,
      // getEventsByWeek: getEventsByWeekTool,
    },
    response_format: {type: "json_object"},
  });

  let fullResponse = '';
  for await (const delta of response.textStream) {
    fullResponse += delta;
  }

  const toolCalls = await response.toolCalls;
  const toolResults = await response.toolResults;
  console.log(fullResponse);

  if (toolCalls.length > 0 && toolResults.length > 0) {
    console.log(toolCalls);
    console.log(toolResults);
    for (const tool of toolResults) {
      const data = tool.output?.result ?? tool.output ?? [];
      messages.push({
        role: 'assistant',
        content: `Tool "${tool.toolName ?? 'unknown'}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
      });
    }
    // allow one more synthesis pass
    // if (attempt < MAX_ATTEMPTS) return await runAgent(messages, expectedOrder, attempt + 1);
    return await runAgent(messages);
  }

  // No more tool usage — parse final text into paragraph + JSON events (if present)
  let parsed = { paragraph: "", events: [] };
  try {
    const jsonMatch = fullResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      parsed.events = JSON.parse(jsonMatch[0]);
      parsed.paragraph = fullResponse.slice(0, jsonMatch.index).trim();
    } else {
      parsed.paragraph = fullResponse.trim();
    }
  } catch (err) {
    console.error("Error parsing AI output:", err.message);
    parsed.paragraph = fullResponse.trim();
  }

  return parsed;
}

router.post("/", async (req,res) => {
  try {
    const {userMessage, history = []} = req.body;

    // map user types to the desired call order (tool names)
    // const expectedOrderMap = {
    //   general: ['getEventsByRegion', 'getEventsByCategory'],
    //   limited_time: ['getEventsByWeek', 'getEventsByRegion'],
    //   skill_based: ['getEventsByCategory', 'getEventsByRegion'],
    //   default: []
    // };
    // const expectedOrder = expectedOrderMap[userType] ?? expectedOrderMap.default;

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