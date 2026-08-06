const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

const userRouter = express.Router();

/**
 * @route POST /api/users/follow/:userid
 * @description follow a user
 * @access Private
 */

userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
);


/**
 * @route POST /api/users/unfollow/:userid
 * @description unfollow a user
 * @access Private
 */
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
);

/**
 * @route POST /api/users/accept/:userid
 * @description accept a follow request
 * @access Private
 */

userRouter.post("/accept/:username", identifyUser, userController.acceptFollowController);

/**
 * @route POST /api/users/reject/:userid
 * @description reject a follow request
 * @access Private
 */

userRouter.post("/reject/:username", identifyUser, userController.rejectFollowController);

module.exports = userRouter;
