langgraph: AI is basically dumb to build complex real world AI applications so we use langgraph to chain the AI agents and tools. It helps in making decision for the application. 

Eg: If a user asks a question, the AI will first check the database if the answer is present or not. If the answer is present, it will return the answer. If the answer is not present, it will call the API to get the answer. If the API call fails, it will return an error message. 

node: Node is a function or a LLM that will perform a specific task. It can be anything from checking the database to calling the API to getting the answer.

edges: Edges is a connection between the nodes. It is a way to pass the output of one node to the input of another node. It can also be used to decide the flow of the application.



state: State is a way to store the output of one node to the input of another node. It can be anything from a string to a dictionary to a list to a custom object.

checkpoint: Checkpoint is a way to save the state of the application. It can be used to resume the application from where it left off.



Now, let's start the AI Battle Arena Project: We will have two AI agents competing against each other to solve a problem. The best solution will be selected as the final answer. The final solution will be judged by third AI model. And we will display the final answer to the user.


We will have 3 LLM's in our project:
1. Google LLM
2. Mistral AI LLM
3. Cohere LLM

We will have 3 nodes in our graph:
1. Google LLM
2. Mistral AI LLM
3. Cohere LLM


flowchart for the project:


start
  ↓
  solve node
  ↓
  judge node
  ↓
end
# AI Battle Arena using LangGraph

## Project Goal

Build an AI Battle Arena where:

1. User provides a problem statement.
2. Mistral AI generates a solution.
3. Cohere AI generates a solution.
4. A third AI model acts as a Judge.
5. The Judge compares both solutions.
6. The best solution is selected.
7. Final answer is returned to the user.

---

# Core Concepts

## 1. Node

A Node is a function or step that performs a specific task inside the graph.

### Nodes in our project

### START Node

- Built-in LangGraph node.
- Execution begins here.
- Receives user input.

Example:

```text
Problem:
How can we reduce traffic congestion in cities?
```

---

### Solution Node

Responsibilities:

1. Receive problem statement.
2. Send problem to Mistral.
3. Send problem to Cohere.
4. Store both outputs in State.

Pseudo Code:

```js
async function solutionNode(state) {
  const mistralAnswer = await mistral.invoke(
    state.problem
  );

  const cohereAnswer = await cohere.invoke(
    state.problem
  );

  return {
    mistralSolution: mistralAnswer,
    cohereSolution: cohereAnswer,
  };
}
```

---

### Judge Node

Responsibilities:

1. Read Mistral solution.
2. Read Cohere solution.
3. Compare both solutions.
4. Select the best one.
5. Store final answer in State.

Pseudo Code:

```js
async function judgeNode(state) {
  const result = await judge.invoke(`
      Compare these solutions:

      Solution A:
      ${state.mistralSolution}

      Solution B:
      ${state.cohereSolution}

      Select the best one.
  `);

  return {
    finalAnswer: result,
  };
}
```

---

### END Node

- Built-in LangGraph node.
- Execution stops here.
- Final state is returned.

---

# 2. Edge

An Edge connects two nodes.

It determines where execution should go next.

Example:

```text
START
  |
  v
Solution Node
  |
  v
Judge Node
  |
  v
END
```

Each arrow represents an Edge.

---

## Edge Flow

### Edge 1

```text
START
  |
  v
Solution Node
```

Passes user problem to Solution Node.

---

### Edge 2

```text
Solution Node
      |
      v
Judge Node
```

Passes generated solutions to Judge Node.

---

### Edge 3

```text
Judge Node
      |
      v
END
```

Passes final answer to END node.

---

# 3. State

State is the shared memory of the graph.

Every node can:

- Read state
- Update state
- Return new state values

---

## Initial State

After user input:

```js
{
  problem: "How can cities reduce traffic congestion?"
}
```

---

## State After Solution Node

Mistral Output:

```text
Build metro systems
Improve public transport
```

Cohere Output:

```text
Use congestion pricing
Improve bus routes
```

Updated State:

```js
{
  problem: "How can cities reduce traffic congestion?",

  mistralSolution:
    "Build metro systems...",

  cohereSolution:
    "Use congestion pricing..."
}
```

---

## State After Judge Node

Judge compares both answers.

Suppose Cohere wins.

Updated State:

```js
{
  problem: "How can cities reduce traffic congestion?",

  mistralSolution:
    "Build metro systems...",

  cohereSolution:
    "Use congestion pricing...",

  finalAnswer:
    "Cohere solution selected"
}
```

---

## Final State

```js
{
  problem: "How can cities reduce traffic congestion?",

  mistralSolution:
    "Build metro systems...",

  cohereSolution:
    "Use congestion pricing...",

  finalAnswer:
    "Cohere solution selected"
}
```

---

# 4. Checkpoint

A Checkpoint is a saved snapshot of the current State.

Think of it like a game save file.

---

## Without Checkpoint

Execution:

```text
START
  |
  v
Solution Node
  |
  v
Crash
```

Problem:

- State is lost.
- Graph must start from the beginning.
- Expensive LLM calls run again.

---

## With Checkpoint

Execution:

```text
START
  |
  v
Solution Node
```

Checkpoint Saved:

```js
{
  problem: "...",
  mistralSolution: "...",
  cohereSolution: "..."
}
```

---

Suppose Judge Node fails:

```text
Judge Node
   |
   v
Timeout Error
```

Without Checkpoint:

```text
Run everything again
```

- Mistral runs again
- Cohere runs again
- More cost
- More latency

---

With Checkpoint:

LangGraph restores the last saved state:

```js
{
  problem: "...",
  mistralSolution: "...",
  cohereSolution: "..."
}
```

Then only Judge Node runs again.

Benefits:

- Saves money
- Saves time
- Enables recovery
- Supports human-in-the-loop workflows

---

# Complete Graph Flow

```text
USER
  |
  v

START
  |
  v

Solution Node
  |
  |-- Call Mistral
  |
  |-- Call Cohere
  |
  |-- Store outputs in State
  |
  |-- Save Checkpoint
  |
  v

Judge Node
  |
  |-- Read State
  |
  |-- Compare Solutions
  |
  |-- Select Best Solution
  |
  |-- Store Final Answer
  |
  |-- Save Checkpoint
  |
  v

END
  |
  v

Return Final Answer
```

---

# State Evolution Summary

## Step 1

```js
{
  problem: "How to learn Node.js?"
}
```

---

## Step 2

```js
{
  problem: "How to learn Node.js?",
  mistralSolution: "...",
  cohereSolution: "..."
}
```

---

## Step 3

```js
{
  problem: "How to learn Node.js?",
  mistralSolution: "...",
  cohereSolution: "...",
  finalAnswer: "Best solution selected"
}
```

---

# Quick Revision

## Node

A function that performs a task.

Examples:

- START
- Solution Node
- Judge Node
- END

---

## Edge

A connection between nodes.

Responsible for controlling execution flow.

---

## State

Shared memory object used by all nodes.

Stores:

- User problem
- Mistral solution
- Cohere solution
- Final answer

---

## Checkpoint

Saved snapshot of State.

Used for:

- Recovery after crashes
- Resuming execution
- Avoiding repeated LLM calls
- Saving cost and time


//================================================

we will implement langgraph, and use Typescript

at first implement `npm init -y`
in package.json, add 
```js
"type": "module",
"scripts": {
    "dev": "tsx server.ts"
}
```

install dev dependency::
"npm i -D typescript tsx"

then run::
"npx tsc --init"

now we will setup tsconfig.json, and the project is ready for typescript implementation.

"outDir": "."

now lets install express
npm i express

along with it, install types for express
npm i -D @types/express


------
src/app.ts
------

import express from "express";

const app = express()

app.get("/health", (req, res)=>{
    res.status(200).json({status: 'ok'})
})

export default app;

---------
server.ts
---------

import app from './src/app.js'; //even though we use TS, but while importing use .js extension

app.listen(3000, () => console.log('Server started on port 3000'))


now in terminal we run :: "npm run dev" and in browser we visit localhost:3000/health and we should see {"status": "ok"} in the response.

now we will setup AI models using langchain:

"npm i @langchain/core @langchain/google @langchain/core
"npm i @langchain/mistralai @langchain/core
"npm i @langchain/cohere @langchain/core



also set up .env file and store API keys:
GOOGLE_API_KEY="AQ.Ab8RN6KJre_yHmvn508eQ4ppxtG4wzdfOp8wfxFDi9uaht6b7g"
MISTRAL_API_KEY="IFpOkHIzw30gfTRsydO5bLUd2qUK0kVn"
COHERE_API_KEY="cohere_YIOl9Du8CvbpWXFWmCaFmFY6TbJadr48uRbRIlvm2vpAAp"


now we will create a config.ts file to store API keys:

---------------------
src/config/config.ts
---------------------

import dotenv from 'dotenv';

dotenv.config();

/**
 * GOOGLE_API_KEY
 * MISTRAL_API_KEY
 * COHERE_API_KEY
 */

type CONFIG = {
    readonly GOOGLE_API_KEY: string,
    readonly MISTRAL_API_KEY: string,
    readonly COHERE_API_KEY: string,
}

// this "readonly" property states that we can't modify the value of these variables once they are loaded.


const config: CONFIG = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
}

export default config;


now we will create one more file as models.services.ts

----------------------
src/services/models.service.ts
----------------------

import { ChatGoogle } from '@langchain/google';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere';
import config from '../config/config.js';

/**
 * Initialize Gemini 2.5 Flash Model
 */
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


now , i need to use graph for that i'll install langgraph:

"npm i @langchain/langgraph @langchain/core"


--------------------------------
src/services/graph.ai.service.ts
--------------------------------

import {
  StateSchema,
  MessagesValue, // ak node se dusre node kya message jayenge , usko hum MessagesValue bolte hain . basically it is a schema of the messages that will be passed between the nodes.
  StateGraph, // we use this to create a graph of nodes . 
  START, // it is a starting point of the graph . 
  END, // it is a ending point of the graph . 
} from '@langchain/langgraph';

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

const state: AIBATTLESTATE = {
  messages: MessagesValue,
  solution_1: '',
  solution_2: '',
  judgement: { winner: 'solution_1', solution_1_score: 0, solution_2_score: 0 },
};



//==================================================================================


# Day 135 — Deep Dive Notes 🔬
## Har File, Har Function — Full Detail Explanation

---

## 📁 FILE 1: `src/config/config.ts`

### ❓ Yeh File Kyun Banayi Gayi?

Socho agar tum seedha code mein API key likh do:

```typescript
// ❌ GALAT TARIKA — kabhi mat karo
const geminiModel = new ChatGoogle({
  apiKey: "AIzaSyB_real_secret_key_here"
});
```

**Kya problem hai isse?**
- Agar yeh code GitHub pe push ho gaya → API key public ho gayi → koi bhi use kar sakta hai → tumhara bill ayega
- Har jagah key copy-paste karni padegi — 10 files mein key hai toh 10 jagah change karna padega
- Production aur Development ki alag keys manage karna mushkil ho jata hai

**Solution:** Ek dedicated config file banao jo sirf environment se keys uthaye.

---

### 📖 Code Line by Line

```typescript
import dotenv from 'dotenv';
```

**Kya hai `dotenv`?**

`dotenv` ek npm package hai. Iska kaam hai `.env` file ko padhna aur uske andar likhe variables ko `process.env` mein daal dena.

Bina `dotenv` ke, `process.env.GOOGLE_API_KEY` → `undefined` hoga.
`dotenv` ke baad → actual value milegi.

---

```typescript
dotenv.config();
```

**Kya kaam karta hai?**

Yeh function call karte hi `dotenv` project ke root mein `.env` file dhundta hai aur usse padhta hai.

```
.env file ka content:
GOOGLE_API_KEY="AIzaSyB_xxxx"
MISTRAL_API_KEY="IFpOkH_xxxx"
COHERE_API_KEY="cohere_xxxx"

dotenv.config() ke baad:
process.env.GOOGLE_API_KEY  → "AIzaSyB_xxxx"  ✅
process.env.MISTRAL_API_KEY → "IFpOkH_xxxx"  ✅
process.env.COHERE_API_KEY  → "cohere_xxxx"   ✅
```

**Kyun sabse pehle call karte hain?**
Kyunki iske neeche jo bhi code hai woh `process.env` use karta hai. Agar pehle call nahi kiya toh values `undefined` aayengi.

---

```typescript
type CONFIG = {
    readonly GOOGLE_API_KEY: string,
    readonly MISTRAL_API_KEY: string,
    readonly COHERE_API_KEY: string,
}
```

**`type` kya hota hai TypeScript mein?**

`type` ek blueprint hai — batata hai ki ek object mein exactly kya-kya hona chahiye aur unka data type kya hoga.

**`readonly` kyun lagaya?**

```typescript
// readonly ke bina — yeh possible hota:
config.GOOGLE_API_KEY = "kuch_aur_key"; // ✅ allowed — DANGER!

// readonly ke saath — yeh error deta hai:
config.GOOGLE_API_KEY = "kuch_aur_key"; // ❌ TypeScript Error!
// "Cannot assign to 'GOOGLE_API_KEY' because it is a read-only property"
```

`readonly` ek safety guard hai. API keys ek baar load hone ke baad change nahi honi chahiye — kabhi bhi, kisi bhi function mein. `readonly` yeh guarantee deta hai.

---

```typescript
const config: CONFIG = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
}
```

**`: CONFIG` kya hai?**

Yeh bata raha hai ki `config` object ka structure exactly `CONFIG` type jaisa hona chahiye. Agar koi field missing ho ya galat type ho toh TypeScript error dega.

**`process.env.GOOGLE_API_KEY || ""` — yeh `||` kyun?**

`process.env.GOOGLE_API_KEY` do cheezein return kar sakta hai:
- `"AIzaSyB_xxxx"` — agar `.env` mein key hai ✅
- `undefined` — agar `.env` mein key nahi hai ❌

TypeScript bolega: "String type mein `undefined` nahi aana chahiye."

`|| ""` ka matlab: "Agar value `undefined` ya `null` ya falsy ho toh empty string `""` use karo." Yeh TypeScript ko happy rakhta hai aur runtime crash se bachata hai.

---

```typescript
export default config;
```

**Kyun `export default`?**

Taaki doosri files is config ko import karke API keys use kar sakein:

```typescript
// kisi bhi doosri file mein:
import config from '../config/config.js';
console.log(config.GOOGLE_API_KEY); // "AIzaSyB_xxxx"
```

---

### 🗺️ config.ts ka Flow Diagram

```
.env file
   │
   │  GOOGLE_API_KEY="AIzaSyB_xxxx"
   │  MISTRAL_API_KEY="IFpOkH_xxxx"
   │  COHERE_API_KEY="cohere_xxxx"
   │
   ▼
dotenv.config()  ←── yeh line .env file padhti hai
   │
   ▼
process.env mein variables aa jaate hain
   │
   ▼
config object banta hai (readonly)
   │
   ▼
export → doosri files import karke use karti hain
```

---

---

## 📁 FILE 2: `src/services/models.service.ts`

### ❓ Yeh File Kyun Banayi Gayi?

**Problem:** Hamare paas 3 alag AI companies hain — Google, Mistral, Cohere. Teeno ke SDK (Software Development Kit) alag hain, API ke format alag hain, authentication alag hai.

**LangChain ka kaam:** LangChain ek "wrapper" library hai. Yeh teeno ke SDK ke upar ek common interface banati hai. Matlab chahe Google ho ya Mistral — hum same `.invoke()` method se call kar sakte hain.

**Alag file kyun?**
- **Reusability:** `geminiModel`, `mistralModel`, `cohereModel` — ek jagah banao, kahin bhi import karo
- **Maintainability:** Kal ko model change karna ho (`mistral-medium` se `mistral-large`) — sirf ek jagah change karo
- **Clarity:** Koi bhi developer is file ko dekh ke samajh jayega ki project mein kaunse AI models use ho rahe hain

---

### 📖 Code Line by Line

```typescript
import { ChatGoogle } from '@langchain/google';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere';
```

**Yeh `Chat` prefix kyun hai?**

LangChain mein do types ke models hote hain:
- `Chat` models → Conversation style, message-based (hum yahi use kar rahe hain)
- `LLM` models → Purana style, simple text in → text out

`ChatGoogle`, `ChatMistralAI`, `ChatCohere` — yeh teeno LangChain ke ready-made classes hain jo in AI companies ke APIs se baat kar sakti hain.

---

```typescript
import config from '../config/config.js';
```

Humne pehli file mein jo config banaya — yahan import kar rahe hain taaki API keys mil sakein.

`../config/config.js` — `.js` extension kyun? TypeScript files `.ts` mein hoti hain, lekin Node.js compile ke baad `.js` files run karta hai. Import path mein hamesha `.js` likhna padta hai TypeScript + ESModules mein.

---

```typescript
export const geminiModel = new ChatGoogle({
  model: 'gemini-flash-latest',
  apiKey: config.GOOGLE_API_KEY,
});
```

**`new ChatGoogle({...})` — Yeh kya kar raha hai?**

`ChatGoogle` ek class hai. `new` keyword se iska ek instance (object) bana rahe hain. Is instance ke paas ek `.invoke()` method hogi jisse hum Gemini model ko questions bhej sakte hain.

**Constructor mein kya diya:**

| Property | Value | Kaam |
|----------|-------|------|
| `model` | `'gemini-flash-latest'` | Google ke kaun se model se baat karni hai |
| `apiKey` | `config.GOOGLE_API_KEY` | Authentication — Google ko batao ki request tumhari hai |

**`gemini-flash-latest` kyun?**

Google ke paas multiple models hain:
- `gemini-pro` — powerful but slow
- `gemini-flash` — fast aur cost-efficient

Judge ke liye fast response chahiye, isliye `flash` use kiya.

---

```typescript
export const mistralModel = new ChatMistralAI({
  model: 'mistral-medium-latest',
  apiKey: config.MISTRAL_API_KEY,
});
```

**`mistral-medium-latest` kyun?**

Mistral ke tiers hain: `tiny` → `small` → `medium` → `large`. Medium ek balanced choice hai — na bahut slow, na bahut cheap quality.

`-latest` suffix matlab Mistral automatically latest version deta rahega is tier ka. Manually version pin nahi karna padega.

---

```typescript
export const cohereModel = new ChatCohere({
  model: 'command-a-03-2025',
  apiKey: config.COHERE_API_KEY,
});
```

**`command-a-03-2025` kyun?**

Cohere ka `command` series unka main conversational model hai. `a-03-2025` specific version hai jo March 2025 mein release hua. Cohere mein `-latest` style nahi hota, isliye specific version pin kiya gaya.

---

**`export const` kyun?**

```typescript
export const geminiModel = ...
export const mistralModel = ...
export const cohereModel = ...
```

`export` lagane se yeh models doosri files mein import ho sakte hain:

```typescript
// graph.ai.service.ts mein:
import { geminiModel, mistralModel, cohereModel } from './models.service.js';

// Ab directly use karo:
const answer = await mistralModel.invoke("What is Node.js?");
```

---

### 🗺️ models.service.ts ka Role

```
config.ts
   │
   │  API Keys provide karta hai
   │
   ▼
models.service.ts
   │
   ├── geminiModel  (Google ka Judge)
   ├── mistralModel (Competitor 1)
   └── cohereModel  (Competitor 2)
   │
   ▼
graph.ai.service.ts
   │
   └── Yeh models use karke nodes chalata hai
```

---

---

## 📁 FILE 3: `src/services/graph.ai.service.ts`

### ❓ Yeh File Kyun Banayi Gayi?

Yeh poore project ki **brain file** hai. Isme define hota hai:
- Graph kaisa dikhega (kaun se nodes, kaun si edges)
- State kya store karegi
- Har node kya kaam karega
- Execution flow kya hoga

---

### 📖 Imports — Line by Line

```typescript
import {
  StateSchema,
  MessagesValue,
  StateGraph,
  START,
  END,
} from '@langchain/langgraph';
```

Har import ko detail mein samjho:

---

#### `StateSchema`

**Kya hai?**
LangGraph mein State ko define karne ka ek standard tarika. Yeh batata hai ki State object mein exactly kaunse fields honge aur unka type kya hoga.

**Analogy:** Ek form ka blank template — naam, address, phone number ke blank boxes. `StateSchema` woh template hai.

---

#### `MessagesValue`

**Kya hai?**
LangGraph ka built-in value type jo **messages ki list ko manage karta hai**. Yeh special isliye hai kyunki yeh automatically messages ko append karta hai (overwrite nahi karta).

**Normal value vs MessagesValue:**

```
Normal string field:
  Node A sets → "Hello"
  Node B sets → "World"
  Result      → "World"  (A ka message gaya!)

MessagesValue:
  Node A sets → "Hello"
  Node B sets → "World"
  Result      → ["Hello", "World"]  (dono safe hain!)
```

Conversation history preserve hoti hai `MessagesValue` se.

---

#### `StateGraph`

**Kya hai?**
Yeh main class hai jisse hum apna graph banate hain. Isko ek **railway map** socho — `StateGraph` woh map hai jisme hum stations (nodes) aur tracks (edges) add karte hain.

```typescript
// Usage pattern:
const graph = new StateGraph(stateSchema)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();
```

---

#### `START`

**Kya hai?**
LangGraph ka built-in constant. Yeh graph ka entry point represent karta hai.

```typescript
// START ek string constant hai jiska value "__start__" hai
// Hum isko edge define karne mein use karte hain:
graph.addEdge(START, "solution"); 
// Matlab: "jab graph shuru ho, pehle solution node chalao"
```

---

#### `END`

**Kya hai?**
LangGraph ka built-in constant. Yeh graph ka exit point represent karta hai.

```typescript
graph.addEdge("judge", END);
// Matlab: "judge node ke baad graph khatam karo"
```

---

### 📖 Type Definitions — Line by Line

```typescript
type JUDGEMENT = {
  winner: 'solution_1' | 'solution_2';
  solution_1_score: number;
  solution_2_score: number;
};
```

**`JUDGEMENT` type kyun banaya?**

Judge node ek structured result dega — sirf "Mistral jeeta" bolna kaafi nahi. Scores bhi chahiye taaki user samjhe kyon ek solution doosre se behtar tha.

**`winner: 'solution_1' | 'solution_2'` — yeh `|` kya hai?**

Yeh **Union Type** hai TypeScript mein. Iska matlab:

```typescript
// ✅ Valid:
winner: 'solution_1'
winner: 'solution_2'

// ❌ Invalid — TypeScript error dega:
winner: 'solution_3'
winner: 'mistral'
winner: 'cohere'
winner: 42
```

Yeh ensure karta hai ki Judge node sirf valid options mein se ek select kare. Typo ya unexpected value compile time pe hi pakdi jayegi.

**`solution_1_score` aur `solution_2_score` kyun?**

Judge sirf winner nahi batayega, dono solutions ko 0-10 jaisa score dega. User ko context milega — agar dono ke scores close hain (7 vs 8) toh dono achhe the. Agar zyada difference hai (3 vs 9) toh ek clearly better tha.

---

```typescript
type AIBATTLESTATE = {
  messages: typeof MessagesValue;
  solution_1: string;
  solution_2: string;
  judgement: JUDGEMENT;
};
```

**Yeh poore graph ki State hai — iska har field samjho:**

---

**`messages: typeof MessagesValue`**

`typeof MessagesValue` — TypeScript ko bata raha hai ki `messages` field ka type exactly wahi hoga jo `MessagesValue` ka type hai (LangGraph ka built-in type).

Yeh field conversation history store karta hai — user ne kya pucha, kaunse nodes ne kya process kiya.

---

**`solution_1: string`**

Mistral AI ka generated solution yahan store hoga. Solution Node is field ko set karega, Judge Node isse padhega.

---

**`solution_2: string`**

Cohere AI ka generated solution yahan store hoga. Same pattern — Solution Node set karta hai, Judge Node padhta hai.

---

**`judgement: JUDGEMENT`**

Judge Node ka final output yahan store hoga. Type `JUDGEMENT` hai (jo humne upar define kiya) — matlab winner aur scores yahan aayenge.

---

### 🧩 Saari Types Mil Ke Kaise Kaam Karti Hain

```
User input aata hai
        │
        ▼
AIBATTLESTATE initialize hoti hai:
{
  messages: [],        ← empty conversation
  solution_1: "",      ← abhi kuch nahi
  solution_2: "",      ← abhi kuch nahi
  judgement: null      ← abhi judge nahi hua
}
        │
        ▼
Solution Node chalti hai:
{
  messages: [userMessage],
  solution_1: "Mistral ka jawab...",   ← SET!
  solution_2: "Cohere ka jawab...",    ← SET!
  judgement: null
}
        │
        ▼
Judge Node chalti hai:
{
  messages: [userMessage, judgeMessage],
  solution_1: "Mistral ka jawab...",
  solution_2: "Cohere ka jawab...",
  judgement: {                          ← SET!
    winner: "solution_2",
    solution_1_score: 7,
    solution_2_score: 9
  }
}
        │
        ▼
END → Final State user ko milti hai
```

---

---

## 🔗 Teeno Files Ka Aapas Mein Connection

```
.env
 │
 └──► config.ts
         │
         │  API Keys export karta hai
         │
         └──► models.service.ts
                  │
                  │  geminiModel, mistralModel, cohereModel export karta hai
                  │
                  └──► graph.ai.service.ts
                            │
                            │  State define karta hai
                            │  Nodes define karta hai
                            │  Edges define karta hai
                            │  Graph compile aur run karta hai
                            │
                            └──► Final Answer → User
```

**Dependency chain:** `.env` → `config.ts` → `models.service.ts` → `graph.ai.service.ts`

Har file apna ek kaam karta hai, doosri file pe depend karta hai ek clean tarike se.

---

---

## 💡 Important Concepts — Extra Clarity

### TypeScript `type` vs `interface`

Hamare code mein `type` use kiya gaya. TypeScript mein `type` aur `interface` dono similar kaam karte hain, lekin:

```typescript
// type — union types ke saath kaam karta hai
type WINNER = 'solution_1' | 'solution_2'; // ✅ possible

// interface — union types ke saath kaam nahi karta
interface WINNER = 'solution_1' | 'solution_2'; // ❌ error
```

Isliye `type` chose kiya — kyunki `winner` field mein union type chahiye tha.

---

### `export const` vs `export default`

```typescript
// config.ts mein:
export default config;
// Import kaise karein:
import config from './config.js';           // ✅
import anythingElse from './config.js';     // ✅ naam badal sakte hain

// models.service.ts mein:
export const geminiModel = ...
export const mistralModel = ...
// Import kaise karein:
import { geminiModel, mistralModel } from './models.service.js';  // ✅
import { gemini } from './models.service.js';  // ❌ exact naam chahiye
```

`export default` — ek file se ek main cheez export hoti hai, naam kuch bhi rakh sakte hain import mein.

`export const` — named exports, multiple cheezein ek file se, import mein exact naam likhna padta hai.

---

### `.env` File Security

```bash
# .gitignore mein yeh zaroori hai:
.env

# Kyun?
# .env mein real API keys hain
# GitHub pe push hua → public → koi bhi use kar sakta hai
# Google/Mistral/Cohere ke bade bills aa sakte hain
```

---

## 📦 Is Project Mein Install Hue Packages

```bash
# dotenv — .env file padhne ke liye
npm i dotenv

# LangChain AI wrappers
npm i @langchain/core        # base package — sabka dependency
npm i @langchain/google      # Google/Gemini ke liye
npm i @langchain/mistralai   # Mistral ke liye
npm i @langchain/cohere      # Cohere ke liye

# LangGraph — graph/flow engine
npm i @langchain/langgraph
```

---

## 🗂️ Project File Structure

```
project/
│
├── .env                     ← Secret API keys (gitignore mein daalo!)
│
├── server.ts                ← Server entry point (port 3000 pe start)
│
├── tsconfig.json            ← TypeScript compiler settings
│
├── package.json             ← Project metadata + npm scripts
│
└── src/
    │
    ├── app.ts               ← Express app setup, /health route
    │
    ├── config/
    │   └── config.ts        ← .env load karo, keys ko readonly object mein daalo
    │
    └── services/
        ├── models.service.ts     ← Teen AI models initialize karo (Gemini, Mistral, Cohere)
        └── graph.ai.service.ts   ← LangGraph: State types, Node functions, Edges, Graph compile
```

---

> **Yeh Part 1 ka deep dive tha.** Agle notes mein actual node functions (Solution Node ka full code, Judge Node ka full code), edges ki wiring, graph compile karna, aur Express route se graph ko trigger karna cover hoga. 🚀