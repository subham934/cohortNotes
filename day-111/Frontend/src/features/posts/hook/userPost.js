// This is a hook layer
import {
  getFeed,
  createPost,
  likePost,
  unlikePost,
} from "../services/post.api.js";
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context.jsx";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setLoading, feed, setFeed, post, setPost } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    const data = await getFeed();
    setFeed(data.posts.reverse());
    setLoading(false);
  };

  // this below function is for creating a post
  const handleCreatePost = async (imageFile, caption) => {
    const data = await createPost(imageFile, caption);
    setFeed((prevFeed) => [data.post, ...prevFeed]);
  };
  // const handleLike = async (post) => {
  //   const data = await likePost(post);
  //   await handleGetFeed();
  // };

  // const handleUnlike = async function (post) {
  //   const data = await unlikePost(post);
  //   await handleGetFeed();
  // };

  const handleLike = async (postId) => {
    await likePost(postId);

    setFeed((prevFeed) =>
      prevFeed.map((post) =>
        post._id === postId ? { ...post, isLiked: true } : post,
      ),
    );
  };

const handleUnlike = async (postId) => {
  await unlikePost(postId);

  setFeed((prevFeed) =>
    prevFeed.map((post) =>
      post._id === postId ? { ...post, isLiked: false } : post
    )
  );
};

  useEffect(() => {
    handleGetFeed();
  }, []);

  return {
    loading,
    feed,
    post,
    handleGetFeed,
    handleCreatePost,
    handleLike,
    handleUnlike,
  };
};
