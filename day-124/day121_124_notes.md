# Day 121 + Day 124 — Full Notes
### Backend Auth + Frontend 4-Layer Architecture

---

# DAY 121 — Backend: Email Verification + Login + Auth Middleware

---

## 1. Email Verification — Concept Samjho Pehle

**Problem:** Jab user register karta hai, hum seedha trust nahi kar sakte ki email real hai. Isliye verification zaroori hai.

**Flow kuch aisa hai:**
1. User register karta hai → data DB mein save hota hai lekin `verified = false` rehta hai
2. Server ek verification link email karta hai jisme ek JWT token hota hai
3. User link pe click karta hai → server token verify karta hai → `verified = true` kar deta hai

**Analogy:** Socho tum ek club join kar rahe ho. Join karte hi tumhara naam list mein aa jaata hai lekin "pending" mein. Jab tak tumhara ID card verify nahi hota, andar nahi jaoge. Email verification bilkul aisa hi hai.

---

### Token kaise banate hain — `jwt.sign()`

```js
const emailVerificationToken = jwt.sign(
  { email: user.email },
  process.env.JWT_SECRET
);
```

- `jwt.sign()` — JWT token banata hai. Andar data pack hota hai jo baad mein verify kar sakte hain
- `{ email: user.email }` — token ke andar user ka email store ho raha hai. Jab user link click karega, server is email se user dhundega
- `process.env.JWT_SECRET` — ek secret key hai jo sirf server ko pata hai. Isse token ko tamper nahi kar sakte
- **Expiry nahi diya** — email verification tokens usually expire nahi karte. Login token pe expiry dete hain

---

### Email bhejne ka code — `sendEmail()`

```js
await sendEmail({
  to: email,
  subject: "Welcome to Perplexity!",
  html: `
    <p>Hi ${username},</p>
    <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">
      Verify Email
    </a>
  `
});
```

- `await` — email bhejne mein time lagta hai (network call hai), isliye await lagaya
- `?token=...` — URL mein token query parameter ke roop mein bheja. Jab user click karega, browser ye token server ko bhejega
- Template literal `` `...` `` — backticks se HTML string banai, `${}` se dynamic values daale

**Outcome:** User ke inbox mein ek email aata hai jisme ek clickable link hota hai.

---

## 2. `verifyEmail` Controller — Link Click hone pe kya hota hai

```js
export async function verifyEmail(req, res) {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.verified = true;
    await user.save();

    return res.send("<h1>Email Verified Successfully!</h1>");
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
}
```

- `req.query.token` — URL mein jo `?token=xyz` aaya tha, woh yahan milta hai
- `jwt.verify()` — token ko decode karta hai aur check karta hai ki hamari hi secret se banaya gaya tha ya nahi
- `decoded.email` — ab hamein pata hai kaun sa user hai, usse DB mein dhundh lo
- `user.verified = true` — user object mein field update ki
- `user.save()` — DB mein permanently save kiya. **Bina save ke sirf memory mein change hota, DB mein nahi**
- `res.send(html)` — pure HTML wapas bheja (JSON nahi), kyunki browser mein directly dikhana tha

**Outcome:** DB mein `verified: true` ho jaata hai. User ek success page dekhta hai.

---

### User Model mein pre hook — Password Hashing

```js
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
```

- `pre("save")` — jab bhi `user.save()` call ho, pehle ye function chale
- `isModified("password")` — agar sirf `verified` update kar rahe hain toh password dobara hash mat karo. Ye check bahut zaroori hai warna `verified = true` karte waqt bhi password dobara hash ho jaata
- `bcrypt.hash(password, 10)` — password ko encrypt karta hai. `10` = salt rounds (kitna secure hash ho)

---

## 3. Login Controller — Step by Step

```js
export async function login(req, res) {
  const { email, password } = req.body;

  // Step 1: User dhundo
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Step 2: Verified hai ya nahi check karo
  if (!user.verified) {
    return res.status(400).json({ message: "Please verify your email first." });
  }

  // Step 3: Password match karo
  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Step 4: JWT token banao
  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Step 5: Cookie mein bhejo
  res.cookie("token", token);
  res.status(200).json({ message: "Logged in!", user: { id: user._id, username: user.username, email: user.email } });
}
```

- **Step 1 — `findOne({ email })`** — DB mein us email ka user dhundo. Agar nahi mila, 400 error
- **Step 2 — verified check** — Agar user ne email verify nahi ki, login allowed nahi. Security ke liye important hai
- **Step 3 — `comparePassword()`** — ye user model mein defined method hai jo bcrypt se password compare karta hai. Plain text se hashed password match hota hai
- **Step 4 — `jwt.sign()`** — login token banaya. Ismein id, email, username daala. `expiresIn: "7d"` matlab 7 din baad token expire ho jaayega
- **Step 5 — `res.cookie("token", token)`** — token ko browser ke cookie mein save kiya. Agle requests mein ye cookie automatically browser bhejega

**Outcome:** Successfully login karne ke baad browser mein ek cookie save hoti hai jisme JWT token hota hai.

---

## 4. Auth Middleware — Guard at the Gate

**Kya hai ye?** Kuch routes private hote hain — jaise "get-me" API. Inpe jaane se pehle proof chahiye ki user logged in hai. Middleware ye proof check karta hai.

```js
// src/middleware/auth.middleware.js

export const authUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
```

- `req.cookies.token` — browser ne cookie mein jo token save kiya tha, woh yahan milta hai
- `!token check` — agar cookie mein token hi nahi hai, seedha reject karo
- `jwt.verify()` — token valid hai ya nahi check karo. Agar token tamper hua ya expire hua, ye error throw karega
- `req.user = decoded` — token ke andar jo data tha (id, email, username), use `req` object pe chipka diya. Ab agle controller ko pata hai kaun sa user hai
- `next()` — sab sahi hai, aage jaane do. Controller run hoga

**Analogy:** Security guard ki tarah. "ID card dikhao" — valid hai toh andar, nahi toh bahar.

---

## 5. `getMe` Controller

```js
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
}
```

- `req.user.id` — middleware ne `req.user` set kiya tha, isse user ka ID milta hai
- `findById(userId)` — ID se DB mein user dhundo
- `.select("-password")` — password field exclude karo response mein. Security ke liye — kabhi bhi hashed password bhi front-end ko mat bhejo

**Route definition:**
```js
authRouter.get("/get-me", authUser, getMe);
//                          ↑           ↑
//                    middleware     controller
// authUser pehle chalega, token check karega. Pass kiya toh getMe chalega.
```

---

# DAY 124 — Frontend: 4-Layer Architecture

---

## Architecture Overview — Kya Banaya?

Frontend mein ek 4-layer structure banaya gaya hai:

| Layer | File | Kaam |
|-------|------|------|
| Layer 1 — UI Layer | `Login.jsx`, `Register.jsx`, `Dashboard.jsx` | Jo user dekhta hai |
| Layer 2 — API Layer | `auth.api.js` | Backend se baat karna |
| Layer 3 — State Layer | `auth.slice.js`, `app.store.js` | Global memory (Redux) |
| Layer 4 — Hook Layer | `useAuth.js` | Sab ko jodna |

**Kyun 4 layers?** Agar kal API change ho, sirf API layer badlo. UI ko kuch nahi pata. Maintenance easy hoti hai.

---

## `app.routes.jsx` — URL ka Map

```jsx
import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><Dashboard /></Protected>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" replace />
  }
]);
```

- `createBrowserRouter([])` — React Router ko batao ki kaun sa URL pe kaun sa component dikhana hai
- `path: "/"` — home route. Isme Dashboard hai lekin `Protected` mein wrap hai
- `<Protected><Dashboard/></Protected>` — Protected check karega ki user logged in hai ya nahi. Agar nahi, `/login` pe redirect karega
- `<Navigate to="/" replace />` — `/dashboard` URL hit karo toh seedha `/` pe bhejo. `replace` se browser history mein purana URL nahi save hota

**Outcome:** Poori app ka routing ek hi jagah defined hai.

---

## `App.jsx` — Hydration ka Magic

```jsx
import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { useAuth } from "../features/auth/hook/useAuth.js";
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
```

- `RouterProvider router={router}` — poori app mein routing active karta hai. URL change hone pe React Router sahi component dikhayega
- `useEffect(() => {...}, [])` — `[]` empty array hai, matlab ye sirf **ek baar** chalega jab app pehli baar load ho
- `handleGetMe()` — jaise hi app load ho, backend se current user ka data fetch karo aur Redux mein save karo

**Ye process "Hydration" kehlaata hai:**
Page reload pe Redux state reset ho jaati hai (sab kuch `null`). Lekin browser mein cookie still saved hoti hai. Toh app load hote hi us cookie se backend ko verify karte hain aur state phir se set karte hain.

```
Page reload
    ↓
Redux state = null (reset ho gayi)
    ↓
App.jsx load → useEffect → handleGetMe() call
    ↓
Backend cookie dekh ke user data bhejta hai
    ↓
dispatch(setUser(data.user)) → Redux state phir se set
    ↓
Ab poori app ko pata hai user logged in hai
```

---

## `auth.api.js` — API Layer

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

export async function register({ email, password, username }) {
  const response = await api.post("/api/auth/register", { email, password, username });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}
```

- `axios.create({...})` — ek custom axios instance banaya. Ab har request mein `baseURL` aur `withCredentials` automatically lagega
- `baseURL` — URL ka woh part jo har request mein same rehta hai. `api.post("/api/auth/login")` likhne pe automatically `http://localhost:3000/api/auth/login` ban jaata hai
- `withCredentials: true` — cookies cross-origin requests mein bhi bhejne deta hai. Bina iske login cookie backend tak nahi pahunchti
- `async function` — ye functions asynchronous hain, network call ka wait karenge
- `api.post(url, body)` — POST request bhejo, body mein data daalo
- `api.get(url)` — GET request bhejo, koi body nahi
- `response.data` — axios puri response deta hai (headers, status, etc.), lekin humein sirf `data` chahiye jo backend ne bheja

**Outcome:** Ye teen clean functions hain. Koi bhi inhe call karke backend se baat kar sakta hai.

---

## `auth.slice.js` — State Layer (Redux)

```js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,  // ← true initially, hydration ke liye
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
```

- `createSlice({})` — Redux ka ek "slice" banao. Ek slice = ek feature ka state + usse change karne ke functions
- `name: "auth"` — slice ka naam. Redux devtools mein `auth/setUser` jaisi action names dikhti hain
- `initialState` — app start pe state ka starting value
- **`loading: true` initially** — ye bahut zaroori hai! Jab app load hoti hai, hydration ho rahi hoti hai. Loading `true` rakho taaki `Protected` component wait kare aur galat redirect na ho
- **Reducers ke andar functions:**
  - `state` — current Redux state (automatically milta hai)
  - `action` — jo data bheja gaya dispatch ke saath. `action.payload` mein actual value hoti hai
- `authSlice.actions` — Redux automatically action creator functions banata hai. Inhe export kiya taaki doosri files dispatch kar sakein
- `export default authSlice.reducer` — reducer ko store mein register karna hoga, isliye export kiya

---

## `app.store.js` — Redux Store (Central Whiteboard)

```js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
});
```

- `configureStore({})` — ek Redux store banao
- `reducer: { auth: authReducer }` — auth slice ka reducer register kiya. Key `"auth"` matlab `state.auth` se ye data milega
- Kal agar notes feature aaye: `reducer: { auth: authReducer, notes: notesReducer }` — bas itna add karo

**Analogy:** Store ek whiteboard hai. `auth` ek section hai us whiteboard ka. Jab koi `setUser` dispatch karta hai, us section mein user ka naam likh deta hai.

---

## `main.jsx` — App ka Entry Point

```jsx
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./app/index.css";
import { store } from "./app/app.store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

- `createRoot(document.getElementById("root"))` — HTML mein `id="root"` wala div dhundo, React app uske andar render hogi
- `<Provider store={store}>` — poori app ko Redux se connect kiya. Bina `Provider` ke koi component `useSelector` ya `useDispatch` use nahi kar sakta
- `index.css` — Tailwind CSS yahan import hota hai, globally apply ho jaata hai

**Analogy:** Provider ek WiFi router hai. Store internet connection hai. Provider ke bina koi component Redux se baat nahi kar sakta.

---

## `useAuth.js` — Hook Layer (Sab Ko Jodne Wala)

```js
import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ email, username, password });
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Registration failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch user"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe };
}
```

- `useDispatch()` — Redux ka hook. Ye `dispatch` function deta hai jisse state change kar sakte hain
- **`try` block** — loading true karo, API call karo
- `dispatch(setLoading(true))` — Redux mein `loading = true` set karo
- `await login({...})` — API layer ko call karo, response aane ka wait karo
- `dispatch(setUser(data.user))` — jo user backend ne bheja, Redux state mein save karo
- **`catch` block** — kuch bhi galat hua (wrong password, server down), error Redux mein save karo
- `err.response?.data?.message` — `?.` optional chaining hai. Agar `err.response` exist nahi karta (network error), crash nahi hoga — `undefined` milega
- `|| "Login failed"` — agar message nahi mila, default message use karo
- **`finally` block** — try succeed ho ya catch chale, loading **HAMESHA** false karo. Warna spinner hamesha chalta rahega

**Outcome:** UI ko sirf `const { handleLogin } = useAuth()` likhna hai aur call karna hai. Andar kya hota hai — API call, Redux update — sab hook handle karta hai.

---

## `Protected.jsx` — Private Route Guard

**Problem:** Agar user logged in nahi hai aur seedha `/` pe jaaye, Dashboard dikhaai de jaayega. Ye nahi hona chahiye.

```jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
```

- `useSelector()` — Redux store se data read karna. `state.auth.user` = auth slice ka user field
- `children` — jo bhi component `Protected` ke andar wrap kiya ho (yahan `Dashboard`), woh `children` mein aata hai
- `if (loading)` — hydration chal rahi hai, abhi pata nahi user hai ya nahi. Spinner dikhaao, wait karo

**Why loading check zaroori hai?** Ye bahut important hai:
```
Bina loading check ke:
App load → user = null → immediately /login redirect
handleGetMe ka response aata hai → user set hota hai
→ Tab tak redirect ho chuka hota hai :(

Loading check ke saath:
App load → loading = true → Protected "Loading..." dikhata hai
handleGetMe complete → loading = false, user set
→ Ab Protected dekhta hai user hai → Dashboard dikhaata hai ✓
```

- `if (!user)` — loading false ho gayi aur user abhi bhi null hai, matlab logged in nahi. `/login` pe bhejo
- `return children` — user hai, loading nahi — Dashboard dikhaao

**Outcome:** Dashboard kabhi bhi bina login ke nahi dikhega.

---

## Login.jsx — Naye Changes

Pehle `Login.jsx` sirf `console.log` karta tha. Ab usme real login logic aaya:

```jsx
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  // Agar already logged in hai, login page mat dikhao
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  // ... rest of UI
};
```

- `useNavigate()` — programmatically route change karne ke liye. `navigate("/")` call karo toh home page pe chale jaao
- `await handleLogin(payload)` — login complete hone ka wait karo, phir navigate karo
- `if (!loading && user)` — agar user pehle se logged in hai, login page kyun dikhaayein? Seedha home pe bhejo
- `!loading &&` — hydration complete hone ka wait karo. Loading ke dauran redirect mat karo

---

## `Dashboard.jsx` — Protected Page

```jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const chat = useChat();

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
```

- `useSelector((state) => state.auth)` — Redux se user ka data lo
- `chat.initializeSocketConnection()` — Socket.IO se backend se real-time connection banao
- `useEffect(() => {...}, [])` — sirf ek baar chalega jab Dashboard mount ho

---

## Backend — CORS aur Morgan Setup

Frontend aur Backend alag ports pe hain (5173 vs 3000). Browser by default cross-origin requests block karta hai. CORS isko allow karta hai.

```js
// Backend/src/app.js

import cors from "cors";
import morgan from "morgan";

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
```

- `morgan("dev")` — har request terminal mein log hoti hai. Format: `GET /api/auth/get-me 200 55ms`. Debugging ke liye bahut useful
- `cors({ origin: "http://localhost:5173" })` — sirf is origin (React app) se aane wali requests allow karo
- `credentials: true` — cookies cross-origin bhejne dega. Bina iske `withCredentials: true` React mein kaam nahi karta

**Morgan terminal mein aisa dikhta hai:**
```
GET /api/auth/get-me 304 71ms    ← Hydration (page reload)
OPTIONS /api/auth/login 204 0ms  ← Browser ka CORS preflight check
POST /api/auth/login 200 168ms   ← Actual login
GET /api/auth/get-me 401 0ms     ← Not logged in (no cookie)
```

- `304` — Not Modified. Data same hai, browser cached version use karega
- `200` — Success
- `401` — Unauthorized. Cookie nahi thi ya token invalid tha
- `OPTIONS request` — Browser pehle check karta hai "kya ye server cross-origin request allow karta hai?" — isko CORS preflight kehte hain

---

## Socket.IO — Real-time Connection

**Kya hai Socket.IO?** Normal HTTP mein request karo, response milta hai — connection khatam. Socket.IO mein ek permanent connection rehti hai. Server kab bhi client ko message bhej sakta hai bina client ke request ke. Chat apps ke liye perfect.

### Backend — Socket Server Setup

```js
// Backend/src/sockets/server.socket.js
import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    }
  });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
```

- `let io` — module level variable. `initSocket` ke baad `io` available hota hai poore module mein
- `new Server(httpServer, {...})` — Socket.IO server banaya aur HTTP server se attach kiya
- `getIO()` — doosri jagah se `io` object chahiye toh is function se lo. Agar `initSocket` pehle call nahi hua toh error dega

---

### `server.js` — HTTP Server ke saath integrate karna

```js
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- `import http from "http"` — Node.js built-in module
- `http.createServer(app)` — Express app ko HTTP server mein wrap kiya
- `initSocket(httpServer)` — Socket.IO ko is HTTP server se attach kiya
- `httpServer.listen()` — ab `app.listen()` ki jagah `httpServer.listen()` use kiya

**Kyun ye change kiya?** Socket.IO ko HTTP server directly chahiye hota hai taaki WebSocket connections handle kar sake. Express app seedha Socket.IO se compatible nahi hoti, toh pehle HTTP server banate hain, phir dono ko attach karte hain.

---

### Frontend — Socket Connection

```js
// Frontend/src/features/chat/service/chat.socket.js
import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
  const socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });
};
```

- `io("http://localhost:3000", {...})` — backend ke Socket.IO server se connect karo
- `withCredentials: true` — cookies saath mein bhejo taaki server pata kar sake kaun connect ho raha hai
- `socket.on("connect", ...)` — jab connection successful ho, ye callback chale. Console mein "Connected" dikhega

```js
// Frontend/src/features/chat/hooks/useChat.js
import { initializeSocketConnection } from "../service/chat.socket";

export const useChat = () => {
  return { initializeSocketConnection };
};
```

Simple wrapper hook. Dashboard mein `useChat()` se function lo aur call karo. Aage chat ke aur functions yahaan aayenge.

**Backend terminal pe aisa dikhega:**
```
A user connected: p0j1g4LRyvCS0SsXAAAF
```
Login ya Register page pe ye nahi dikhega — sirf Dashboard pe aata hai.

---

# Complete Login Flow — Ek Baar Sab Milake

```
1. User Login.jsx mein email/password daal ke Submit karta hai
        ↓
2. handleSubmit chalta hai → handleLogin() call hoti hai (Hook Layer)
        ↓
3. Hook: dispatch(setLoading(true)) → Redux mein loading = true
        ↓
4. login() function call hota hai (API Layer) → axios se POST /api/auth/login
        ↓
5. Backend: email check → verified check → password compare → JWT token generate → cookie set
        ↓
6. Response aata hai → dispatch(setUser(data.user)) → Redux mein user save
        ↓
7. dispatch(setLoading(false)) → loading = false
        ↓
8. navigate("/") → home page pe jaao
        ↓
9. Protected component: loading false + user hai → Dashboard dikhaao
        ↓
10. Dashboard mount hota hai → Socket.IO connection banta hai
```

---

# Key Concepts — Quick Reference

| Concept | Kya hai |
|---------|---------|
| **JWT** | Signed token jisme data store hota hai. Server verify kar sakta hai bina DB query ke |
| **Cookie** | Browser mein chhoti si storage. Automatically har request ke saath bhejti hai |
| **Redux** | Global state management. Poori app ka data ek jagah |
| **useSelector** | Redux se data padhna |
| **useDispatch + dispatch()** | Redux mein state change karna |
| **Middleware (Express)** | Route hit hone se pehle chalne wala code (jaise `authUser`) |
| **Hydration** | Page reload pe Redux state repopulate karna using cookies |
| **Socket.IO** | Real-time bidirectional communication. Chat ke liye use hoga |
| **CORS** | Different origin se requests allow karna (React app → Express server) |
| **Protected component** | Route guard. Sirf logged in users hi andar aa sakte hain |
| **Optional chaining `?.`** | Agar property exist nahi karti toh crash nahi hoga, `undefined` milega |
| **`finally` block** | Chahe try succeed kare ya catch chale, ye HAMESHA chalega |

---

*— End of Notes —*
