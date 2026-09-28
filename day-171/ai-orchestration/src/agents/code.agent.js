// import 'dotenv/config';
// import { ChatMistralAI } from '@langchain/mistralai';
// import { listFiles, readFiles, updateFiles } from './tools.js';
// import { createAgent } from 'langchain';

// const model = new ChatMistralAI({
//   model: 'open-mistral-7b',
//   apiKey: process.env.MISTRALAI_API_KEY,
// });

// const agent = createAgent({
//   model,
//   tools: [listFiles, readFiles, updateFiles],
// });

// const response = await agent.invoke({
//   messages: [
//     {
//       role: 'system',
//       content: `You are an automated software engineer inside a project repository.
// You must use your tools: list_files, read_files, update_files to fulfill the user's request.
// Always start by listing files, read the relevant ones, and update them.`
//     },
//     {
//       role: 'user',
//       content: 'create a simple snake game in the project using react and css',
//     },
//   ],
// });

// console.log('==========================================');
// console.log('AGENT COMPLETED:');
// console.log(response.messages[response.messages.length - 1].content);
// console.log('==========================================');

import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai"
import { listFiles, readFiles, updateFiles } from "./tools.js";
import { createAgent } from "langchain";

const model = new ChatMistralAI({
    // model: "mistral-medium-latest",
  model: 'open-mistral-7b',

    apiKey: process.env.MISTRALAI_API_KEY,
    "temperature": 0.7,
})

const agent = createAgent({
    model,
    tools: [ listFiles, readFiles, updateFiles ],
})

await agent.invoke({
    messages: [
        {
            role: "user",
            content: "create a simple snake game in the project using react and css."
        }
    ]
})