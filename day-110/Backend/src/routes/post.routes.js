const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middlewares/auth.middleware");

/**
 * POST /api/posts [protected-only valid user can create post]rs
 * req.body - {caption, image-file }
 */

/**
 * /api/posts/
 */

postRouter.post(
  "/",
  upload.single("imgUrl"),
  identifyUser,
  postController.createPostController,
);

/**
 *  GET /api/posts [protected-only valid user can access]
 *
 * here, we will the post created by the perticular user
 */

postRouter.get("/", identifyUser, postController.getPostController);

/**
 * GET /api/posts/details/:postid
 * return a detail aobut specific post with the id. also check whether the post belong to the user that is requesting
 */

postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);


/**
 * @route POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params.
 * @access Private
 */
postRouter.post(
  "/like/:postId",
  identifyUser,
  postController.likePostController,
);


/**
 * @route GET /api/posts/feed
 * @description get all the post created in DB
 * @access Private
 */

postRouter.get("/feed", identifyUser, postController.getFeedController);

module.exports = postRouter;