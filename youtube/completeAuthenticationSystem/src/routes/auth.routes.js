import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';




const authRouter = Router();




/**
 * POST /api/auth/register
 * desc : register new user
 * access : public
 */

authRouter.post("/register",authController.register)


/**
 * GET /api/auth/get-me
 * desc: protected route
 * access: private
 */

authRouter.get("/get-me",authController.getMe)


export default authRouter;