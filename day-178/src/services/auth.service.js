const UserModel = require('../models/user.model');
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
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Check if user already exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (isExisted) {
      return res.status(409).json({
        message: 'User already exists with this email',
      });
    }

    // Hash the password before storing it in the database
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    // now, we will create token

    let accessToken = generateAccessToken(newUser._id);
    let refreshToken = generateRefreshToken(newUser._id);

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
      return res.status(400).send('All fields are required');
    }

    // Check if user not exists with the given email
    let isExisted = await UserModel.findOne({ email });
    if (!isExisted) {
      return res.status(404).json({
        message: 'User not found with this email',
      });
    }

    // Check if the provided password matches the stored hashed password
    let hashPass = bcrypt.compareSync(password, isExisted.password);
    if (!hashPass) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    // now, we will create token

    let accessToken = generateAccessToken(isExisted._id);
    let refreshToken = generateRefreshToken(isExisted._id);

    return { isExisted, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { registerService, loginService };
