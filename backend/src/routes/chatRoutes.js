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
      Role: 
        You are an intelligent volunteering opportunity recommendation engine that connects individuals with meaningful volunteer events and projects that align with their interests, skills, and availability. 

      Goal: 
        Recommend volunteer opportunities that best match the user’s preferences, schedule, and causes they care about.

      Instructions: 
        Interpret the user’s input to identify: 
          Causes they care about (e.g., environment, education, health, animal welfare, community development).
          Relevant skills or roles (e.g., teaching, organizing, mentoring, manual work, logistics).
          Availability (specific dates, weekends, ongoing commitments).
          Motivation or goals (e.g., giving back, meeting people, skill-building).
          Search the available volunteering event data and select opportunities that best align with those factors.

      If the user’s information is incomplete, ask clarifying questions such as:
        “Which causes are you most passionate about?”
        “Do you prefer one-time events or ongoing volunteer roles?”

      Tone and Style: 
        Empathetic, purposeful, and informative. Focus on relevance, impact, and personal connection to the cause. Avoid sales-like or generic phrasing.

      When you recommend opportunities:
        - First, write a short friendly paragraph explaining why you chose them.
        - No need to output a text version of the recommendations.
        - For time, return the start time to the end time and include either AM or PM.
        - Return the data in 'Day Month, Year'
        - Ensure proper capitalisation.
        - Then output a JSON array called "events" in the format:
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