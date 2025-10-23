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
  description: "Retreive a list of volunteering events that are located in a specific region from backend api.",
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

// --- NEW: filter events by weekdays/weekends using start_date / end_date ---
const getEventsByWeekTool = tool({
  description: "Retrieves events filtered by week type: 'weekdays' (Mon-Fri) or 'weekends' (Sat-Sun). Uses start_date and end_date fields and handles multi-day events.",
  inputSchema: z.object({
    weekType: z.enum(['weekdays','weekends']).describe("Either 'weekdays' or 'weekends'")
  }),
  execute: async ({ weekType }) => {
    try {
      const res = await axios.get(`${BASE}/events/get_all_events`);
      const data = res.data?.result ?? res.data ?? [];

      const parseDate = (val) => {
        if (!val) return null;
        // Accept Date object, ISO string, or SQL date string
        const d = (val instanceof Date) ? val : new Date(val);
        return (d && !isNaN(d)) ? d : null;
      };

      const rangeHasWeekend = (start, end) => {
        if (!start || !end) return null;
        // iterate day by day to detect any weekend day
        const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          const dow = d.getDay(); // 0 = Sun, 6 = Sat
          if (dow === 0 || dow === 6) return true;
        }
        return false;
      };

      const filtered = data.filter(event => {
        // prefer explicit fields start_date/end_date; if end_date missing use start_date
        const rawStart = event.start_date ?? event.startDate ?? event.date ?? null;
        const rawEnd = event.end_date ?? event.endDate ?? null;

        const start = parseDate(rawStart);
        const end = parseDate(rawEnd) || start;

        // If recurring_days present, use that
        if (!start && Array.isArray(event.recurring_days) && event.recurring_days.length) {
          const days = event.recurring_days.map(d => String(d).toLowerCase());
          const wantsWeekend = weekType === 'weekends';
          const hasWeekend = days.includes('saturday') || days.includes('sunday') || days.includes('sat') || days.includes('sun');
          return wantsWeekend ? hasWeekend : !hasWeekend;
        }

        // If we can't parse dates, exclude (or change to include)
        if (!start) return false;

        const hasWeekend = rangeHasWeekend(start, end);
        if (hasWeekend === null) return false;

        return weekType === 'weekends' ? hasWeekend : !hasWeekend;
      });

      return filtered;
    } catch (err) {
      console.error("GetEventsByWeekTool Error:", err?.message ?? err);
      return { error: err?.message ?? String(err) };
    }
  }
});

async function runAgent(messages, expectedOrder = [], attempt = 0) {
  // limit retries to avoid infinite recursion
  const MAX_ATTEMPTS = 1;

  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: {
      getAllEvents: getAllEventsTool,
      getEventsByCategory: getEventsByCategoryTool,
      getEventsByRegion: getEventsByRegionTool,
      getEventsByWeek: getEventsByWeekTool, // <-- add this
    },
    response_format: {type: "json_object"},
  });

  let fullResponse = '';
  for await (const delta of response.textStream) {
    fullResponse += delta;
  }

  const toolCalls = (await response.toolCalls) ?? [];
  const toolResults = (await response.toolResults) ?? [];
  console.log("AI response text:", fullResponse);
  console.log("toolCalls:", toolCalls.map(c => c.toolName));
  // Enforce expected order if provided
  if (Array.isArray(expectedOrder) && expectedOrder.length > 0 && toolCalls.length > 0) {
    const observed = toolCalls.map(c => c.toolName);
    const matchesOrder = expectedOrder.every((name, idx) => {
      const pos = observed.indexOf(name);
      if (pos === -1) return false;
      for (let j = 0; j < idx; j++) {
        if (observed.indexOf(expectedOrder[j]) > pos) return false;
      }
      return true;
    });

    if (!matchesOrder && attempt < MAX_ATTEMPTS) {
      console.warn(`Tool order mismatch. Expected: ${expectedOrder.join(' -> ')}; observed: ${observed.join(' -> ')}`);
      messages.push({
        role: 'assistant',
        content: `Please call tools in this order: ${expectedOrder.join(' then ')}.`,
      });
      return await runAgent(messages, expectedOrder, attempt + 1);
    }
  }

  // If tools were called and produced results, feed them back and allow the model to synthesize
  if (toolCalls.length > 0 && toolResults.length > 0) {
    for (const tool of toolResults) {
      const data = tool.output?.result ?? tool.output ?? [];
      messages.push({
        role: 'assistant',
        content: `Tool "${tool.toolName ?? 'unknown'}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
      });
    }
    // allow one more synthesis pass
    if (attempt < MAX_ATTEMPTS) return await runAgent(messages, expectedOrder, attempt + 1);
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
    const {userMessage, history = [], userType } = req.body;

    // map user types to the desired call order (tool names)
    const expectedOrderMap = {
      general: ['getEventsByRegion', 'getEventsByCategory'],
      limited_time: ['getEventsByWeek', 'getEventsByRegion'],
      skill_based: ['getEventsByCategory', 'getEventsByRegion'],
      default: []
    };
    const expectedOrder = expectedOrderMap[userType] ?? expectedOrderMap.default;

    const messages = [
      {role: "system", content: shortened_system},
      ...history,
      {role: "user", content: `${userMessage}${format_reminder}`},
    ];
    const finalResponse = await runAgent(messages, expectedOrder);

    return res.json({ success: true, reply: finalResponse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'server error' });
  }
})


export default router;