// here, we create the register api and export it to app.js

const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
// /api/auth/register

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  // we dont give 500 error to people, for that we we use below method to give error message

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already Exist with this email address",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign(
    {
      id: user._id, // we can use either one of the two or both
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "User Registered",
    user,
    token, // tokan is a string , combination of userdata and jwt secret, with the help of jwt.sign, our server create a token and return it back to us
  });
});

module.exports = authRouter;
