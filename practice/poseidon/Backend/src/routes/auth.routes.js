const express = require("express");
const authRoutes = express.Router();
const authController = require('../controllers/auth.controller')



// ========================================================
// POST  api/auth/register
// ========================================================
authRoutes.post("/register", authController.registerController);



// ========================================================
// POST  api/auth/login
// ========================================================

authRoutes.post("/login", authController.loginController);

// ========================================================

// authRoutes.get("/get-me", async (req, res) => {
//   const token = req.cookies.jwt_token;

//   if (!token) {
//     return res.status(401).json({
//       message: "Unauthorized",
//     });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   const user = await userModel.findById(decoded.id);

//   res.status(200).json({
//     user,
//   });
// });

// ========================================================

module.exports = authRoutes;
