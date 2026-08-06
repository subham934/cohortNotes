import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);


/**
 * @route GET /api/auth/get-me
 * @desc Get current user
 * @access Private
 */

authRouter.get("/get-me", authUser, getMe);



/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email
 * @access Public
 * @query { token }
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route GET /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.get("/logout", authUser, logout);

/**
 * @route POST /api/auth/forgot-password
 * @desc Forgot Password
 * @access Public
 */
authRouter.post("/forgot-password", forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset Password
 * @access Public
 */
authRouter.post("/reset-password", resetPassword);


export default authRouter;
