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