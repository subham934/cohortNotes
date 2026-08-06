# Day 119 — Socket.IO & Real-Time Communication

---

## 1. The Problem: HTTP Polling

Imagine a chat app with two users, **A** and **B**, and a **server** that stores their message history.

Without any real-time technology, this is what happens:

- **B sends a message** → message reaches the server, and stays there.
- **A never automatically receives it.** Instead, A has to **continuously ask (poll) the server**: *"Do you have any new messages for me?"*
- If the server has nothing new, it returns nothing — but A has to keep asking anyway.

This process is called **HTTP Polling**.

### Why HTTP Polling is Inefficient

- User A sends repeated requests to the server even when there's nothing new.
- This wastes bandwidth and CPU on both the client and server.
- The same problem exists in reverse for user B.
- As more users join, **server load keeps increasing** with all these unnecessary requests.

---

## 2. The Solution: Socket.IO

**Socket.IO** is a library built on top of **WebSockets** that solves this problem.

Instead of polling:

- Both users (A and B) **connect to the server once** and **keep that connection open**.
- When B sends a message, the server **pushes it directly to A** over the existing connection.
- No repeated polling needed — the server proactively delivers data to clients.

> **Key idea:** The connection is persistent and bidirectional. Either side (client or server) can send data at any time.

---

## 3. Setting Up the Project

### Step 1: Install Express

```bash
npm install express
```

Express.js is a backend framework that makes building a server easy.

### Step 2: Enable ES Modules in `package.json`

```json
{
  "type": "module"
}
```

Node.js by default uses `require()` (CommonJS syntax). Adding `"type": "module"` lets you use modern `import` syntax instead:

```js
import express from "express";
```

### Step 3: Create `src/app.js`

```js
import express from "express";

const app = express();

export default app;
```

- `express()` creates the main application (server object).
- `export default app` allows importing it in other files.

### Step 4: Create `server.js`

```js
import app from "./src/app.js";

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

This starts the server on **port 3000**.

---

## 4. Adding Socket.IO

### Install

```bash
npm install socket.io
```

### Why Can't Socket.IO Attach Directly to Express?

Express alone handles standard **request-response** HTTP cycles. Socket.IO needs a persistent, low-level **HTTP server** to attach to and run WebSockets alongside normal HTTP traffic.

### Updated `server.js`

```js
import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("New user connected");
});

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

### Line-by-Line Breakdown

| Line | Explanation |
|---|---|
| `import { createServer } from "http"` | Node's built-in module to create a real HTTP server |
| `const httpServer = createServer(app)` | Wraps the Express app inside a raw HTTP server |
| `const io = new Server(httpServer)` | Attaches Socket.IO to the HTTP server |
| `io.on("connection", (socket) => {...})` | Fires whenever a new client connects |
| `httpServer.listen(3000)` | Starts the actual server (not `app.listen` anymore) |

> ⚠️ **Important Change:** Use `httpServer.listen(3000)` instead of `app.listen(3000)`. The real server is now `httpServer`; Express (`app`) is just the logic layer inside it.

### Architecture Overview

```
Express App (logic/routes)
        ↓
HTTP Server (real server — createServer)
        ↓
Socket.IO attached
        ↓
httpServer.listen()
```

**Analogy:**
- Express = the restaurant menu 🍽️
- HTTP Server = the building 🏢
- Socket.IO = the live waiter (real-time service) 🤵

---

## 5. Core Concepts: `io` vs `socket`

> 💡 This is the most important mental model in Socket.IO.

| Term | Represents |
|---|---|
| `io` | The **server** — talks to all clients |
| `socket` | A **single client connection** |

### Two Key Methods

| Method | Meaning |
|---|---|
| `.on(event, callback)` | **Listen** for an event |
| `.emit(event, data)` | **Trigger/send** an event |

Socket.IO is **event-driven**: actions happen in response to named events being fired.

---

## 6. Events in Action

### Built-in Event: `"connection"`

```js
io.on("connection", (socket) => {
    console.log("New connection created");
});
```

Every time a client connects (e.g., from Postman or your frontend), this callback runs. If two clients connect, you see `"New connection created"` twice in the terminal.

### Custom Events: Listening from Client

```js
io.on("connection", (socket) => {
    console.log("New connection created");

    socket.on("message", (msg) => {
        console.log("User fired message event");
        console.log(msg); // could be a string or a JSON object
    });
});
```

When a client fires the `"message"` event with data, the server receives it here.

**Console output example:**

```
Server is running on port 3000
New connection created
User fired message event
hello socket.io from user
User fired message event
{ data: 'some secret data' }
```

Data can be sent as plain text or as a JSON object.

---

## 7. Emitting Events from the Server

Once the server receives an event, it can broadcast events back to clients.

```js
io.on("connection", (socket) => {
    socket.on("message", (msg) => {
        console.log(msg);
        io.emit("abc"); // broadcast to ALL connected clients
    });
});
```

When user B fires the `"message"` event, the server emits `"abc"` to every connected client — including user A. If A is listening for `"abc"`, it will receive it.

---

## 8. The Three Ways to Emit

This is a critical distinction — always know **who you're targeting**:

| Method | Who Receives It |
|---|---|
| `socket.emit()` | Only the **current user** (the one who triggered the event) |
| `socket.broadcast.emit()` | **Everyone except** the current user |
| `io.emit()` | **Everyone including** the current user |

### `socket.emit()` — Only the Sender

Use when the response is **personal** to the user who acted.

```js
io.on("connection", (socket) => {
    socket.on("login", (userData) => {
        socket.emit("login-success", {
            message: "Login successful",
            user: userData
        });
    });
});
```

**Use cases:** Login responses, OTP results, personal dashboard data.

### `socket.broadcast.emit()` — Everyone Except the Sender

Use when others need to know about someone's action, but the **sender already knows what they did**.

```js
io.on("connection", (socket) => {
    socket.on("join", (username) => {
        socket.broadcast.emit("user-joined", {
            message: `${username} joined the chat`
        });
    });
});
```

**Use cases:** "User joined" notifications, typing indicators, live presence updates.

### `io.emit()` — Everyone Including the Sender

Use when the **entire room** needs the same update.

```js
io.on("connection", (socket) => {
    socket.on("send-message", (msg) => {
        io.emit("receive-message", {
            message: msg,
            sender: socket.id
        });
    });
});
```

**Use cases:** Chat messages, live score updates, global announcements.

---

## 9. Summary Table

| Method | Target | Common Use Case |
|---|---|---|
| `socket.emit()` | Current user only | Login success, personal alerts |
| `socket.broadcast.emit()` | All users except sender | "X is typing", "Y joined" |
| `io.emit()` | All users including sender | Chat messages, live updates |

---

## 10. What to Read Next (Socket.IO Docs)

- **Events (full)** — deeper dive into custom events
- **Adapters** — intro + Redis adapter (for scaling across multiple servers)
- **Server** — middleware
- **Client** — socket instance