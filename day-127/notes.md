// in day-127, there is a baatcheet session, but because i did not properly understand day126, i'm studying again and writing notes given by ankur bhaiya, in the process i'm understanding it way better.

yesterday, we have seen how to send message, generate title, create a chat , and conversation history, today , we will integrate with frontend.

---

## Frontend/src/features/chat/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {
const chat = useChat();
const [chatInput, setChatInput] = useState('');
const [userMessage, setUserMessage] = useState('');

const { user } = useSelector((state) => state.auth);

// Safe optional chaining to prevent crashes if Redux chat slice is not registered
const dummyMessages = [
{ id: 1, role: 'user', content: 'What is Docker?' },

    {
      id: 2,
      role: 'ai',
      content:
        'Docker is a platform designed to help developers create, deploy, and run applications easily by using containers.',
    },

    {
      id: 3,
      role: 'user',
      content: 'How do I run a container in background mode?',
    },

    {
      id: 4,
      role: 'ai',
      content:
        'You can run a container in the background (detached mode) by using the `-d` option in the run command. For example: `docker run -d -p 80:80 nginx`.',
    },

    {
      id: 5,
      role: 'user',
      content: 'Got it! And how do I stop a running container?',
    },

    {
      id: 6,
      role: 'ai',
      content:
        'To stop a running container, first find its container ID or name using `docker ps`, then run: `docker stop <container_id_or_name>`.',
    },

];

useEffect(() => {
chat.initializeSocketConnection();
}, []);

const handleSubmitMessage = (event) => {
event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    setUserMessage(trimmedMessage);
    setChatInput('');

};

return (

<main className="min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5">
<section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none">
<aside className="hidden h-full w-72 shrink-0 rounded-3xl border  bg-[#080b12] p-4 md:flex md:flex-col">
<h1 className="mb-5 text-3xl font-semibold tracking-tight">
Perplexity
</h1>

          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className="w-full rounded-xl border border-white/60 bg-transparent px-3 py-2 text-left text-base font-medium text-white/90 transition hover:border-white hover:text-white"
              >
                Chat title
              </button>
            ))}
          </div>
        </aside>

        <section className="relative max-w-3/5 mx-auto flex h-full min-w-0 flex-1 flex-col gap-4">
          <div className="messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30">
            {dummyMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${
                  message.role === 'user'
                    ? 'ml-auto rounded-br-none bg-white/12 text-white'
                    : 'mr-auto border border-white/25 bg-[#0f1626] text-white/90'
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <footer className="rounded-3xl w-full absolute bottom-2 border border-white/60 bg-[#080b12] p-4 md:p-5">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/45 focus:border-white/90"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-2xl border border-white/60 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>

);
};

export default Dashboard;

I've created the UI useing AI, now , lets create the Redux for chat.

## //state layer

## Frontend/src/features/chat/chat.slice.js

import {createSlice} from '@reduxjs/toolkit';

export const chatSlice = createSlice({
name: "chat",
initialState: {
chats:{},
currentChatId:null,
isLoading: false,
error: null,

    },
    reducers:{
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },

    }

})

export const {setChats, setCurrentChatId, setLoading, setError} = chatSlice.actions;
export default chatSlice.reducer;

---

## Frontend/src/app/app.store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice"
import chatReducer from "../features/chat/chat.slice"

export const store = configureStore({
reducer: {
auth: authReducer,
chat: chatReducer,
}
});

// WE have created state layer , now we will create API layer

---

## Frontend/src/features/chat/service/chat.api.js

import axios from 'axios';

const api = axios.create({
baseURL: 'http://localhost:3000',
withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
const response = await api.post('/api/chats/message', { message, chatId });

return response.data;
};

export const getChats = async () => {
const response = await api.get('/api/chats');

return response.data;
};

export const getMessages = async (chatId) => {
const response = await api.get(`/api/chats/${chatId}/messages`);

return response.data;
};

export const deleteChat = async (chatId) => {
const response = await api.delete(`/api/chats/${chatId}`);

return response.data;
};

//=========================================

// now, lets create Hook layer::

---

## Frontend/src/features/chat/hooks/useChat.js

import { initializeSocketConnection } from '../service/chat.socket';
import {
sendMessage,
getChat,
getMessage,
deleteChat,
} from '../service/chat.api.js';
import {
setChats,
setCurrentChatId,
setLoading,
setError,
} from '../chat.slice.js';
import { useDispatch } from 'react-redux';

export const useChat = () => {
const dispatch = useDispatch();

// yeh handleSendMessage parameter main kya le rha hai?
// 1. message: user ka message
// 2. chatId: current chat id

async function handleSendMessage({ message, chatId }) {
dispatch(setLoading(true));
//jab hum pehla message bhejte hai toh do cheez ho sakti hai:
// pehla: its our first message of chat, we send the message and API creates a new chat with a new chatId.
// dusra: its not our first message of chat, we send the message and API adds the message to the existing chat.

    const data = await sendMessage({ message, chatId });
    //agar yeh mera pehla msg hai, toh koi chatId nahi hoga, in that case , it is undefined, and that undefined reaches backend and creates a new chat with a new chatId, isko humko store karna hai.

    const { chat, aiMessage } = data;
    //yaha pe data main chat aayegi, ak ai message aayegi
    dispatch(
      setChats((prev) => {
        return {
          ...prev,
          [chat.title]: {
            ...chat,
            messages: [{ content: message, role: 'user' }, aiMessage],
          },
        };
      })
    );
    dispatch(setCurrentChatId(chat._id));

}
// yeh jo handleSendMessage ka kaam hai ki agar user pehla message kar raha hai , toh uss pehli message pe kya cheez hongi, toh uss pehle msg pe ak chat create ho rahi hai, uss chat k andar sare messages rahenge jaha pehla msg user ka hoga aur dusra AI ka.

return {
initializeSocketConnection,
handleSendMessage,
};
};

// =============================================
// handleSendMessage — Detailed Explanation
// =============================================

// Yeh function tab call hota hai jab user koi message type karke Send dabata hai.
// Yeh ek async function hai jo 2 cheezein accept karta hai:
// 1. message → user ka typed text
// 2. chatId → agar purana chat chal raha hai toh uski ID, warna undefined

// ------ Step 1: Loading true karo ------
// dispatch(setLoading(true))
// Jab tak backend se response nahi aata, loading state true rehti hai.
// Is se UI pe spinner ya disabled state dikh sakti hai.

// ------ Step 2: Backend ko API call karo ------
// const data = await sendMessage({ message, chatId })
// chat.api.js ke through POST /api/chats/message call hoti hai.
// Agar chatId undefined hai → backend naya chat banata hai (title bhi generate karta hai AI se)
// Agar chatId diya gaya → backend usi chat mein message add karta hai

// Backend ka response (NAYA CHAT case mein):
// {
// title: "Docker Explained",
// chat: { \_id: "abc123", title: "Docker Explained", user: "..." },
// aiMessage: { content: "Docker is...", role: "ai" }
// }

// Backend ka response (FOLLOW-UP case mein):
// {
// title: null, ← kyunki naya chat nahi bana
// chat: null, ← kyunki if(!chatId) block skip hua
// aiMessage: { content: "...", role: "ai" }
// }

// ------ Step 3: Response unpack karo ------
// const { chat, aiMessage } = data
// data object se chat aur aiMessage alag kar lo

// ------ Step 4: Redux state update karo ------
// dispatch(setChats((prev) => { ... }))
//
// prev = Redux mein jo chats pehle se stored hain, unka poora object
// ...prev = spread operator → purane saare chats ko copy karo (taaki delete na ho)
//
// [chat.title] = naya key (jo AI ne generate kiya title hai, jaise "Docker Explained")
// Agar yeh key pehle nahi thi → naya entry add hoga
// Agar yeh key pehle se thi → wo entry overwrite ho jaayegi (messages reset)
//
// messages array mein 2 cheezein:
// 1. { content: message, role: 'user' } → user ka original message
// 2. aiMessage → backend se aayi AI ki response

// Example — Redux state pehle:
// chats = { "Node.js Basics": { ... } }
//
// handleSendMessage call ke baad:
// chats = {
// "Node.js Basics": { ... }, ← ...prev ki wajah se safe raha
// "Docker Explained": { ← naya entry add hua
// \_id: "abc123",
// title: "Docker Explained",
// messages: [
// { content: "What is Docker?", role: "user" },
// { content: "Docker is a containerization...", role: "ai" }
// ]
// }
// }

// ------ Step 5: Active chat set karo ------
// dispatch(setCurrentChatId(chat.\_id))
// Naye bane chat ki ID ko current active chat mark kar do.
// Isse Dashboard ko pata chalta hai ki screen pe kaunsi chat dikhani hai.

// ------ Step 6: Loading false karo ------
// dispatch(setLoading(false))
// API call complete ho gayi, loading khatam.

// =============================================
// IMPORTANT BUGS in current code:
// =============================================

// BUG 1: setChats ko function pass ho raha hai
// dispatch(setChats((prev) => { ... })) ← WRONG
// Redux slice mein: state.chats = action.payload → payload ek function ban jaata hai, object nahi!
// Sahi tarika: pehle value calculate karo, phir dispatch karo.

// BUG 2: Yeh code sirf NAYE chat ke liye kaam karta hai
// Follow-up message case mein backend null chat return karta hai.
// Tab [chat.title] → null.title → 💥 TypeError CRASH
// Follow-up ke liye alag logic likhna padega.

//==================================================================

now , i've made changes in code, it is as follows::

```javascript
----------------------------------------
Frontend/src/features/chat/chat.slice.js
----------------------------------------

import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({ content, role });
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
} = chatSlice.actions;
export default chatSlice.reducer;

// chats = {
//     "docker and AWS": {
//         messages: [
//             {
//                 role: "user",
//                 content: "What is docker?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers. It provides an efficient way to package and distribute software, ensuring consistency across different environments."
//             }
//         ],
//         id: "docker and AWS",
//         lastUpdated: "2024-06-20T12:34:56Z",
//     }

// }


-------------------------------------------
Frontend/src/features/chat/hooks/useChat.js
-------------------------------------------

import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title,
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
    }

}


----------------------------------------------
Frontend/src/features/chat/pages/Dashboard.jsx
----------------------------------------------

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput('');
  };

  return (
    <main className="min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5">
      <section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none">
        <aside className="hidden h-full w-72 shrink-0 rounded-3xl border  bg-[#080b12] p-4 md:flex md:flex-col">
          <h1 className="mb-5 text-3xl font-semibold tracking-tight">
            Perplexity
          </h1>

          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className="w-full rounded-xl border border-white/60 bg-transparent px-3 py-2 text-left text-base font-medium text-white/90 transition hover:border-white hover:text-white"
              >
                Chat title
              </button>
            ))}
          </div>
        </aside>

        <section className="relative max-w-3/5 mx-auto flex h-full min-w-0 flex-1 flex-col gap-4">
          <div className="messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30">
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${
                  message.role === 'user'
                    ? 'ml-auto rounded-br-none bg-white/12 text-white'
                    : 'mr-auto border border-white/25 bg-[#0f1626] text-white/90'
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <footer className="rounded-3xl w-full absolute bottom-2 border border-white/60 bg-[#080b12] p-4 md:p-5">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/45 focus:border-white/90"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-2xl border border-white/60 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;

```

//==================================================================
// EXPLANATION OF UPDATED CODE (chat.slice.js + useChat.js + Dashboard.jsx)
//==================================================================

// =============================================
// chat.slice.js — 2 Naye Reducers
// =============================================

// createNewChat reducer:
// ---------------------
// Yeh reducer Redux ke chats object mein ek NAYA KHALI container banata hai.
// Payload mein chatId aur title aata hai.
// state.chats[chatId] = { id, title, messages: [], lastUpdated }
// Messages array shuruat mein KHALI hoti hai — baad mein addNewMessage se fill hogi.
// Key chatId hota hai (MongoDB \_id) — title nahi, warna duplicate title pe overwrite ho sakta tha.

// addNewMessage reducer:
// ----------------------
// Yeh reducer kisi existing chat ke messages array mein ek message PUSH karta hai.
// Payload mein chatId, content, role aata hai.
// state.chats[chatId].messages.push({ content, role })
// Redux Toolkit ke andar Immer hota hai — isliye direct mutation allowed hai.

// Dono milke kaam karte hain:
// Step 1 → createNewChat → khali box banao (ghar banao)
// Step 2 → addNewMessage → message daalo (saamaan rakho)
// Step 3 → addNewMessage → AI reply daalo

// =============================================
// dispatch kaise kaam karta hai?
// =============================================

// dispatch ek "postman" hai jo Redux Store tak parcel pahunchata hai.
// Parcel mein 2 cheezein hoti hain:
// type: "chat/createNewChat" ← kaunsa reducer chalana hai
// payload: { chatId, title } ← kya data bhej rahe hain
//
// Redux Store type dekhta hai → sahi reducer run karta hai → state update hoti hai.

// =============================================
// FULL FLOW — User ne message bheja
// =============================================

// SCENE: User types "What is Docker?" and hits Send

// Step 1 — Dashboard.jsx mein handleSubmitMessage chali
// chatInput = "What is Docker?"
// trimmedMessage = "What is Docker?" (spaces hataaye)
// chat.handleSendMessage({ message: "What is Docker?", chatId: null })
// (pehla message hai, currentChatId = null)

// Step 2 — useChat.js ka handleSendMessage chala
// message = "What is Docker?", chatId = null

// Step 3 — Loading true karo
// dispatch(setLoading(true))

// Step 4 — Backend ko API call karo
// POST /api/chats/message { message: "What is Docker?", chatId: null }
// chatId null → backend ne NAYA chat banaya
// Backend ka response:
// {
// chat: { \_id: "abc123", title: "Docker Explained" },
// aiMessage: { content: "Docker is a platform...", role: "ai" }
// }

// Step 5 — Response unpack karo
// const { chat, aiMessage } = data

// Step 6 — Redux mein khali container banao
// dispatch(createNewChat({ chatId: "abc123", title: "Docker Explained" }))
// Redux: chats["abc123"] = { id, title, messages: [], lastUpdated }

// Step 7 — User ka message daalo
// dispatch(addNewMessage({ chatId: "abc123", content: "What is Docker?", role: "user" }))
// Redux: chats["abc123"].messages = [{ content: "What is Docker?", role: "user" }]

// Step 8 — AI ka reply daalo
// dispatch(addNewMessage({ chatId: "abc123", content: "Docker is...", role: "ai" }))
// Redux: chats["abc123"].messages = [user msg, ai msg]

// Step 9 — Is chat ko active mark karo
// dispatch(setCurrentChatId("abc123"))
// Redux: currentChatId = "abc123"

// Step 10 — Dashboard automatically re-render
// useSelector ne Redux change detect kiya
// currentChatId = "abc123", chats["abc123"].messages = [user msg, ai msg]
// chats[currentChatId]?.messages.map(...) → messages screen pe dikh gaye ✅

// =============================================
// currentChatId Dashboard mein kaise aata hai?
// =============================================

// Redux Store ek "shared diary" hai — sab components isse padh sakte hain.
// useSelector ek "live wire" hai jo diary se data leta hai.
//
// const currentChatId = useSelector((state) => state.chat.currentChatId)
//
// Jab dispatch(setCurrentChatId("abc123")) hota hai:
// → Redux diary mein "abc123" likh jaata hai
// → useSelector ka wire change detect karta hai
// → Dashboard re-render hoti hai aur currentChatId = "abc123" mil jaata hai
// → Pehle: currentChatId = null (koi chat nahi thi)
// → Baad: currentChatId = "abc123" (automatically update)

// =============================================
// BUGS in current code
// =============================================

// BUG 1: createNewChat har message pe dispatch hota hai
// -------------------------------------------------------
// Pehla message: chatId = null → backend ne "abc123" banaya → createNewChat theek hai ✅
// Follow-up msg: chatId = "abc123" → createNewChat phir chala
// → chats["abc123"] = { messages: [] } ← RESET! Pehle ke messages gayab ❌
//
// FIX:
// if (!chatId) {
// dispatch(createNewChat({ chatId: chat.\_id, title: chat.title }))
// }
// // Sirf tab naya container banao jab genuinely naya chat ho (chatId null tha)

// BUG 2: Sidebar mein hardcoded "Chat title" buttons
// ---------------------------------------------------
// Dashboard.jsx ka sidebar:
// Array.from({ length: 6 }).map(...) ← hardcoded 6 buttons
// "Chat title" ← hardcoded text, Redux se nahi aa raha
//
// FIX:
// Object.values(chats).map((chat) => (
// <button key={chat.id}>{chat.title}</button>
// ))
// // Real chat titles Redux se aayenge

//==================================================================

now , i've made some more changes in code, it is as follows::

```javascript
----------------------------------------
Frontend/src/features/chat/chat.slice.js
----------------------------------------
import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            state.chats[ chatId ].messages.push({ content, role })
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[ chatId ].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages } = chatSlice.actions
export default chatSlice.reducer


// chats = {
//     "docker and AWS": {
//         messages: [
//             {
//                 role: "user",
//                 content: "What is docker?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers. It provides an efficient way to package and distribute software, ensuring consistency across different environments."
//             }
//         ],
//         id: "docker and AWS",
//         lastUpdated: "2024-06-20T12:34:56Z",
//     }

// }


-------------------------------------------
Frontend/src/features/chat/hooks/useChat.js
-------------------------------------------
import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title,
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }


    async function handleOpenChat(chatId) {

        const data = await getMessages(chatId)
        const { messages } = data

        const formattedMessages = messages.map(msg => ({
            content: msg.content,
            role: msg.role,
        }))
        dispatch(addMessages({
            chatId,
            messages: formattedMessages,
        }))
        dispatch(setCurrentChatId(chatId))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}

----------------------------------------------
Frontend/src/features/chat/pages/Dashboard.jsx
----------------------------------------------
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'


const Dashboard = () => {
  const chat = useChat()
  const [ chatInput, setChatInput ] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
  }

  return (
    <main className='min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5'>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl border   p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none'>
        <aside className='hidden h-full w-72 shrink-0 rounded-3xl border  bg-[#080b12] p-4 md:flex md:flex-col'>
          <h1 className='mb-5 text-3xl font-semibold tracking-tight'>Perplexity</h1>

          <div className='space-y-2'>
            {Object.values(chats).map((chat,index) => (
              <button
                onClick={()=>{openChat(chat.id)}}
                key={index}
                type='button'
                className='w-full cursor-pointer rounded-xl border border-white/60 bg-transparent px-3 py-2 text-left text-base font-medium text-white/90 transition hover:border-white hover:text-white'
              >
                {chat.title}
              </button>
            ))}
          </div>
        </aside>

        <section className='relative max-w-3/5 mx-auto flex h-full min-w-0 flex-1 flex-col gap-4'>

          <div className='messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30'>
            {chats[ currentChatId ]?.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
                    ? 'ml-auto rounded-br-none bg-white/12 text-white'
                    : 'mr-auto border border-white/25 bg-[#0f1626] text-white/90'
                  }`}
              >
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                      ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                      ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                      code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                      pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <footer className='rounded-3xl w-full absolute bottom-2 border border-white/60 bg-[#080b12] p-4 md:p-5'>
            <form onSubmit={handleSubmitMessage} className='flex flex-col gap-3 md:flex-row'>
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Type your message...'
                className='w-full rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/45 focus:border-white/90'
              />
              <button
                type='submit'
                disabled={!chatInput.trim()}
                className='rounded-2xl border border-white/60 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
```
