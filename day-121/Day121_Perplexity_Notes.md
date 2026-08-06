# Day 121 — Email Verification, Login, Auth Middleware & AI Integration
> **Stack:** Node.js · Express · MongoDB · JWT · Nodemailer · LangChain · Gemini

---

## Table of Contents
1. [Email Verification Flow](#1-email-verification-flow)
2. [verifyEmail Controller](#2-verifyemail-controller)
3. [Login API](#3-login-api)
4. [Auth Middleware (authUser)](#4-auth-middleware-authuser)
5. [getMe API](#5-getme-api)
6. [Complete Files (Final State)](#6-complete-files-final-state)
7. [AI Integration — LangChain + Gemini](#7-ai-integration--langchain--gemini)
8. [Message Flow with AI](#8-message-flow-with-ai)
9. [Bugs Found & Fixed](#9-bugs-found--fixed)
10. [Key Concepts](#10-key-concepts)

---

## 1. Email Verification Flow

After registration, the user's `verified` field is `false`. We send a JWT-signed link to their email. When they click it, the server verifies the token and sets `verified: true`.

```
Register → user saved (verified: false)
         → JWT token generated (contains email)
         → email sent with clickable link
         → user clicks link
         → GET /api/auth/verify-email?token=...
         → server decodes token → finds user → sets verified: true
         → user can now login
```

### Generating the verification token inside `register()`

```js
const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET
    // No expiry set here — token lives forever (see Bug #1 in section 9)
);
```

> ⚠️ **Note:** No `expiresIn` is set here. For production, always add `{ expiresIn: "1d" }` so old verification links expire.

### Sending the verification email

```js
await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
        <p>Hi ${username},</p>
        <p>Thank you for registering at <strong>Perplexity</strong>!</p>
        <p>Verify your email address by clicking the link below:</p>
        <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">
            Verify Email
        </a>
        <p>Best regards,<br>The Perplexity Team</p>
    `,
});
```

### Adding the route

```js
// src/routes/auth.routes.js
authRouter.get("/verify-email", verifyEmail);
```

---

## 2. verifyEmail Controller

```js
// src/controllers/auth.controller.js

export async function verifyEmail(req, res) {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found",
            });
        }

        user.verified = true;
        await user.save();

        const html = `
            <h1>Email Verified Successfully</h1>
            <p>Your email has been verified. You can now log in.</p>
            <a href="http://localhost:${process.env.PORT}/login">Login</a>
            <p>Best regards,<br>The Perplexity Team</p>
        `;

        return res.send(html);

    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message,
        });
    }
}
```

> 🐛 **Bug Fixed:** The original code had `if (!user)` inside the `catch` block. At that point, `user` is out of scope (it was declared inside `try`) — this causes a `ReferenceError`. The fix is to move the `if (!user)` check inside `try`, right after `findOne()`.

### Result in MongoDB after verification

```json
{
  "_id": "6a04a18ffd18019fe50bbcdf",
  "username": "SubhamDhar",
  "email": "dharsubham32@gmail.com",
  "password": "$2b$10$5Ju0NGsxMTPGIRILaARUpeKdJS95Z1Y1eki26nFJNiu.rXfkOKcUC",
  "verified": true,
  "createdAt": "2026-05-13T16:06:39.835Z",
  "updatedAt": "2026-05-13T16:25:19.417Z"
}
```

---

## 3. Login API

### Update `src/validators/auth.validator.js`

Add a `loginValidator` — same pattern as `registerValidator` but without `username`:

```js
export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    validate
];
```

### Update `src/routes/auth.routes.js`

```js
import { register, verifyEmail, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

/**
 * @route POST /api/auth/login
 * @desc  Login user — returns JWT in cookie
 * @access Public
 * @body  { email, password }
 */
authRouter.post("/login", loginValidator, login);
```

### `login()` controller

```js
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User not found",
            success: false,
            err: "User not found",
        });
    }

    // Block login if email not yet verified
    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email address before logging in.",
            success: false,
            err: "User not verified",
        });
    }

    // Compare password with hashed password in DB
    const isPasswordMatch = await user.comparePassword(password);  // ← must await!

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid password",
            success: false,
            err: "Invalid password",
        });
    }

    // Generate login JWT (separate from the email verification token)
    const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true });  // httpOnly prevents JS access

    return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}
```

> 🐛 **Bug Fixed:** The original code called `user.comparePassword(password)` without `await`. Since `comparePassword` returns a Promise (`bcrypt.compare`), without `await` it always returns a truthy Promise object — meaning **any password would work**. Always `await` it.

> 💡 **Two different JWTs:** The `emailVerificationToken` (used during registration) and the `token` (used during login) are separate. The login token contains `id`, `email`, `username` and expires in 7 days. The verification token only contains `email` and is single-use.

> 💡 Test login via Postman: `POST http://localhost:3000/api/auth/login`

---

## 4. Auth Middleware (authUser)

Once logged in, the JWT is stored in a cookie. Protected routes use this middleware to verify the token and attach the user to `req.user`.

### `src/middleware/auth.middleware.js`

```js
import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { id, email, username }
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token",
        });
    }
};
```

> 💡 `req.user` is now available in any route that uses this middleware. It contains the decoded JWT payload: `{ id, email, username }`.

---

## 5. getMe API

Returns the currently logged-in user's profile. Protected by `authUser` middleware.

### Update `src/routes/auth.routes.js`

```js
import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

/**
 * @route  GET /api/auth/get-me
 * @desc   Get currently logged-in user
 * @access Private (requires valid cookie token)
 */
authRouter.get("/get-me", authUser, getMe);
```

### `getMe()` controller

```js
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(400).json({
            message: "User not found",
            success: false,
            err: "User not found",
        });
    }

    return res.status(200).json({
        message: "User found",
        success: true,
        user,
    });
}
```

> 💡 `.select("-password")` tells Mongoose to return everything **except** the password field. Never send the password hash to the client.

---

## 6. Complete Files (Final State)

### `src/routes/auth.routes.js`

```js
import { Router } from "express";
import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/** @route POST /api/auth/register  — Public */
authRouter.post("/register", registerValidator, register);

/** @route POST /api/auth/login  — Public */
authRouter.post("/login", loginValidator, login);

/** @route GET  /api/auth/get-me  — Private */
authRouter.get("/get-me", authUser, getMe);

/** @route GET  /api/auth/verify-email?token=...  — Public */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
```

### `src/validators/auth.validator.js`

```js
import { body, validationResult } from "express-validator";

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
    validate
];

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Provide a valid email"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Minimum 6 characters"),
    validate
];
```

### `src/models/user.model.js` — pre-save hook fix

```js
// The pre-save hook must accept AND call next()
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```

> 🐛 **Bug (from Day 120, repeated in Day 121 notes):** The original showed the hook without `next` as a parameter AND without calling `next()` at the end. Both are required.

---

## 7. AI Integration — LangChain + Gemini

### Install packages

```bash
npm install @langchain/google-genai langchain
```

### Get your Gemini API key

1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API Key**
3. Create a new project and generate a key
4. Add to `.env`:

```
GEMINI_API_KEY=your_key_here
```

### `src/services/ai.service.js`

```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",   // use a stable, available model name
    apiKey: process.env.GEMINI_API_KEY,
});

// Test function — only for development/testing
export async function testAi() {
    const res = await model.invoke("What is the capital of France?");
    console.log(res.content);   // ← use .content, not .text (see Bug #3)
}
```

> 🐛 **Bug Fixed:** The original used `.then()` on `model.invoke()` without `await`, making error handling hard. Also used `res.text` — in LangChain's `AIMessage`, the correct property is `res.content`. Always `await` async calls.

### Testing in `server.js` (temporary, remove after testing)

```js
// server.js — add temporarily for testing
import { testAi } from "./src/services/ai.service.js";

testAi();
```

> ⚠️ Remove the `testAi()` call from `server.js` once you've confirmed it works. It's only for testing.

---

## 8. Message Flow with AI

Once a user sends a chat message, here is the complete request-to-response flow:

```
1. User sends message
        ↓
2. Server receives the request
        ↓
3. Server saves user's message to DB  (role: "user")
        ↓
4. Server calls AI service (LangChain → Gemini)
        ↓
5. AI generates a response
        ↓
6. Server saves AI's response to DB  (role: "ai")
        ↓
7. Server sends the AI response back to the user
```

### Why we store both user and AI messages

| Reason | Explanation |
|---|---|
| **Chat history** | Show the full conversation when the user reopens a chat |
| **AI context** | Send past messages to AI so it remembers what was discussed |

This is why `message.model.js` has a `role` field with enum `['user', 'ai']`.

---

## 9. Bugs Found & Fixed

### Bug #1 — `user` accessed out of scope in `verifyEmail` catch block

```js
// ❌ WRONG (original):
try {
    const user = await userModel.findOne(...); // 'user' is scoped to try block
    user.verified = true;
    await user.save();
} catch (err) {
    if (!user) { // ReferenceError: user is not defined!
        return res.status(400).json({ ... });
    }
}

// ✅ CORRECT (fixed):
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {  // ← check for user INSIDE try, right after findOne
        return res.status(400).json({ message: "User not found", success: false });
    }

    user.verified = true;
    await user.save();
    return res.send(html);

} catch (err) {
    return res.status(400).json({ message: "Invalid or expired token", err: err.message });
}
```

---

### Bug #2 — Missing `await` on `comparePassword`

```js
// ❌ WRONG (original):
const isPasswordMatch = user.comparePassword(password);
// isPasswordMatch is a Promise object → always truthy → any password works!

// ✅ CORRECT (fixed):
const isPasswordMatch = await user.comparePassword(password);
```

---

### Bug #3 — `res.text` vs `res.content` in LangChain

```js
// ❌ WRONG (original):
model.invoke("...").then((res) => {
    console.log(res.text);  // undefined — .text doesn't exist on AIMessage
})

// ✅ CORRECT (fixed):
const res = await model.invoke("...");
console.log(res.content);  // ← correct property on LangChain's AIMessage
```

---

### Bug #4 — pre-save hook missing `next` (carried from Day 120)

```js
// ❌ WRONG (original, repeated in Day 121 notes):
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // doesn't call next → Mongoose hangs
    this.password = await bcrypt.hash(this.password, 10);
    // next() never called → request hangs after password change
});

// ✅ CORRECT (fixed):
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```

---

## 10. Key Concepts

### Two separate JWTs
| Token | Purpose | Payload | Expiry |
|---|---|---|---|
| `emailVerificationToken` | Verify email on registration | `{ email }` | Should be `1d` |
| Login `token` | Authenticate API requests | `{ id, email, username }` | `7d` |

### `httpOnly` cookie
Setting `httpOnly: true` on the cookie prevents JavaScript (including malicious scripts via XSS) from reading the token. Always use it for auth cookies.

### Middleware as a gatekeeper
`authUser` middleware sits between the route and the controller. If the token is missing or invalid, the request stops there — the controller never runs.

```
Request → authUser (checks token) → getMe (runs only if token valid)
```

### `.select("-password")`
Mongoose's `.select()` lets you include or exclude fields. Prefixing with `-` excludes that field. Always exclude `password` when returning user data to the client.

### LangChain
LangChain is a framework that lets you use multiple AI providers (Gemini, OpenAI, Mistral, etc.) with a **unified API**. Switching models later is easy — you change the model class, not your entire codebase.

---

*Day 121 Complete ✓*
