express
dotenv
singleton Auth--> MVC

Global Error Middleware
Async Handler
Token - JWT



Authentication: There are mainly two types of auth(tokens)
1. Singleton token: A single token is used for authentication throughout the application.
2. multiple tokens: Different tokens are used for different sessions or users, providing more granular control over authentication.(access tokens and refresh tokens)

attacks like XSS and CSRF can compromise authentication tokens if proper security measures are not implemented. These attacks happens on cookies, apis, compromised frontend applications, and can lead to unauthorized access if tokens are stolen.

1. Access tokens: These tokens are used to access protected resources and have a limited lifespan. It last of an hour or 5 hrs.
2. Refresh tokens: These tokens are used to obtain new access tokens without requiring the user to re-authenticate. They usually have a longer lifespan compared to access tokens, often lasting days or weeks.

even now, if our tokens get compromised, we can mitigate the impact by implementing token revocation mechanisms and using short-lived access tokens along with refresh tokens. This way, the compromised access token will expire quickly, and the attacker won't be able to use it for long.

Refresh Token VS Access Token

1. Access Token:
   - Short-lived token used to access protected resources.
   - Typically expires within an hour or a few hours.
   - If compromised, the impact is limited due to its short lifespan.
   - used for all protected routes and requests.
   - Typically stored in memory or local storage on the client side.

2. Refresh Token:
   - Long-lived token used to obtain new access tokens.
   - Typically expires in days or weeks.
   - If compromised, it can be used to generate new access tokens until revoked.
   - only used for obtaining new access tokens.
   - save in DB & cookies for secure storage.


go to folder and run `npm init -y`

install necessary packages and any other required dependencies using `npm install express dotenv jsonwebtoken cookie-parser bcrypt cors mongoose`.

====================
day-178/src/app.js
====================

let express = require("express");


let app = express();
app.use(express.json());


module.exports = app;


create a .env file and put the port number.

============
day-178/.env
============

PORT=3000

=================
day-178/server.js
=================

let app = require("./src/app");
require("dotenv").config();


let port = process.env.PORT || 4000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


Now, we will create db.js inside the src/config folder to handle the database connection.

====================
day-178/src/config/db.js
====================

const { default: mongoose } = require("mongoose");

let connectDB = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0/test-artokens");
    console.log("Mongodb connected");
  } catch (error) {
    console.log("error in connecting db", error);
  }
};

module.exports = connectDB;

=> now, we need to import and use the connectDB function in our server.js file to establish the database connection before starting the server.

====================
day-178/server.js
====================

let app = require("./src/app");
let connectDB = require("./src/config/db");
require("dotenv").config();

connectDB();

let port = process.env.PORT || 4000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

=> now, when we start the server using `npx nodemon`, it will first establish a connection to the database and then start listening on the specified port.

`Server is running on port 3000
Mongodb connected`



Now, lets create a model for our users. 


====================
day-178/src/models/user.model.js
====================

const { default: mongoose } = require('mongoose');

let userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

let UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;


=> Now, we will create routes for our user model. 

====================
day-178/src/routes/auth.routes.js
====================

let express = require('express');
let router = express.Router();

module.exports = router;


=> we will import the user routes in our app.js file and use them with a specific route prefix.

====================
day-178/src/app.js
====================

let express = require("express");
let authRoutes = require('./routes/auth.routes');


let app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;



now, for the routes, we will need to create controllers that handle the logic for each route. These controllers will be placed inside the `src/controllers` folder.


====================
day-178/src/controllers/auth.controller.js
====================

let registerController = async (req, res) => {
 
};

let loginController = async (req, res) => {

};

module.exports = { registerController, loginController };



=> now , we will import the controllers in our `auth.routes.js` file and use them for the respective routes.

====================
day-178/src/routes/auth.routes.js
====================

let express = require('express');
let router = express.Router();
const {
  registerController,
  loginController,
} = require('../controllers/auth.controller');
router.post('/register', registerController);
router.post('/login', loginController);
module.exports = router;


=> next, lets write the logic for our register and login controllers in `auth.controller.js`. We will use the `UserModel` to interact with the database and handle user registration and login.

we will also need tokens for authentication, which we will generate using the `generateAccessToken` and `generateRefreshToken` utility functions. but atfirst , we will generate tokens inside the .env file and then use them in our utility functions.


============
day-178/.env
============

JWT_ACCESS_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here


lets create utils folder and inside it, we will create a file named `generateTokens.js` where we will define our `generateAccessToken` and `generateRefreshToken` functions.

====================
day-178/src/utils/generateTokens.js
====================

const jwt = require('jsonwebtoken'); 

let generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
};

let generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
};

module.exports = { generateAccessToken, generateRefreshToken };


=> now, we will create a service file named `auth.service.js` inside the `src/services` folder where we will define the logic for user registration and token generation.

====================================
day-178/src/services/auth.service.js
====================================

const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateTokens');

let registerService = async (data) => {
  try {
    // Registration logic here
    let { name, email, password } = data;

    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Check if user already exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (isExisted) {
      return res.status(409).json({
        message: 'User already exists with this email',
      });
    }

    // Hash the password before storing it in the database
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    // now, we will create token

    let accessToken = generateAccessToken(newUser._id);
    let refreshToken = generateRefreshToken(newUser._id);

    return { newUser, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { registerService };



now, we will put all the logic inside the `auth.controller.js` file where we will define the controllers for user registration and login.


==========================================
day-178/src/controllers/auth.controller.js
==========================================


const { registerService } = require('../services/auth.service.js');

let registerController = async (req, res) => {
 let result = await registerService(req.body);
 let { newUser, accessToken, refreshToken } = result;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({
    message: 'User registered successfully',
    accessToken,
    refreshToken,
    user: newUser
  });

};

let loginController = async (req, res) => {
  try {
    // Login logic here
    res.send('User logged in');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { registerController, loginController };


Now, we will create service for login :::

====================================
day-178/src/services/auth.service.js
====================================

const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateTokens');

let registerService = async (data) => {
  try {
    // this is destructuring the data object to get name, email, and password
    let { name, email, password } = data;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Check if user already exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (isExisted) {
      return res.status(409).json({
        message: 'User already exists with this email',
      });
    }

    // Hash the password before storing it in the database
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    // now, we will create token

    let accessToken = generateAccessToken(newUser._id);
    let refreshToken = generateRefreshToken(newUser._id);

    return { newUser, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};



let loginService = async (data) => {
  try {
    // this is destructuring the data object to get email, and password
    let { email, password } = data;

    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Check if user not exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (!isExisted) {
      return res.status(404).json({
        message: 'User not found with this email',
      });
    }

    // Check if the provided password matches the stored hashed password
    let hashPass = bcrypt.compareSync(password, isExisted.password);
    if (!hashPass) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    // now, we will create token

    let accessToken = generateAccessToken(isExisted._id);
    let refreshToken = generateRefreshToken(isExisted._id);

    return { isExisted, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { registerService, loginService };



now that the service is done, we will need to implement the login service on the controller 

===========================================
day-178/src/controllers/auth.controller.js
===========================================

const { registerService, loginService } = require('../services/auth.service.js');

let registerController = async (req, res) => {
  let result = await registerService(req.body);
  let { newUser, accessToken, refreshToken } = result;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({
    message: 'User registered successfully',
    accessToken,
    refreshToken,
    user: newUser,
  });
};

let loginController = async (req, res) => {
  try {
    let result = await loginService(req.body);
    let { isExisted, accessToken, refreshToken } = result;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
      user: isExisted,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { registerController, loginController };

with the help of cookie-parser, we are able to set cookies for accessToken and refreshToken in the user's browser. This allows us to manage authentication tokens securely and conveniently. we will use it inside app.js

==================
day-178/src/app.js
==================

let express = require('express');
let cookieParser = require('cookie-parser');
let authRoutes = require('./routes/auth.routes');

let app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

module.exports = app;



now, we will do the testing, for that we will use postman.

we will create a POST request to the endpoint `http://localhost:3000/api/auth/register` with the user's name, email and password in the request body.
{
  "name": "Darwin",
  "email": "darwin@email.com",
  "password": "darwin123"
}
we will get the response as such::


{
    "message": "User registered successfully",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiMDA3M2UyMzNjNmIwNzJhYzZiYzNjOSIsImlhdCI6MTc5NTE5MTc3OCwiZXhwIjoxNzk1MTkyMzc4fQ.ogV7lOCFG3hDbK9D5Emn4ze8aM7Z4Lot6XVfbVMy5sM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiMDA3M2UyMzNjNmIwNzJhYzZiYzNjOSIsImlhdCI6MTc5NTE5MTc3OCwiZXhwIjoxNzk1Mjc4MTc4fQ.CqKHE7FCVML28Cv3jikeEWoE6Y2WUjxY5aHex4GHP_E",
    "user": {
        "name": "Darwin",
        "email": "darwin@email.com",
        "password": "$2b$10$pP0gy2aHE9BC8eLUIK8jBuNlLz9yeGWec4TQCh6.HONFrIOXXKB2C",
        "_id": "6b0073e233c6b072ac6bc3c9",
        "createdAt": "2026-11-20T16:22:58.239Z",
        "updatedAt": "2026-11-20T16:22:58.239Z",
        "__v": 0
    }
}


now,we will create a middleware to protect our home route by verifying the access token. This middleware will check if the access token is present in the cookies, verify it, and then attach the user information to the request object. If the token is invalid or missing, it will return an unauthorized response.

=========================================
day-178/src/middleware/auth.middleware.js 
=========================================

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

let authMiddleware = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }


    let decode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (!decode) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    let user = await UserModel.findById(decode.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }
    req.user = user;
    
    // Here you would normally verify the token
    next();
  } catch (error) {
    // res.status(401).json({ message: 'Invalid access token' });
    throw new Error(error)
    
  }
};

module.exports = authMiddleware;

