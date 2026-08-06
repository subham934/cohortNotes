Today, we will learn redis in detail.

Redis is a key-value store, which is used to store data in memory.
It is a non-relational database, which is used to store data in memory.


in the middleware auth.middleware.js, what "authUser" function does is simple, it extract a token from cookies, and then identify the user based on that token.
Then it will attach the user object to the request object. 


lets say there are 4 apis:
/api/post/like/:postId
/api/post/save/:postId
/api/post/comment/:postId
/api/story/comment/:storyId


=> in the above apis, we will use the middleware authUser from auth.middleware.js, to identify the user. so  authUser is used in multiple api and the code inside authUser is also executed multiple times. 

=> to see if the token is blacklisted or not , the server will send request to redis



host : redis-17157.c305.ap-south-1-1.ec2.cloud.redislabs.com
port: 17157
password: xrHTSV9bmc4jK64RqgMdeiifnisenbGF


we will connect the server to redis::
=> we will connect the server to redis using ioredis package.

npm i ioredis

create a new file called cache.js, and inside the cache.js file, we will write the code to connect the server to redis.

---------------------------------
Backend > src > config > cache.js
---------------------------------


const Redis = require('ioredis').default;

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

redis.on('connect', () => {
    console.log("server is connected to redis")
})

redis.on('error', (err) => {
    console.log(err)
})

module.exports = redis;


=> now we will require it inside middleware file auth.middleware.js

-----------------------------------------------
Backend > src > middleware > auth.middleware.js
-----------------------------------------------


const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require('../config/cache')


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


=> now when we run the server , we can see the message "server is connected to redis" in the terminal. our server is connected to redis and also database.


=> we have connected the server to redis, now we will implement the token blacklisting in redis.

-----------------------------------------------
Backend > src > controller > auth.controller.js
-----------------------------------------------


const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require('../config/cache')

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
  // await blacklistModel.create({
  //   token
  // })
 

  // when the user logged out , we store the token inside the blacklistModel which is stored in mongodb , but now we will use redis :
  await redis.set(token, Date.now().toString());
  

  

  return res.status(200).json({
    message: "User logged out successfully"
  })

}

module.exports = { registerUser, loginUser, getMe , logoutUser };



//==============================================

=> previously , we used to check if our token is blacklisted or not , we used to check in middleware in blacklistModel, but now we will use redis, which is a key-value store, which is used to store data in memory.




-----------------------------------------------
Backend > src > middleware > auth.middleware.js
-----------------------------------------------
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require('../config/cache')


async function authUser(req, res, next) {
  // jab tak user login nahi karta, tab tak uske paas token nahi hoga
  // token ko hum cookie se nikalenge
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  // const isTokenBlacklisted = await blacklistModel.findOne({ token });

  const isTokenBlacklisted = await redis.get(token);

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