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
  await redis.set(token, Date.now().toString(), "EX", 60 * 60 );


  

  return res.status(200).json({
    message: "User logged out successfully"
  })

}

module.exports = { registerUser, loginUser, getMe , logoutUser };


