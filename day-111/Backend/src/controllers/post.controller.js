const postModel = require("../models/post.model");
const Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");

const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  // console.log(req.body, req.file);

  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-instagram",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created Successfully",
    post,
  });
}

async function getPostController(req, res) {
  // this token helps us find out token from that perticular user, it help us figure out that the request came from that perticular user

  const userId = req.user.id;

  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Posts fetched successfully.",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  // to check if postId is created by that perticular user

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  return res.status(200).json({
    message: "Post fetched successfully.",
    post,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  const isAlreadyLiked = await likeModel.findOne({
    user: username,
    post: postId,
  });

  if (isAlreadyLiked) {
    return res.status(409).json({
      message: "Post already liked.",
    });
  }

  const like = await likeModel.create({
    post: postId,
    user: username,
  });

  res.status(201).json({
    message: "Post liked successfully.",
    like,
  });
}

async function unlikePostController(req, res){
   const username = req.user.username;
  const postId = req.params.postId;

  // this is to check if the current user has liked a post
  const isLiked = await likeModel.findOne({
    user: username,
    post: postId,
  });

  if(!isLiked){
    return res.status(400).json({
      message: "You have not liked this post."
    })
  }

  await likeModel.findOneAndDelete({
    _id: isLiked._id
  })

  return res.status(200).json({
    message: "post unliked successfully"
  })
}

async function getFeedController(req, res) {
  
  const user = req.user;
  
  const posts = await Promise.all((await postModel.find().populate("user").lean()).map(
    async (post) => {
    
      const isLiked = await likeModel.findOne({
        user: user.username,
        post: post._id,
      })
      post.isLiked = Boolean(isLiked);
      return post;
    },
  ));

  // postModel.find() will return all the post we have created.
  
  res.status(200).json({
    message: "Post fetched successfully.",
    posts,
  });
} 

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getFeedController,
  unlikePostController
};
