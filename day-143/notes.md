what is CORS error?
-> cross origin resource sharing
-> it is an error that is thrown when a request is made to a server from a different origin (domain) than the one that the server is listening on.
-> it is a security feature that is used to prevent cross-site scripting attacks and other security vulnerabilities.
-> this error is raised by the browser when a request is made to a server from a different origin than the one that the server is listening on.


// today we'll see proxy

so , we go to backend/app.js and we'll remove the cors middleware (I"m just commenting it out)::

------------------
backend/src/app.js
------------------

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";



const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));


app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

export default app;


//==================================================
now, we'll go to vite.config.js and make below changes




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


//==================================================

=> also do make changes in auth.api.js

--------------------------------------------------
frontend/src/app/features/auth/service/auth.api.js
--------------------------------------------------

import axios from 'axios';

const authApiInstance = axios.create({
  baseURL: '/api/auth', // we have made changes here, from http://localhost:3000/api/auth to /api/auth
  withCredentials: true,
});

export async function register({ email, contact, password, fullname, isSeller }) {
  const response = await authApiInstance.post('/register', {
    email,
    contact,
    password,
    fullname,
    isSeller
  });

  return response.data;
}

export async function login({ email, password }) {
    const response = await authApiInstance.post('/login', {
        email,
        password
    });

    return response.data;
}
//==================================================

here, what is happening is that :::

1. Inside VITE.config.js , we have setup a proxy


 server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

2. Inside auth.api.js , we have made changes in baseURL, from http://localhost:3000/api/auth to /api/auth

since /api/auth runs on frontend, the API will look like http://localhost:5173/api/auth/login` ,

Since the baseURL is /api/auth and no host is specified, the browser assumes the current origin (http://localhost:5173). Therefore the request initially becomes http://localhost:5173/api/auth/login, which is then intercepted and forwarded by Vite Proxy to http://localhost:3000/api/auth/login.

For example:

authApiInstance.post('/login')

becomes

http://localhost:5173/api/auth/login

at first.

3. Vite intercepts the request

The browser sends the request to:

http://localhost:5173/api/auth/login

Vite sees that the URL starts with /api, matches the proxy rule, and internally forwards the request to:

http://localhost:3000/api/auth/login


4. Why does the CORS error disappear?

From the browser's perspective, the request was made to:

http://localhost:5173/api/auth/login

which is the same origin as the frontend.

The browser never directly communicates with http://localhost:3000.

Instead:

Browser
   ↓
Vite Server (5173)
   ↓
Backend Server (3000)

Since the browser only talks to the Vite server, no cross-origin request occurs, and therefore no CORS check is triggered.

//==================================================

so, now we will setup Google OAuth 2.0
-> for that we need

1. Google OAuth 2.0 Client ID
2. Google OAuth 2.0 Client Secret

-> we can get it from Google Cloud Console
-> we'll get the link , just go to console, create a new project, name it Snitch.
-> after the project is created , a notification pops up, select the project.
-> now , go to API & Services > OAuth Consent Screen
-> name the application as Snitch. provide support email. select external then contact info and finally click on create.
-> now, we need to go to API & Services > Credentials
-> click on Create credentials > OAuth client ID > Web application. for Authorized redirect URIs, enter http://localhost:5173/api/auth/google/callback
-> now create it , we'll get the client id and client secret.

after we get it, we need to save it in .env file

GOOGLE_CLIENT_ID=**************************

GOOGLE_CLIENT_SECRET=**************************

-> now, in the backend, let's make changes in the config.js file

----------------------------
backend/src/config/config.js
----------------------------


import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

if(!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

if(!process.env.GOOGLE_CLIENT_ID){
  throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables.")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
  throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables.")
}


export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};

//==================================================
now we need to install as below::
npm install passport passport-google-oauth20

-> let's make changes in the backend>app.js file

------------------
backend/src/app.js
------------------
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
// import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

export default app;


//==================================================

now, let's make changes in the backend>routes>auth.routes.js file

---------------------------------
backend/src/routes/auth.routes.js
---------------------------------

import { Router } from 'express';
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js';
import { register, login, googleCallback } from '../controllers/auth.controller.js';
import { config } from '../config/config.js';
import passport from 'passport';


const router = Router();

router.post('/register', validateRegisterUser, register);
router.post("/login",validateLoginUser, login)

// /api/auth/google
router.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] }))

router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
    }),
    googleCallback,
)


export default router;


//==================================================

for the above changes, we need to make changes in controllers>auth.controller.js file, we will create a new controller called googleCallback.

---------------------------------
backend/src/controllers/auth.controller.js
---------------------------------
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token);

  res.status(200).json({
    message,
    token,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  // this is the data that will be sent to the database, this data is coming from the client
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    // Checking for an existing user
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? 'seller' : 'buyer',
    });
    //  A new user is saved in MongoDB.
    // Because my model has a pre("save") middleware, the password is hashed before being stored.
    //The role is not supplied, so the schema’s default "buyer" role is used.

    await sendTokenResponse(user, res, 'User registered successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    await sendTokenResponse(user, res, 'User logged in successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
};

export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails[0].value;
  const profilePic = photos[0].value;

  let user = await userModel.findOne({
    email,
  });

  if (!user) {
    user = await userModel.create({
      email,
      googleId: id,
      fullname: displayName,
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  res.cookie('token', token);

  res.redirect('http://localhost:5173/');
};

-> i'll explain whats happening here,
// i've created two API's in the backend, /google & /google/callback . in frontend, over the register page i've created a "register with google" button. 
// if anyone clicks on the button , it gets redirected to /api/auth/google.
// backend will redirect to the google login page 
// select the account you want to register
// then google will ask for permission to allow Snitch to access your info
// if we click "continue" , we will be redirected to http://localhost:5173/
//==================================================

I've made small changes in the frontend where i've added the register with google button in register.jsx


//==================================================
//==================================================
//==================================================
//==================================================
//==================================================
//==================================================
//==================================================
//==================================================
//==================================================
//==================================================
