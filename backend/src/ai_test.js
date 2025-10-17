import { createOpenAI } from '@ai-sdk/openai';
import {streamText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';
import * as readline from 'node:readline/promises';
import axios from "axios";

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const messages = [];
const BASE = "http://localhost:3001";

const getAllEventsTool = tool({
  description: "Retreives a list of all volunteering events from the backend api.",
  inputSchema: z.object({}),
  execute: async () => {
    const res = await axios.get(`${BASE}/events/get_all_events`);
    return res.data;
  }
})

const getEventByCategoryTool = tool({
  description: "Retreives a list of volunteering events that belong to a specific category from the backend api.",
  inputSchema: z.object({
    category: z.string().describe("The event category to filter by")
  }),
  execute: async ({category}) => {
    try {
      const res = await axios.get(`${BASE}/events/get_events_by_category?category=${encodeURIComponent(category.toLowerCase())}`);

      const similar = res.data.result.filter(event => {
        event.category.toLowerCase().includes(category.toLowerCase);
      })
      
      if(res.data.length > 0) {
        return res.data;
      } else if (similar.length > 0) {
        return similar
      } else {
        return [];
      }
    } catch (err) {
      console.error("GetEventsByCategoryTool Error: ", err);
      return {error: err};
    }
  }
})


async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const response = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      tools: { 
        getAllEvents: getAllEventsTool,
        getEventByCategory: getEventByCategoryTool,
      },
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of response.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    const toolCalls = await response.toolCalls;
    const toolResults = await response.toolResults;

    if(toolResults.length > 0) {
      const tool = toolResults[0];
      const output = tool.output;
      if(output.result == undefined) {
        messages.push({
          role: "tool",
          content: JSON.stringify(output),
          name: toolResults[0].toolName,
        })
      } else {
        const data = output.result;
        messages.push({
          role: "tool",
          content: JSON.stringify(data),
          name: toolResults[0].toolName,
        })
      }
    }

    if(toolCalls.length > 0 && toolResults.length > 0) {
      const followup = await streamText({
        model: openai('gpt-4o-mini'),
        messages,
      });
    }


    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);