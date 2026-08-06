# Day 135 — LangGraph AI Battle Arena 🥊
## Detailed Notes: Kya, Kyun aur Kaise

---

## 🧠 Part 1: LangGraph Kya Hai?

LangGraph ek framework hai jo **AI agents ko chain karne** ke liye use hota hai. Matlab, akela AI model real-world complex problems solve karne mein "dumb" hota hai — woh sirf ek kaam karta hai. LangGraph ke through hum **multiple AI agents aur tools ko ek sequence (ya graph) mein connect kar sakte hain**, jisse application smart decisions le sake.

### Real Example:
```
User asks a question
        ↓
Database check karo — answer hai?
        ↓ (nahi hai)
API call karo — answer milega?
        ↓ (API fail ho gayi)
Error message return karo
```
Yeh poora **decision flow** LangGraph handle karta hai.

---

## 🔷 Core Concepts

### 1. NODE — Kaam Karne Wala Unit

**Kya hai?**
Node ek function ya LLM (AI model) hota hai jo ek specific kaam karta hai.

**Kyun use karte hain?**
Complex kaam ko chote-chote pieces mein todne ke liye. Har node apna ek kaam karta hai — separation of responsibility.

**Hamare project mein nodes:**

| Node | Kaam |
|------|------|
| `START` | Built-in. User ka input receive karta hai. Entry point. |
| `Solution Node` | Mistral aur Cohere dono ko problem bhejta hai, dono ke answers State mein store karta hai. |
| `Judge Node` | Dono solutions compare karta hai, best solution chunata hai, final answer State mein store karta hai. |
| `END` | Built-in. Execution khatam hota hai. Final state return hoti hai. |

---

### 2. EDGE — Connection Between Nodes

**Kya hai?**
Edge do nodes ke beech ka connection hai — ek node ka output doosre node ka input ban jata hai.

**Kyun use karte hain?**
Flow control ke liye. Kaunsa node ke baad kaunsa node chalega — yeh edge decide karta hai.

**Hamare project mein edges:**

```
START ──────────→ Solution Node
Solution Node ──→ Judge Node
Judge Node ──────→ END
```

Har arrow ek edge hai.

---

### 3. STATE — Shared Memory

**Kya hai?**
State ek shared memory object hai jo poore graph mein sabhi nodes use karte hain. Ek node jo output deta hai woh State mein save hota hai, aur doosra node us State se read karta hai.

**Kyun use karte hain?**
Nodes directly ek doosre se baat nahi karte — sab kuch State ke through hota hai. Yeh clean aur maintainable architecture banata hai.

**State ka evolution hamare project mein:**

```
Step 1 — Sirf problem hai:
{
  problem: "How to learn Node.js?"
}

Step 2 — Solution Node ke baad:
{
  problem: "How to learn Node.js?",
  mistralSolution: "Build projects, read docs...",
  cohereSolution: "Start with official tutorial..."
}

Step 3 — Judge Node ke baad:
{
  problem: "How to learn Node.js?",
  mistralSolution: "...",
  cohereSolution: "...",
  finalAnswer: "Cohere solution selected because..."
}
```

---

### 4. CHECKPOINT — Game Save File

**Kya hai?**
Checkpoint State ka ek saved snapshot hai — jaise game mein save karte hain.

**Kyun use karte hain?**
Agar execution beech mein crash ho jaye, toh checkpoint se wahan se resume ho sakta hai jahan se ruka tha. Bina checkpoint ke, sab LLM calls dubara karni padti hain jo **costly aur slow** hota hai.

**Without vs With Checkpoint:**

```
WITHOUT CHECKPOINT:
START → Solution Node → [CRASH]
Dobara chalao: START → Mistral again → Cohere again → ...
(Extra cost + Extra time)

WITH CHECKPOINT:
START → Solution Node → [Checkpoint saved] → Judge Node → [CRASH]
Resume: Judge Node se hi shuru karo
(Mistral/Cohere dobara nahi chalenge)
```

---

## 🏗️ Part 2: Project Setup — Step by Step

### Step 1: Project Initialize karo

```bash
npm init -y
```
> `-y` flag: saare defaults accept kar leta hai, manually kuch type nahi karna.

### Step 2: `package.json` mein ye add karo

```json
"type": "module",
"scripts": {
    "dev": "tsx server.ts"
}
```

**Kyun `"type": "module"`?**
Node.js ko batata hai ki hum ES Modules use kar rahe hain (import/export), purana CommonJS (require) nahi.

**Kyun `tsx`?**
`tsx` ek dev tool hai jo TypeScript files ko directly run karta hai bina pehle compile kiye. Development ke time speed milti hai.

### Step 3: TypeScript Dev Dependencies install karo

```bash
npm i -D typescript tsx
```
> `-D` = devDependency. Sirf development ke liye, production bundle mein nahi jayega.

### Step 4: TypeScript config initialize karo

```bash
npx tsc --init
```
Yeh `tsconfig.json` banata hai. Usmein set karo:
```json
"outDir": "."
```
> Compiled JS files same folder mein output hongi.

---

## 📁 Part 3: File by File Explanation

---

### `src/app.ts` — Express Server Setup

```typescript
import express from "express";

const app = express()

app.get("/health", (req, res) => {
    res.status(200).json({ status: 'ok' })
})

export default app;
```

**Kya ho raha hai?**
- `express` import kiya
- Ek `/health` route banaya — yeh ek testing endpoint hai
- Jab `GET /health` call karo, toh `{ status: 'ok' }` return hoga

**Kyun?**
Health check endpoint common practice hai. Deployment ke time confirm karte hain ki server chal raha hai ya nahi.

---

### `server.ts` — Entry Point

```typescript
import app from './src/app.js'; // .js extension use karna zaroori hai TS mein

app.listen(3000, () => console.log('Server started on port 3000'))
```

**Kya ho raha hai?**
Server port 3000 pe start ho raha hai.

**Kyun `.js` extension?**
Hum TypeScript likhte hain, lekin Node.js compile hone ke baad `.js` files run karta hai. Import path mein `.js` likhna zaroori hai kyunki TypeScript compiler extension change nahi karta.

---

### `src/config/config.ts` — Environment Variables

```typescript
import dotenv from 'dotenv';
dotenv.config();

type CONFIG = {
    readonly GOOGLE_API_KEY: string,
    readonly MISTRAL_API_KEY: string,
    readonly COHERE_API_KEY: string,
}

const config: CONFIG = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
}

export default config;
```

**Kya ho raha hai?**
- `dotenv.config()` — `.env` file load karta hai environment mein
- `CONFIG` type mein `readonly` hai — iska matlab in values ko baad mein change nahi kar sakte (immutable)
- `process.env.X || ""` — agar env variable na mile toh empty string fallback

**Kyun alag config file?**
- API keys seedha code mein nahi likhte (security risk)
- Ek jagah se saari keys manage hoti hain — maintainability
- `readonly` se accidental overwrite nahi hoga

---

### `src/services/models.service.ts` — AI Models Initialize karo

```typescript
import { ChatGoogle } from '@langchain/google';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere';
import config from '../config/config.js';

export const geminiModel = new ChatGoogle({
  model: 'gemini-flash-latest',
  apiKey: config.GOOGLE_API_KEY,
});

export const mistralModel = new ChatMistralAI({
  model: 'mistral-medium-latest',
  apiKey: config.MISTRAL_API_KEY,
});

export const cohereModel = new ChatCohere({
  model: 'command-a-03-2025',
  apiKey: config.COHERE_API_KEY,
});
```

**Kya ho raha hai?**
Teen AI models initialize ho rahe hain:
- **Gemini** (Google) → Judge ki role mein use hoga
- **Mistral** → Solution 1 dega
- **Cohere** → Solution 2 dega

**Kyun alag service file?**
Separation of concerns — model initialization aur business logic alag-alag files mein. Agar model change karna ho, sirf yahan change karo.

**Models kaun se?**
| Model | Company | Use |
|-------|---------|-----|
| `gemini-flash-latest` | Google | Judge |
| `mistral-medium-latest` | Mistral AI | Competitor 1 |
| `command-a-03-2025` | Cohere | Competitor 2 |

---

### `src/services/graph.ai.service.ts` — Graph Logic (Partial)

```typescript
import {
  StateSchema,
  MessagesValue,
  StateGraph,
  START,
  END,
} from '@langchain/langgraph';
```

**Imports explanation:**

| Import | Kya karta hai |
|--------|--------------|
| `StateSchema` | State ka structure define karne ke liye |
| `MessagesValue` | Node ke beech messages ka schema |
| `StateGraph` | Graph banane ka main class |
| `START` | Graph ka starting point (built-in) |
| `END` | Graph ka ending point (built-in) |

---

### State Type Definition

```typescript
type JUDGEMENT = {
  winner: 'solution_1' | 'solution_2';
  solution_1_score: number;
  solution_2_score: number;
};

type AIBATTLESTATE = {
  messages: typeof MessagesValue;
  solution_1: string;
  solution_2: string;
  judgement: JUDGEMENT;
};
```

**Kya ho raha hai?**
- `JUDGEMENT` type mein winner sirf `'solution_1'` ya `'solution_2'` ho sakta hai (union type — type safety)
- `AIBATTLESTATE` poore graph ki state define karta hai:
  - `messages` — node ke beech communication
  - `solution_1` — Mistral ka answer
  - `solution_2` — Cohere ka answer
  - `judgement` — Judge ka final verdict

**Kyun TypeScript types?**
Runtime errors se pehle compile time pe hi pata chal jata hai ki kuch galat hai. `winner: 'solution_3'` likhoge toh TypeScript turant error dega.

---

## 🔄 Part 4: Complete Flow Summary

```
User Input: "Problem statement"
        ↓
    [START NODE]
        ↓
    [SOLUTION NODE]
     ├── Mistral ko problem bhejo → solution_1 milo
     ├── Cohere ko problem bhejo → solution_2 milo
     └── State update karo + Checkpoint save karo
        ↓
    [JUDGE NODE]
     ├── State se solution_1 aur solution_2 pado
     ├── Gemini se compare karwao
     └── Winner decide karo + State update karo + Checkpoint save karo
        ↓
    [END NODE]
        ↓
Final Answer User ko return hota hai
```

---

## 📦 Packages Installed — Quick Reference

```bash
# Core
npm init -y
npm i express
npm i -D typescript tsx @types/express

# AI Models (LangChain wrappers)
npm i @langchain/core
npm i @langchain/google
npm i @langchain/mistralai
npm i @langchain/cohere

# Graph Engine
npm i @langchain/langgraph

# TypeScript Config
npx tsc --init
```

---

## 🗂️ Project Structure

```
project/
├── .env                          ← API Keys (git mein push mat karna!)
├── server.ts                     ← Entry point, server start
├── tsconfig.json                 ← TypeScript config
├── package.json
└── src/
    ├── app.ts                    ← Express app, routes
    ├── config/
    │   └── config.ts             ← Environment variables loader
    └── services/
        ├── models.service.ts     ← AI models initialization
        └── graph.ai.service.ts   ← LangGraph logic (nodes, edges, state)
```

---

## ⚡ Quick Commands

```bash
npm run dev          # Server start karo (tsx se)
# Browser mein jao: localhost:3000/health
# Response: {"status": "ok"}
```

---

> **Note:** Yeh Day 135 ke notes ka pehla part hai. Graph ke nodes ka full implementation, edges ki wiring, aur actual LangGraph execution — yeh sab next notes mein cover hoga. 🚀
