# **Redux Toolkit – Complete Beginner Documentation**

## 1. Introduction

When React applications start growing, managing data becomes messy.

At first things look simple.

A component holds some state.

Then that state needs to be shared with another component.

So we pass it as props.

This is called **props drilling**.

Example flow:

`App → Parent → Child → GrandChild`

Even if only the **GrandChild** needs the data, we still pass it through every layer.

As applications grow, this becomes painful.

Problems start appearing:

- Too many props
  • Difficult debugging
  • State scattered everywhere
  • Hard to scale applications

To solve this, developers started using **centralized state management**.

This is where **Redux** came in.

---

# 2. History of Redux

Redux was created in **2015** by:

- **Dan Abramov**
  • **Andrew Clark**

Redux was inspired by the **Flux architecture** created at Facebook.

The main idea was simple:

Instead of storing state inside many components, keep **one central store** for the entire application.

So the architecture became:

`Components → Dispatch Action → Store → Update State → UI Updates`

Redux introduced three core principles:

### 1. Single Source of Truth

The entire application's state lives inside **one store**.

Example:

`store = {
  user: {},
  cart: [],
  theme: "dark"
}`

Everything is stored in one place.

---

### 2. State is Read Only

You cannot modify the state directly.

Instead you send **actions**.

Example:

`dispatch({
  type: "ADD_TODO",
  payload: "Learn Redux"
})`

---

### 3. Changes are made with Pure Functions

Redux uses **reducers** to update state.

Reducers are just functions.

Example:

`function reducer(state, action) {
  if(action.type === "ADD_TODO") {
    return {...state, todos: [...state.todos, action.payload]}
  }
}`

Reducers take:

`current state

- # action

  new state`

  ***

# 3. Problems with Classic Redux

Redux was powerful, but it had a **big problem**.

It required **too much boilerplate code**.

To create even a small feature you had to write:

1. Action Types
2. Action Creators
3. Reducers
4. Store configuration
5. Middleware setup

Example structure:

`actions.js
actionTypes.js
reducers.js
store.js
constants.js`

A small feature could require **100+ lines of code**.

Developers started complaining.

Redux became famous for being:

"Powerful but painful."

This is where **Redux Toolkit** enters the story.

---

# 4. What is Redux Toolkit

Redux Toolkit (RTK) is the **official recommended way to write Redux logic today**.

It was introduced by the Redux team in **2019**.

Redux Toolkit simplifies Redux development and removes most of the boilerplate code.

The goal of Redux Toolkit is simple:

**Make Redux easier, safer, and faster to write.**

Instead of writing many files manually, Redux Toolkit gives **utility functions** that automatically generate the required logic.

---

# 5. Why Redux Toolkit was Created

Redux Toolkit was created to solve these problems:

### Problem 1

Too much boilerplate.

Solution:

RTK automatically generates **actions and reducers**.

---

### Problem 2

Complex store configuration.

Solution:

RTK provides **configureStore()**.

---

### Problem 3

Accidental state mutations.

Solution:

RTK uses **Immer.js** internally to allow safe state mutation syntax.

---

### Problem 4

Async logic was confusing.

Solution:

RTK provides **createAsyncThunk()**.

---

### Problem 5

Too many libraries required.

Solution:

RTK bundles the most important Redux tools together.

---

# 6. Core Idea of Redux Toolkit

Redux Toolkit follows the same Redux architecture.

`Component
   ↓
Dispatch Action
   ↓
Reducer updates state
   ↓
Store updates
   ↓
UI re-renders`

But the difference is:

**Redux Toolkit reduces the amount of code needed to implement this architecture.**

---

# 7. Installation

Install Redux Toolkit and React Redux.

`npm install @reduxjs/toolkit react-redux`

Redux Toolkit already includes Redux internally.

So you **do not need to install redux separately.**

---

# 8. Important Concepts in Redux Toolkit

There are a few important building blocks.

### 1. Store

The central place where all application state lives.

### 2. Slice

A slice represents a **portion of the state**.

Example:

`userSlice
cartSlice
themeSlice`

Each slice contains:

- state
  • reducers
  • actions

---

### 3. Reducer

A function that updates the state.

---

### 4. Action

An object describing what happened.

Example:

`{
 type: "cart/addItem",
 payload: item
}`

---

### 5. Dispatch

A function used to send actions to the store.

---

### 6. Selector

A function used to read data from the store.

---

# 9. configureStore()

In classic Redux, creating a store required multiple steps.

Redux Toolkit simplifies it using **configureStore()**.

Purpose:

- Create store
  • Combine reducers
  • Enable Redux DevTools
  • Add middleware automatically

Example:

`import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./counterSlice"

export const store = configureStore({
reducer: {
counter: counterReducer
}
})`

Now the store is ready.

---

# 10. createSlice()

This is the **most important feature of Redux Toolkit**.

A slice combines:

- state
  • reducers
  • actions

into a single place.

Example:

`import { createSlice } from "@reduxjs/toolkit"

const counterSlice = createSlice({
name: "counter",

initialState: {
value: 0
},

reducers: {
increment: (state) => {
state.value += 1
},

    decrement: (state) => {
      state.value -= 1
    }

}
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer`

What Redux Toolkit automatically generates:

- Action Types
  • Action Creators
  • Reducers

All automatically.

---

# 11. How State Mutation Works (Immer)

In classic Redux, state must **never be mutated**.

Example:

❌ Wrong

`state.count += 1`

✅ Correct

`return {
  ...state,
  count: state.count + 1
}`

But Redux Toolkit allows mutation-like syntax.

Example:

`state.count += 1`

This works because Redux Toolkit internally uses **Immer.js**.

Immer converts mutation syntax into immutable updates behind the scenes.

So the state is still safe.

---

# 12. Connecting Redux Toolkit with React

Redux works with React through **React Redux**.

React Redux provides:

`Provider
useDispatch
useSelector`

---

### Provider

Wrap the application.

`<Provider store={store}>
   <App />
</Provider>`

---

### useDispatch()

Used to send actions.

Example:

`const dispatch = useDispatch()
dispatch(increment())`

---

### useSelector()

Used to read state from store.

Example:

`const count = useSelector((state) => state.counter.value)`

---

# 13. createAsyncThunk()

Redux Toolkit also handles **API requests and async operations**.

For example:

- Fetch data from server
  • Login user
  • Load products

Redux Toolkit provides **createAsyncThunk()**.

It automatically generates:

`pending
fulfilled
rejected`

Example concept:

`fetchData
   ↓
pending
   ↓
success → fulfilled
error → rejected`

Reducers can handle these states.

---

# 14. Folder Structure (Recommended)

A clean Redux Toolkit project structure looks like this:

`src
├── app
│     store.js
│
├── features
│     counter
│        counterSlice.js
│
├── components
│
└── App.jsx`

Each feature keeps its own slice.

This is called **feature-based architecture**.

---

# 15. Advantages of Redux Toolkit

Redux Toolkit provides many benefits.

### 1. Less Boilerplate

You write far less code compared to classic Redux.

---

### 2. Built-in Best Practices

Redux Toolkit automatically includes:

- Redux DevTools
  • Middleware
  • Immutable state checks

---

### 3. Easier Async Logic

createAsyncThunk simplifies API calls.

---

### 4. Better Project Structure

Slices keep related logic together.

---

### 5. Safer State Updates

Immer prevents accidental mutation.

---

### 6. Official Redux Standard

Redux Toolkit is now the **recommended way to use Redux**.

---

# 16. Redux vs Context API

Many beginners ask this question.

When should we use Redux?

### Context API

Good for:

- small applications
  • theme management
  • authentication state
  • simple global data

---

### Redux Toolkit

Better for:

- large applications
  • complex state
  • multiple features sharing data
  • predictable state updates

---

# 17. Performance Benefits

Redux Toolkit improves performance by:

- preventing unnecessary re-renders
  • centralizing state updates
  • enabling selective subscriptions through selectors

React components only re-render when the selected state changes.

---

# 18. Redux DevTools

Redux DevTools allow developers to:

- see every action dispatched
  • inspect state changes
  • time travel debugging
  • track bugs easily

Redux Toolkit automatically enables DevTools in development.

---

# 19. When Should You Use Redux Toolkit

Redux Toolkit is useful when:

- many components share the same data
  • state logic becomes complex
  • application grows large
  • debugging state becomes difficult

---

# 20. Summary

Redux Toolkit is a modern state management library built on top of Redux.

It simplifies Redux development by reducing boilerplate and providing powerful utilities.

Key points:

- Redux was created in 2015
  • Redux Toolkit was introduced in 2019
  • Redux Toolkit is now the **official way to write Redux**

Main tools provided by Redux Toolkit:

- configureStore()
  • createSlice()
  • createAsyncThunk()
  • built-in middleware
  • Immer integration

Redux Toolkit helps developers write scalable, maintainable, and predictable state management logic.

///////////////////////////##################################

redux-toolkit is the upgraded version of redux. It is a collection of tools that help you use redux more effectively.

=> redux toolkit is used for data-centralization. its main task is to perform state management for scalable applications.

=> Redux is a predictible state container for JavaScript applications. It helps you manage the state of your application in a centralized and predictable way.

=> the difference between contextAPI and Redux Toolkit is that Context API is used for small applications and Redux Toolkit is used for large applications. in context API , we can say that its like a kirana shop, where for each item we have to go and search for it manually. But in Redux Toolkit, we can say that its like a super market, where all the items are organized in a proper way and we can easily find them.

=> Eg: for user we have different context, for theme we have different context, for cart we have different context, for product details we have different context, for product listing we have different context, for post details we have different context, for post listing we have different context etc but thats not a good way to manage the state of the application. thats why we use Redux Toolkit.

=> The main difference between Context API and Redux Toolkit is scalability and state management structure.

Context API is generally good for small to medium applications where state sharing is simple, like theme, authentication, or language settings.
Redux Toolkit (RTK) is better for medium to large applications where many components need shared state, async operations, caching, and predictable state updates.

=> We can compare them like this:

Context API is like a small kirana shop. Items are available, but everything is separated, and managing many items becomes difficult as the shop grows.
Redux Toolkit is like a supermarket. Everything is organized in sections, easier to manage, scalable, and simpler to track.

=> In Context API, we usually create multiple contexts for different features:

1. UserContext
2. ThemeContext
3. CartContext
4. ProductContext
5. PostContext
6. etc.

As the application grows, handling many providers and updating deeply nested components can become messy and harder to maintain.

=> Redux Toolkit solves this problem by keeping all global state in a centralized store with organized slices like:

1. userSlice
2. cartSlice
3. productSlice
4. postSlice
5. themeSlice

This makes state management cleaner, easier to debug, scalable, and better for large applications.

=> Another major advantage of Redux Toolkit is:

Built-in support for async operations using createAsyncThunk
Redux DevTools support
Better debugging
Predictable state flow
Easier code organization

So, Context API is not “bad,” but Redux Toolkit becomes more powerful and maintainable when the application grows large and complex.

at first we have to install the redux toolkit.
`npm install @reduxjs/toolkit`
then we have to install the react-redux.
`npm install react-redux`

now we will create a store, it will have multiple slice functions ::

---

## src/store/store.js

import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
reducer:{

    }

})

=> now we will wrap our application with the provider so that it can access the store globally ::

---

## src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
<StrictMode>
<Provider store={store}>
<App />
</Provider>
</StrictMode>,
)

=> so now, we have created a central store and wrapped our application with the provider, now we can create slices. this slices are used to manage the state of the application.
slices has two main properties ::

1. reducers: reducers are functions that can update the state of the application.
2. initialState: initialState is the initial state of the application.

```javascript
--------------------------
src/store/CounterSlice.jsx
--------------------------

import { createSlice } from "@reduxjs/toolkit"

export const counterSlice = createSlice({
    name: "counter",
    initialState: {
        value: 0
    },
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            if (state.value > 0) {
                state.value -= 1;
            }
        },
        incrementByAmount: (state, action) => {
            state.value += Number(action.payload);
        }
    }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

--------------------------
src/store/ThemeSlice.jsx
--------------------------

import { createSlice } from "@reduxjs/toolkit"

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        value: "light"
    },
    reducers: {
        toggleTheme: (state) => {
            state.value = state.value === "light" ? "dark" : "light"
        }
    }
})

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;



// => now, we have to mention the slices in the store in the reducer property.



------------------
src/store/store.js
------------------
import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "./CounterSlice.jsx";
import themeReducer from "./ThemeSlice.jsx";

export const store = configureStore({
    reducer:{

        counter: counterReducer,
        theme: themeReducer

    }
})

```

=> ok now, we have two slices, counter and theme, and we have also mentioned them in the store. now we can use them in our application.

=> Let's connect the Redux state to our React entry component:

------------
src/App.jsx
------------

```javascript
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store/CounterSlice';
import { toggleTheme } from './store/ThemeSlice';

const App = () => {
  // Read state using useSelector
  const count = useSelector((state) => state.counter.value);
    // useSelector hamare "store" main jo value store kiya hai, wo read karta hai aur usko UI main show karta hai

  const theme = useSelector((state) => state.theme.value);
  
  // Get the dispatch function
  const dispatch = useDispatch();
  // with the help of useDispatch() we can use the functions like increment, decrement, incrementByAmount, toggleTheme. hum iss function ko start kar sakte hai.
  
  const [customVal, setCustomVal] = useState('5');

  return (
    <div className={`app-container ${theme}`}>
      {/* Background blobs for ambient glow */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <header className="header">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <h2>
            Pulse<span>Counter</span>
          </h2>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'dark' ? (
            <>
              <span className="icon">☀️</span> Light Mode
            </>
          ) : (
            <>
              <span className="icon">🌙</span> Dark Mode
            </>
          )}
        </button>
      </header>

      <main className="main-content">
        <div className="dashboard-card">
          <span className="card-badge">Redux Toolkit State</span>

          <div className="counter-display">
            <span className="counter-label">CURRENT COUNT</span>
            <h1 className="counter-number">{count}</h1>
          </div>

          <div className="action-grid">
            <button
              className="action-btn decrement-btn"
              onClick={() => dispatch(decrement())}
              aria-label="Decrement"
            >
              <span className="btn-symbol">−</span> Decrement
            </button>
            <button
              className="action-btn increment-btn"
              onClick={() => dispatch(increment())}
              aria-label="Increment"
            >
              <span className="btn-symbol">+</span> Increment
            </button>
          </div>

          <div className="custom-increment-section">
            <label htmlFor="custom-amount">Increment by custom amount</label>
            <div className="custom-input-wrapper">
              <input
                id="custom-amount"
                type="number"
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                placeholder="Value"
              />
              <button
                onClick={() =>
                  dispatch(incrementByAmount(Number(customVal) || 0))
                }
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with React & Redux Toolkit • Auto-saving active</p>
      </footer>
    </div>
  );
};

export default App;
```

=> To make it look extremely premium, we used a Dark & Red glassmorphism gradient theme with transitions:

--------------
src/index.css
--------------

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap');

:root {
  --font-primary:
    'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Space Grotesk', monospace;

  /* Color Palette - Dark Red Mode (Default/Dark) */
  --bg-color-dark: #0a0506;
  --card-bg-dark: rgba(22, 14, 16, 0.7);
  --border-color-dark: rgba(255, 60, 80, 0.15);
  --text-primary-dark: #fcfcfd;
  --text-secondary-dark: #b8afb2;
  --primary-accent: #ff334b;
  --secondary-accent: #b31024;
  --glow-color: rgba(255, 51, 75, 0.4);

  /* Color Palette - Light Red Mode */
  --bg-color-light: #fdfafb;
  --card-bg-light: rgba(255, 255, 255, 0.85);
  --border-color-light: rgba(179, 16, 36, 0.15);
  --text-primary-light: #1c0d10;
  --text-secondary-light: #6b5c5f;

  --transition-smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: var(--font-primary);
  overflow-x: hidden;
  background-color: var(--bg-color-dark);
}

#root {
  width: 100%;
  min-height: 100%;
}

/* App Container */
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  overflow: hidden;
  transition: var(--transition-smooth);
}

/* Dark Theme */
.app-container.dark {
  background-color: var(--bg-color-dark);
  color: var(--text-primary-dark);
}

/* Light Theme */
.app-container.light {
  background-color: var(--bg-color-light);
  color: var(--text-primary-light);
}

/* Ambient Glow Blobs */
.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  z-index: 1;
  pointer-events: none;
  opacity: 0.45;
  transition: var(--transition-smooth);
}

.dark .ambient-blob {
  opacity: 0.35;
}

.blob-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(
    circle,
    var(--primary-accent) 0%,
    rgba(0, 0, 0, 0) 70%
  );
}

.blob-2 {
  bottom: -15%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(
    circle,
    var(--secondary-accent) 0%,
    rgba(0, 0, 0, 0) 70%
  );
}

.light .blob-1 {
  background: radial-gradient(
    circle,
    rgba(255, 51, 75, 0.25) 0%,
    rgba(255, 255, 255, 0) 70%
  );
}

.light .blob-2 {
  background: radial-gradient(
    circle,
    rgba(179, 16, 36, 0.15) 0%,
    rgba(255, 255, 255, 0) 70%
  );
}

/* Dashboard Card */
.dashboard-card {
  position: relative;
  width: 100%;
  padding: 3rem 2.5rem;
  border-radius: 28px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: var(--transition-smooth);
}

.dark .dashboard-card {
  background: var(--card-bg-dark);
  border: 1px solid var(--border-color-dark);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.light .dashboard-card {
  background: var(--card-bg-light);
  border: 1px solid var(--border-color-light);
  box-shadow:
    0 20px 40px rgba(179, 16, 36, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.02);
}

/* Action Buttons Grid */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-btn {
  border: none;
  outline: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition-smooth);
}

/* Custom Increment Section */
.custom-increment-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
```

