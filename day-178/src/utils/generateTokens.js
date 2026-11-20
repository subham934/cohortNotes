const jwt = require('jsonwebtoken'); 

let generateAccessToken = (userId) => {
  return jwt.sign({ id: userId });
};

module.exports = { generateAccessToken };