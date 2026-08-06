Today , we will be completing the integration of Insta clone , yesterday we have integrated the "feed" feature, where we could check if the user has liked a post, today, we will enhance that feature and user can create a post from frontend.


1. Create a post from frontend
- We will create a form in the frontend where user can input the post details and submit it


=> First, lets create a route for creating a post in the frontend, we will create a new page called "CreatePost" and add a route for it in the app.routes.jsx file.

-------------------------------
Frontend > src > app.routes.jsx
-------------------------------

import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/posts/pages/Feed";
import CreatePost from "./features/posts/pages/CreatePost";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element:<Feed />,
    },
    {
        path: "/create-post",
        element:<CreatePost />,
    }
]);


=> we will create a new component called Nav for the navigation bar, where we will add a link to the "/create-post" page.

-------------------------------
Frontend > src > features > shared > components > Nav.jsx
-------------------------------
import React from "react";
import "../nav.scss";
import { useNavigate } from "react-router";
const Nav = () => {
  const navigate = useNavigate();
  
  
  return (
    <nav className="nav-bar">
      <p>Insta</p>
      <button
        onClick={() => {
          navigate("/create-post");
        }}
        className="button primary-button"
      >
        New Post
      </button>
    </nav>
  );
};

export default Nav;



--------------------------------------------------
Frontend > src > features > shared > nav.scss
--------------------------------------------------
.nav-bar{
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: .5rem 1rem;

    p{
        font-size: 1.5rem;
        font-weight: 600;
    }
}

=> we will need to put the <Nav/> on <Feed/> page so that we can navigate to the create post page from the feed page.


-----------------------------------
Frontend > src > features > posts > pages > Feed.jsx
-----------------------------------

import React, { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/userPost";
import Nav from "../../shared/components/Nav";
const Feed = () => {

    const { feed, loading, handleGetFeed} = usePost();

    useEffect(() => {
        handleGetFeed()
    },[])

    if(loading || !feed) {
        return <h1>Loading...</h1>
    }
    
  return (
    <main className="feed-page">
      <Nav/>
      <div className="feed">
        <div className="posts">
          {
            feed.map(post => {
                return <Post user={post.user} post={post} />
            })
          }
        </div>
      </div>
    </main>
  );
};

export default Feed;



=> so, when we click on the "New Post" button, it will navigate to the "/create-post" page where we will create a form for creating a post.

=> Now, we will create a new page called "CreatePost" where we will create a form for creating a post.

-------------------------------
Frontend > src > features > posts > pages > CreatePost.jsx
-------------------------------


import React from 'react'
import "../style/createpost.scss"
const CreatePost = () => {
  return (
    <div>
        <main className="create-post-">
            <div className="form-container">
                <h1>Create Post</h1>
                <form>
                    <label className='post-image-label' htmlFor="postImage">Select Image</label>
                    <input type="file" id="postImage" hidden name="postImage" id="postImage" />
                    {/* we can hide the input:file part, as we have used label, as both are connected with #postImage and because of that , it will do the same thing */}
                    <input type="text" placeholder='Enter Caption' name="caption" id="caption" />
                    <button className='button primary-button'>
                        Create Post
                    </button>

                </form>
            </div>
        </main>
    </div>
  )
}

export default CreatePost


-------------------------------------------
Frondend > src > features > posts > style > createpost.scss
-------------------------------------------


.post-image-label{
     background-color: #eaeaea;
    color: rgb(25,25,25);
    padding-inline: 1rem;
    padding-block: .5rem;
    border-radius: 1rem;
    cursor: pointer;
    font-size: 22px;
    font-weight: 600;

}

=> Now we will have to do the two way binding, but if the input type is file, then we will have to handle it differently, we will have to use useState and useRef to handle the file, and send data with FormData to the backend, we will see how to do that in the next step.

//==========================================

// This is UI Layer of the application, here we are creating a form for creating a post, we have an input of type file for selecting the image and an input of type text for entering the caption, and a button for submitting the form.
-------------------------------
Frontend > src > features > posts > pages > CreatePost.jsx
-------------------------------


import React, { useRef, useState } from "react";
import "../style/createpost.scss";
const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageInputFieldRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();

    // now, from the postImageInputFieldRef, we can access the value of the input:file , here we have accessed the first file
    const file = postImageInputFieldRef.current.files[0];


    
  }

  return (
    <div>
      <main className="create-post-">
        <div className="form-container">
          <h1>Create Post</h1>
          <form onSubmit={handleSubmit}>
            <label className="post-image-label" htmlFor="postImage">
              Select Image
            </label>

            <input
              ref={postImageInputFieldRef}
              type="file"
              id="postImage"
              hidden
              name="postImage"
              id="postImage"
            />

            {/* we can hide the input:file part, as we have used label, as both are connected with #postImage and because of that , it will do the same thing */}

            {/* we have given reference to the input:file part as ref={postImageInputFieldRef}, so that we can access its value */}

            {/* we can have select multiple files in the input:file, only we need to provide the html attribute like "multiple" jsut like "hidden" */}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              type="text"
              placeholder="Enter Caption"
              name="caption"
              id="caption"
            />

            <button className="button primary-button">Create Post</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;




// now, we can send the file & caption to the backend using FormData, we will create a new FormData object and append the file and caption to it, and then we will send it to the backend using fetch or axios.


-------------------------------------
Frontend > src > features > posts > services > post.api.js
-------------------------------------

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


=> Now that the API layer is done, we will send this function createPost to the Hook layer.



------------------------------------
Frontend > src > features > posts > hook > userPost.jsx
------------------------------------


// This is a hook layer
import { getFeed, createPost } from "../services/post.api.js";
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context.jsx";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setLoading, feed, setFeed, post, setPost } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    const data = await getFeed();
    setFeed(data.posts);
    setLoading(false);
  };

  // this below function is for creating a post
  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    const data = await createPost(imageFile, caption);
    setFeed((prevFeed) => [data.post, ...prevFeed]);

    setLoading(false);
  };

  useEffect(() => {
    handleGetFeed();
  }, []);

  return { loading, feed, post, handleGetFeed, handleCreatePost };
};



=> In the `handleCreatePost` function, we call the `createPost` function from the API layer and pass `imageFile` and `caption` as arguments. After the backend creates the post and returns the new post data, we update the `feed` state by adding the new post at the beginning of the existing feed.

=> We need to hydrate the `feed` state when the hook/component first loads. For that, we call `handleGetFeed` inside `useEffect`. So when the component mounts, it fetches the feed data from the backend and stores it in the `feed` state.

=> We also return `handleCreatePost` from this hook so the UI layer can call it when the user submits the create post form.








-------------------------------
Frontend > src > features > posts > pages > CreatePost.jsx
-------------------------------

=> Now, we will import the handleCreatePost function from the hook layer and call it in the handleSubmit function. here what will happen is that when the user submits the form, the handleSubmit function will be called, which will call the handleCreatePost function from the hook layer, which will call the createPost function from the API layer, which will send the data to the backend and create a new post, and then it will update the feed state in the frontend.



import React, { useRef, useState } from "react";
import "../style/createpost.scss";
import { usePost } from "../hook/userPost";
import {useNavigate} from 'react-router'

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageInputFieldRef = useRef(null);
    const navigate = useNavigate();
  const { loading, handleCreatePost } = usePost();
  async function handleSubmit(e) {
    e.preventDefault();

    // now, from the postImageInputFieldRef, we can access the value of the input:file , here we have accessed the first file
    const file = postImageInputFieldRef.current.files[0];

    await handleCreatePost(file, caption);

    navigate("/");
  }

  if (loading) {
    return (
      <main>
        <h1>Creating Post</h1>
      </main>
    );
  }

  return (
    <div>
      <main className="create-post-">
        <div className="form-container">
          <h1>Create Post</h1>
          <form onSubmit={handleSubmit}>
            <label className="post-image-label" htmlFor="postImage">
              Select Image
            </label>

            <input
              ref={postImageInputFieldRef}
              type="file"
              id="postImage"
              hidden
              name="postImage"
              id="postImage"
            />

            {/* we can hide the input:file part, as we have used label, as both are connected with #postImage and because of that , it will do the same thing */}

            {/* we have given reference to the input:file part as ref={postImageInputFieldRef}, so that we can access its value */}

            {/* we can have select multiple files in the input:file, only we need to provide the html attribute like "multiple" jsut like "hidden" */}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              type="text"
              placeholder="Enter Caption"
              name="caption"
              id="caption"
            />

            <button className="button primary-button">Create Post</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;

//==========================================

=> till now, what we were getting was , the recent post was getting added at the end of the feed, but now, we have to change it to add the recent post at the beginning of the feed, so that when we create a new post, it will be shown at the top of the feed. for that we can write in two ways as follow:

1. change the order of the posts in the backend, so that the recent post comes first, for that we can sort on the basis of _id in the getFeedController function , this _id is generated by MongoDB and it has a timestamp in it, so we can sort on the basis of _id to get the recent post first.


-------------------------------------
day-111 > Backend > src > controllers > post.controller.js
-------------------------------------
(the below getFeedController function is already there in the post.controller.js file, we just need to add the sort method to it)

async function getFeedController(req, res) {
  
  const user = req.user;
  
  const posts = await Promise.all((await postModel.find().sort({ _id: -1 }).populate("user").lean()).map(
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




2. change the order of the posts in the frontend, so that the recent post comes first, for that we can write as follows:


-------------------------------------
day-111 > Frontend > src > features > posts > hook > userPost.jsx
-------------------------------------
// This is a hook layer
import { getFeed, createPost } from "../services/post.api.js";
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context.jsx";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setLoading, feed, setFeed, post, setPost } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    const data = await getFeed();
    setFeed(data.posts.reverse()); // reverse the order of the posts to get the recent post first
    setLoading(false);
  };

  // this below function is for creating a post
  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    const data = await createPost(imageFile, caption);
    setFeed((prevFeed) => [data.post, ...prevFeed]);
    setLoading(false);
  };

  useEffect(() => {
    handleGetFeed();
  }, []);

  return { loading, feed, post, handleGetFeed, handleCreatePost };
};


//==========================================

=> now we need to integrate the like feature, so that we can like or unlika a post, if we click on the heart svg icon, it will like the post, and if we click on it again, it will unlike the post, and we also need to change the color of the heart icon to red when the post is liked, and to white when the post is unliked.

=> we already have the like feature, just need to make changes to like it when clicked, also we need to add a new unlike feature

=> at first create an API for unliking in post.routes.js file, then create a function in post.controller.js file for unliking a post, then create a function in post.api.js file for unliking and liking a post, then create a function in userPost.jsx file for unliking and liking a post, and then call that function in the Post.jsx file when the heart icon is clicked and the post is  liked and unliked.

---------------------------------------
Backend > src > routes > post.routes.js
---------------------------------------

/**
 * @route POST /api/posts/unlike/:postid
 * @description unlike a post with the id provided in the request params.
 * @access Private
 */
postRouter.post(
  "/unlike/:postId",
  identifyUser,
  postController.unlikePostController,
);



---------------------------------------
Backend > src > controllers > post.controller.js
---------------------------------------

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


---------------------------------------
Frontend > src > features > posts > services > post.api.js
---------------------------------------

// =============== API LAYER ===============



export async function likePost(postId){
  const response = await api.post('/api/posts/like/' + postId)
  return response.data
}

export async function unlikePost(postId){
  const response = await api.post(`/api/posts/unlike/${postId}`)
  return response.data
}

--------------------------------------
Frontend > src > features > posts > hook > userPost.js
--------------------------------------
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
  const handleLike = async (post) => {
    const data = await likePost(post);
    await handleGetFeed();
  };

  const handleUnlike = async function (post) {
    const data = await unlikePost(post);
    await handleGetFeed();
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


=> we will pass the handleLike and handleUnlike in Feed.jsx file, this inturn will pass it to the Post.jsx file, and then we will call the handleLike and handleUnlike function when the heart icon is clicked, and we will also change the color of the heart icon based on whether the post is liked or not.



--------------------------------------------
Frontend > src > features > posts > pages > Feed.jsx
--------------------------------------------

import React, { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/userPost";
import Nav from "../../shared/components/Nav";
const Feed = () => {

    const { feed, loading, handleGetFeed, handleLike, handleUnlike} = usePost();

    useEffect(() => {
        handleGetFeed()
    },[])

    if(loading || !feed) {
        return <h1>Loading...</h1>
    }
    
  return (
    <main className="feed-page">
      <Nav/>
      <div className="feed">
        <div className="posts">
          {
            feed.map(post => {
                return <Post key={post._id} user={post.user} post={post} loading={loading} handleLike={handleLike} handleUnlike={handleUnlike} />
            })
          }
        </div>
      </div>
    </main>
  );
};

export default Feed;



--------------------------------------------
Frontend > src > features > posts > components > Post.jsx
--------------------------------------------

import React from "react";
const Post = ({ user, post, loading, handleLike, handleUnlike  }) => {
  return (
    <div>
      <div className="post">
        <div className="user">
          <div className="img-wrapper">
            <img src={user.profileImage} alt="" />
          </div>
          <p>{user.username}</p>
        </div>
        <img src={post.imgUrl} alt="" />
        <div className="icons">
          <div className="left">
            <button >
              <svg
                className={post.isLiked ? "liked" : ""}
                onClick={()=> post.isLiked ? handleUnlike(post._id) : handleLike(post._id)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"></path>
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z"></path>
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"></path>
              </svg>
            </button>
          </div>
          <div className="right">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="bottom">
          <p className="caption">{post.caption}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;




//==========================================

--------------------------------------
Frontend > src > features > posts > hook > userPost.js
--------------------------------------

=> now that everyting is sorted, one problem remains and it is that when we like or unlike a post, there is this loading state which is true, and when the loading state is true, we are showing "Loading..." text in the feed page, so when we like or unlike a post, the whole feed page shows "Loading..." text, which is not a good user experience, it happens because we are calling the handleGetFeed function inside the handleLike and handleUnlike functions which is causing the loading state to be true every time we like or unlike a post, so we need to fix that, for that we can write as follows:






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



//==========================================
//==========================================
//==========================================
//==========================================
//==========================================
//==========================================