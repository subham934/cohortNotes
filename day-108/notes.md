day-108

=> kal humne Login.jsx aur Register.jsx banaya hai, jisme humne Login form aur Register form banaya tha.

=> Login.jsx ka kaam hota hai UI dikhana, jisme user ka login form hota hai aur uske andar email aur password input hoti hai, jisme humne email aur password input banaya tha. But , humari jo Login.jsx file hai wo backend se communicate kar rahi hai, humne code aisa likha hai ki wo backend se communicate kare, aur API call kare, but aisa nahi hota, UI layer kabhi bhi directly backend se communicate nahi karega.

=> React ka ak architecture hai, explained by ankur bhaiya, 

# Frontend Architecture – 4-Layer Model (React)

This note describes a simple, scalable way to structure a React frontend into **4 strict layers**:

```
UI (Presentation)
  ↓
Hooks (Orchestration)
  ↓
State (Memory)
  ↓
API (Backend Communication)
```

Each layer has a **single responsibility**. When layers leak into each other, technical debt starts.

---

## Quick Overview (Read This First)

### What each layer is for (with example + real-life use case)

| Layer | What it does (brief) | Tiny example | Real-life use case |
|---|---|---|---|
| **UI** | Renders screens/components and collects user input. Calls hooks, shows loading/error. | `onSubmit={() => login(email, pass)}` | Login form page, profile screen, post list UI |
| **Hooks** | Coordinates flows: call API, update state, decide what UI needs (loading/error). | `await loginApi(); setUser(user)` | Login flow, create-post flow, follow/unfollow flow |
| **State** | Stores app/feature data + derived values. No HTTP, no navigation. | `isAuthenticated = !!user` | Keep logged-in user in memory, cache feed list |
| **API** | Talks to backend via HTTP. Normalizes responses/errors. No React. | `axios.post('/auth/login', body)` | Central place to change endpoints/headers/token handling |

### Folder convention (example)

```
features/
  auth/
    pages/            # UI
    components/       # UI
    hooks/            # Orchestration
    store/ or *.context.tsx   # State
    services/         # API
```

---

## 1) UI Layer (Presentation Layer)

**Location**

```
features/*/pages/
features/*/components/
```

**Responsibility**

- Render UI
- Handle form input
- Trigger actions (`onClick`, `onSubmit`)
- Display loading and error states
- Navigate between routes

**UI must NOT**

- Call API directly
- Access cookies/localStorage
- Parse tokens
- Manage global state directly
- Contain business rules
- Know backend response structure

UI should be **dumb and declarative**.

**Example**

```jsx
const LoginPage = () => {
  const { login } = useAuth();

  const handleSubmit = async () => {
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      ...
    </form>
  );
};
```

**Real-life use case**

- A login page that only collects email/password, calls `useAuth().login`, and shows “Logging in…” / error text.

**Why keep UI dumb?**

- Refactoring becomes safer
- Testing becomes easier
- Less duplication
- Business rules don’t leak into every component

---

## 2) Hooks Layer (Orchestration Layer)

**Location**

```
features/*/hooks/
```

Example:

```
useAuth.js
usePosts.js
```

### What does "orchestration" actually mean?

Think of the hook as a **manager at a restaurant**.

- The UI is the **waiter** (takes order from customer, shows the food).

- The API layer is the **kitchen** (makes the food).

- The State layer is the **order board** (tracks what's ready, what's cooking).

- The Hook is the **manager** — when the waiter says "new order", the manager tells the kitchen to cook, updates the order board, and tells the waiter when it's done.

The manager doesn't cook. The manager doesn't serve. The manager **coordinates**.

### Responsibility

- Receive intent from UI ("user wants to log in")
- Call the right API function
- Take the API response and update State
- Handle loading/error transitions
- Return a **simple interface** to UI (`{ handleLogin, loading, error }`)

### What the hook actually does step-by-step (login example)

```
1. UI calls handleLogin(username, password)
2. Hook sets loading = true, error = null        ← updates State
3. Hook calls loginApi(username, password)        ← calls API
4. API returns response
5. Hook sets user = response.user                 ← updates State
6. Hook sets loading = false                      ← updates State
7. UI automatically re-renders (because State changed)
```

### Full Example (from our codebase)

```js
import { useCallback, useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register } from "../services/auth.api.js";

export function useAuth() {
    const { setUser, setLoading, setError, ...state } = useContext(AuthContext);

    const handleLogin = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(username, password);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setUser]);

    return { ...state, handleLogin };
}
```

Notice: the hook **does not store data itself**. It reads setters from State, calls API, and passes results into State.

### What UI sees vs what hook hides

| UI sees (simple) | Hook hides internally |
|---|---|
| `handleLogin(user, pass)` | Which API endpoint to call |
| `loading` (true/false) | When to flip loading on/off |
| `error` (object or null) | How to catch/normalize errors |
| `user` (object or null) | Where user data comes from |

UI doesn't know about `axios`, `loginApi`, `setUser`, or `setLoading`. It just calls one function and reads the result.

### Hooks must NOT

- Render UI or return JSX
- Directly manipulate DOM
- Contain infrastructure logic (like axios instance setup)
- Store data themselves — they write into **State**, not into local variables that persist

### Real-life use case

- `usePosts()` exposes `{ posts, isLoading, error, createPost, refresh }` — internally it calls `fetchPostsApi()`, updates `PostsContext`, and manages loading transitions. UI just renders `posts.map(...)` and shows a spinner when `isLoading` is true.

### Why this layer is critical

Without hooks as a middle layer:

```
UI → API directly  (Login.jsx imports axios and calls /auth/login)
```

This means:
- Every page duplicates loading/error handling
- Every page knows the backend URL structure
- Changing one API endpoint means editing 5 different components

With hooks:

```
UI → Hook → API    (Login.jsx calls handleLogin(), hook handles the rest)
```

- Logic lives in one place
- UI stays simple
- Changing the API only affects the hook

---

## 3) State Layer (Global or Feature State)

**Location**

```
features/*/*.context.jsx
```

OR

```
features/*/store/
```

### What is the State layer?

Think of it as a **shared whiteboard** mounted on the wall.

- Anyone (any component) can **look at** the whiteboard to see current data.
- Only authorized people (hooks) are allowed to **write on** it.
- The whiteboard itself doesn't decide what to write — it just holds the data and shouts "Hey, I changed!" so everyone looking at it can update.

State is **passive**. It stores values. It doesn't fetch, navigate, or decide.

### Responsibility

- Hold shared data (`user`, `posts`, etc.)
- Provide derived/computed values (`isAuthenticated = !!user`)
- Expose setter functions (`setUser`, `setLoading`, `setError`)
- Trigger re-renders when data changes

That's it. **Nothing else.**

### Full Example (from our codebase)

```jsx
import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,   // ← derived value
            loading,
            error,
            setUser,                    // ← setter for hooks to call
            setLoading,
            setError,
        }),
        [user, loading, error]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
```

Notice what's **not** here: no `axios`, no `async/await`, no `try/catch`, no API imports. Pure storage.

### "But why does `loading` live in State if the Hook controls it?"

This is the most common confusion. Here's why:

- `loading` needs to be **shared** — multiple components (Login page, a navbar spinner, a disabled button) might need to know if auth is in progress.
- The **Hook decides when** to set loading true/false (that's orchestration).
- The **State holds the value** so any component anywhere in the tree can read it.

Analogy: The manager (hook) writes "COOKING" on the whiteboard (state). Both the waiter and the cashier can see it — they don't need to ask the manager directly.

### State vs Hooks — side-by-side

| | State Layer | Hooks Layer |
|---|---|---|
| **Purpose** | Hold data + expose setters | Coordinate actions + call setters |
| **Contains** | `useState`, `useMemo`, derived values | `async` functions, API calls, `try/catch` |
| **Knows about** | Nothing outside itself | State (to write) + API (to fetch) |
| **Analogy** | Whiteboard / Database | Manager / Controller |
| **Async logic?** | No | Yes |
| **Imports API?** | Never | Yes |
| **Example** | `const [user, setUser] = useState(null)` | `const res = await loginApi(); setUser(res.user)` |

### State layer must NOT

- Call API directly (no `axios`, no `fetch`)
- Navigate routes
- Render UI (it provides a `<Provider>`, but that just wraps children)
- Show alerts/toasts
- Handle cookies/localStorage directly
- Contain `async` functions or `try/catch` blocks

### Real-life use case

- `AuthContext` stores `{ user, loading, error }` and derived `isAuthenticated`, so:
  - The **Login page** can show a spinner when `loading` is true
  - The **Navbar** can show the username from `user`
  - A **ProtectedRoute** component can redirect when `isAuthenticated` is false
  - All of them read from the same shared state, without knowing how the data got there

### Why separate state from hooks?

**Hooks orchestrate. State stores.**

If you put API calls inside the context (state layer), you get:
- State that "does things" — hard to predict, hard to test
- Multiple async flows competing inside one provider
- No clear place to add a second consumer (e.g., a `useAuthStatus` hook that only reads, never writes)

If you keep state passive:
- You can write **multiple hooks** that read/write the same state differently
- State is predictable — you can look at the context and instantly know the shape of your data
- Testing is trivial — just check that the right values are in state

---

## 4) API Layer (Backend Communication Layer)

**Location**

```
features/*/services/
```

Example:

```
auth.api.ts
posts.api.ts
```

**Responsibility**

- Communicate with backend
- Send HTTP requests
- Normalize responses
- Normalize errors

This layer isolates the app from backend changes.

**Example**

```ts
export const loginApi = async (email, password) => {
  const response = await axios.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};
```
---

**API layer must NOT**

- Update React state
- Navigate
- Show UI errors
- Access React hooks
- Render anything

API layer should be **pure infrastructure**.

**Why this layer matters**

If UI talks directly to axios:

- Every component knows backend structure
- Backend changes break many files
- Error handling becomes duplicated

With an API layer:

- Only one file changes if the backend changes

---

## Full Request Flow Example

Login Flow:

```
User clicks Login button
    ↓
UI Layer calls login() from useAuth
    ↓
Hook Layer calls loginApi()
    ↓
API Layer sends request to backend
    ↓
Response returned to Hook
    ↓
Hook updates State Layer
    ↓
UI re-renders automatically
```

Each layer performs exactly one responsibility.

---

## Strict Layer Rules

### UI can talk to:

* Hooks

### Hooks can talk to:

* State
* API

### State can talk to:

* Nothing (pure storage)

### API can talk to:

* Backend only

No skipping layers.

---

## Common Architecture Mistakes

- UI calling API directly
- API updating React state
- State handling navigation
- Hooks manipulating cookies directly
- Business rules inside components

Every violation increases coupling.

---

## Conclusion

Your 4-layer frontend architecture consists of:

1. **UI Layer** – renders and interacts
2. **Hooks Layer** – orchestrates logic
3. **State Layer** – stores data
4. **API Layer** – communicates with backend

When each layer respects its boundary,
your React app remains scalable and maintainable.



https://github.com/ankurdotio/cohort-2.0/blob/main/notes/react-architecture.md




UI layer hamara already setup hai
hum abhi banayenge API layer, jisme humne backend se communicate karenge

=> we will create a folder called "services" inside src > features > auth

=> inside src > features > auth > services , we will create auth.api.js

=> content inside auth.api.js is as follows:


------------------------------------
day-108 > Frontend > src > features > auth > services > auth.api.js
------------------------------------

import axios from "axios";

export async function register(username, email, password) {
    try{
        const response = await axios.post("http://localhost:3000/api/auth/register", {
            username,
            email,
            password
        },{
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function login(username, password) {
    try{
        const response = await axios.post("http://localhost:3000/api/auth/login", {
            username,
            password
        },{
            withCredentials: true
        });
        return response.data;

    } catch (err) {
        throw err;
    }    
}



===============================================
=> in the above code , we are repeating codes, to solve the issue, we do following:


------------------------------------
day-108 > Frontend > src > features > auth > services > auth.api.js
------------------------------------


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(username, password) {
  try {
    const response = await axios.post("/login", {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}


===============================================



=> now,we will create one more API inside auth.router.js

------------------------------------
day-108 > Backend > src > routes > auth.router.js
------------------------------------

const express = require("express");
const  authController = require("../controllers/auth.controller")
const identifyUser = require("../middlewares/auth.middleware");

const authRouter = express.Router();


// POST  api/auth/register

authRouter.post("/register", authController.registerController);

/**
 * POST  api/auth/login
 */
authRouter.post("/login", authController.loginController);

/**
 * @route GET /api/auth/get-me
 * @description get currently logged in user's information
 * @access Private
 */

authRouter.get("/get-me",identifyUser, authController.getMeController);


module.exports = authRouter;


===============================================
=> for the above API , we need a controller, so we created a getMeController

------------------------------------
day-108 > Backend > src > controllers > auth.controller.js
------------------------------------

const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        "User already Exists " +
        (isUserAlreadyExists.email == email
          ? "Email already exists"
          : "Username already exists"),
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash,
  });

  const token = jwt.sign(
    {
      /*
        - user ka data hona chahiye,
        - data unique hona chahiye
      */

      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User Registered Successfully",
    user: {
      name: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
    token,
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;

  /*
      user can either login with either: {username, password} OR {email, password }
    */

  const user = await userModel.findOne({
    $or: [
      {
        // condition - 1
        username: username,
      },
      {
        // condition - 2
        email: email,
      },
    ],
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User LoggedIn Successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function getMeController(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  res.status(200).json({
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
  registerController,
  loginController,
  getMeController
};



===============================================
=> after setting up auth.routes.js and auth.controller.js in backend , we will create a getMe() function inside auth.api.js, which is in frontend
===============================================


------------------------------------
day-108 > Frontend > src > features > auth > services > auth.api.js (API Layer)
------------------------------------

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});
export async function register(username, email, password) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(username, password) {
  try {
    const response = await axios.post("/login", {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getMe(){
    try{
        const response = await api.get("/get-me");
        return response.data;
    }
    catch(err){
        throw err;
    }
}

================================================
=> Till now, UI layer and API layer is created, we need to create State layer and Hooks layer

=> lets begin with State layer, state layer is directly created in a file, we dont need to create a folder.
================================================



------------------------------------------------
day-108 > Frontend > src > features > auth > auth.context.jsx (State Layer)
------------------------------------------------

import { createContext, useState } from "react";
import { login, register, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async function (username, password) {
    setLoading(true);
    try {
      const response = await login(username, password);
      setUser(response.user);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async function (username, email, password) {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
}


=> Now we will wrap the above AuthProvider component in our App.js file




------------------------------------
day-108 > Frontend > src > App.js
------------------------------------




import AppRoutes from "./AppRoutes";
import "./style.scss";
import { AuthProvider } from "./features/auth/auth.context.jsx";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;



=> Till now oour UI layer, State layer and API layer is done
=================================================

------------------------------------
day-108 > Frontend > src > features > auth > hooks > useAuth.js (Hooks Layer)
------------------------------------

import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}

------------------------------------
day-108 > Frontend > src > features > auth > pages > Login.jsx (UI Layer)
------------------------------------


import React, { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();

    handleLogin(username, password)
      .then((res) => {
        console.log(res);
        setUsername("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
        setUsername("");
        setPassword("");
      });
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="Enter username"
          />
          <input
            value={password}
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;



------------------------------------
day-108 > Frontend > src > features > auth > pages > Register.jsx
------------------------------------


import { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {handleRegister} = useAuth();
  
  async function handleSubmit(e) {
    e.preventDefault();

    handleRegister(username, email, password)
      .then((res) => {
        console.log(res);
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
        setUsername("");
        setEmail("");
        setPassword("");
      });
  }

  return (
    <>
      <main>
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <input
              value={username}
              onInput={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              name="username"
              placeholder="Enter Username"
            />
            <input
              value={email}
              onInput={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              name="email"
              placeholder="Enter Email"
            />
            <input
              value={password}
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="password"
              placeholder="Enter Password"
            />

            <button type="submit">Register</button>
          </form>
          <p>
            Already have an account?{" "}
            <Link className="toggleAuthForm" to="/login">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;




if we wnat to show that the user is loading, loading is managed in auth.context.jsx(State Layer), but with the help of custom hooks we can manage it inside Login.jsx(UI Layer). we want that when we the user log in, we want it to navigate to "/" page 

------------------------------------
day-108 > Frontend > src > features > auth > pages > Login.jsx (UI Layer)
------------------------------------
import React, { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleLogin(username, password)
      .then((res) => {
        console.log(res);
        navigate("/");
        setUsername("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
        setUsername("");
        setPassword("");
      });
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="Enter username"
          />
          <input
            value={password}
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
