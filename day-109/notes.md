day-109

=> kal humne Login.jsx aur Register.jsx banaya hai, jisme humne Login form aur Register form banaya tha. Aaj ka class kal ka repeat class hai, we will explain broadly about the login jsx format.

=> Login.jsx ka kaam hota hai UI dikhana, jisme user ka login form hota hai aur uske andar email aur password input hoti hai, jisme humne email aur password input banaya tha. But , humari jo Login.jsx file hai wo backend se communicate kar rahi hai, humne code aisa likha hai ki wo backend se communicate kare, aur API call kare, but aisa nahi hota, UI layer kabhi bhi directly backend se communicate nahi karega.


In the backend we have already created some routes like , /register, /login, /get-me in auth.routes.js. So, we can use these routes in Login.jsx and Register.jsx.

=> we have also created some API related to user and post.
=> Now, we will use these API to Integrate with frontend.

=> we know the folder structure for backend, similarly we follow a folder structure for frontend. This folder structure is divided in 4 layers.

1. UI layer
  => UI dikhana user ko aur navigate karna
   
2. Hooks layer
  => Manage karna state aur API ko.

3. State layer
  => State manage karna.
    => Loading
    => user logged In
    => Post list
    => error

4. API layer
  => Backend se communicate karna.

=> yeha ak layer dusre k kaam main interfare nahi karega.

=> to navigate between pages we use react-router.

npm i react-router

=> now inside src folder we create a router file called app.routes.jsx



-------------------------------
Frontend > src > app.routes.jsx
-------------------------------

import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    }
]);


=> we have create a Login.jsx and Register.jsx file to login and register user. these file was created inside "features" folder to separate the features from the rest of the code. Inside "features" folder , we have two another folder called "auth" and "posts", "auth" is for authentication, login , register, logout and "posts" is for posts.
//======================================

=> we need to use the router in App.jsx

------------------------
Frontend > src > App.jsx
------------------------


import React from 'react'
import { RouterProvider } from 'react-router'
import {router} from './app.routes'
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App


//======================================
=> now we will integrate styles, for that we will create a folder called "shared" inside "features" folder.Inside "shared" we will create global.scss for global styling

to implement the scss we will use sass, to install sass we will use "npm i sass"

after that import the file in App.jsx


------------------------
Frontend > src > App.jsx
------------------------

import React from 'react'
import { RouterProvider } from 'react-router'
import {router} from './app.routes'
import './features/shared/global.scss'

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;



------------------------------------------------
Frontend > src > features > shared > global.scss
------------------------------------------------

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body, #root{
    width: 100%;
    background-color: #131313;
    color: whitesmoke;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}


//======================================

let's write content for Login.jsx and Register.jsx

-----------------------------------------
Frontend > src > features > auth > pages > Login.jsx
-----------------------------------------

import React from 'react'
import '../style/form.scss'
import { Link } from 'react-router'
const Login = () => {

    const handleSubmit = (e) =>{
        e.preventDefault()
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name='username' id='username' placeholder='Enter Username' />
                <input type="password" name='password' id='password' placeholder='Enter password' />
                <button className='button primary-button'>Login</button>

            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login


-----------------------------------------
Frontend > src > features > auth > pages > Register.jsx
-----------------------------------------

import React from 'react'
import { Link } from 'react-router'

const Register = () => {
      const handleSubmit = (e) =>{
        e.preventDefault()
    }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name='username' id='username' placeholder='Enter Username' />
                <input type="email" name='email' id='email' placeholder='Enter Email Address' />
                <input type="password" name='password' id='password' placeholder='Enter password' />
                <button className='button primary-button'>Register</button>

            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </main>
  )
}



export default Register






=> to style the Login.jsx & Register.jsx, we will create another file for styling the components




-----------------------------------------
Frontend > src > auth > style > form.scss
-----------------------------------------


@mixin flex-column($gap: 0rem) {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

main {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .form-container {
    @include flex-column(2rem);
    border: 1px solid whitesmoke;
    min-width: 400px;
    padding: 2rem;
    border-radius: 1rem;
  }

  h1 {
    text-align: center;
    color: rgb(146, 45, 45);
  }

  form {
    @include flex-column(1rem);

    input {
      border: none;
      outline: none;
      padding-inline: 1rem;
      padding-block: 0.5rem;
      border-radius: 1rem;
      font-size: 22px;
    }
  }
}


------------------------------------------------
Frontend > src > features > shared > global.scss
------------------------------------------------

@use 'button.scss';

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body, #root{
    width: 100%;
    background-color: #131313;
    color: whitesmoke;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

a{
    color: #d20c3d;
    text-decoration: none;
}

------------------------------------------------
Frontend > src > features > shared > button.scss
------------------------------------------------

.button {
  border: none;
  outline: none;
  padding-inline: 1rem;
  padding-block: 0.75rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 22px;
  transition: all 0.3s ease-in-out;

  &.primary-button {
    background-color: #d20c3d;
    color: whitesmoke;
  }

  &:active {
    transform: scale(0.9);
  }
}

=> So till now , only UI layer is complete.

//======================================

=> Now, we will create an API layer, its main purpose is to connect the backend with frontend.

=> to communicate with backend, we need axios.
"npm i axios"



-------------------------------------
day-109 > Frontend > src > features > auth > services > auth.api.js
-------------------------------------


// =============== API LAYER ===============    

  import axios from 'axios'

  const api = axios.create({
      baseURL: 'http://localhost:3000/api/auth',
      withCredentials: true,

  })

// to interact with backend for authentication, we have 3 api methods, i.e., login, register, get-me, so we need to create 3 different function to interact with the 3 api methods

export async function login(username, password){
    const response = await api.post('/login', {username, password})
    return response.data
}

export async function register(username, email, password){
    const response = await api.post('/register', {username, email, password})
    return response.data
}

export async function getMe(){
    const response = await api.get('/get-me')
    return response.data
}



//======================================

=> Now , we will create a state layer, this is where we will manage our state.


--------------------------------------------------
Frontend > src > features > auth > auth.context.js
--------------------------------------------------

// This is state layer

import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

=> we will wrap the App.jsx with AuthProvider.

------------------------
Frontend > src > App.jsx
------------------------
import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import "./features/shared/global.scss";
import { AuthProvider } from "./features/auth/auth.context";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;



//======================================
=> state layer is to manage the state of the application. this is where we will manage the state of the application. The hook layer will manage the API layer , and when we have response from API , the data in the state will be updated.

--------------------------------------------
day-109 > Frontend > src > features > auth > hooks > useAuth.js
--------------------------------------------

// This is a hook layer
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;
};



// inside context we have user , setUser, loading, setLoading. so every data we have stored in state layer is inside hook layer. hook layer manages both state and api layer. so we need to get the data of API layer aswell. for that we write as below:


--------------------------------------------
day-109 > Frontend > src > features > auth > hooks > useAuth.js
--------------------------------------------


// This is a hook layer
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe } from "../services/auth.api";
export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

    const handleLogin = async (username, password) => {
        setLoading(true);
        const response = await login(username, password);
        setUser(response.user);
        setLoading(false);
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        const response = await register(username, email, password);
        setUser(response.user);
        setLoading(false);
    }

    const handleGetMe = async () => {
        setLoading(true);
        const response = await getMe();
        setUser(response.user);
        setLoading(false);
    }

    return { user, setUser, loading, setLoading, handleLogin, handleRegister, handleGetMe };

};

//======================================
=> Now we will use the hook layer in Login.jsx and Register.jsx

-----------------------------------------
Frontend > src > features > auth > pages > Login.jsx
-----------------------------------------

import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { user, loading, handleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      console.log("user loggedIn");
      navigate("/");
    } catch (err) {
      console.log(err);
      setUsername("");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
            placeholder="Enter Username"
          />
          <input
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
          />
          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;



-----------------------------------------
Frontend > src > features > auth > pages > Register.jsx
-----------------------------------------


import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(username, email, password);
      console.log("user registered");
      navigate("/");
    } catch (err) {
      console.log(err);
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
            placeholder="Enter Username"
          />
          <input
            value={email}
            onInput={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email Address"
          />
          <input
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
          />
          <button className="button primary-button">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;


//======================================
