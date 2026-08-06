yesterday, we have understood token blacklisting in verbal manner. Today, we will implement it in code.


=> we have implemented the register and login functionality in the previous days. We have used JWT for authentication. Now, we will implement token blacklisting to ensure that when a user logs out, their token is invalidated.

=> we will implement token blacklisting using mongoDB. We will create a collection called "blacklistedTokens" where we will store the tokens that have been blacklisted.


=> now we will create a get-me route that will return the details of the logged-in user. This route will be protected and will require a valid token to access. If the token is blacklisted, the user will not be able to access this route.


=> we need to create a middleware that will check who the user is. 


----------------------------------------
Backend > src > middlewares > auth.middleware.js
----------------------------------------

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  // jab tak user login nahi karta, tab tak uske paas token nahi hoga
  // token ko hum cookie se nikalenge
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  // abb token mil bhi jaye, toh usko verify karna padega ki kya ye token humne sign kiya tha, ya kisi aur ne sign kiya hai

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
    
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {authUser}; 



=> Now we will create a getMe controller so that we can get the details of the logged-in user.

----------------------------------------
Backend > src > controller > auth.controller.js
----------------------------------------

const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "Username or email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function loginUser(req, res) {
  const { email, password, username } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


async function getMe(req, res) {
  
  const user = await userModel.findById(req.user.id);
 
  return res.status(200).json({
    message: "User fetched successfully",
    user
  });
}

module.exports = { registerUser, loginUser, getMe };




//=======================================
=>we will export the getMe controller so that we can use it in the get-me route.


---------------------------------------
Backend > src > routes > auth.routes.js
---------------------------------------

// const express = require('express');
// const router = express.Router();

const {Router} = require('express');
const authController = require('../controller/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware")

const router = Router();


router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);


// jab tak koi valid token na ho, tab tak authcontroller.getMe k pass request nahi jayega.


router.get('/get-me',authMiddleware.authUser, authController.getMe);



module.exports = router;



//=======================================
=> Now that we are getting the data of the user, there is one big problem, we are getting password which we dont want. there are two ways to solve this problem,

1. In the controller while getting the data of the user, we can remove the password from the response. we are telling database to not return the password.


----------------------------------------
Backend > src > controller > auth.controller.js
----------------------------------------


async function getMe(req, res) {
  
  const user = await userModel.findById(req.user.id).select("-password");
 
  return res.status(200).json({
    message: "User fetched successfully",
    user
  });
}

=================== OR =================


2. WE can go to userSchema and remove the password from the response. so , by default when we read the data of the user, the password will not be read.

--------------------------------------
Backend > src > models > user.model.js
--------------------------------------

const mongoose = require('mongoose');   

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username must be unique']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // this will tell the database to not return the password
    }
});

// TASK
// userSchema.pre('save', function(next){})
// userSchema.post('save', function(next){})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
 

=> now in the login controller, we need to read the password from the database. for that we write as below::


--------------------------------------
Backend > src > controller > auth.controller.js
--------------------------------------

async function loginUser(req, res) {
  const { email, password, username } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  }).select("+password"); // this tells the user that we want to read the password from the database

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}



//=======================================
=> Now , we will implement /logout api so that when a user logs out, their token is invalidated.

at first we need to create a logout controller and a logout route.


---------------------------------------
Backend > src > controller > auth.controller.js
---------------------------------------

async function logoutUser(req, res){
  const token = req.cookies.token;

  // we have the token and we need to clear the token from the cookies.

  res.clearCookie("token");

  // now, even though we have removed the token from client side, still someone can use that token, for that we need to use blacklisting
  // at first we create a model called blacklist.model.js

}

-------------------------------------------
Backend > src > models > blacklist.model.js
-------------------------------------------

const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required for blacklisting"],
      unique: [true, "Token must be unique"],
    },
  },
  {
    timestamps: true,
  },
);


const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;



=========================

=> Now that the blacklist model is created, we need to create a logout controller and a logout route.

=> at first we import model in logout controller 


---------------------------------
Backend > src > controller > auth.controller.js
---------------------------------

const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");


async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "Username or email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function loginUser(req, res) {
  const { email, password, username } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


async function getMe(req, res) {
  
  const user = await userModel.findById(req.user.id);
 
  return res.status(200).json({
    message: "User fetched successfully",
    user
  });
}

async function logoutUser(req, res){
  const token = req.cookies.token;

  // we have the token and we need to clear the token from the cookies.

  res.clearCookie("token");

  // now, even though we have removed the token from client side, still someone can use that token, for that we need to use blacklisting
  // at first we create a model called blacklist.model.js


// we store the token in the blacklist model
  await blacklistModel.create({
    token
  })

  return res.status(200).json({
    message: "User logged out successfully"
  })

}

module.exports = { registerUser, loginUser, getMe , logoutUser };



---------------------------------------
Backend > src > routes > auth.routes.js
---------------------------------------


// const express = require('express');
// const router = express.Router();

const {Router} = require('express');
const authController = require('../controller/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware")

const router = Router();


router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);


// jab tak koi valid token na ho, tab tak authcontroller.getMe k pass request nahi jayega.


router.get('/get-me',authMiddleware.authUser, authController.getMe);

router.get('/logout', authController.logoutUser);

module.exports = router;



//=======================================

=> now , there is a major issue, once we login we generate a token , this token can be picked by hackers and they can have accesss to our application. so in the middleware, we need to check if the token is balacklisted or not.



---------------------------------
Backend > src > middlewares > auth.middleware.js
---------------------------------


const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  // jab tak user login nahi karta, tab tak uske paas token nahi hoga
  // token ko hum cookie se nikalenge
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const isTokenBlacklisted = await blacklistModel.findOne({ token });
  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  try {
    // abb token mil bhi jaye, toh usko verify karna padega ki kya ye token humne sign kiya tha, ya kisi aur ne sign kiya hai
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = { authUser };




//=======================================

=> token blacklisting is not done in mongodb, it is done in redis.
here, we just create a collection 


//=======================================
//=======================================
//=======================================
//=======================================
//=======================================
//=======================================
//=======================================
//=======================================
