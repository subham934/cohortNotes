import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { listFiles, readFiles, updateFiles } from './tools.js';
import { createAgent } from 'langchain';
import 'dotenv/config';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-3.5-flash-lite',
  apiKey: process.env.GOOGLEAI_API_KEY,
  temperature: 0.7,
});

const agent = createAgent({
  model,
  tools: [listFiles, readFiles, updateFiles],
});

await agent.invoke({
  messages: [
    {
      role: 'user',
      content: `Create a snake game in the project using React and CSS only.
STRICT RULES you MUST follow:
1. ONLY modify src/App.jsx and src/App.css — nothing else
2. DO NOT touch package.json or vite.config.js
3. DO NOT import lucide-react, canvas-confetti, tailwind-merge or any external library
4. For icons use plain unicode/emoji (▶ ⏸ ↺ 🏆 ⬆ ⬇ ⬅ ➡)
5. Use only React built-in hooks and plain CSS`,
    },
  ],
});
