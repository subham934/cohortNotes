import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const authRouter = Router();

/**
 * POST /api/auth/register
 * desc : register new user
 * access : public
 */

authRouter.post('/register', authController.register);

/**
 * GET /api/auth/get-me
 * desc: protected route
 * access: private
 */

authRouter.get('/get-me', authController.getMe);

/**
 * GET /api/auth/refresh-token
 * desc: with the help of this , client could request on api/auth/refresh to generate a new token
 * access: private
 */

authRouter.get('/refresh-token', authController.refreshToken);

export default authRouter;
