// const express = require('express');
// const router = express.Router();

const { Router } = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

// jab tak koi valid token na ho, tab tak authcontroller.getMe k pass request nahi jayega.

router.get("/get-me", authMiddleware.authUser, authController.getMe);

router.get("/logout", authController.logoutUser);

module.exports = router;
