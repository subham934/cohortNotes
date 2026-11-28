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
    if ( !name|| !email || !password) {
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
