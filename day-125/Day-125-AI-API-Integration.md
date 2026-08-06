# Day 125 — AI Features & API Integration (Hinglish Notes) 🤖

> **Topic:** Backend mein AI integrate karna — Gemini + Mistral ke saath full chat system banana

---

## 📁 Project Structure (Jo files humne banai)

```
Backend/src/
├── sockets/
│   └── chat.routes.js        ← Chat ke liye routes
├── controllers/
│   └── chat.controller.js    ← Business logic
├── services/
│   └── ai.service.js         ← AI models ke saath communication
└── app.js                    ← Main app file
```

---

## STEP 1 — Router Setup

### `chat.routes.js` banao

```js
import { Router } from 'express';
const chatRouter = Router();
export default chatRouter;
```

**Kya ho raha hai?**
Express ka `Router()` use karke ek dedicated router banaya — jaise ek alag "department" — jo sirf chat se related requests handle karega.

---

### `app.js` mein import karo

```js
import chatRouter from './sockets/chat.routes.js';

app.use('/api/chats', chatRouter);
```

**Kya ho raha hai?**
Ab koi bhi request jo `/api/chats/...` pe aayegi, wo directly `chatRouter` ke paas jayegi. Jaise ek receptionist jo specific department ko forward karta hai.

---

## STEP 2 — Basic Controller (Message receive karna)

```js
// chat.controller.js
export async function sendMessage(req, res) {
  const { message } = req.body;
  console.log(message);
}
```

**Kya ho raha hai?**
User jo message bhejta hai (`req.body.message`), wo server console pe print hota hai. Abhi sirf "sun" raha hai, kuch respond nahi kar raha.

---

## STEP 3 — Auth Middleware Lagao (Security)

```js
// chat.routes.js
import { authUser } from '../middleware/auth.middleware';

chatRouter.post('/message', authUser, sendMessage);
```

**Kya ho raha hai?**
`authUser` ek "bouncer" hai — pehle check karta hai ki user logged in hai ya nahi. Agar nahi hai toh request block ho jaati hai. Agar hai toh `sendMessage` controller chalega.

> **Flow:** Request → `authUser` (check karo) → `sendMessage` (message process karo)

---

## STEP 4 — AI Service banana

### `ai.service.js` — Gemini se response lena

```js
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from 'langchain';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash-lite',
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateResponse(message) {
  const response = await model.invoke([new HumanMessage(message)]);
  return response.text;
}
```

**Kya ho raha hai?**

| Cheez | Matlab |
|---|---|
| `ChatGoogleGenerativeAI` | Google ka Gemini model LangChain ke through use karna |
| `HumanMessage` | User ka message proper format mein wrap karna |
| `model.invoke([...])` | AI ko call karna — "ye lo message, jawab do" |
| `response.text` | AI ka actual text response extract karna |

---

## STEP 5 — Controller mein AI connect karo

```js
import { generateResponse } from '../services/ai.service.js';

export async function sendMessage(req, res) {
  const { message } = req.body;

  const result = await generateResponse(message);

  res.json({ response: result });
}
```

**Kya ho raha hai?**
User ka message AI ko diya, AI ne response diya, woh response user ko wapis bhej diya. Basic loop complete! ✅

---

## STEP 6 — Chat Title Feature (Mistral AI)

Jab user pehla message bhejta hai, AI automatically ek **title** generate kare (jaise ChatGPT karta hai).

### Install karo:
```bash
npm i @langchain/mistralai
```

### `ai.service.js` mein Mistral model add karo:

```js
import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from 'langchain';

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates concise and descriptive titles 
      for chat conversations. Generate a title in 2-6 words.
    `),
    new HumanMessage(`
      Generate a title for: "${message}"
    `)
  ]);
  return response.text;
}
```

**Kya ho raha hai?**

| Concept | Explanation |
|---|---|
| `SystemMessage` | AI ko "instructions" dena — ye batana ki AI ka role kya hai |
| `HumanMessage` | User ka actual input |
| `mistralModel.invoke([...])` | Dono messages ek saath bhejo — system instruction + user message |

> **Kyun Mistral?** Title generate karna ek chhota, fast kaam hai — heavyweight model (Gemini) waste hoga. Mistral lightweight aur fast hai is kaam ke liye.

---

## STEP 7 — Database mein Chat Save karna

```js
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {
  const { message } = req.body;

  const title = await generateChatTitle(message);
  const result = await generateResponse(message);

  // Nayi chat DB mein create karo
  const chat = await chatModel.create({
    user: req.user.id,
    title,
  });

  // User ka message save karo
  const userMessage = await messageModel.create({
    chat: chat._id,
    content: message,
    role: 'user',
  });

  // AI ka response save karo
  const aiMessage = await messageModel.create({
    chat: chat._id,
    content: result,
    role: 'ai',
  });

  res.status(201).json({ title, chat, aiMessage });
}
```

**Kya ho raha hai (step by step)?**
1. User message bhejta hai
2. Mistral se **title generate** hota hai
3. Gemini se **AI response** generate hota hai
4. DB mein **nayi chat** create hoti hai (user ID + title ke saath)
5. **User ka message** DB mein save hota hai
6. **AI ka message** DB mein save hota hai
7. Sab kuch user ko **response** mein bheja jaata hai

---

## STEP 8 — Follow-up Messages (Conversation History)

Ek he chat mein multiple messages karna — jaise asli conversation.

**Problem:** Agar user "docker explain karo" bolta hai, phir "code example do" bolta hai — toh AI ko previous context chahiye!

### Updated Controller:

```js
export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;  // chatId bhi lo body se

  let chat = null, title = null;

  // Agar chatId NAHI hai — nayi chat banao
  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({ user: req.user.id, title });
  }

  // User ka message save karo
  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: 'user',
  });

  // Poori chat history fetch karo DB se
  const messages = await messageModel.find({
    chat: chatId || chat._id,
  });

  // Poori history AI ko do (context ke saath response generate hoga)
  const result = await generateResponse(messages);

  // AI ka response save karo
  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: 'ai',
  });

  res.status(201).json({ title, chat, aiMessage });
}
```

**Key Logic:**
- `chatId` aya = existing chat mein message add karo
- `chatId` nahi aya = nayi chat banao

---

## STEP 9 — generateResponse ko upgrade karo (Full History Support)

```js
// ai.service.js
import { HumanMessage, AIMessage } from 'langchain';

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(
    messages.map((msg) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);  // AI ke purane messages
      }
    })
  );
  return response.text;
}
```

**Kya ho raha hai?**
Pehle sirf ek message bheja jaata tha. Ab **poori conversation history** ek array ke roop mein bhaji jaati hai.

- `HumanMessage` → user ke messages
- `AIMessage` → AI ke purane responses

AI is history ko padh ke samajhta hai context aur **relevant followup** deta hai.

---

## STEP 10 — Extra APIs (Get & Delete)

### `getChats` — User ki saari chats laao

```js
export async function getChats(req, res) {
  const chats = await chatModel.find({ user: req.user.id });
  res.status(200).json({ message: 'Chats retrieved successfully', chats });
}
```

> Sirf **us user ki** chats aayengi, doosre ki nahi — `user: req.user.id` filter lagata hai.

---

### `getMessages` — Ek specific chat ke saare messages

```js
export async function getMessages(req, res) {
  const { chatId } = req.params;

  // Check karo ki ye chat is user ki hai
  const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const messages = await messageModel.find({ chat: chatId });
  res.status(200).json({ message: 'Messages retrieved successfully', messages });
}
```

> **Security check:** `findOne({ _id: chatId, user: req.user.id })` — ensure karta hai ki koi dusra user kisi aur ki chat access na kar sake.

---

### `deleteChat` — Chat aur uske messages delete karo

```js
export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await messageModel.deleteMany({ chat: chatId }); // Saare messages bhi delete

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  res.status(200).json({ message: 'Chat deleted successfully' });
}
```

> `deleteMany` isliye use kiya kyunki ek chat mein **bahut saare messages** ho sakte hain.

---

## Final Routes Summary

```js
// chat.routes.js
chatRouter.post('/message', authUser, sendMessage);           // Message bhejo
chatRouter.get('/', authUser, getChats);                      // Saari chats lo
chatRouter.get('/:chatId/messages', authUser, getMessages);   // Ek chat ke messages lo
chatRouter.delete('/delete/:chatId', authUser, deleteChat);   // Chat delete karo
```

---

## 🔄 Pura Flow — Visual Summary

```
User → POST /api/chats/message
         │
         ▼
    authUser (logged in hai?)
         │
         ▼
    sendMessage controller
         │
         ├─ chatId nahi?
         │    ├─ generateChatTitle (Mistral) → title
         │    └─ chatModel.create() → nayi chat DB mein
         │
         ├─ userMessage DB mein save
         │
         ├─ messageModel.find() → poori history fetch
         │
         ├─ generateResponse(history) (Gemini) → AI response
         │
         ├─ aiMessage DB mein save
         │
         └─ res.json({ title, chat, aiMessage })
```

---

## 📌 Key Concepts Recap

| Concept | Kya karta hai |
|---|---|
| `SystemMessage` | AI ko role/instructions dena (jaise ek manager) |
| `HumanMessage` | User ka message AI ko bhejne ka format |
| `AIMessage` | AI ke previous responses — context ke liye |
| `authUser` middleware | Route pe "guard" — sirf logged in users access kar sakein |
| `chatId` check | Fresh chat vs followup chat decide karna |
| `messageModel.find()` | Poori conversation history DB se lena |
| `deleteMany()` | Ek saath multiple documents delete karna |

---

## 🧪 Postman Testing Guide

| Action | Method | URL | Body |
|---|---|---|---|
| New message | POST | `/api/chats/message` | `{ "message": "What is Docker?" }` |
| Follow-up | POST | `/api/chats/message` | `{ "message": "Give code example", "chat": "<chatId>" }` |
| Get all chats | GET | `/api/chats/` | — |
| Get messages | GET | `/api/chats/:chatId/messages` | — |
| Delete chat | DELETE | `/api/chats/delete/:chatId` | — |

> **Note:** Pehle login karo, tabhi ye APIs kaam karengi (authUser middleware ki wajah se).

---

*Day 125 Complete ✅ — AI Integration with Gemini + Mistral, full chat history support, aur CRUD APIs.*
