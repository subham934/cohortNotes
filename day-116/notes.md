Today, we will be learning about Authentication and Authorization. We have seen token blacklisting yesterday, today, we will see , how our moodify detect our mood and plays songs accordingly. 

we will also connect the backend to the frontend::


UI layer => UI dikhana aur navigation handle karna (pages, components)

hook => State and APIs manage karna [hooks]

State => data store [auth.context.jsx, post.context.jsx]

API => backend se communicate karne k liye [services/auth.api.js, services/post.api.js]


//==========================================


Lets redesign the Frontend now::

but before that install react-router
npm i react-router

At first lets create a route::






-------------------------------
Frontend > src > app.routes.jsx
-------------------------------


import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home</h1>,
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

now, for css we will use sass
npm i sass

for global styles we will create a global scss file inside "features/shared/styles/global.scss"

---------------------------------------------------------
Frontend > src > features > shared > styles > global.scss
---------------------------------------------------------

@use "./button.scss";


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  background-color: rgb(33, 33, 33);
  color: whitesmoke;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
}



---------------------------------------------------------
Frontend > src > features > shared > styles > button.scss
---------------------------------------------------------

.button{
    background-color: #dd4200;
    border: none;
    color: whitesmoke;
    padding: .5rem 1rem;
    text-align: center;
    display: inline-block;
    align-self: flex-start;
    font-size: 1rem;
    border-radius: .5rem;
    outline: none;
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
        background-color: #ff5722;
    }

    &:active {
        scale: 0.95;
    }
}



//==========================================
=> Importing the routes on App.jsx
------------------------
Frontend > src > App.jsx
------------------------

import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import "./features/shared/styles/global.scss";



const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;




//==========================================


------------------------------------------------
Frontend > src > features > auth > pages > Login.jsx
------------------------------------------------


import "../style/login.scss";


const Login = () => {
  return (
    <div className="login-page">
      <div className="form-container">
        <h1>Login</h1>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <button className="button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;



-------------------------------------------------
Frontend > src > features > auth > style > login.scss
-------------------------------------------------
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border-radius: 0.5rem;
    min-width: 400px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      input{
        padding: .5rem;
        border-radius: .25rem;
        border: 1px solid #ccc;
        outline: none;
        border: none;
      }
    }
  }
}


//==========================================

in the Login.jsx file, the label and input are being repeated and for Register.jsx also, so we can create a reusable component for that::

---------------------------------------
Frontend > src > features > auth > components > FormGroup.jsx
---------------------------------------


import React from "react";

const FormGroup = ({label, placeholder}) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor={label}>{label}</label>
        <input type='text' name={label} id={label} placeholder={placeholder} required />
      </div>
    </>
  );
};

export default FormGroup;





//==========================================
//==========================================


Latest changes in Auth pages
============================

Now we improved the Login and Register pages by making the form UI more reusable and consistent.


//==========================================

1. Fixed FormGroup import in Login.jsx
--------------------------------------

In `FormGroup.jsx`, we are exporting the component as default:

```jsx
export default FormGroup;
```

So in `Login.jsx`, we should import it without curly braces:

```jsx
import FormGroup from "../components/FormGroup";
```

Wrong way:

```jsx
import { FormGroup } from "../components/FormGroup";
```

Curly braces are used only when the component is exported as a named export.


//==========================================

2. Added FormGroup component in Login.jsx
-----------------------------------------

Earlier, label and input code was repeated again and again.

Now we use the reusable `FormGroup` component:

```jsx
<FormGroup label="Email" placeholder="Enter your email" />
<FormGroup label="Password" placeholder="Enter your password" />
```

This makes the code cleaner and easier to reuse in Register page also.


//==========================================

3. Register.jsx structure
-------------------------

Register page now follows the same structure as Login page:

```jsx
<main className="register-page">
  <div className="form-container">
    <h1>Register</h1>
    <form>
      <FormGroup label="Name" placeholder="Enter your name" />
      <FormGroup label="Email" placeholder="Enter your email" />
      <FormGroup label="Password" placeholder="Enter your password" />
      <button className="button" type="submit">
        Register
      </button>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  </div>
</main>
```

We also imported `Link` from react-router:

```jsx
import { Link } from "react-router";
```

This allows us to navigate to the login page without refreshing the browser.


//==========================================

4. register.scss styling
------------------------

We styled `register.scss` like `login.scss`, so both pages have the same layout.

```scss
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border-radius: 0.5rem;
    min-width: 400px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      input {
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: none;
        outline: none;
      }
    }
  }
}
```


//==========================================

5. Button width fix
-------------------

The button was taking full width because the form is a flex container with column direction.

In flexbox, child elements stretch by default.

So we added this in `button.scss`:

```scss
align-self: flex-start;
```

This makes the button take only the required space.


//==========================================

6. Added paragraph and link style globally
------------------------------------------

Both Login and Register pages now have a small paragraph for switching pages.

In Register page:

```jsx
<p>
  Already have an account? <Link to="/login">Login here</Link>
</p>
```

In Login page:

```jsx
<p>
  Don't have an account? <Link to="/register">Register here</Link>
</p>
```

For styling these paragraphs, we added global styles in:

`Frontend > src > features > shared > styles > global.scss`

```scss
p {
  color: #cfcfcf;
  font-size: 0.95rem;
  line-height: 1.5;

  a {
    color: #dd4200;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
```

Because this is written in `global.scss`, the same paragraph and link style can be used on both Login and Register pages.


//==========================================

Now that the UI layer is complete, we will code api layer and state management layer in the next sessions.

we need 'npm i axios'


=> Lets create the API Layer::


-----------------------------------------
Frontend > src > features > auth > services > auth.api.js
-----------------------------------------

import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials: true,
})

export async function register({email, username, password}){
    const response = await api.post('/api/auth/register',{
        email, password, username
    })

    return response.data;
}

export async function login({email, username, password}){
    const response = await api.post('/api/auth/login', {
        email, username, password
    })

    return response.data;
}

export async function getMe(){
    const response = await api.get('/api/auth/get-me')
    return response.data;
}

export async function logout(){
    const response = await api.get('/api/auth/logout')
    return response.data;
}


=============================

Lets create State Layer:


------------------------------
Frontend > src > features > auth > auth.context.jsx
------------------------------

import {createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    return(
        <AuthContext.Provider value = {{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

Now , we will wrap the App.jsx with AuthProvider


------------------------------
Frontend > src > App.jsx
------------------------------


import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
};

export default App;


//==========================================
Hook layer

------------------------------------------------------
Frontend >  src > features > auth > hooks > useAuth.js
------------------------------------------------------


import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export function useAuth() {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  async function handleRegister({ username, email, password }) {
    setLoading(true);
    const data = await register({ username, email, password });
    setUser(data.user);
    setLoading(false);
  }

  async function handleLogin({ username, email, password }) {
    setLoading(true);
    const data = await login({ username, email, password });
    setUser(data.user);
    setLoading(false);
  }

  async function handleGetMe() {
    setLoading(true);
    const data = await getMe();
    setUser(data.user);
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    const data = await logout();
    setUser(null);
    setLoading(false);
  }

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}




//==========================================

now we will do 2way binding in Login.jsx and Register.jsx with FormGroup.jsx


--------------------------------------------
Frontend > src > features > auth > components > FormGroup.jsx
--------------------------------------------

import React from "react";

const FormGroup = ({ label, placeholder, value, onChange }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor={label}>{label}</label>
        <input
          value={value}
          onChange={onChange}
          type="text"
          name={label}
          id={label}
          placeholder={placeholder}
          required
        />
      </div>
    </>
  );
};

export default FormGroup;



--------------------------------------------
Frontend > src > features > auth > pages > Login.jsx
--------------------------------------------
import "../style/login.scss";
import FormGroup from "../components/FormGroup";
import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="Enter your email"
          />
          <FormGroup
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
          />
          <button className="button" type="submit">
            Login
          </button>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;


--------------------------------------------
Frontend > src > features > auth > pages > Register.jsx
--------------------------------------------
import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const Register = () => {
  const { handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  }

  return (
    <main className="register-page">
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Name"
            placeholder="Enter your name"
          />
          <FormGroup
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="Enter your email"
          />
          <FormGroup
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
          />
          <button className="button" type="submit">
            Register
          </button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;


//==========================================

Now , we shell create a Protected component that says that in order to appear on home page you must be logged in or registered

Protected.jsx is meant to act like a guard around pages that should only be visible when the user is logged in.

-------------------------------------------
Frontend > src > features > auth > components > Protected.jsx
-------------------------------------------
import React, { Children } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";


const Protected = ({ children }) => {
    // The Protected component expects children. Any element we wrap inside Protected can only be rendered if the user is logged in.

  const { user, loading } = useAuth();


   if (loading) {
    return <h1>Loading...</h1>;
  }


  if (!user) {
    return <Navigate to="/login" />
  }

 

  return children;
};

export default Protected;




=> Now we will wrap our Home page inside Protected component


-------------------------------
Frontend > src > app.routes.jsx
-------------------------------

import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <h1>Home</h1>
      </Protected>
    ),
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

=> now when we login , we will be redirected to home page, but there is a problem, if we refresh the page, we will be redirected to login page again. 

=> This happens because our state layer (auth.context.jsx) stores user and loading. When we log in, the handleLogin function inside useAuth.js makes an API call and returns the user data. This data is then stored using the setUser function in auth.context.jsx. As long as the user state is available, we can access the children inside the Protected.jsx component.

=> However, when we reload the page, the React state resets and user becomes null. Because of this, we can no longer access the children inside Protected.jsx, and we are redirected to the login page again. To prevent this, we use useEffect() to fetch the user data again when the app loads. 


-------------------------------------------
Frontend > src > features > auth > auth.context.jsx
-------------------------------------------

// Lets create State Layer:

import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // we set loading to true now.

  //We changed loading from false to true because when the app first loads, we do not immediately know whether the user is logged in or not. For example, after login, the backend may store authentication in a cookie. If the user refreshes the page, React state resets, so initially user becomes null again. But that does not always mean the user is logged out; it may only mean the frontend has not checked the backend yet. So we start with loading: true, which tells Protected.jsx: “wait, do not redirect yet, first let getMe() check the backend.” While loading is true, the app shows Loading.... Then getMe() runs. If the backend finds a valid cookie/token, it returns the user and we do setUser(data.user), so the user can stay on the Home page. If the backend says there is no valid user, then user remains null, loading becomes false, and Protected.jsx redirects to /login. If we started with loading: false, then on every refresh the app would instantly see user = null and redirect to login before getMe() gets a chance to restore the logged-in user.

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


-------------------------------------------
Frontend > src > features > auth > hooks > useAuth.js
-------------------------------------------


import { login, register, getMe, logout } from "../services/auth.api";
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";

export function useAuth() {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  async function handleRegister({ username, email, password }) {
    setLoading(true);
    const data = await register({ username, email, password });
    setUser(data.user);
    setLoading(false);
  }

  async function handleLogin({ username, email, password }) {
    setLoading(true);
    const data = await login({ username, email, password });
    setUser(data.user);
    setLoading(false);
  }

  async function handleGetMe() {
    setLoading(true);
    const data = await getMe();
    setUser(data.user);
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    const data = await logout();
    setUser(null);
    setLoading(false);
  }

  useEffect(()=>{
    handleGetMe();
  },[])

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}

=> When the page reloads, useEffect calls getMe(), which checks if the user is still authenticated (via cookie/token). If valid, it fetches user data again and restores the state.


Protected component acts as a guard that allows access only when a user is authenticated. On page reload, React state resets and user becomes null. To handle this, we call getMe() when the app initializes, which verifies authentication using stored credentials (like cookies or tokens). If valid, it fetches the user again and restores the state, preventing unwanted redirects.


//==========================================



