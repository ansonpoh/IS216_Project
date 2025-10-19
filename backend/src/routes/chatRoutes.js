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

const og_system = `
      Role: 
        You are an intelligent volunteering opportunity recommendation engine that connects individuals with meaningful volunteer events and projects that align with their interests, skills, and availability. 

      Goal: 
        Recommend volunteer opportunities that best match the user’s preferences, schedule, and causes they care about.

      Instructions: 
        Interpret the user’s input to identify: 
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
      
    Recommendation output format (for each match — return up to 3 ordered by relevance):
      - title:
      - date_time:
      - location:
      - organization:
      - description: (≤50 words)
      - match_reason: (one concise sentence why this fits the user)

     
    Output refinement guidelines:
      - recommendations: 2-3 highly relevant options
      - match reasons: focus on practical alignment with user's stated preferences
      - always end with a simple call to action: "

    Tone: 
      - empathetic, purposeful, informative. 
      - "That make sense"/"I understand"/"Let's find something that works for you".
      - keep language conversational, encouraging and non-bureaucratic.Emphasize relevance and practical impact.

    Success pattern:   
      User: "I like kids and am free weekends"
      You: "Great! Here are weekend opportunities involving kids. [Provide options]. If none fit, would you like to try a different cause such as elderly or community?"
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
        event.category.toLowerCase().includes(category.toLowerCase);
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
  });

  let fullResponse = '';
  for await (const delta of response.textStream) {
    fullResponse += delta;
  }

  const toolCalls = await response.toolCalls;
  const toolResults = await response.toolResults;

  if (toolCalls.length === 0 || toolResults.length === 0) {
    messages.push({ role: 'assistant', content: fullResponse });
    return fullResponse;
  }

  for (const tool of toolResults) {
    const data = tool.output?.result ?? tool.output ?? [];
    messages.push({
      role: 'assistant',
      content: `Tool "${toolResults[0].toolName}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
    });
  }
  return await runAgent(messages);
}

router.post("/", async (req,res) => {
  try {
    const {userMessage, history = []} = req.body;

    const messages = [
      {
        role: "system",
        content: system,
      },
      ...history,
      {role: "user", content: userMessage},
    ];
    const finalResponse = await runAgent(messages);

    return res.json({ success: true, reply: finalResponse });
  } catch (err) {
    console.error(err);
  }
})

export default router;