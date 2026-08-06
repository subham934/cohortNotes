const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/posts [protected-only valid user can create post]rs
 * req.body - {caption, image-file }
 */

/**
 * /api/posts/
 */

postRouter.post("/",upload.single("imgUrl"), postController.createPostController);

module.exports = postRouter;
