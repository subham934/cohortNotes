const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * POST /api/auth/register
 */
authRouter.post("/register", async (req, res) => {
  
  const { name, email, password } = req.body;

  const isUserExists = await userModel.findOne({ email });
  
  if (isUserExists) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password: crypto.createHash("md5").update(password).digest("hex"), // this line convert password to hex value
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("token", token);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    token,
  });
});

authRouter.get('/get-me', async(req, res)=>{
    const token = req.cookies.token;


    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await userModel.findById(decoded.id)
    
    res.status(200)
    .json({
        success: true,
        message: "User details",
        name: user.name,
        email: user.email
    })
    
})

authRouter.post("/login", async(req, res)=>{
    const {email, password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const isPasswordValid = hash === user.password

    if(!isPasswordValid){
        return res.status(401).json({
            success: false,
            message: "Invalid Password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {expiresIn: "1h"})

    res.cookie("token", token)

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user:{
            name: user.name,
            email: user.email
        }
    })

})

module.exports = authRouter;
