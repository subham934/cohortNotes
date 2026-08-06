// here, we create the register api and export it to app.js

const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
// if we wish to create api in another file apart from app.js we need to use this function express.Router()

const jwt = require("jsonwebtoken");
const crypto = require("crypto")


// /api/auth/register

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  // we dont give 500 error to people, for that we we use below method to give error message

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User Already Exist with this email address",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex")

  const user = await userModel.create({
    email,
    password:hash,    
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

/* 
 /api/auth/protected
*/ 

authRouter.post('/protected', (req, res)=>{
  console.log(req.cookies);

  res.status(200).json({
    message: 'This is protected route'
  })
})


/*
/api/auth/login

// the async callback function will only work when the /login api has a request, such callback are called controller 
*/ 

authRouter.post('/login', async (req, res)=>{
  const {email, password} = req.body;
  // here, we check that if the email and password we receive are correct or not, if so, return a new token

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(404).json({
      message: "User not found with this mail address",
    })
  }

  const isPasswordMatched = user.password === crypto.createHash('md5').update(password).digest('hex')

  if(!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid Password"
    })
  }

  const token = jwt.sign({
    id: user._id,

  },  process.env.JWT_SECRET)

   res.status(200).json({
    message: "user logged in",
    user,
    token
   })

})

module.exports = authRouter;
