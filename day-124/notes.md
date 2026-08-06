this is the copy of project121, where we have removed the testAi function from ai.service.js. we have created a folder called backend and moved all the backend files to it and now lets create another folder called Frontend.

lets install tailwind , react-router

in the backend we have authentication related api, so we create it in the frontend aswell. we will use redux

=> Let's create a 4 layer architecture in frontend.

1. the UI Layer

lets create the Login.jsx

---

## src/features/auth/pages/Login.jsx

import React, { useState } from 'react';
import { Link } from 'react-router';

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
// const [submittedData, setSubmittedData] = useState(null);

const handleSubmit = (e) => {
e.preventDefault();
const payload = {
email,
password,
};

    console.log('Login payload', payload);

};

return (
<div className="relative min-h-screen flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden font-sans selection:bg-[#31b8c6] selection:text-stone-950">
{/_ Background Glows _/}
<div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#31b8c6]/15 rounded-full blur-[120px] pointer-events-none"></div>
<div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-[#31b8c6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-stone-900/40 border border-stone-850 backdrop-blur-xl shadow-2xl shadow-[#31b8c6]/5 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#31b8c6]">
            Welcome Back
          </h2>
          <p className="text-stone-400 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Live Binding State Visualizer */}
        {(email || password) && (
          <div className="mt-6 p-3 bg-stone-950/80 border border-stone-850 rounded-lg text-xs font-mono text-stone-400 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#31b8c6] tracking-wider mb-1">Live State Binding:</div>
            <div>email: <span className="text-stone-200">{email || '""'}</span></div>
            <div>password: <span className="text-stone-200">{"*".repeat(password.length) || '""'}</span></div>
          </div>
        )}



        <div className="mt-8 text-center text-sm">
          <p className="text-stone-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>

);
};

export default Login;

//==========================================

now lets create the register.jsx

---

## src/features/auth/pages/Register.jsx

import React, { useState } from 'react';
import { Link } from 'react-router';

const Register = () => {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
// const [submittedData, setSubmittedData] = useState(null);

const handleSubmit = (e) => {
e.preventDefault();
const payload = {
username,
email,
password,
};

    console.log('Register payload', payload);

};

return (
<div className="relative min-h-screen flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden font-sans selection:bg-[#31b8c6] selection:text-stone-950">
{/_ Background Glows _/}
<div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#31b8c6]/15 rounded-full blur-[120px] pointer-events-none"></div>
<div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-[#31b8c6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-stone-900/40 border border-stone-850 backdrop-blur-xl shadow-2xl shadow-[#31b8c6]/5 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#31b8c6]">
            Create Account
          </h2>
          <p className="text-stone-400 mt-2 text-sm">
            Sign up to start sharing notes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
          >
            Create Account
          </button>
        </form>

        {/* Live Binding State Visualizer */}
        {(username || email || password) && (
          <div className="mt-6 p-3 bg-stone-950/80 border border-stone-850 rounded-lg text-xs font-mono text-stone-400 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#31b8c6] tracking-wider mb-1">Live State Binding:</div>
            <div>username: <span className="text-stone-200">{username || '""'}</span></div>
            <div>email: <span className="text-stone-200">{email || '""'}</span></div>
            <div>password: <span className="text-stone-200">{"*".repeat(password.length) || '""'}</span></div>
          </div>
        )}



        <div className="mt-8 text-center text-sm">
          <p className="text-stone-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>

);
};

export default Register;

//==========================================

=> now that both the Login.jsx and Register.jsx is done we will integrate using router

---

## src/app/app.routes.jsx

import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

export const router = createBrowserRouter([
{
path: "/",
element: <Navigate to="/login" replace />,
},
{
path: "/login",
element: <Login />,
},
{
path: "/register",
element: <Register />,
},
]);

//==========================================

=> now , in the App.jsx , we will use RouterProvider to render the routes

---

## src/app/App.jsx

import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";

const App = () => {
return <RouterProvider router={router} />;
};

//
export default App;

//==========================================

now that the UI layer is done , we will create API layer
=> for that we need axios

---

## src/features/auth/service/auth.api.js

import axios from "axios";

const api = axios.create({
baseURL : "http://localhost:3000",
withCredentials:true
})

//register API
export async function register({email, password, username}) {
const response = await api.post('/api/auth/register' , {email, password, username})
return response.data
}

//login API
export async function login({email, password}) {
const response = await api.post('/api/auth/login' , {email, password})
return response.data
}

export async function getMe(){
const response = await api.get("/api/auth/get-me")
return response.data
}
//=======================================

=> we have completed 2 layer, now we will create state layer, for that we will use redux.

npm i @reduxjs/toolkit react-redux

=> after installing , we need to set it up,

---

## src/app/app.store.js

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
reducer:{

    }

})

here , store is the central point where we can access the state , for that we need to wrap around main.jsx

---

## src/main.jsx

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

// now we will create slice related to the auth, this slice manages the authentication

//------------------------------------------
// src/features/auth/auth.slice.js
//------------------------------------------
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
name: "auth",
initialState: {
user: null,  
 loading:false,
error:null  
 },
reducers:{
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
})

export const { setUser, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;

//=======================================

=> now , we need to connect slice into store

---

## src/app/app.store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";

export const store = configureStore({
reducer: {
auth: authReducer,
}
})

//=============================
now, we will create the hook layer

---

## src/features/auth/hook/useAuth.js

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
dispatch(
setError(error.response?.data?.message || "Registration failed"),
);
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
dispatch(
setError(err.response?.data?.message || "Failed to fetch user data"),
);
} finally {
dispatch(setLoading(false));
}
}

return {
handleRegister,
handleLogin,
handleGetMe,
};
}

=> now , our 4 layer architechture is done, we ahve created the UI layer, the service layer, the state layer and the Hook layer. now we will make some changes in Login.jsx

//========================================
import useNavigate and useAuth
* import { Link, useNavigate } from 'react-router';
* import { useAuth } from '../hook/useAuth';

 
------------------------------------------
Frontend/src/features/auth/pages/Login.jsx
------------------------------------------

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };

    await handleLogin(payload);
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden font-sans selection:bg-[#31b8c6] selection:text-stone-950">
      {/* Background Glows */}
      <div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#31b8c6]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-[#31b8c6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-stone-900/40 border border-stone-850 backdrop-blur-xl shadow-2xl shadow-[#31b8c6]/5 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#31b8c6]">
            Welcome Back
          </h2>
          <p className="text-stone-400 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Live Binding State Visualizer */}
        {(email || password) && (
          <div className="mt-6 p-3 bg-stone-950/80 border border-stone-850 rounded-lg text-xs font-mono text-stone-400 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#31b8c6] tracking-wider mb-1">
              Live State Binding:
            </div>
            <div>
              email: <span className="text-stone-200">{email || '""'}</span>
            </div>
            <div>
              password:{' '}
              <span className="text-stone-200">
                {'*'.repeat(password.length) || '""'}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm">
          <p className="text-stone-400">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

=> let's make change in app.routes.jsx

-------------------------------
Frontend/src/app/app.routes.jsx
-------------------------------

import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element:  <h1>Home Page</h1>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);


=> now when we login , we will redirect to "Home Page"

//===================================

in the backend we will install cors:
npm i cors
with the help of cors we will allow all the origins to access our backend

=> we will setup logger middleware in our backend

npm i morgan

morgan is a logger which will help to see the http request in the terminal
=> jo hamare server pe request aati hai, wo kis api pe request aai, wo api kis method ki thi, or kya response aaya, kya error aaya sab kuch dikhaega "console pe" with the help of morgan

now , lets make changes in Backend/src/app.js

--------------------
Backend/src/app.js
--------------------


import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import morgan from 'morgan';
import cors from 'cors';
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

export default app;

//=======================================

=> now lets create a new route for after we login

-------------------------------
Frontend/src/app/app.routes.jsx
-------------------------------

import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element:  <Dashboard/>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);


----------------------------------------------
Frontend/src/features/chat/pages/Dashboard.jsx
----------------------------------------------

import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';



const Dashboard = () => {

    const {user} = useSelector((state) => state.auth)

    console.log(user) // after reload this shows null, which is a problem. 
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard





// abhi hum login pe jake agar login karte hai toh we are inside Dashboard.jsx page. But there is a problem, once I reload the page, the user details are gone, this is because everytime i reload the page, the state is reinitialised, so to resolve this problem we do the following steps::

jaise hi hamara page reload hoga, tab humko turant user ka value set karna padega, to set user value for that we write as below::

------------------------
Frontend/src/app/App.jsx
------------------------

import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();
  
  useEffect(() => {
    handleGetMe();
  }, []);
  return <RouterProvider router={router} />;
};

//
export default App; 

jab hamara application pehli bar load hogi, toh woh handlegetme() ko call karegi , handlegetme() getMe() api ko call karegi , getMe() api server pe user ka details laegi, or us details ko state me set karegi , now hum jinti bar reload unti bar humko hamara user details dikhega, this process is called "hydration".

=> jab hum hydartion perform kar rahe hai, toh hamari loading true hogi, so lets change the logic of loading in auth.slice.js

-----------------------------------------
Frontend/src/features/auth/auth.slice.js
-----------------------------------------

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true, // Set initial state of loading to true
    error: null,
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
    },
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;


=> now we will create a Protected.jsx component, why, because agar hamara user login nahi hai, toh woh Dashboard.jsx pe redirect nahi hona chahiye, or agar user login hai, toh woh Dashboard.jsx pe redirect hona chahiye, iske liye hum Protected.jsx component ko use karege.


---------------------------------------------------
Frontend/src/features/auth/components/Protected.jsx
---------------------------------------------------
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

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

//=============================================

now we will wrap the Dashboard.jsx component with Protected.jsx component in app.routes.jsx

--------------------------------------
Frontend/src/app/app.routes.jsx
--------------------------------------

import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element:  <Protected><Dashboard/></Protected>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

//=============================================

and because we used logger(morgan) , over the console we could see somthing like::

GET /api/auth/get-me 304 71.193 ms - -
GET /api/auth/get-me 304 55.395 ms - -
GET /api/auth/get-me 304 55.005 ms - -
GET /api/auth/get-me 304 103.131 ms - -
GET /api/auth/get-me 304 59.402 ms - -
GET /api/auth/get-me 304 58.405 ms - -
GET /api/auth/get-me 304 70.259 ms - -
GET /api/auth/get-me 304 57.669 ms - -
GET /api/auth/get-me 304 146.235 ms - -
GET /api/auth/get-me 401 0.311 ms - 68
OPTIONS /api/auth/login 204 0.241 ms - 0
POST /api/auth/login 200 168.959 ms - 146

//=============================================
=> aab ak aur feature add karenge, ki agar hum loggedIn hai, toh user login page pe ja nahi sakta

=> lets make changes in Login.jsx


------------------------------------------
Frontend/src/features/auth/pages/Login.jsx
------------------------------------------

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const {user} = useSelector((state) => state.auth)
  const {loading} = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };

    await handleLogin(payload);
    navigate('/');
  };

  if(!loading && user){
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden font-sans selection:bg-[#31b8c6] selection:text-stone-950">
      {/* Background Glows */}
      <div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#31b8c6]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-[#31b8c6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-stone-900/40 border border-stone-850 backdrop-blur-xl shadow-2xl shadow-[#31b8c6]/5 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#31b8c6]">
            Welcome Back
          </h2>
          <p className="text-stone-400 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Live Binding State Visualizer */}
        {(email || password) && (
          <div className="mt-6 p-3 bg-stone-950/80 border border-stone-850 rounded-lg text-xs font-mono text-stone-400 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#31b8c6] tracking-wider mb-1">
              Live State Binding:
            </div>
            <div>
              email: <span className="text-stone-200">{email || '""'}</span>
            </div>
            <div>
              password:{' '}
              <span className="text-stone-200">
                {'*'.repeat(password.length) || '""'}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm">
          <p className="text-stone-400">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

//===========================================
From here , its backend code
//===========================================
now , we need to implement the socket.io server

let install socket.io in backend
npm i socket.io



------------------------------------
Backend/src/sockets/server.socket.js
------------------------------------

import {Server} from "socket.io"


let io;
export function initSocket(httpServer){
    io = new Server(httpServer, {
        cors : {
            origin : "http://localhost:5173",
            credentials: true,
            
        }
    })
    // 
    export function getIO(){
    if(!io){
        throw new Error("Socket.io not initialized")
    }
    return io;
}
}


//===========================================
=> socket.io ka server , server.js main start hoga
at first we import a module 
```javascript
import http from 'http'


// iss module se hum ak server create karte hai as below: 
const httpServer = http.createServer(app);

// http server ko pass karna hota hai , jab socket server ko start karte hai as below::

initSocket(httpServer)


// then we start the http server as below:
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

the entire code is as below::

-----------------
Backend/server.js
-----------------

import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import http from 'http';
import { initSocket } from './src/sockets/server.socket.js';

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB().catch((err) => {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//===========================================

now, server side pe socket.io setup ho chuka hai, ab hume front-end pe socket.io ka code likhna hai.
client aur server dono ko ak socket connection se connect karna rahega:

to install socketio in client side , we need to install it first::
npm install socket.io-client

then we write the following code::

-------------------------------------------------
Frontend/src/features/chat/service/chat.socket.js
-------------------------------------------------

import { io } from 'socket.io-client';

export const initializeSocketConnection = () => {
  const socket = io('http://localhost:3000', {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });
};


// now , we have created a function named initializeSocketConnection() that will connect the client to the server and emit a connect event.
// to manage this function, we create a hook

//---------------------------------------------
Frontend/src/features/chat/hooks/useChat.js
//---------------------------------------------

import { initializeSocketConnection } from '../service/chat.socket';

export const useChat = () => {
  return {
    initializeSocketConnection,
  };
};


// now , we need to call this function somewhere in our application. 
----------------------------------------------
Frontend/src/features/chat/pages/Dashboard.jsx
----------------------------------------------

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {
  const chat = useChat();

  const { user } = useSelector((state) => state.auth);

  console.log(user);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);
  return <div>Dashboard</div>;
};

export default Dashboard;

========================================
only after we login , we can see that in console it says::
Connected to Socket.IO server

also in the backend terminal we can see::
A user connected :  p0j1g4LRyvCS0SsXAAAF

if we are in Login or Register page it wont show anything

========================================

==> now, let me explain in detail ki kya ho rha hai, client aur server dono ko socket.io se connect karna hai, backend ka server pe humne socketio setup kar diya tha::


export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

    console.log('socket.io server is RUNNING');

  io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);
  });
}

yeh function socketio ko server side pe setup karta hai, server.js file main iss fuction ko call karte hai


backend/server.js
initSocket(httpServer);

now , we need to connect frontend with server se with the help of socket.io

for that we need a package in frontend to setup socket.io, the package is 'socket.io-client'

after installing it write following code in Frontend/src/features/chat/service/chat.socket.js

inside this file , we have created a function , "initializeSocketConnection", jab hum iss fucntion ko call karenge toh socket.io, client aur server connect kar dega.

jab hamara client aur server connect hoga, Socket.IO ka built-in connect event fire hoga. Hum us event ko sun rahe hain (socket.on), aur jab woh fire ho, tab console mein 'Connected to Socket.IO server' print karte hain.

the entire code runs when we call initializeSocketConnection() in the useChat.js hooks.


import { initializeSocketConnection } from '../service/chat.socket';

export const useChat = () => {
  return {
    initializeSocketConnection,
  };
};

iss function ko finally call karte hai, Dashboard.jsx file k andar, useEffect hook k andar::


const Dashboard = () => {
  const chat = useChat();
  // ...
  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);
  return <div>Dashboard</div>;
};

only after calling it from here, the client and server is connected with the help of socket.io



========================================
# Socket.IO — Client aur Server Connection

---

## Backend Side — Socket.IO Server Setup

```js
// Backend/src/sockets/server.socket.js

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  console.log('socket.io server is RUNNING');

  io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);
  });
}
```

Ye function Socket.IO ko **server side** pe setup karta hai.

- `new Server(httpServer, {...})` — Socket.IO server banaya aur HTTP server se attach kiya
- `cors` — frontend (port 5173) se aane wali socket connections allow ki
- `io.on('connection', ...)` — ye ek **built-in event** hai. Jab bhi koi naya client connect hoga, ye automatically fire hoga
- `socket.id` — har connected client ka ek unique ID hota hai. Console mein ye ID print hogi

`server.js` mein is function ko call karte hain:

```js
// Backend/server.js
initSocket(httpServer);
```

**Outcome:** Jab bhi koi client connect hoga, backend terminal mein aisa dikhega:
```
socket.io server is RUNNING
A user connected : p0j1g4LRyvCS0SsXAAAF
```

---

## Frontend Side — Socket.IO Client Setup

Frontend mein Socket.IO use karne ke liye pehle package install karo:

```
npm install socket.io-client
```

Phir ye file banao:

```js
// Frontend/src/features/chat/service/chat.socket.js

import { io } from 'socket.io-client';

export const initializeSocketConnection = () => {
  const socket = io('http://localhost:3000', {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });
};
```

- `io('http://localhost:3000', {...})` — backend ke Socket.IO server se connect karo
- `withCredentials: true` — cookies saath mein bhejo taaki server pata kar sake kaun connect ho raha hai
- `socket.on('connect', ...)` — ye Socket.IO ka **built-in event** sun raha hai. Jab client aur server successfully connect ho jaate hain, ye event **automatically** fire hota hai
- `console.log('Connected to Socket.IO server')` — ye sirf ek **console message** hai jo tab print hota hai jab `connect` event fire ho. Koi cheez emit nahi ho rahi yahan

> **Important distinction:**
> - `socket.on(...)` — kisi event ko **sunna** hai (listening)
> - `socket.emit(...)` — koi event **bhejana** hai (emitting)
>
> Yahan hum sirf **sun rahe hain** ki connection hua ya nahi. Kuch bhej nahi rahe.

---

## Hook — `useChat.js`

```js
// Frontend/src/features/chat/hooks/useChat.js

import { initializeSocketConnection } from '../service/chat.socket';

export const useChat = () => {
  return {
    initializeSocketConnection,
  };
};
```

Simple wrapper hook hai ye. `initializeSocketConnection` function ko export kiya taaki components easily use kar sakein. Aage chat ke aur functions bhi yahaan aayenge.

---

## Finally — `Dashboard.jsx` mein call karna

```js
// Frontend/src/features/chat/pages/Dashboard.jsx

import React, { useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {
  const chat = useChat();

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
```

- `useChat()` — hook se `initializeSocketConnection` function lo
- `useEffect(() => {...}, [])` — `[]` empty array hai, matlab ye sirf **ek baar** chalega jab Dashboard pehli baar mount ho
- `chat.initializeSocketConnection()` — yahan call karne pe hi client aur server ka Socket.IO connection banta hai

**Ye function yahaan call karna kyun zaroori hai?** Kyunki `initializeSocketConnection` ke andar `io(...)` call hota hai jo actual connection establish karta hai. Jab tak ye function call nahi hoga, koi connection nahi banega.

---

## Complete Flow

```
Dashboard mount hota hai
        ↓
useEffect chalta hai → chat.initializeSocketConnection() call
        ↓
io('http://localhost:3000') → backend se connection request
        ↓
Backend: io.on('connection') fire hota hai
Backend terminal: "A user connected : p0j1g4LRyvCS0SsXAAAF"
        ↓
Client side: socket.on('connect') fire hota hai
Browser console: "Connected to Socket.IO server"
        ↓
Connection established ✓ — ab real-time communication ho sakti hai
```

**Note:** Ye connection sirf `Dashboard` pe jaane ke baad banta hai. Login ya Register page pe koi socket connection nahi hota.
========================================


let's make small changes in app.routes.jsx

-------------------------------
Frontend/src/app/app.routes.jsx
-------------------------------

import { createBrowserRouter, Navigate } from 'react-router';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/chat/pages/Dashboard';
import Protected from '../features/auth/components/Protected';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },{
    path: '/dashboard',
    element: <Navigate to="/" replace />
  }
]);



