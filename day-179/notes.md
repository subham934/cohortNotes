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
day-178/arTokens/src/app.js
====================

let express = require("express");


let app = express();
app.use(express.json());


module.exports = app;


create a .env file and put the port number.

============
day-178/arTokens/.env
============

PORT=3000

=================
day-178/arTokens/server.js
=================

let app = require("./src/app");
require("dotenv").config();


let port = process.env.PORT || 4000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


Now, we will create db.js inside the src/config folder to handle the database connection.

====================
day-178/arTokens/src/config/db.js
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
day-178/arTokens/server.js
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
day-178/arTokens/src/models/user.model.js
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
day-178/arTokens/src/routes/auth.routes.js
====================

let express = require('express');
let router = express.Router();

module.exports = router;


=> we will import the user routes in our app.js file and use them with a specific route prefix.

====================
day-178/arTokens/src/app.js
====================

let express = require("express");
let authRoutes = require('./routes/auth.routes');


let app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;



now, for the routes, we will need to create controllers that handle the logic for each route. These controllers will be placed inside the `src/controllers` folder.


====================
day-178/arTokens/src/controllers/auth.controller.js
====================

let registerController = async (req, res) => {
 
};

let loginController = async (req, res) => {

};

module.exports = { registerController, loginController };



=> now , we will import the controllers in our `auth.routes.js` file and use them for the respective routes.

====================
day-178/arTokens/src/routes/auth.routes.js
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
day-178/arTokens/.env
============

JWT_ACCESS_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here


lets create utils folder and inside it, we will create a file named `generateTokens.js` where we will define our `generateAccessToken` and `generateRefreshToken` functions.

====================
day-178/arTokens/src/utils/generateTokens.js
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
day-178/arTokens/src/services/auth.service.js
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
day-178/arTokens/src/controllers/auth.controller.js
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
day-178/arTokens/src/services/auth.service.js
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
      throw new Error('All fields are required');
    }

    // Check if user already exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (isExisted) {
      throw new Error('User already exists with this email');
    }

    // Hash the password before storing it in the database
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    // now, we will create token

    let accessToken = generateAccessToken(newUser._id);
    let refreshToken = generateRefreshToken(newUser._id);


    newUser.refreshToken = refreshToken;
    await newUser.save();


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
      throw new Error('All fields are required');
    }

    // Check if user not exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (!isExisted) {
      // return res.status(404).json({
      //   message: 'User not found with this email',
      // });
      throw new Error('User not found with this email');
    }

    // Check if the provided password matches the stored hashed password
    let hashPass = bcrypt.compareSync(password, isExisted.password);
    if (!hashPass) {
      throw new Error('Invalid password');
    }

    // now, we will create token

    let accessToken = generateAccessToken(isExisted._id);
    let refreshToken = generateRefreshToken(isExisted._id);

    
    isExisted.refreshToken = refreshToken;
    await isExisted.save();



    return { isExisted, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { registerService, loginService };



now that the service is done, we will need to implement the login service on the controller 

===========================================
day-178/arTokens/src/controllers/auth.controller.js
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
      user: isExisted,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { registerController, loginController };

with the help of cookie-parser, we are able to set cookies for accessToken and refreshToken in the user's browser. This allows us to manage authentication tokens securely and conveniently. we will use it inside app.js

==================
day-178/arTokens/src/app.js
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


we can also login by creating a POST request to the endpoint `http://localhost:3000/api/auth/login` with the user's email and password in the request body.
{
  "email": "darwin@email.com",
  "password": "darwin123"
}
we will get the response as such:
{
    "message": "User logged in successfully",
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

=> now, we can register or login, and we will able to the access and refresh tokens in cookies.

now,we need a protected route for which we will create a middleware to protect our home route by verifying the access token. This middleware will check if the access token is present in the cookies, verify it, and then attach the user information to the request object. If the token is invalid or missing, it will return an unauthorized response.

=========================================
day-178/arTokens/src/middleware/auth.middleware.js 
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

=> now we need protected routes, so we will create a home route

================================
day-178/arTokens/src/routes/home.route.js
================================

const express = require("express");
const router = express.Router();

router.get("/",  (req, res) => {
  return res.status(200).json({ message: "Home fetched"});
});

module.exports = router;

=> now, we need to link this to our app.js

================================
day-178/arTokens/src/app.js
================================

let express = require('express');
let cookieParser = require('cookie-parser');
let authRoutes = require('./routes/auth.routes');
let homeRoutes = require('./routes/home.routes'); 

let app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

module.exports = app;


=> Now, we will create a GET request on URL http://localhost:3000/api/home in postman to test our protected route. Because we have loggedIn before, we already have the access token in our cookies, so we should be able to see:

{
    "message": "Home fetched"
}


=> Now, we will add the authMiddleware to the home route to make it a protected route. This will ensure that only authenticated users with a valid access token can access the home route. we will remove the accessToken from cookies and try to access the home route again, which should now return an unauthorized request error.


================================
day-178/arTokens/src/routes/home.route.js
================================

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Home fetched"});
});

module.exports = router;


=> now, we login again and access the home route with the valid access token in our cookies, which should allow us to successfully fetch the home route message.

{
    "message": "Home fetched"
}



=> till now, we have done register and login flow with access token and refresh token , then a middleware to protect routes using the access token, now if the access token expires, we will need to regenerate it . now, we will create the regenerate API where it will lead to regeneration of access token using the refresh token. 

=> to create the regenerate API, we need to save the refresh token in the database when the user logs in or registers. This will allow us to verify the refresh token and generate a new access token when needed. for that we will now save the refresh token in the database when we register or login.


================================
day-178/arTokens/src/services/auth.service.js
================================


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
      throw new Error('All fields are required');
    }

    // Check if user already exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (isExisted) {
      throw new Error('User already exists with this email');
    }

    // Hash the password before storing it in the database
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    // now, we will create token

    let accessToken = generateAccessToken(newUser._id);
    let refreshToken = generateRefreshToken(newUser._id);

    // with this below lines of code, we are saving the refresh token in the database for the newly created user
    newUser.refreshToken = refreshToken;
    await newUser.save();


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
      throw new Error('All fields are required');
    }

    // Check if user not exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (!isExisted) {
      // return res.status(404).json({
      //   message: 'User not found with this email',
      // });
      throw new Error('User not found with this email');
    }

    // Check if the provided password matches the stored hashed password
    let hashPass = bcrypt.compareSync(password, isExisted.password);
    if (!hashPass) {
      throw new Error('Invalid password');
    }

    // now, we will create token

    let accessToken = generateAccessToken(isExisted._id);
    let refreshToken = generateRefreshToken(isExisted._id);

    // with this below lines of code, we are saving the refresh token in the database for the existing user
    isExisted.refreshToken = refreshToken;
    await isExisted.save();



    return { isExisted, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};



module.exports = { registerService, loginService };




=>now that we have saved the refresh token in the database during registration and login, so , when we login or register, we will have the refresh token available in the database, we can create a service to regenerate the access token using the refresh token.


step-1: at first, we take refresh token from cookies.
step-2: we decode the refresh token to extract the user id.
step-3: we find the user in the database using the extracted user id.we verify if the refresh token exists in the database for the extracted user id.
step-4: if the refresh token is valid, we generate a new access token using the user id.
step-5: return the new access token to the client cookies.

we put all these steps into a service function called `getAccessTokenService` in our `auth.service.js` file. This service takes the refresh token, verifies it, checks it against the database, and generates a new access token if valid.


====================================
day-178/arTokens/src/services/auth.service.js
====================================

const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
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
      throw new Error('All fields are required');
    }

    // Check if user already exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (isExisted) {
      throw new Error('User already exists with this email');
    }

    // Hash the password before storing it in the database
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    // now, we will create token

    let accessToken = generateAccessToken(newUser._id);
    let refreshToken = generateRefreshToken(newUser._id);

    // with this below lines of code, we are saving the refresh token in the database for the newly created user
    newUser.refreshToken = refreshToken;
    await newUser.save();

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
      throw new Error('All fields are required');
    }

    // Check if user not exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (!isExisted) {
      // return res.status(404).json({
      //   message: 'User not found with this email',
      // });
      throw new Error('User not found with this email');
    }

    // Check if the provided password matches the stored hashed password
    let hashPass = bcrypt.compareSync(password, isExisted.password);
    if (!hashPass) {
      throw new Error('Invalid password');
    }

    // now, we will create token

    let accessToken = generateAccessToken(isExisted._id);
    let refreshToken = generateRefreshToken(isExisted._id);

    // with this below lines of code, we are saving the refresh token in the database for the existing user
    isExisted.refreshToken = refreshToken;
    await isExisted.save();

    return { isExisted, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};

let getAccessTokenService = async (refreshToken) => {
  let decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  if (!decode) {
    throw new Error('Unauthorized');
  }

  let user = await UserModel.findById(decode.id);

  if (refreshToken !== user.refreshToken) {
    throw new Error('Unauthorized');
  }

  let accessToken = generateAccessToken(user._id);
  return accessToken;
};

module.exports = { registerService, loginService, getAccessTokenService };


we will use the getAccessTokenService to generate a new access token using the refresh token stored in the user's cookies.lets make some changes in auth.controller.js to handle this properly.

==========================================
day-178/arTokens/src/controllers/auth.controller.js
==========================================

const { registerService, loginService, getAccessTokenService } = require('../services/auth.service.js');

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
      user: isExisted,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

let getAccessTokenController = async (req, res) => {
  try {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    let accessToken = await getAccessTokenService(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    return res.status(200).json({ message: 'Access token generated successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = { registerController, loginController, getAccessTokenController };

now, import this in your auth.routes.js file and add a route for it.

==========================
day-178/arTokens/src/routes/auth.routes.js
==========================

let express = require('express');
let router = express.Router();
const {
  registerController,
  loginController,
  getAccessTokenController,
} = require('../controllers/auth.controller');


router.get("/get-accessToken", getAccessTokenController);

router.post('/register', registerController);
router.post('/login', loginController);

module.exports = router;




=> Now, when i login , i can see the accessToken and refreshToken in cookies. now, when we do the GET request on GET http://localhost:3000/api/home, we will see the response as ::
{
    "message": "Home fetched"
}

=> now, when we delete the access token and  do the GET request on GET http://localhost:3000/api/home, we get::
{
    "message": "Unauthorized request"
}

=> we will call the regeration API, for that we make a GET request to GET http://localhost:3000/api/auth/get-accessToken. If the refresh token is valid, a new access token will be generated and set in the cookies. we will get the response as ::
{
    "message": "Access token generated successfully"
}


=> Till i have refresh token valid, I can keep generating new access tokens using the regeneration API.

Finally, i'll implement cors on app.js to allow cross-origin requests.

===========================
day-178/arTokens/src/app.js
===========================

let express = require('express');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let authRoutes = require('./routes/auth.routes');
let homeRoutes = require('./routes/home.routes');

let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://localhost:5173', 
        credentials: true
    }
));

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

module.exports = app;



just like `arTokens` we will add one more folder called  `integration` and we will run `npm create vite@latest .`

now, we will go into App.jsx and start writing codes::

=======================
integration/src/App.jsx
=======================

import React from 'react'
import axios from "axios"
const App = () => {

  let getData = async () => {
    try {
      let res = await axios.get('https://fakestoreapi.com/products');
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
  getData()

  return (
    <div>
      <h1>Hello, Integration App!</h1>
    </div>
  )
}

export default App

so, what is instance in axios?
An instance in axios is a custom configuration of axios that allows you to set default properties like baseURL, headers, and other settings for all requests made using that instance. This is useful when you have multiple APIs or need to reuse the same configuration across different parts of your application.

Example:
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

// Now you can use `api` instead of `axios` for requests
api.get("/home").then(res => console.log(res));


========================================
integration/src/config/axiosInstance.jsx
========================================

import axios from "axios";


export let axiosInstance = axios.create({
  baseURL: "https://fakestoreapi.com",
});



=======================
integration/src/App.jsx
=======================

import React from 'react'
import { axiosInstance } from "./config/axiosInstance";
const App = () => {

  let getData = async () => {
    try {
      let res = await axiosInstance.get('/products');
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
  getData()

  return (
    <div>
      <h1>Hello, Integration App!</h1>
    </div>
  )
}

export default App


now, we will use interceptors, what are interceptors in axios?
Interceptors in axios are functions that are called before a request is sent or before a response is handled. They allow you to modify requests or responses globally, such as adding authentication tokens, logging, or handling errors consistently.

Example:
import { axiosInstance } from "./config/axiosInstance";

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Modify request config if needed
    console.log("Request sent:", config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log("Response received:", response);
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);




========================================
integration/src/config/axiosInstance.jsx
========================================

import axios from 'axios';

export let axiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('Request sent:', config);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios instance response:', response);
    return response;
  },
  (error) => {
    console.error('Axios instance error:', error);
  }
);



//==================================================
## DAY-179
//==================================================

till now, we have registered, logIn, getaccessToken and auth middleware

there are basically two types of interceptors in axios: request interceptors and response interceptors.

- Request interceptors are called before a request is sent. They allow you to modify the request configuration, such as adding authentication headers or logging request details.
- Response interceptors are called after a response is received. They allow you to handle responses globally, such as logging, error handling, or transforming response data.

Our API are saved in server, we call this API to either save data or fetch data from the server. Interceptors help us manage these requests and responses efficiently by allowing us to add common logic, such as authentication or error handling, in one place rather than repeating it in every API call.

Feature Based Architecture: It is 4 layers architecture where the application is divided into different features, and each feature contains its own components, services, and state management. This helps in organizing the code better, making it more maintainable and scalabl

To start our project i need to install these::

npm i react-router react-redux @reduxjs/toolkit tailwindcss @tailwindcss/vite

=> after installing tailwind, we need to register its vite plugin inside `vite.config.js` and import it in our css file.

====================
integration/vite.config.js
====================

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})

====================
integration/src/index.css
====================

@import "tailwindcss";


now, as we are following feature based / layered architecture, we will create 3 new folders inside `src` -> `layouts`, `pages` and `routes`.

- `layouts` -> will hold our common layouts like AuthLayout(for login/register) and MainLayout(for the actual app after login).
- `pages` -> will hold our individual pages like Login, Register etc.
- `routes` -> will hold our route config file(AppRoutes.jsx) where we define all our routes using react-router.

lets first create our layouts.

====================
integration/src/layouts/AuthLayout.jsx
====================

import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;


====================
integration/src/layouts/MainLayout.jsx
====================

import React from 'react'
import { Outlet } from 'react-router'
const MainLayout = () => {
  return (
    <div>
        <div>Navbar</div>
        <Outlet/>
    </div>
  )
}

export default MainLayout


=> what is Outlet here? Outlet is a placeholder component given by react-router, it renders whichever child route matches the current path. so basically AuthLayout and MainLayout act as wrappers here, and whatever page matches the url gets rendered in place of `<Outlet/>`.

now, lets create our pages, for now these are just dummy pages, we will build the actual ui/logic on top of these later.

====================
integration/src/pages/Login.jsx
====================

import React from 'react'

const Login = () => {
  return (
    <div>Login</div>
  )
}

export default Login


====================
integration/src/pages/Register.jsx
====================

import React from 'react'

const Register = () => {
  return (
    <div>Register</div>
  )
}

export default Register


=> now, lets write our route config inside `routes/AppRoutes.jsx`. here, we will use `createBrowserRouter` to define our routes and `RouterProvider` to provide this router to our app.

====================
integration/src/routes/AppRoutes.jsx
====================

import React from 'react';
import Home from '../Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
  let router = createBrowserRouter([
    // Define your routes here
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: '',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
      ],
    },
    {
      path: '/home',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default AppRoutes;


=> so here, `/` route uses `AuthLayout` and renders `Login` on its index path and `Register` on `/register`. similarly, `/home` route uses `MainLayout` and renders `Home` on its index path.

this is nested routing in react-router -> parent route renders the layout, and whichever child route matches, renders inside the `<Outlet/>` of that layout.

=> finally, we need to tell react to render `AppRoutes` instead of our old `App` component, so we update `main.jsx`.

====================
integration/src/main.jsx
====================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
    <AppRoutes />
)


note: `App.jsx` is still there inside src with our old axios test code(fetching products from fakestoreapi using axiosInstance), but its not being rendered anymore since `main.jsx` now renders `AppRoutes` directly. keeping it around for now just for reference/testing the axios instance + interceptors.

=> now, when i run `npm run dev` and go to `http://localhost:5173/`, i see the Login page(since `/` -> AuthLayout -> index route -> Login). going to `http://localhost:5173/register` shows the Register page, and `http://localhost:5173/home` shows the Home page with "Navbar" above it(coming from MainLayout).

now, lets build the actual UI for Login and Register pages, since till now they were just dummy pages with plain text.

to handle form state/validation easily, i installed `react-hook-form`:

npm i react-hook-form

=> i also moved `Home.jsx` from directly inside `src/` into `src/pages/`, so that all pages live together in one place. this means the import inside `routes/AppRoutes.jsx` also had to change from `../Home` to `../pages/Home`.

====================
integration/src/routes/AppRoutes.jsx
====================

import Home from '../pages/Home';


=> now, lets style up `Login.jsx` and `Register.jsx` using tailwind classes, and add actual form markup(inputs for email/password/name, submit button, link to switch between login/register).

====================
integration/src/pages/Login.jsx
====================

import React from "react";
import { useNavigate } from "react-router";
const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>

        <p className="text-gray-500 text-center mb-6">Login to your account</p>

        <form
          className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don&apos;t have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-black font-semibold cursor-pointer"
          >
            &nbsp; Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;


====================
integration/src/pages/Register.jsx
====================

import React from "react";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <p className="text-gray-500 text-center mb-6">Register to continue</p>

        <form
          className="flex flex-col gap-5"
        >
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Create password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?
          <span
            onClick={() => navigate("/")}
            className="text-black font-semibold cursor-pointer"
          >
            &nbsp; Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;


=> so both pages now have a proper tailwind styled card with inputs and a submit button. `useNavigate` is used so clicking "Register"/"Login" text at the bottom switches between the two pages without a full reload(`navigate("/register")` from Login, `navigate("/")` from Register).

=> in the actual files, the `useAuth` hook and `useForm`'s `register`, `handleSubmit`, `errors` are kept commented out for now(left out of the snippets above for clarity) - that's because the `useAuth` hook (which will hold the actual register/login logic, calling our backend APIs) hasn't been built yet. once that hook is ready, i'll uncomment these lines to wire up `handleSubmit(onLogin)`/`handleSubmit(onRegister)`, spread `register(...)` onto each input, and show validation `errors` below each field.

=> for now, running `npm run dev` just shows the styled forms on `/` and `/register`, submit doesn't actually do anything yet since it's not wired up.