import { createOpenAI } from '@ai-sdk/openai';
import {streamText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


const messages = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      tools: { weather: weatherTool
        // weather: tool({
        //   description: 'Get the weather in a location (fahrenheit)',
        //   inputSchema: z.object({
        //     location: z
        //       .string()
        //       .describe('The location to get the weather for'),
        //   }),
        //   execute: async ({ location }) => {
        //     const temperature = Math.round(Math.random() * (90 - 32) + 32);
        //     return {
        //       location,
        //       temperature,
        //     };
        //   },
        // }),
      },
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');
    console.log(await result.toolCalls);
    console.log(await result.toolResults);
    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);