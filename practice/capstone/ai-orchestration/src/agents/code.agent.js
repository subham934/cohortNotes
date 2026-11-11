import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { listFiles, readFiles, updateFiles } from './tools.js';
import { createAgent } from 'langchain';
import 'dotenv/config';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-3.5-flash-lite',
  apiKey: process.env.GOOGLEAI_API_KEY,
  "temperature": 0.7,
});

const agent = createAgent({
  model,
  tools: [listFiles, readFiles, updateFiles],
});

await agent.invoke({
  messages: [
    {
      role: 'user',
      content: 'update theme of the project to light',
    },
  ],
});
