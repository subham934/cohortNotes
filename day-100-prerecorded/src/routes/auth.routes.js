const express = require('express');
const authRouter = express.Router();
const userModel = require('../models/user.model');
const crpyto = require('crypto');
const jwt = require('jsonwebtoken');

/*
POST /api/auth/register
*/

authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const isUserExists = await userModel.findOne({ email });

  if (isUserExists) {
    return res.status(409).json({
      message: 'User already exists, try different User...',
    });
  }

  const user = await userModel.create({
    name,
    password: crpyto.createHash('sha256').update(password).digest('hex'),
    email,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token);

  res.status(201).json({
    message: 'User registered Successfully',
    user,
    token,
  });
});

authRouter.get('/get-me', async (req, res) => {
  const token = req.cookies.token;
  // we know, once the user registers it receives a token, and that token can be known with req.cookies.token

  // to get the data from token we do the below method
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // console.log(decoded);
  const user = await userModel.findById(decoded.id);

  res.json({
    name: user.name,
    email: user.email,
  });
});

/*
POST /api/auth/login
*/

authRouter.post('/login', async function (req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  const hash = crpyto.createHash('sha256').update(password).digest('hex');

  const isPasswordValid = hash === user.password;

  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid Password',
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token);

  res.json({
    message: 'User logged in successfully',
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = authRouter;
