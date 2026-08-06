day-107

aaj hum ak fullstack project banayenge , jaha , hum 

/login => login form banayenge
/register => register form banayenge

=> this project will be done with the help of previous instagram app we have been developing

for that we need react-router-dom package

npm i react-router

=> jo routing wala part hai, ki kis route pe kaun sa page humko dikhana hai, wo hum karenge AppRoutes.jsx file k andar



============================================

=> now we will create the <Login/> and <Register />
=> we create a new folder called 'features' inside 'src' folder,

=> inside 'features' we need to create two features, 'auth' & 'post', 'auth' k andar hum authentication related kaam karenge aur 'post' k andar hum post related kaam karenge

---------------------------------------------------
day-107 > Frontend > src > features > auth > pages > Login.jsx
---------------------------------------------------

import React from 'react'

const Login = () => {
  return (
    <div>Login</div>
  )
}

export default Login

-------------------------------------------------
day-107 > Frontend > src > features > auth > pages > Register.jsx
-------------------------------------------------


import React from 'react';

const Register = () => {
  return (
    <div>Register</div>
  )
}

export default Register;


===============================================

=> now , we shell import those above two files inside routes.js file

----------------------------------------
day-107 > Frontend > src > AppRoutes.jsx
----------------------------------------


import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;






================================================
=> now we shell import routes.jsx file inside App.jsx file and implement it.

------------------------------------
day-107 > Frontend > src > App.jsx
------------------------------------
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div>
      <AppRoutes  />
    </div>
  );
};

export default App;


=> now , if we go to http://localhost:5173/login , we will get the login page, and if we go to http://localhost:5173/register, we will get the register page

===============================================

=> now we will design the login and register UI

=> to style the FE of login and register we will use scss
=> npm i sass

to style the global css we will create a new file called 'style.scss' inside 'src' folder:

-------------------------------------
day-107 > Frontend > src > style.scss
-------------------------------------

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, 
body,
#root{
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
}

html{
    background-color: #1d1d1d;
    color: whitesmoke;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

=> we need to import this style.scss in App.jsx file

----------------------------------
day-107 > Frontend > src > App.jsx
----------------------------------

import AppRoutes from "./AppRoutes";
import './style.scss';
const App = () => {
  return (
    <div>
      <AppRoutes  />
    </div>
  );
};

export default App;


================================================

now to change the style of Login.jsx and Register.jsx, for that we will use form.scss, but before, lets see the code for Login.jsx and Register.jsx

---------------------------
day-107 > Frontend > src > features > auth > pages > Login.jsx
---------------------------
import { Link } from "react-router";
import "../style/form.scss";

const Login = () => {
  return (
    <>
      <main>
        <div className="form-container">
          <h1>Login</h1>
          <form>
            <input type="text" name="username" placeholder="Enter Username" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
            />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <Link className="toggleAuthForm" to="/register">Register</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;


---------------------------
day-107 > Frontend > src > features > auth > pages > Register.jsx
---------------------------

import React from "react";
import "../style/form.scss";
import { Link } from "react-router";

const Register = () => {
  return (
    <>
      <main>
        <div className="form-container">
          <h1>Register</h1>

          <form>
            <input type="text" name="username" placeholder="Enter Username" />
            <input type="email" name="email" placeholder="Enter Email" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
            />

            <button type="submit">Register</button>
          </form>
          <p>
            Already have an account? <Link className="toggleAuthForm" to="/login">Login</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;


-------------------------------------------
day-107 > Frontend > src > features > auth > styles > form.scss
-------------------------------------------

main {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 1rem;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input,
    button {
      border: none;
      outline: none;
      font-size: 22px;
      padding-block: 1rem;
      padding-inline: 1.5rem;
      border-radius: 0.3rem;
    }

    button {
      cursor: pointer;
      background-color: #bd0c23;
      color: whitesmoke;
    }
  }

  .toggleAuthForm {
    color: #bd0c23;
    cursor: pointer;
    text-decoration: none;
  }
}


================================================

=>Now, we will see the logic of the UI where we will register the user and login the user. For that we have already written the code in backend where we have already created some APIs, /register & /login

=> Lets implement the logic in Register.jsx
=> Also to use the API in frontend we need a package npm i axios;





=> now we will move to Register.jsx

------------------------------------------------
day-107 > Frontend > src > features > auth > pages > Register.jsx
------------------------------------------------


import React, { useState } from "react";
// React import kiya — JSX use karne ke liye zaroori
// useState import kiya — input fields ki values store karne ke liye

import "../style/form.scss";
// CSS styles import kiye form ke liye

import { Link } from "react-router";
// Link import kiya — page reload ke bina ek page se doosre pe jaane ke liye
// eg: Register se Login pe jaana

import axios from "axios";
// axios import kiya — HTTP requests karne ke liye (backend se baat karne ke liye)
// eg: POST /api/auth/register

const Register = () => {

  // =========================================================
  // STATE — input fields ki values store karne ke liye
  // =========================================================

  const [username, setUsername] = useState("");
  // username = abhi input mein jo value hai
  // setUsername = username ki value change karne ka function
  // useState("") = shuru mein khaali string

  const [email, setEmail] = useState("");
  // email field ki value

  const [password, setPassword] = useState("");
  // password field ki value


  // =========================================================
  // handleSubmit — jab user "Register" button dabaye
  // =========================================================

  async function handleSubmit(e) {

    e.preventDefault();
    // by default form submit hone pe page reload hota hai
    // e.preventDefault() se page reload ROKK dete hain

    await axios
      .post("http://localhost:3000/api/auth/register", {
        // axios se POST request bhejo backend pe
        // URL = http://localhost:3000/api/auth/register
        // yahi woh API hai jo humne backend mein banai thi!

        username,   // state se username bhejo
        email,      // state se email bhejo
        password,   // state se password bhejo
      })
      .then((res) => {
        console.log(res.data);
        // agar request successful rahi =>
        // backend ka response console mein dikhao
      });
  }


  return (
    <>
      <main>
        <div className="form-container">
          {/* form-container div — CSS ke liye */}

          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
          {/* jab form submit ho => handleSubmit function chalao */}

            <input
              onInput={(e) => setUsername(e.target.value)}
              // user jab bhi kuch type kare =>
              // e.target.value = jo type kiya woh value
              // setUsername se username state update karo
              type="text"
              name="username"
              placeholder="Enter Username"
            />

            <input
              onInput={(e) => setEmail(e.target.value)}
              // user jab bhi kuch type kare =>
              // email state update karo
              type="email"
              name="email"
              placeholder="Enter Email"
            />

            <input
              onInput={(e) => setPassword(e.target.value)}
              // user jab bhi kuch type kare =>
              // password state update karo
              type="password"
              name="password"
              placeholder="Enter Password"
            />

            <button type="submit">Register</button>
            {/* yeh button click hone pe form submit hoga
                aur handleSubmit function chalega */}

          </form>

          <p>
            Already have an account?{" "}
            <Link className="toggleAuthForm" to="/login">
              Login
            </Link>
            {/* Link => /login pe jaao bina page reload ke
                to="/login" => login page ka route */}
          </p>

        </div>
      </main>
    </>
  );
};

export default Register;
// Register component ko export karo
// taaki doosri files mein use kar sakein


================================================

after this , we might get an error in console as we have not installed cors package yet, so we need to install npm i cors in backend folder and make changes in app.js


-------------------------------
day-107 > Backend > src > app.js
-------------------------------

const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require("cors"); 


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())


// require routes
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.routes')

// using routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

module.exports = app;


================================================

coming back to Register.jsx , when we register user on backend , then register API creates a token and set's it to cookies, but now data is not set in cookies. the problem is that , if we use Axios in frontend , by default , axios don't set data, the solution to this is to pass the below object in axios request:



    async function handleSubmit(e){
        e.preventDefault()

        axios.post("http://localhost:3000/api/auth/register",{
            username,
            email,
            password,
        },{
            withCredentials:true
        })
        .then(res => {
            console.log(res.data)
        })
    }


when we make changes in axios as: withCredentials: true,
=> with the help of withCredentials:true we set the cookies on frontend

then we need to make changes in backend as well.

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

================================================

=> The overall FrontEnd and backend code looks like
------------------------------------------------
day-107 > Frontend > src > features > auth > pages > Register.jsx
------------------------------------------------
import React, { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log(res.data);
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        // ✅ error handle karo
        console.log(err.response.data.message);
        setUsername(""); // ✅ error pe bhi empty karo
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


--------------------------------
day-107 > Backend > src > app.js
--------------------------------

const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require("cors"); 


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))


// require routes
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.routes')

// using routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

module.exports = app;



================================================

=> Also , lets make changes in Login.jsx


----------------------------------------
day-107 > Frontend > src > features > auth > pages > Login.jsx
----------------------------------------
import React, { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        console.log(res.data);
        setUsername("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
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


----------------------------------------
----------------------------------------


