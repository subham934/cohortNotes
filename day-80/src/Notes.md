ReactRouterDOM contains two things:
-React Router
-React Router DOM

✅ React Router ecosystem (simple explanation)

React Router is a routing system for React

    It lets you create multiple pages without reloading the browser

    Works like navigation inside a single-page app

✅ React Router has 2 main parts
🔹 React Router (react-router) → core library

The main engine
Contains routing logic
Platform independent

Works for:
web
React Native
server rendering

You rarely use this directly in web apps
👉 Think: brain of routing

🔹 React Router DOM (react-router-dom) → browser package

Built on top of React Router
Connects routing to the browser DOM
Used for websites

It provides components like:

BrowserRouter → enables routing
Routes → container for routes
Route → defines a page
Link → navigation without reload
NavLink → active link styling
Outlet → renders nested routes
useNavigate() → programmatic navigation
useParams() → URL parameters

## Types of Routers

=> BrowserRouter - Uses History API - URL clean - mordern WebApps - Good SEO - Needs Server Config.

=> Hash Router - URL contains # - /courses/#ab?123/#about - old Browser - No SEO

=> Memory ROuter - Used in React Native

=> Static Router - Used in SSR

React - Single Page Application (URL change hone pe kuch nahi hota tha) , so with help REACT-ROUTER-DOM, we can perform routing

Routes - Container - Contain All the Route
Route - if URL is 'y' then show Y

## . `useNavigate()`

**What:** Hook used to **navigate programmatically** (via JavaScript, not clicks).

**Why:** Redirect after login, submit, logout, or any condition.

```jsx
import { useNavigate }from"react-router-dom";

functionLogin() {
const navigate =useNavigate();

functionhandleLogin() {
// login logic
navigate("/dashboard");// redirect
  }

return<buttononClick={handleLogin}>Login</button>;
}

```

**Key Points**

- Replaces `useHistory` (older versions)
- Used **inside components only**
- `navigate(-1)` → go back

---

## 2. `Outlet`

**What:** Placeholder to render **child (nested) routes**.

**Why:** Needed when using **nested routing**.

```jsx
import {Outlet }from"react-router-dom";

functionLayout() {
return (
<>
<h1>Navbar</h1>
<Outlet />
</>
  );
}

```

```jsx
{
path:"/",
element:<Layout />,
children: [
    {path:"home",element:<Home /> },
    {path:"about",element:<About /> }
  ]
}

```

**Key Points**

- Parent component must contain `<Outlet />`
- Child routes render **inside Outlet**

---

## 3. `createBrowserRouter`

**What:** Modern way to define routes (v6.4+).

**Why:** Cleaner, object-based routing with nesting.

```jsx
import { createBrowserRouter,RouterProvider }from"react-router-dom";

const router =createBrowserRouter([
  {
path:"/",
element:<Layout />,
children: [
      {path:"home",element:<Home /> },
      {path:"about",element:<About /> }
    ]
  }
]);

functionApp() {
return<RouterProviderrouter={router} />;
}

```

**Key Points**

- Replaces `<BrowserRouter>` + `<Routes>`
- Supports nested routes naturally
- Used with `<RouterProvider />`

---

## 4. `NavLink`

**What:** Special version of `Link` that knows **active route state**.

**Why:** To apply styles to the active link.

```jsx
import {NavLink }from"react-router-dom";

functionNavbar() {
return (
<NavLink
to="/home"
className={({isActive }) => (isActive ? "active" : "")}
    >
      Home
</NavLink>
  );
}

```

**Key Points**

- `isActive` helps style active links
- Best for navbars
- Use instead of `Link` when active styling is needed
  Displaying Day 80 Notes.md.




import React from 'react'
import Navbar from './components/Navbar'
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import Kodr from './pages/Kodr'
import Kodex from './pages/Kodex'
import AllCourses from './pages/AllCourses'
import Footer from './components/Footer'
import Layout from './pages/Layout'

const App = () => {

  const allRoutes = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'about',
          element: <About />
        },
        {
          path: 'courses',
          element: <Courses />,
          children: [
            {
              path: 'kodex',
              element: <Kodex />
            },
            {
              path: 'kodr',
              element: <Kodr />
            },
            {
              index:true,
              element:<AllCourses />
            }
          ]
        }
      ]
    }
  ])

  return (<RouterProvider router={allRoutes} />

  )
}

export default App

For reference, use the below link
https://github.com/saarthack/cohort-2-react/blob/main/class12/src/App.jsx