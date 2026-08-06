Generative AI = content generate karna [text, code, image, audio, video]

AI service provider = 1.training a LLM 
                      2.hosting a LLM
                      3.providing access via api
                      eg: OpenAI, Google, Anthropic etc.

Prompt = input to LLM

Response = output from LLM

API = way to communicate with LLM

Langchain = jo server aur ASP k beech main communication hota hai, ussey easy process karne k liye use hota hai
Langchain is like mongoose for LLM, jo server aur ASP k beech main communication hota hai, ussey easy process karne k liye use hota hai

//============================================================

// now let use AI to setup the js for taking user input and show the respone from Mistral AI
// we will have to install readline-sync "npm i readline-sync", with the help of which we can take input from user in terminal.

--------
index.js
--------

```javascript

import readline from 'readline';


// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('What is your name? ', (name)=>{
    console.log(`Hello, ${name}!`);
    rl.close();
});




```
=> now, we go to terminal and type node index.js, we can see that it ask "What is your name?" and after entering the name it will show "Hello, [name]!".
=> we have installed readline to take input from user in terminal.


=> now , lets install langchain, "npm i langchain", with the help of which we can easily integrate LLM with our application.
=> but then, to run a particular model we will have to install it too, eg: here, we have installed mistralAI, "npm i @langchain/mistralai"

=> now that we have installed langchain and mistralAI,we will also have to create a env file and add our API key to it.

=> dont forget to install 'npm i dotenv"

//============================================================

1. Steps to Generate a Mistral API Key via Studio
Sign In to Mistral AI

Go to mistral.ai and log in with your credentials.


2. Navigate to Studio

After signing in, go to mistral.ai/products/studio.
Click the "Try Studio" button (top-right corner).


3. Access API Key Settings in Studio

Once inside Studio, look for:
Your profile icon (top-right) → Click it.
Select "Settings" or "API Keys" from the dropdown.


4. Generate New API Key
Click on "Generate API Key" or "Create new key".

You’ll see a pop-up with your new API key (long alphanumeric string).

Copy it immediately.

//===========================

=> now that we have the API Key , we can create the model instance using the API Key.


--------
index.js
--------
```javascript

import "dotenv/config"
import readline from 'readline/promises';
import { ChatMistralAI } from "@langchain/mistralai";


// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const model = new ChatMistralAI({
    modelName: "mistral-small-latest",
});

const response = model.invoke("What is the capital of France?")

console.log(response.text);

rl.close()
```

=> here, we are using mistral, so, to communicate with mistral LLM, we have initiated ChatMistralAI.  and asked a question , now, when we run the file it shows the response from mistral LLM.

=> there is one problem with the above code, our input is static and we can't make changes in runtime. so lets make changes in code::

--------
index.js
--------
```javascript

import "dotenv/config"
import readline from 'readline/promises';
import { ChatMistralAI } from "@langchain/mistralai";


// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const model = new ChatMistralAI({
    modelName: "mistral-small-latest",
});

while(true){
    const userInput = await rl.question("You: ");
    const response = await model.invoke(userInput);
    console.log("Mistral: ", response.text);
}


rl.close()
```
// yaha pe humne while(true) use kiya, jo infinitely chalega jab tak ki hum Ctrl+C dabake process ko stop nahi karte. jab loop ak bar chalega, to wo input lega user se, then wo output dega and then it will again wait for input.

// rl.question user se input lege, aur uska response userInput pe save ho jayega. yehi same input hum model ko denge. hamara model iss input k basis pe ak response dega and we will share the response via console.log().


//===========================

=> ok , now let talk to AI for few chats and ask "what was my first message?", the response i get is:  I don’t have memory between conversations, so I wouldn’t know your first message unless you repeat it for me. If you’d like, you can share it again and I’ll be happy to help!

=> in the terminal , we can see the previous messages but AI dont have it, because all the request are stateless. meaning it only remeber the last request. but in real world, when we text on chatgpt or grok, the AI remembers the previous conversation. that mean , LLM need to remeber previous conversation too. for that we need to implement memory in our application. we will use langchain memory feature for this. our server needs to maintain the chat history.

we will create an array called messages [], and we will store all the messages in it. and we will pass it to the model.


--------
index.js
--------

```javascript

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



```

now we can see what was our previous message

// humne server pe message name ka array create kiya hai, at first the array was empty,
// uskey baad jab humne user se input liya, humne ussey HumanMessage k through array me store karliya, 
// server pura messages array ko as an input model ko pass karega, and model ussey read karega.
// then humne model ko invoke kiya and humko jo response mila humne ussey array me store karliya.

// jab humne ai se poocha ki what was my first meesage, toh kyunki hum messages array send kr rhe the, isiliye AI message array dekh k pura history dekh paya aur uskey baad uss history k basis pe answer de paya.


// issey memory feature implement ho jata hai.



//===========================
// resend email, email varified k baad user ko alag page dikhao
