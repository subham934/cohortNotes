const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authRoutes = express.Router(); // if we wish to create an api other than app.js we need to use this function express.Router()
const crypto = require("crypto");

authRoutes.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User already exists with this email address",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  const user = await userModel.create({ email, name, password:hash });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
});

authRoutes.post("/protected", (req, res) => {
  console.log(req.cookies);

  res.status(200).json({
    message: "This is protected route",
  });
});

/**
 * api/auth/login
 *
 * controller
 * the async callback function will only work when the /login api has a request, such callback are called controller
 */

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found with this mail address",
    });
  }

  const isPasswordMatched = user.password === crypto.createHash('md5').update(password).digest('hex')

  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user,
    token,
  });
});

module.exports = authRoutes;
