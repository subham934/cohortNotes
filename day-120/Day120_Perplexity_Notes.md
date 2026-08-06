# Day 120 — Build Perplexity Clone
> **Stack:** Node.js · Express · MongoDB · Mongoose · Nodemailer · JWT · bcryptjs

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Data Modeling](#2-data-modeling)
3. [Server Setup](#3-server-setup)
4. [Mongoose Models](#4-mongoose-models)
5. [Authentication Flow](#5-authentication-flow)
6. [Validators & Routes](#6-validators--routes)
7. [Auth Controller](#7-auth-controller)
8. [Nodemailer + Gmail OAuth2](#8-nodemailer--gmail-oauth2)
9. [Bugs Found & Fixed](#9-bugs-found--fixed)
10. [Folder Structure](#10-folder-structure)
11. [Key Concepts](#11-key-concepts)

---

## 1. Project Overview

We are building a **Perplexity.ai clone** — an AI-powered chat app that searches the internet and returns summarized, cited answers.

### Core Features
- **Authentication** — Register → Email Verification → Login
- **Chat with AI** — with internet research capability
- **Chat History** — saved per user in MongoDB
- **Message Storage** — every message stored with role (`user` / `ai`)

---

## 2. Data Modeling

> **Data modeling** = how you structure your data inside the database. Each schema is a blueprint for a MongoDB collection.

### User
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `username` | String | unique, required |
| `email` | String | unique, lowercase |
| `password` | String | bcrypt-hashed, never plain text |
| `verified` | Boolean | default: `false` |
| `createdAt` | Date | auto via `timestamps` |
| `updatedAt` | Date | auto via `timestamps` |

### Chat
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `user_id` | ObjectId | ref → User |
| `title` | String | default: `"New Chat"` |
| `createdAt / updatedAt` | Date | auto |

### Message
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `chat` | ObjectId | ref → Chat |
| `content` | String | required |
| `role` | String | enum: `['user', 'ai']` |
| `createdAt / updatedAt` | Date | auto |

---

## 3. Server Setup

### `server.js`
```js
import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### `src/config/database.js`
```js
import mongoose from "mongoose";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
```

### `src/app.js`
```js
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

export default app;
```

> 💡 Run `npm run dev` to start. Server boots on port 3000 and connects to MongoDB.

---

## 4. Mongoose Models

### `src/models/user.model.js`
```js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook: hash password before saving to DB
userSchema.pre("save", async function (next) {   // ← 'next' param is required!
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method: compare plain password with hashed one
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
```

> 🐛 **Bug Fixed:** The original notes were missing `next` as a parameter in the pre-save callback. Without it, `next()` is `undefined` and the app crashes on every save.

### `src/models/chat.model.js`
```js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:   { type: String, default: "New Chat", trim: true },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
```

### `src/models/message.model.js`
```js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat:    { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String, required: true },
    role:    { type: String, enum: ["user", "ai"], required: true },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
```

---

## 5. Authentication Flow

Unlike a basic auth system that sends a JWT right after registration, we enforce **email verification first.**

```
Register → user created (verified: false)
        → verification email sent (with tokenized link)
        → user clicks link
        → server sets verified: true
        → user can now login
        → JWT generated and returned
```

> ⚠️ **JWT is ONLY generated when `verified === true`.** Unverified users cannot log in.

---

## 6. Validators & Routes

### `src/validators/auth.validator.js`
```js
import { body, validationResult } from "express-validator";

// Runs after validators — checks for errors
export function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be 3–30 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Letters, numbers, underscores only"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Minimum 6 characters"),

    validate  // must be last in the array
];
```

### `src/routes/auth.routes.js`
```js
import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);

export default authRouter;
```

---

## 7. Auth Controller

### `src/controllers/auth.controller.js`
```js
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
    const { username, email, password } = req.body;

    // Check for duplicate email or username
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
        });
    }

    // Create user — password gets auto-hashed by the pre-save hook
    const user = await userModel.create({ username, email, password });

    // Generate a short-lived token for email verification
    const verifyToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    // Send verification email (NOT a login JWT!)
    await sendEmail({
        to: email,
        subject: "Verify your Perplexity account",
        html: `
            <p>Hi ${username},</p>
            <p>Click the link below to verify your email address:</p>
            <a href="${process.env.CLIENT_URL}/verify-email?token=${verifyToken}">
                Verify My Email
            </a>
            <p>This link expires in 24 hours.</p>
        `
    });

    res.status(201).json({
        message: "Registered! Check your email to verify your account.",
        success: true,
        user: { id: user._id, username: user.username, email: user.email }
    });
}
```

> 💡 Password hashing happens automatically in the pre-save hook — never hash manually in the controller.

> 🐛 **Bug Fixed:** The original notes had a welcome email with **no verification link**. The whole purpose of the email is to let the user verify — so the link is essential.

---

## 8. Nodemailer + Gmail OAuth2

### How email sending works

Your Node.js server **cannot send emails directly**. It needs to talk to an SMTP server (Gmail's) which does the actual delivery.

```
Your App  →  Transporter  →  Gmail SMTP  →  User's Inbox
```

> 💡 Think of the **transporter** like a delivery truck. Your app hands the letter to the truck, the truck drives it to the post office (SMTP), and the post office delivers it.

### Install
```bash
npm install nodemailer
```

### `.env` variables needed
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_USER=your_gmail@gmail.com
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
CLIENT_URL=http://localhost:5173
PORT=3000
```

### `src/services/mail.service.js`
```js
import nodemailer from "nodemailer";

// Transporter = bridge between your app and Gmail's SMTP server
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user:         process.env.GOOGLE_USER,
        clientId:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
});

// Verify connection on server startup
transporter.verify()
    .then(() => console.log("Email transporter ready!"))
    .catch((err) => console.error("Transporter failed:", err));

export async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
}
```

> 💡 **Why OAuth2 and not a plain Gmail password?** Google blocks plain password auth as suspicious. OAuth2 uses a refresh token to get a short-lived access token for each send — much safer and reliable.

---

## 9. Bugs Found & Fixed

### Bug #1 — Missing `next` in pre-save hook

```js
// ❌ WRONG (original):
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return next(); // ReferenceError: next is not defined
});

// ✅ CORRECT (fixed):
userSchema.pre("save", async function (next) {  // ← accept 'next' as param
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();  // ← call it at the end too
});
```

---

### Bug #2 — Unused `jwt` import in controller

The original imported `jwt` in `auth.controller.js` but didn't use it in `register()`. Now it's actually used to generate the verification token.

```js
// ✅ jwt IS now used — to create the email verification token:
const verifyToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
```

> JWT for **login sessions** will be a separate token, generated only after `verified: true`.

---

### Bug #3 — Verification email had no link

```js
// ❌ Original: just a welcome message, useless for verification
html: `<p>Thank you for registering at Perplexity.</p>`

// ✅ Fixed: includes an actual tokenized verification link
html: `<a href="${process.env.CLIENT_URL}/verify-email?token=${verifyToken}">
         Verify My Email
       </a>`
```

---

## 10. Folder Structure

```
perplexity-clone/
├── server.js
├── .env
├── package.json
└── src/
    ├── app.js
    ├── config/
    │   └── database.js
    ├── controllers/
    │   └── auth.controller.js
    ├── models/
    │   ├── user.model.js
    │   ├── chat.model.js
    │   └── message.model.js
    ├── routes/
    │   └── auth.routes.js
    ├── services/
    │   └── mail.service.js
    └── validators/
        └── auth.validator.js
```

---

## 11. Key Concepts

### Mongoose `pre('save')` hook
Runs automatically **before** a document is saved to MongoDB. Used here to hash the password. Always accept and call `next` — without it, Mongoose hangs waiting forever.

### SMTP vs Transporter
SMTP is the email delivery protocol. The Nodemailer **transporter** is the bridge between your server and the SMTP server (Gmail). Configure it once, reuse it for every email.

### OAuth2 vs Password Auth
Using a raw Gmail password in code is insecure and Google may block it. OAuth2 uses client credentials + a refresh token to get short-lived access tokens — much safer.

### `verified` field strategy
User is created with `verified: false`. They **cannot log in** (no JWT) until they click the verification link and the server sets `verified: true`. This prevents fake/unconfirmed accounts.

### Modular architecture
We split code into `controllers/`, `routes/`, `validators/`, `services/`, and `models/`. Each file has one job. This makes the codebase easier to debug, test, and scale.

---

*Day 120 Complete ✓*
