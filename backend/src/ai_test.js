import { createOpenAI } from '@ai-sdk/openai';
import {streamText, tool } from 'ai';
import 'dotenv/config';
import { success, z } from 'zod';
import * as readline from 'node:readline/promises';
import axios from "axios";
import express from "express";

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const router = express.Router();

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const messages = [];
const BASE = "http://localhost:3001";

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

async function runAgent(messages) {
  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: {
      getAllEvents: getAllEventsTool,
      getEventByCategory: getEventsByCategoryTool,
    },
  });

  let fullResponse = '';
  for await (const delta of response.textStream) {
    fullResponse += delta;
    process.stdout.write(delta);
  }
  process.stdout.write('\n');

  const toolCalls = await response.toolCalls;
  const toolResults = await response.toolResults;

  if (toolCalls.length === 0 || toolResults.length === 0) {
    messages.push({ role: 'assistant', content: fullResponse });
    return;
  }

  for (const tool of toolResults) {
    const data = tool.output?.result ?? tool.output ?? [];
    messages.push({
      role: 'assistant',
      content: `Tool "${toolResults[0].toolName}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
    });
  }

  await runAgent(messages);
}

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    if (userInput.trim().toLowerCase() === 'exit') break;
    messages.push({ role: 'user', content: userInput });

    process.stdout.write('\nAssistant: ');
    await runAgent(messages);
    process.stdout.write('\n');
  }
  terminal.close();
  
}

main().catch(console.error);

router.post("/chat", async (req,res) => {
  try {
    const {userMessage, history = []} = req.body;

    const messages = [
      {
        role: "system",
        content: "",
      },
      ...history,
      {role: "user", content: userMessage},
    ];

    const response = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      tools: {
        getAllEvents: getAllEventsTool,
        getEventsByCategory: getEventsByCategoryTool,
      }
    });

    let fullResponse = "";
    for await (const delta of response.textStream) {
      fullResponse += delta;
    }

    const toolCalls = await response.toolCalls;
    const toolResults = await response.toolResults;

    if(toolCalls.length > 0 && toolResults.length > 0) {
      const data = tool.output?.result ?? tool.output ?? [];
      messages.push({
        role: 'assistant',
        content: `Tool "${toolResults[0].toolName}" returned the following data: \n${JSON.stringify(data, null, 2)}`,
      });
    }

    return res.json({
      success: true,
      reply: fullResponse.trim(),
      toolCalls,
      toolResults,
    })

  } catch (err) {
    console.error(err);
  }
})