const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
  const token = req.cookies.token;

  // token hum isliye nikalte hain taki hum pata kar sake ki request hume kis user ka aah raha hai

  if (!token) {
    return res.status(401).json({
      message: "Token not provided, unauthorized access.",
    });
  }

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "user not authorized",
    });
  }

  req.user = decoded;
  next();
}

module.exports = identifyUser;
