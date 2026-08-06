we have seen how to use tools, how to handle memory by server,
today, we will se AI features, API's that interact with AI.

At first we will create a routes file:

---

## Backend/src/sockets/chat.routes.js

import {Router} from 'express';

const chatRouter = Router();

export default chatRouter;

---

now , we will import it inside app.js

---

## Backend/src/app.js

import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import morgan from 'morgan';
import cors from 'cors';
import chatRouter from './sockets/chat.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
cors({
origin: 'http://localhost:5173',
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE'],

})
);
// Health check
app.get('/', (req, res) => {
res.json({ message: 'Server is running at port: 3000' });
});

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);

export default app;

now ,we will create a simple API , it will collect message from user and send it to AI as input, AI will read the input from user and generate a output. This output will be sent to user as response. at first we will create a controller.

---

## Backend/src/controllers/chat.controller.js

export async function sendMessage(req, res){
const { message } = req.body;

console.log(message);
}

---

now , we will import it inside routes file.

---

## Backend/src/sockets/chat.routes.js

import {Router} from 'express';
import { sendMessage } from '../controllers/chat.controller';
const chatRouter = Router();

chatRouter.post("/message", sendMessage)

export default chatRouter;

any user can only avail "sendMessage" api if the user is logged in. So we have to use auth middleware.

---

## Backend/src/sockets/chat.routes.js

import {Router} from 'express';
import { sendMessage } from '../controllers/chat.controller';
import { authUser } from '../middleware/auth.middleware';

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessage)

export default chatRouter;

=> now , if we go to postman , at first we need to login , then we will send a message useing the link::

http://localhost:3000/api/chats/message

=> over the console we can see our message.
=> we can receive message at our backend, it gets authenticated only then it could send message. we need to feed this message to AI and return an output to to user which the AI generates as its output.

=> inside ai.service.js , we will write a function , which will take message from user and return an output.

---

## Backend/src/services/ai.service.js

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from 'langchain';

const model = new ChatGoogleGenerativeAI({
model: 'gemini-2.5-flash-lite',
apiKey: process.env.GEMINI_API_KEY,
});

export async function generateResponse(message) {
const response = await model.invoke([new HumanMessage(message)]);
return response.text;
};

=> now we will import this function inside chat.controller.js and make sure we get a response from AI.

---

## Backend/src/controllers/chat.controller.js

import { generateResponse } from "../services/ai.service.js";

export async function sendMessage(req, res){
const { message } = req.body;

    const result = await generateResponse(message)

    res.json({
        response: result
    })

}

=> now, our basic integration is done . we will create a feature where, when we go to GPT and type our message in the input field, the message goes to GPT and a new chat gets created. The title of that chat is decided by AI itself. we need to create this feature. we need to create a function for that and use Mistral AI to generate chat titles. lets install mistralAI::

npm i @langchain/mistralai

also import MISTRAL_API_KEY in .env file

now , lets create a funciton inside ai.service.js

```javascript
export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([]);
}
```

//now, we need to tell mistral that "aapko ak message diya jayega, uss message k basis pe ak title generate karo", to give such instruction , we use SystemMessage for custom instructions. and for the user message, we use HumanMessage.

---

## Backend/src/services/ai.service.js

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from 'langchain';

const geminiModel = new ChatGoogleGenerativeAI({
model: 'gemini-2.5-flash-lite',
apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
model: 'mistral-small-latest',
apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(message) {
const response = await geminiModel.invoke([new HumanMessage(message)]);
return response.text;
}

export async function generateChatTitle(message) {

    const response = await mistralModel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.

            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-6 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])

    return response.text;

}

//===================================
now, we will import the "generateChatTitle" function inside "chat.controller.js"

---

## Backend/src/controllers/chat.controller.js

import { generateResponse, generateChatTitle } from "../services/ai.service.js";

export async function sendMessage(req, res){
const { message } = req.body;

    const title = await generateChatTitle(message);
    console.log(title)
    const result = await generateResponse(message)


    res.json({
        AIMessage: result,
        title
    })

}

now, lets go to postman and send a request, in the URL http://localhost:3000/api/chats/message where the message will be "What is docker and how we use it in AWS?" , then we can see in our terminal, the title that states "Understanding Docker on AWS" , and in response we will get the text that is generated by AI.

//=====================================
now that title is generated, we need to create a chat ki jo user hai wo chat kar paye

---

## Backend/src/controllers/chat.controller.js

import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res){
const { message } = req.body;

    const title = await generateChatTitle(message);

    const result = await generateResponse(message)

    const chat = await chatModel.create({
        user: req.user.id,
        title
    })

    const aiMessage = await messageModel.create({
        chat: chat._id,
        content: result,
        role: "ai"
    })

res.status(201).json({
title,
chat,
aiMessage
})

}

=> now, whenever we go to postman and send a message, we receive title and AI response. in backend we also create a chat and AI message in DB
=> the response is as below:::

{
"title": "Superman Explained Simply",
"chat": {
"user": "6a04a18ffd18019fe50bbcdf",
"title": "Superman Explained Simply",
"\_id": "6a144e2d278708ddc9ab2930",
"createdAt": "2026-05-25T13:27:09.057Z",
"updatedAt": "2026-05-25T13:27:09.057Z",
"**v": 0
},
"aiMessage": {
"chat": "6a144e2d278708ddc9ab2930",
"content": "Superman is one of the most iconic and enduring superheroes in popular culture. Here's a breakdown of who he is:\n\n**Origin Story:**\n\n\* **Kryptonian Heritage:**first appearing in **Action Comics #1 in 1938**. He has since become a global phenomenon, appearing in countless comic books, television shows, movies, animated series, radio dramas, and video games. He has influenced the superhero genre immensely and continues to be a beloved and recognizable character worldwide.",
"role": "ai",
"\_id": "6a144e2d278708ddc9ab2931",
"createdAt": "2026-05-25T13:27:09.120Z",
"updatedAt": "2026-05-25T13:27:09.120Z",
"**v": 0
}
}
//=====================================
=> till now, we have created an API , when we send a message, and if it is the first message of the chat, wo title generate karta hai, ak chat create karta hai aur jo bhi AI ka response hota hai uss response ko send karta hai

=> now, we have generateResponse, generateChatTitle, now for a full flaged app, we need to store every message , and we need to send it back to the user when they send a message in a chat. that response should also have all the messages of the chat.

-> now in the controller, we need to save AI's message and the user's message aswell. we have saved AI's message in the last step. now we need to save user's message.

---
```javascript
## Backend/src/controllers/chat.controller.js

import { generateResponse, generateChatTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {
const { message } = req.body;

const title = await generateChatTitle(message);

const result = await generateResponse(message);

const chat = await chatModel.create({
user: req.user.id,
title,
});


// with this below line of code, the user's message will also be saved in DB.
const userMessage = await messageModel.create({
chat: chat._id,
content: message,
role: 'user',
});

const aiMessage = await messageModel.create({
chat: chat._id,
content: result,
role: 'ai',
});

res.status(201).json({
title,
chat,
aiMessage,
});
}
```
//=================================

=> humlog har bar nayi chat nahi create karte, kabhi kabhi hum log ek he chat mein messages add karte rehte hai(follow up messages of that chat).

=> Toh follow up karne k liye humko batana padega ki "kis chat ka message hai ye" aur "aapka question kya hai", dono hi cheez hum hamare backend pe bhejenge aur backend pe message k saath chatId bhi aayega.

=> agar chatId aah rahi hai,toh chat ka title already database mein present hoga, toh humko wapis se title aur chat create karni nahi padegi. Jo chat hai uska followup message jaa rahi hai, for this we write as

```javascript
-----------------------------------
Backend/src/controllers/chat.controller.js
-----------------------------------

let chat = null,
  title = null;

if (!chatId) {
  title = await generateChatTitle(message);
  chat = await chatModel.create({
    user: req.user.id,
    title,
  });
}
```

//aab , uss chat k ander jinte massage hua , hum unko fetch karenge

```javascript
const messages = await messageModel.find({
  chat: chatId,
});

console.log(messages);

//========================================
// yeh jo "messages" hai yeh basically pura old chat hai, jo previous hai uss chat ko hum frontend ko bhejenge, taaki frontend ko pata chal jaye ki 'ye followup hai'
// ab hum log uss chat ko AI ko denge, jiske basis par AI naya response generate karega
// if we type this 
// {
//     "message": "how we deploy a docker image on AWS ECS",
//     "chat": "6a1486fa4bf8da69e7c6e60b"
// }

// humne already ak message kar diya tha, uski chat create ho gayi thi, aab, usi chat ki followup le rehe hai, toh frontend se batana zaroori ho jata hai, ki "iss chat ka followup hai".
// iss ke liye humko chatId leni padegi, and usko hum DB pe check karenge

// agar chatId hai, toh uss chat k ander jitne message hai unko hum frontend ko bhej denge, that means, frontend ko pata chal jata hai ki 'ye followup hai'


//=========================================

-----------------------------------
Backend/src/controllers/chat.controller.js
-----------------------------------

import { generateResponse, generateChatTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let chat = null,
    title = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: 'user',
  });

  const messages = await messageModel.find({
    chat: chatId || chat._id,
  });

  console.log(messages)

}

// yaha pe jo "messages" hai, iska basically yeh matlab hai ki, iss chat mein jitne bhi message hue hai(user+ai), wo sab yaha pe hai.toh hum jab isko console.log(messages) karte hai toh jitne bhi previous messages hai, sab humko show hota hai, including the recent message. iska formatt hai 
 
// if we type as below and send this request in postman with URL: http://localhost:3000/api/chats/message  we will get the entire chat history in the terminal including the recent message which we send via postman:

// {
//     "message": "how we deploy a docker image on AWS ECS",
//     "chat": "6a1486fa4bf8da69e7c6e60b"
// }

// now that we have fetch all the previous messages, ab humko AI se response generate karvana hai, ab iss "messages" ko hum AI ko denge, and AI uss basis par response generate karega. and as usual, we will create chat and ai_message in DB, and res send with response from AI, so we will pass the message in `generateResponse` function  which is stored in a variable "result", we will pass this "result" as content of aiMessage.

import { generateResponse, generateChatTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let chat = null,
    title = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: 'user',
  });

  const messages = await messageModel.find({
    chat: chatId || chat._id,
  });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: 'ai',
  });

  res.status(201).json({
    title,
    chat,
    aiMessage,
  });
}

// we also need to make changes in generateResponse where the new parameter will be messages::
----------------------------------
Backend/src/services/ai.service.js
----------------------------------


import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage, AIMessage } from 'langchain';

const geminiModel = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash-lite',
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(
    messages.map((msg) => {
      if (msg.role == 'user') {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    })
  );
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-6 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
    new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `),
  ]);

  return response.text;
}


```
//==========================================
now, lets understand the entire flow, here we have few things::

1. AI
2. User
3. Server
4. Database

a). User → Server: User sends a fresh message (e.g., "Hi, explain Node.js to me").

b). Server → AI (Title Generation): Before generating the main answer, the server makes a quick, lightweight call to the AI: "Generate a short 3-4 word title for this prompt: 'Hi, explain Node.js to me'".

c). AI → Server: AI returns something like "Node.js Explanation".

d). Server → DB (Create Chat): The server creates a new entry in the Chats table with a unique chatId and the generated title.

e). Server → DB (Save User Message): The user's initial message is saved to the Messages table linked to that chatId.

f). Server → AI (Main Response): The server sends the user's message to the AI to get the actual answer.

g). AI → Server: AI returns the comprehensive response about Node.js.

h). Server → DB (Save AI Message): The server inserts this AI response into the Messages table as an aiMessage.

i). Server → User: Finally, the response (and usually the chatId and title) is sent back to the frontend.

j). User → Server: User types a follow-up message (e.g., "Give me a code example"). The frontend automatically attaches the chatId to this request.

k). Server → DB (Fetch History): The server asks the DB: "Give me all previous messages where chatId = XYZ ordered by timestamp".

l). DB → Server: Returns the history array: [{user: "Hi, explain Node..."}, {ai: "Node.js is a runtime..."}].

m). Server → DB (Save New Prompt): The server saves the new user message ("Give me a code example") into the database.

n). Server → AI (Full Context): The server constructs an array containing the entire history + the new user message and sends it to the AI.

o). AI → Server: The AI reads the history, understands what "Node.js" refers to, and generates the code example response.

p). Server → DB (Save New Response): The server saves this new AI response into the database.

q). Server → User: The server sends the response back to the user's screen.

//===============================

hum 2 API create karenge, ak controrller create karenge jo user ki chat fetch karke le ayega. dusra controller ak perticular chat k jitne bhi msg hai , wo return karega

------------------------------------------
Backend/src/controllers/chat.controller.js
------------------------------------------

import { generateResponse, generateChatTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let chat = null,
    title = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: 'user',
  });

  const messages = await messageModel.find({
    chat: chatId || chat._id,
  });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: 'ai',
  });

  res.status(201).json({
    title,
    chat,
    aiMessage,
  });
}

export async function getChats(req, res) {
  const user = req.user;

  const chats = await chatModel.find({
    user: user.id,
  });

  res.status(200).json({
    message: 'Chats retrieved successfully',
    chats,
  });
}


// yeh ak perticular chat k jitne bhi msg hai , wo return karega
export async function getMessages(req, res) {
  const { chatId } = req.params;

  // yeh below 'chat' check karega ki , yeh chat , user ka hai ya nahi , agar user nahi hoga toh 404 return karega
  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: 'Chat not found',
    });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });

  res.status(200).json({
    message: 'Messages retrieved successfully',
    messages,
  });
}

//=================================
=> now we will integrate in API

==================================
Backend/src/sockets/chat.routes.js
==================================

import { Router } from 'express';
import {
  sendMessage,
  getChats,
  getMessages,
} from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const chatRouter = Router();

chatRouter.post('/message', authUser, sendMessage);
chatRouter.get('/', authUser, getChats);
chatRouter.get('/:chatId/messages', authUser, getMessages);

export default chatRouter;


//=> if we go to postman and check with a get request localhost:3000/api/chats/ after login, we will get our chat list


//=> and if we go to postman and check with a get request localhost:3000/api/chats/:chatId/messages, we will get messages of that perticular chat


======================================

now , we will create an API to delete a chat

lets create the controller

------------------------------------------
Backend/src/controllers/chat.controller.js
------------------------------------------
export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await messageModel.deleteMany({
    chat: chatId,
  });

  if (!chat) {
    return res.status(404).json({
      message: 'Chat not found',
    });
  }

  res.status(200).json({
    message: 'Chat deleted successfully',
  });
}


==================================
Backend/src/sockets/chat.routes.js
==================================
import { Router } from 'express';
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat
} from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const chatRouter = Router();

chatRouter.post('/message', authUser, sendMessage);
chatRouter.get('/', authUser, getChats);
chatRouter.get('/:chatId/messages', authUser, getMessages);
chatRouter.delete('/delete/:chatId', authUser, deleteChat)

export default chatRouter;



//=> and if we go to postman and check with a delete request localhost:3000/api/chats/delete/:chatId, we will delete that chat and its messages.

