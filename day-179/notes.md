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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>

        <p className="text-gray-500 text-center mb-6">Login to your account</p>

        <form
        onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
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
import React from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <p className="text-gray-500 text-center mb-6">Register to continue</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("name", {
                required: "Name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Create password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
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
            onClick={() => navigate('/')}
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

=> for now, running `npm run dev` just shows the styled forms on `/` and `/register`, submit doesn't actually do anything yet since it's not wired up.



here, in both Login and Register pages, we are using `useForm` from `react-hook-form` to handle form state and validation. We are also using onSubmit handlers (`handleSubmit(onSubmit)`) to process the form data when the user submits the form. we will optimize this further once we integrate the actual authentication logic using the `useAuth` hook.

now, lets actually pull this `useForm` + `useNavigate` logic out of `Login.jsx` and `Register.jsx` and into a dedicated `useAuth` hook, so both pages share the same logic instead of each one duplicating its own `useForm`/`useNavigate`/`onSubmit`.

====================
integration/src/hooks/useAuth.jsx
====================

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export let useAuth = () => {
  let navigate = useNavigate();
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    console.log("login data", data);
  };

  const onRegister = async (data) => {
    console.log("register data", data);
  };

  return {
    register,
    handleSubmit,
    errors,
    navigate,
    onLogin,
    onRegister,
  };
};


=> `useAuth` wraps `useForm`(from `react-hook-form`) and `useNavigate`(from `react-router`) in one place, and returns `register`, `handleSubmit`, `errors`, `navigate` along with two handlers - `onLogin` and `onRegister`. both handlers just `console.log` the form data for now, they'll be replaced with actual API calls(via our `axiosInstance`) once the backend auth endpoints are wired up.

=> now, `Login.jsx` and `Register.jsx` just call `useAuth()` instead of calling `useForm`/`useNavigate` directly.

====================
integration/src/pages/Login.jsx
====================

import React from 'react';
import { useAuth } from '../hooks/useAuth';
const Login = () => {
  
  let { register, handleSubmit, errors, navigate, onLogin } = useAuth();


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>

        <p className="text-gray-500 text-center mb-6">Login to your account</p>

        <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register('email', {
                required: 'Email is required',
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
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
            onClick={() => navigate('/register')}
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

import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  let { register, handleSubmit, errors, navigate, onRegister } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <p className="text-gray-500 text-center mb-6">Register to continue</p>

        <form
          onSubmit={handleSubmit(onRegister)}
          className="flex flex-col gap-5"
        >
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("name", {
                required: "Name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Create password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
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
            onClick={() => navigate('/')}
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


=> so now both pages just call `useAuth()` once to get everything they need, instead of each page having its own `useForm`/`useNavigate` + its own `onSubmit` function. `Login.jsx` uses `onLogin` and `Register.jsx` uses `onRegister` from the same shared hook. submitting either form still just logs the data to console for now(`login data {...}` / `register data {...}`) - actual backend integration(calling `/register` and `/login` APIs via `axiosInstance`) is still pending.

now, lets actually wire up `onLogin` and `onRegister` inside `useAuth` to hit our real backend APIs, instead of just console.logging the form data.

====================
integration/src/hooks/useAuth.jsx
====================

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/axiosInstance";

export let useAuth = () => {
  let navigate = useNavigate();
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    try {
        let res = await axiosInstance.post("/api/auth/login", data)
        console.log("login response", res);
    } catch (error) {
        console.log("error in login", error)
    }
  };

  const onRegister = async (data) => {
    try {
        let res = await axiosInstance.post("/api/auth/register", data)
        console.log("register response", res);
    } catch (error) {
        console.log("error in register", error)
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    navigate,
    onLogin,
    onRegister,
  };
};


=> `onLogin` now posts to `/api/auth/login` and `onRegister` posts to `/api/auth/register`(both via `axiosInstance`), wrapped in try/catch so a failed request doesn't crash the app. both still just `console.log` the response/error for now - the "redirect on success"/"show error message" part is still pending.

=> since these endpoints live on our own backend(not fakestoreapi anymore), i also updated `axiosInstance`'s `baseURL` to point to our backend running locally.

====================
integration/src/config/axiosInstance.jsx
====================

import axios from 'axios';

export let axiosInstance = axios.create({
  baseURL: 'https://localhost:3000',
});


=> our backend here is a separate node/express app(the `arTokens` folder) that exposes `/api/auth/register`, `/api/auth/login` etc. it listens on port `3000`(set via `.env` -> `PORT=3000`), connects to mongo via `connectDB()`, and is started with `node server.js`.

=> bug: as soon as i tried registering from `localhost:5173/register`, i got this error in the console:

POST https://localhost:3000/api/auth/register net::ERR_SSL_PROTOCOL_ERROR

=> turns out, our backend is a plain express app - `app.listen(port, ...)` starts a regular **http** server, there's no https/TLS certificate configured anywhere in `server.js`/`app.js`. but `axiosInstance`'s `baseURL` was set to `https://localhost:3000`(notice the `https`). so the browser was trying to do a TLS handshake against a server that only speaks plain http on that port - hence `ERR_SSL_PROTOCOL_ERROR`.

=> fix: changed the scheme from `https` to `http` in `axiosInstance.jsx`.

====================
integration/src/config/axiosInstance.jsx
====================

import axios from 'axios';

export let axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});


=> after this fix, hitting register from the UI correctly reaches our backend at `http://localhost:3000/api/auth/register` instead of failing with the SSL error.


=> now, we will register a user and login that user, we want that when we logIn, we move to home page, for that we will implement protected routes.

to start with, i created a `protected` folder inside `routes` with two wrapper components - `Public` and `Protected`. for now these are just dumb wrappers(just render `<Outlet/>`), the actual auth-check logic(redirecting based on whether user is logged in or not) will be added to these later.

====================
integration/src/routes/protected/Public.jsx
====================

import React from 'react'
import { Outlet } from 'react-router'

const Public = () => {
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Public


====================
integration/src/routes/protected/Protected.jsx
====================

import React from 'react'
import { Outlet } from 'react-router'

const Protected = () => {
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Protected


=> now, lets wrap our existing routes with these - `AuthLayout`(Login/Register) goes under `Public`, and `MainLayout`(Home) goes under `Protected`.

====================
integration/src/routes/AppRoutes.jsx
====================

import React from 'react';
import Home from '../pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Public from './protected/Public';
import Protected from './protected/Protected';

const AppRoutes = () => {
  let router = createBrowserRouter([
    // Define your routes here
    {
      path: '/',
      element: <Public />,
      children: [
        {
          path: '',
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
      ],
    },
    {
      path: '/home',
      element: <Protected />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <Home />,
            },
          ],
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


=> so now there's one extra level of nesting - `/` route renders `Public`, which renders `AuthLayout` in its `<Outlet/>`, which in turn renders `Login`/`Register` in its own `<Outlet/>`. similarly `/home` renders `Protected` -> `MainLayout` -> `Home`. right now `Public`/`Protected` don't actually do anything extra(no redirect logic yet), they're just there as the place we'll plug that logic into - next step is to check inside `Protected` if the user is logged in(has a valid token) and redirect to `/` if not, and inside `Public` check if user is already logged in and redirect to `/home` if so(so a logged-in user can't see the login/register page again).


=> when we loggin , we get a user, we need to save that user so when a user is logged in , he wont visit the login page. He must be redirected to the `/home` page instead.

to actually know "is a user logged in or not" across the whole app(inside `Public`/`Protected`, and anywhere else later), we need some kind of global state - prop-drilling the logged in user down through `AppRoutes` -> `Public`/`Protected` -> pages would get messy fast. so for this we bring in `redux`(via `@reduxjs/toolkit`, which was already installed earlier).

first, lets create a redux "slice" for auth.

====================
integration/src/state/authReducer.jsx
====================

import { createSlice } from "@reduxjs/toolkit";

export let authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    removeUser: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

export let { addUser, removeUser } = authSlice.actions;


=> `createSlice`(from `@reduxjs/toolkit`) bundles a slice of state + its reducers + auto-generated action creators all in one place, instead of writing action types/action creators/reducer functions separately like old-school redux.

- `name: "auth"` -> just an identifier for this slice(used internally, eg to prefix action types like `auth/addUser`, and shows up in redux devtools).
- `initialState` -> the starting shape of this slice - `user: null`(nobody logged in yet) and `isLoading: false`(reserved for later, eg to show a spinner while a login/register request is in flight).
- `reducers` -> each key here(`addUser`, `removeUser`) becomes both a reducer case AND an auto-generated action creator of the same name. under the hood, `createSlice` uses `immer`, so even though we write `state.user = action.payload`(which looks like direct mutation), it doesn't actually mutate the real state - immer tracks these "mutations" on a draft object and produces a brand new immutable state from it. that's why we get to write simple, mutation-looking reducers instead of manually spreading `{ ...state, user: action.payload }` everywhere.
- `addUser(state, action)` -> sets `state.user` to whatever gets passed in(`action.payload`), and flips `isLoading` back to `false`.
- `removeUser(state)` -> clears `state.user` back to `null`(this is what we'll call on logout).
- `authSlice.actions` -> `createSlice` auto-generates the `addUser`/`removeUser` action creator functions based on the keys inside `reducers` - we destructure and export them so we can do `dispatch(addUser(someUser))` from anywhere in the app.

now, lets create the actual redux store and plug this slice into it.

====================
integration/src/app/store.jsx
====================

import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../state/authReducer';
export let store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authSlice.reducer,
  },
});


=> `configureStore`(also from `@reduxjs/toolkit`) creates the actual redux store. the `reducer` object passed in defines the shape of our whole global state tree - right now we only have one slice, `auth: authSlice.reducer`, so our global state looks like `{ auth: { user: null, isLoading: false } }`. if we add more slices later(eg for products/cart), each one would just become another top-level key here, becoming its own branch of the state tree.

now we need to make this `store` available to the entire react tree, so any component can read from it/dispatch to it, without passing it down manually as props. for that, we wrap our whole app with redux's `<Provider>` inside `main.jsx`.

====================
integration/src/main.jsx
====================

import { createRoot } from 'react-dom/client';
import './index.css';
import AppRoutes from './routes/AppRoutes.jsx';
import { Provider } from 'react-redux';
import { store } from './app/store.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);


=> `<Provider store={store}>` uses react's context api under the hood to make `store` available to every component in the tree below it. this is exactly what lets us use the `useSelector`/`useDispatch` hooks anywhere inside `AppRoutes` and its children, without threading the store through props.

now, lets actually use this store - first, inside `useAuth.jsx`, we dispatch the logged-in user into the store right after a successful login.

====================
integration/src/hooks/useAuth.jsx
====================

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/axiosInstance";
import { useDispatch } from "react-redux";
import { addUser } from "../state/authReducer";
export let useAuth = () => {
  let navigate = useNavigate();
    let dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    // console.log("login data", data);
    try {
        let res = await axiosInstance.post("/api/auth/login", data)
        console.log("login response", res);
        dispatch(addUser(res.data.user));
    } catch (error) {
        console.log("error in login", error)
    }
  };

  const onRegister = async (data) => {
    // console.log("register data", data);
    try {
        let res = await axiosInstance.post("/api/auth/register", data)
        console.log("register response", res);
    } catch (error) {
        console.log("error in register", error)
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    navigate,
    onLogin,
    onRegister,
  };
};


=> `useDispatch()` gives us the store's `dispatch` function - calling `dispatch(someAction)` is how we actually update the redux state(it sends the action to the reducer, the reducer computes the new state, and any component subscribed to that bit of state via `useSelector` automatically re-renders with the new value). here, once `POST /api/auth/login` succeeds, we assume the backend responds with the logged-in user at `res.data.user`, and `dispatch(addUser(res.data.user))` runs our `addUser` reducer, setting `state.auth.user` to this user object. note: `onRegister` doesn't dispatch anything yet - after registering we probably still want the user to log in separately(or we could auto-login them here too, later).

finally, lets use this stored `user` inside our `Protected` and `Public` route wrappers, to actually redirect based on login status instead of just rendering `<Outlet/>` unconditionally.

====================
integration/src/routes/protected/Protected.jsx
====================

import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const Protected = () => {
  let { user } = useSelector((store) => store.auth);

  if (!user) return <Navigate to={'/'} />;
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Protected;


====================
integration/src/routes/protected/Public.jsx
====================

import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'

const Public = () => {

    let {user} = useSelector((store) => store.auth);
    if (user) return <Navigate to={'/home'} />;
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Public


=> `useSelector((store) => store.auth)` reads the `auth` slice out of the whole redux state tree(remember, our store shape is `{ auth: { user, isLoading } }`) - this hook also subscribes the component to that slice, so whenever `state.auth` changes(eg right after `dispatch(addUser(...))` runs), these components automatically re-render with the fresh value.

- in `Protected` -> if there's `no user`, nobody's logged in, so instead of the normal `<Outlet/>` we render `<Navigate to={'/'} />` - `Navigate` is a react-router component that, as soon as it's rendered, triggers a client-side redirect to the given path(no full page reload). so anyone trying to hit `/home` without being logged in gets bounced back to `/`(the login page). if there IS a `user`, we fall through to the normal `<Outlet/>`, letting `MainLayout`/`Home` render as usual.
- in `Public` -> it's the mirror image check - if there IS a `user`(already logged in), we redirect them to `/home` instead of letting them see the login/register page again. if there's no `user`, we render `<Outlet/>` as usual, letting `AuthLayout` -> `Login`/`Register` render.

=> so the full picture now: `useAuth`'s `onLogin` logs the user in via the backend and `dispatch`es that user into redux -> `Public`/`Protected` both read that same `user` back out of the store via `useSelector` and redirect accordingly. so once `onLogin` succeeds, on the next render `Public`(wrapping `/`) sees `user` is now set and auto-redirects to `/home`, while `Protected`(wrapping `/home`) now lets us through since `user` exists.

note to self: `Public.jsx` renders `<Navigate to={'/home'} />` but only imports `{ Outlet }` from `'react-router'` - `Navigate` itself isn't imported there, so this'll throw a `Navigate is not defined` error the moment a logged-in user hits `/`. need to fix the import to `import { Navigate, Outlet } from 'react-router';`(same as `Protected.jsx`) for this to actually work.

=> and sure enough, as soon as i logged in, i hit exactly that:

## Unexpected Application Error!
### Navigate is not defined
ReferenceError: Navigate is not defined
    at Public (.../src/routes/protected/Public.jsx:10:43)

=> fix: added `Navigate` to the import in `Public.jsx`.

====================
integration/src/routes/protected/Public.jsx
====================

import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

const Public = () => {

    let {user} = useSelector((store) => store.auth);
    if (user) return <Navigate to={'/home'} />;
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Public


=> now `Navigate` resolves correctly, so logging in -> `dispatch(addUser(...))` -> `Public` re-renders, sees `user` is set, and redirects to `/home` without throwing.


=> Now, when we reload the home page, we go back to login page again, which shouldn't happen, so, we need to hydrate the user from local storage or some persistent storage on app initialization, ensuring that the `user` state in redux is correctly set even after a page reload.

=> we need to hydrate the user from backend

=> why this happens: redux state lives only in memory - the moment we refresh the page, the whole react app(and the redux store along with it) gets thrown away and recreated from scratch, so `state.auth.user` goes back to `null`, even though we're still actually logged in(the backend still has our `accessToken`/`refreshToken` cookies). so `Protected` sees `user` is `null` and redirects us back to `/`. to fix this, on every app load we need to ask the backend "hey, who am i logged in as right now?" using whatever cookie the browser already has, and re-populate redux from that answer before the route guards make their decision.

=> our backend already has a `/me` route for exactly this(inside `arTokens`):

====================
arTokens/src/routes/auth.routes.js
====================

router.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'currently loggedIn user',
    user: req.user,
  });
});


=> this route is guarded by `authMiddleware` - lets look at what that does:

====================
arTokens/src/middleware/auth.middleware.js
====================

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


=> step by step, this middleware runs BEFORE the actual `/me` route handler(that's what "middleware" means here - express runs it first, and it decides whether to call `next()`(continue to the route handler) or send its own response and stop there):

1. `req.cookies.accessToken` -> reads the `accessToken` cookie off the incoming request(this is only possible because `app.js` uses `cookieParser()`, and because our frontend's `axiosInstance` sends requests with `withCredentials: true`, which makes the browser actually attach cookies on cross-origin requests between `localhost:5173` and `localhost:3000`).
2. if there's no `accessToken` cookie at all(eg user never logged in, or it already expired - remember it's only valid for 10 minutes), middleware immediately responds and stops here - nothing further runs.
3. if there IS a token, `jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)` decodes and verifies it was actually signed by our server(using the secret) and hasn't been tampered with. if this fails(invalid signature/expired token), `jwt.verify` either returns falsy or throws - either way we don't let the request through.
4. if the token's valid, `decode` contains whatever we originally signed into it(the user's `id`), so we look that user up for real in the db via `UserModel.findById(decode.id)` - this also handles the edge case where the token is valid but the user was deleted since.
5. if we find the user, we attach it to `req.user` and call `next()` - this is how the actual route handler(`(req, res) => { ... user: req.user }`) gets access to "who's calling this request" without re-verifying the token itself.

=> now, lets add the "ask /me on every app load" logic to our frontend, inside `AppRoutes.jsx`(since that's the top-level component that's always mounted once, no matter which route we're on).

====================
integration/src/routes/AppRoutes.jsx
====================

import React, { useEffect } from 'react';
import Home from '../pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Public from './protected/Public';
import Protected from './protected/Protected';
import { axiosInstance } from '../config/axiosInstance';
import { useDispatch } from 'react-redux';
import { addUser } from '../state/authReducer';

const AppRoutes = () => {

  const dispatch = useDispatch();

    useEffect(() => {
    (async () => {
      try {
        let res = await axiosInstance.get("/api/auth/me");
        dispatch(addUser(res.data.user));
      } catch (error) {
        console.log("error in me api", error);
      }
    })();
  }, []);

  let router = createBrowserRouter([
    // ...same route config as before...
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default AppRoutes;


=> breaking this down:
- `useEffect(() => { ... }, [])` with an empty dependency array runs exactly once, right after `AppRoutes` first mounts - ie right when the app first loads/refreshes, before the user does anything.
- inside it, we define an `async` arrow function and immediately call it(`(async () => { ... })()`) - this is the usual pattern to use `await` inside `useEffect`, since the effect callback itself isn't allowed to be `async` directly.
- `axiosInstance.get("/api/auth/me")` -> because `axiosInstance` has `withCredentials: true`, this request automatically carries along whatever `accessToken`/`refreshToken` cookies the browser already has for `localhost:3000`, without us doing anything extra.
- if that succeeds(meaning `authMiddleware` on the backend found a valid cookie + a real user), `res.data.user` is the currently logged in user, and `dispatch(addUser(res.data.user))` puts that user back into redux - exactly as if we'd just logged in, just without actually re-entering email/password. this is what "hydrating" the user means here.
- if it fails(401, no cookie, expired token, etc), we just `console.log` it and move on - `state.auth.user` stays `null`, so `Protected` correctly keeps us on the login page, which is the right behavior when we're genuinely not logged in.

=> bug #1 - wrong status code: while testing this, every time i reloaded the page(without being logged in, or after my access token expired), the console showed:

GET http://localhost:3000/api/auth/me 404 (Not Found)

=> this looked like a routing problem at first, but the route was registered correctly - the real issue was inside `authMiddleware` itself: the very first check(`if (!accessToken)`) was returning `res.status(404)`, while every other failure case in the exact same function(invalid token, user not found) correctly used `res.status(401)`. `404` means "this route doesn't exist", but the route absolutely does exist - we just don't have a valid token, which is a `401 Unauthorized` situation. fix: changed that one line from `res.status(404)` to `res.status(401)`, matching the rest of the function.

=> bug #2 - missing import: separately, `AppRoutes.jsx` called `dispatch(addUser(res.data.user))` but never imported `addUser` from `../state/authReducer`. since this call only runs inside the `try` block, when it threw `ReferenceError: addUser is not defined`, it got silently swallowed by the `catch` block and logged as just another "error in me api" - so it looked like `/me` was failing, when actually the request itself could have succeeded(or was failing anyway because of bug #1) and this would've silently broken the hydration regardless. fix: added `import { addUser } from '../state/authReducer';` at the top of `AppRoutes.jsx`.

=> with both fixes in place, the full flow on a page reload now works like this: `AppRoutes` mounts -> fires `GET /api/auth/me` with cookies attached -> `authMiddleware` reads+verifies the `accessToken` cookie and looks up the user -> route handler responds with `{ user }` -> frontend `dispatch(addUser(user))` -> redux's `state.auth.user` gets set -> `Protected`(wrapping `/home`) sees a `user` exists and lets us through instead of bouncing us back to `/`. if we're genuinely logged out(no/expired cookie), `/me` correctly responds `401`, we skip the dispatch, `user` stays `null`, and `Protected` correctly redirects us to `/` as before.

====================
CHANGES MADE - Day 179
====================

## Change #1: Set `isLoading` to true in authReducer initialState

**File:** integration/src/state/authReducer.jsx

```javascript
export let authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,  // Changed from false to true
  },
  // ...
});
```

**Why:** The app needs to show "Loading..." while checking for an existing session on page load. The initial state should be `isLoading: true` because when the app first mounts, it hasn't yet checked if the user is logged in. Only after the `/api/auth/me` request completes should it set `isLoading: false` via the `addUser` reducer. This prevents a flash of the login page before the session check completes.

---

## Change #2: Add `removeUser` reducer case

**File:** integration/src/state/authReducer.jsx

```javascript
removeUser: (state) => {
  state.user = null;
  state.isLoading = false;
},
```

**Why:** This reducer is needed to handle the case when the `/api/auth/me` request fails (401 Unauthorized - no valid token). When an error occurs in AppRoutes, we dispatch `removeUser()` which sets `isLoading: false`, allowing the page to render instead of staying stuck on "Loading...". This tells Redux "we checked for a session and there isn't one", so render the login page.

---

## Change #3: Import both `addUser` and `removeUser` in AppRoutes

**File:** integration/src/routes/AppRoutes.jsx

```javascript
import { addUser, removeUser } from '../state/authReducer';
```

**Why:** Previously only `addUser` was imported, but now we also need `removeUser` for the error handler. Without importing both, the code would throw `ReferenceError: removeUser is not defined` when the error handler tried to call it.

---

## Change #4: Dispatch `removeUser()` in the catch block of AppRoutes

**File:** integration/src/routes/AppRoutes.jsx

```javascript
useEffect(() => {
  (async () => {
    try {
      let res = await axiosInstance.get('/api/auth/me');
      dispatch(addUser(res.data.user));
    } catch (error) {
      dispatch(removeUser());  // NEW: Handle error case
      console.log('error in me api', error);
    }
  })();
}, []);
```

**Why:** When the `/api/auth/me` request fails (e.g., user is not logged in, token expired, or server error), we need to explicitly set `isLoading: false` so the app stops showing "Loading..." and renders the login page. Without this dispatch, `isLoading` would remain `true` forever and the user would see an infinite loading state. The error catch is the most likely path for logged-out users since they have no valid `accessToken` cookie.

---

## Summary of the Flow

1. App mounts -> `AppRoutes` component renders
2. `useEffect` with empty dependency runs once -> `isLoading: true` from initial state
3. `GET /api/auth/me` request fires with cookies attached
4. **Case A (logged in):** Server responds with user data -> `dispatch(addUser(user))` -> `isLoading: false` -> `Protected` sees `user` exists and renders `/home`
5. **Case B (logged out):** Server responds 401 -> catch block -> `dispatch(removeUser())` -> `isLoading: false` -> `Protected` sees `user` is null and redirects to login page
6. The "Loading..." message is shown by `Public` and `Protected` components when `isLoading: true`




=> ok , as of now, i've refresh token in my cookies and i need to generate access token, till i have refresh token.

in the /home page , i've a protected route , which is updated with redux, redux is updated with /me , /me 's job is find accessToken, and if it doesn't find one, it will give 401. before this 401 is shown in UI , we need to call getaccessToken API

====================
LATEST AUTH CHANGES IN THE FRONTEND
====================

the notes above describe the plan to use the refresh token when `/api/auth/me` receives a 401. the current frontend code now has a response interceptor in `integration/src/config/axiosInstance.jsx` to implement that flow. the current auth state is managed by `integration/src/state/authReducer.jsx`.

====================
integration/src/config/axiosInstance.jsx
====================

```javascript
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalReq = error.config;

    if (error.response.status === 401 || originalReq.retry) {
      originalReq.retry = true;
      try {
        await axiosInstance.get('/api/auth/get-accessToken');
        return axiosInstance(originalReq);
      } catch (error) {
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
  }
);
```

=> `interceptors.response.use` has two callbacks:

- the first callback handles successful responses and returns the response unchanged, so existing calls can still read `res.data`, status codes, and other Axios response fields.
- the second callback handles failed responses. It gets the original request configuration from `error.config`. When the request receives a 401, it asks the backend for a new access token through `/api/auth/get-accessToken`.
- `withCredentials: true` is set on the shared Axios client, so the browser can send the refresh-token cookie with that request when the backend's cookie and CORS settings allow it.
- if token generation succeeds, `axiosInstance(originalReq)` sends the failed request again. For example, an expired access token on `/api/auth/me` can be renewed before the `/me` request is retried.
- if refreshing the token fails, the code redirects the browser to `/` and rejects the refresh error. The caller can then treat the request as failed rather than receiving a successful response.

note: the current condition is `error.response.status === 401 || originalReq.retry`. Because it uses `||`, any failed retry can enter the refresh branch again, including a retry that itself returns 401. This can cause repeated refresh-and-retry requests. A network failure can also have no `error.response`, so reading `.status` may throw; and the interceptor currently does not explicitly reject non-401 HTTP errors. These are limitations of the current implementation.

====================
integration/src/state/authReducer.jsx
====================

the current slice still tracks two values:

```javascript
initialState: {
  user: null,
  isLoading: false,
},
reducers: {
  addUser: (state, action) => {
    state.user = action.payload;
    state.isLoading = false;
  },
  removeUser: (state) => {
    state.user = null;
    state.isLoading = false;
  },
},
```

=> `addUser` stores the user returned by login or `/api/auth/me`; `removeUser` clears the user when the session check fails. Both reducers set `isLoading` to `false` to indicate that the authentication check has finished.

important update: the earlier **CHANGES MADE - Day 179** section says the initial `isLoading` value was changed to `true`, but the current source file has it set to `false`. With this current initial value, `Public` and `Protected` do not wait for the startup `/api/auth/me` request: they may render or redirect while the request is still in progress. To get the loading behavior described earlier, the initial value would need to be `true`; then `addUser` or `removeUser` changes it to `false` when `/me` finishes.

=> in short, the access-token refresh step is now wired into the shared Axios response handling, while Redux remains responsible for keeping the authenticated user and loading status available to the route guards. The interceptor handles renewing and retrying an API request; the reducers handle updating the frontend's logged-in user state after the request succeeds or the session check fails.
