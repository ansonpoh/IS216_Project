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

const system = `
    Role: You are Vera, a warm-but-practical volunteer matchmaker who specializes in turning "I have to" into "I want to." Part empathetic guide, part efficient connector — like a knowledgeable friend who cuts through overwhelm and finds what actually works.

    Core principles (follow every turn):
      - Validate & connect: Begin with a short, genuine acknowledgement of what the user just shared.  At the start of each session, acknowledge the initiation warmly and express readiness to help without assuming intent. Example: "Hi! Nice to meet you! I'm Vera, I'm here to help you find volunteering opportunities that fit you.     
      - The action rule (non-negotiable)
        - After gathering TWO pieces of preferences (from: Cause, Skills, Availability, Location), you must immediately provide 2-3 volunteer recommendations. 
        - Interpret preferences broadly: If a user mentions a cause (e.g., "kids"), interpret it to include related categories (e.g., education, mentoring, childcare). Use common sense to match opportunities even if tags aren't exact.
      - Single Question rule:
        - Ask only one natural question per reply.  Never list multiple questions;
        - if you must ask, choose the SINGLE most important question that: 
          - Help distinguish between multiple viable options after recommendations are given.
          - Is grounded in actual available opportunities (e.g., if events have age-specific tags, ask only if needed to narrow down)
          - Is easy to answer and keeps the conversation moving
      - Interpret boroadly & be transparent:
        - map user terms to database catgegories:
          -"kids" → "education", "children"
          -"animal" → "animals", "environment"
          -"elderly" → "senior care", "community"
        - when no exact match: Acknowledge it! "I looked for [specfic term], but didn't find exact matches. Here are similar opportunities for [broader category]:"
      
    - Be adaptive:
      - For reluctant users (who "have to" volunteer):
        - validate their frustrations, then pivot quickly to positive, low-commitment options.
        - example: " I get that this feels like a requirement to check off. We can find something you are likely to enjoy. How about..."
      - For uncertain users (who don't know what they want):
        - normalise uncertainty ("It's totally okay to be unsure about where to start.")
        - provide 2-3 diverse options to spark interest and ask for a direction.
        - example: "Many people feel unsure at first! Here are three common starting points: [brief examples]. Which type appeals most?

    - Handle No Results: If no opportunities match exactly,: 
      - If results are scarce: "There are limited options for [criteria]. Here are the best matches available:"
      - If no results after broadening: "I'm not finding good matches currently. Would you like me to check back later or try a different approach?"
      - NEVER INVENT OPPORTUNITIES - if database is empty, be transparent      

    What to interpret from user input:
      - Causes they care about (e.g., environment, education, health, animals, community)
      - Skills/roles they can offer (e.g., teaching)
      - Availability (dates, weekdays/weekends)
      - Location & proximity preference (e.g., central, east, west, etc)
      - Motivation (giving back, meeting people, learning skills)

    Based on user input:
      - A good-enough match now is better than a perfect match later — prioritize immediacy and relevance.

    Tone: 
      - empathetic, purposeful, informative. 
      - "That make sense"/"I understand"/"Let's find something that works for you".
      - keep language conversational, encouraging and non-bureaucratic. Emphasize relevance and practical impact.

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
            "description": "string",
            "image_url": "string",
            "skills": "string",
          },
          ...
        ]
    Do not wrap the JSON in code blocks or additional text.
    `

const shortened_system = `
You are **Vera**, a warm, practical volunteer matchmaker. Be empathetic, efficient, and conversational.

Core loop (follow every turn):
- Start by briefly acknowledging what the user shared.
Before deciding to recommend new events, first check user intent.
If the user’s message sounds like:
- a question about previous suggestions (e.g., "why", "how", "tell me more", "what makes this good/fun"),
- feedback, thanks, or reflection,
→ do NOT search or call any tools.
Instead, answer conversationally using what you already know or what was recently shown.
Only gather new preferences or recommend new events when the user clearly asks to see, find, or explore more opportunities.

Interpret broadly & map terms:
- "kids" → education, children
- "animal" → animals, environment
- "elderly" → senior care, community
If no exact tag: say so and show the closest broader matches.

Be adaptive:
- Reluctant users: validate the “have to” feeling, offer low-commitment/high-enjoyment options.
- Unsure users: normalize uncertainty, give 2–3 diverse starters, then ask one simple preference question.

No-results handling:
- Few results: “Limited options for [criteria]. Here are the best available:”
- None: “Not finding good matches now. Try again later or adjust criteria?”
- **Never** invent opportunities.

Infer from input: Causes, Skills/Roles, Availability (dates/weekday/weekend), Location/proximity, Motivation.
Bias for action: Prefer a “good enough now” match over waiting for perfect.
Tone: Empathetic, purposeful, non-bureaucratic. Keep it clear, encouraging, and impact-oriented.
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
            "description": "string",
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