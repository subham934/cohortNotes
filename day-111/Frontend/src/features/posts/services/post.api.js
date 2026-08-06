// =============== API LAYER ===============

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getFeed() {
  const response = await api.get("/api/posts/feed");
  return response.data;
}

export async function createPost(imageFile, caption) {
  const formData = new FormData();

  formData.append("imgUrl", imageFile);

  // the name "imgUrl" came from post.routes.js

  //   postRouter.post(
  //   "/",
  //   upload.single("imgUrl"),
  //   identifyUser,
  //   postController.createPostController,
  // );

  formData.append("caption", caption);

  // the name "caption" came from post.controller.js
  // const post = await postModel.create({
  //   caption: req.body.caption,
  //   imgUrl: file.url,
  //   user: req.user.id,
  // });


  const response = await api.post("/api/posts", formData);

  return response.data;
}


export async function likePost(postId){
  const response = await api.post('/api/posts/like/' + postId)
  return response.data
}

export async function unlikePost(postId){
  const response = await api.post(`/api/posts/unlike/${postId}`)
  return response.data
}