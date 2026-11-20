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
