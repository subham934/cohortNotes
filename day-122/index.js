import "dotenv/config"
import readline from 'readline/promises';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const model = new ChatMistralAI({
    modelName: "mistral-small-latest",
});

const messages = [];

while(true){
    const userInput = await rl.question("\x1b[1;36mYou: \x1b[0m");
    messages.push(new HumanMessage(userInput));
    const response = await model.invoke(messages);
    messages.push(response.text)
    console.log("\x1b[1;32mMistral:\x1b[0m", response.content);
    console.log("\x1b[2m" + "─".repeat(50) + "\x1b[0m");
}


rl.close();

