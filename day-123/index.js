import "dotenv/config";
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, tool, createAgent } from "langchain";
import { sendEmail } from "./mail.service.js";
import * as z from "zod";

// after importing tool , we create a tool called emailTool, this tool requires some arguments to be passed, as it requires object with to, subject, html, text properties, so we use zod to define the schema for the arguments.

//this sendEmail function always returns a string, which confirms the email sent successfully

const emailTool = tool(sendEmail, {
  name: "emailTool",
  description: "use this tool to send an email",
  schema: z.object({
    to: z.string().describe("the receiver's email address"),
    html: z.string().describe("the html content of the email"),
    subject: z.string().describe("the subject of the email"),
  }),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  modelName: "mistral-small-latest",
});

const agent = createAgent({
  model,
  tools: [emailTool],
});

const messages = [];

while (true) {
  const userInput = await rl.question("\x1b[1;36mYou: \x1b[0m");
  messages.push(new HumanMessage(userInput));
  const response = await agent.invoke({
    messages,
  });
  // get the AI's latest message

  messages.push(response.messages[response.messages.length - 1]);

  // console.log("\x1b[1;32mAI:\x1b[0m", messages);
  console.log("\x1b[1;32mAI:\x1b[0m", response);

  
  
}
rl.close();

