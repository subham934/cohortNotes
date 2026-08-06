Today , we will see that once we login , we will show UI , which is a <Feed/> page, which will show all the post created on our application.

---
-----------------------------------------
## Frontend > src > app.routes.jsx
-----------------------------------------


import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/posts/pages/Feed";

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
}
]);

//=============================================
=> every post has a caption, imgUrl, userid, \_id.
=> with the help of userid we will get the detail of the user. for that we will create another API in backend

---
-----------------------------------------
## day-110 > Backend > src > routes > post.routes.js
-----------------------------------------


(just like below there are many API, i've just written this for understanding)

/\*\*

- @route GET /api/posts/feed
- @description get all the post created in DB
- @access Private
  \*/

postRouter.get("/feed", identifyUser, postController.getFeedController);

=> we will also need to create a controller for the above routes

---
-----------------------------------------
## day-110 > Backend > src > controllers > post.controller.js
-----------------------------------------


// a new controller called getFeedController is created below

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

async function likePostController(req,res){
const username = req.user.username;
const postId = req.params.postId;

const post = await postModel.findById(postId);

if(!post){
return res.status(404).json({
message: "Post not found.",
});
}

const isAlreadyLiked = await likeModel.findOne({
user: username,
post: postId,
});

if(isAlreadyLiked){
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

async function getFeedController(req, res){
const posts = await postModel.find();
// postModel.find() will return all the post we have created

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
getFeedController
};

=> now go to postman and login a user, then type "http://localhost:3000/api/posts/feed" in the url, you will get the posts created by all the users

=> We got all the posts , but it only has imgUrl, caption, \_id, user_id. we also need the profile image and username of the user who created the post. luckly we have the Id , and from there itself we will the users details.

=> on the controller , we have just made a small change - we will also populate the user field, so that we can access the user details.

=> now go to postman and login a user, then type "http://localhost:3000/api/posts/feed" in the url, you will get the posts created by all the users along with the entire user details.

================================

async function getFeedController(req, res){
const posts = await postModel.find().populate("user");

// postModel.find() will return all the post we have created.

res.status(200).json({
message: "Post fetched successfully.",
posts,
});
}

================================

=> The ".populate("user");" will only work when we have a reference to the user in the post model. The example is as below:

user: {
type: mongoose.Schema.Types.ObjectId,
ref: "users", // **\*** this is the reference to the user model
required: [true, "user id is required for creating a post"],
},

=>Now everything is sorted but there is a very big problem, we are also getting the password of the user , we dont want that to be visible to the user. So we will remove the password from the response.

=> we will make sure that when we create a user, the password, bydefault, is not read by user from the database and hence cant be sent as response. for that we write as select: false,

---
-----------------------------------------
## Backend > src > models > user.model.js
-----------------------------------------


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
username: {
type: String,
unique: [true, "User name already exists"],
required: [true, "username is required"]
},

    email:{
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
    },

    password:{
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },

    bio: String,
    profileImage: {
        type: String,
        default: 'https://ik.imagekit.io/lq7qd2rhd/IMG-20251226-WA0073.jpg',
    }

})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;

=> now, bydefault our password wont be read but there is one problem, while login we need to get the password, for that we write as below in auth.controller.js:

-----------------------------------------
## Backend > src > controllers > auth.controller.js
-----------------------------------------


const user = await userModel.findOne({
$or: [
{
// condition - 1
username: username,
},
{
// condition - 2
email: email,
},
],
}).select("+password");

=> this thing forces our query ki jo password bydefault read karne k liye nahi hai, use bhi aap read karoge

=> now , we can interact with backend.

//=============================================

=> now we will create a Feed page, which will show all the posts created by all the users.

=> At first we will create an API layer

-----------------------------------------
## Frontend > src > features > post > services > post.api.js
-----------------------------------------

// =============== API LAYER ===============

import axios from "axios";

const api = axios.create({
baseURL: "http://localhost:3000",
withCredentials: true,
});

export async function getFeed(){
const response = await api.get("/api/posts/feed");
return response.data;
}

//=============================================

=>Now let create a state layer

-----------------------------------------
## Frontend > src > features > posts > post.context.jsx
-----------------------------------------

// state layer

import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
const [loading, setLoading] = useState(false);
const [post, setPost] = useState(null);
const [feed, setFeed] = useState(null);
return (
<PostContext.Provider
value={{ loading, setLoading, post, setPost, feed, setFeed }} >
{children}
</PostContext.Provider>
);
}

=> we will wrap the App.jsx file with this provider.

-----------------------------------------
## Frontend > src > App.jsx
-----------------------------------------

import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import "./features/shared/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { PostContextProvider } from "./features/posts/post.context";

const App = () => {
return (
<div>
<AuthProvider>
<PostContextProvider>
<RouterProvider router={router} />
</PostContextProvider>
</AuthProvider>
</div>
);
};

export default App;

//=============================================

=> Now we will create a hook layer

-----------------------------------------
## Frontend > src > features > posts > hook > userPost.js
-----------------------------------------

// This is a hook layer
import { getFeed } from "../services/post.api.js";
import { useContext } from "react";
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
  return { loading, feed, post, handleGetFeed };
};



//=============================================

-----------------------------------------
Frontend > src > features > posts > pages > Feed.jsx
-----------------------------------------

import React, { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/userPost";
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


-----------------------------------------
Frontend > src > features > posts > components > Post.jsx
-----------------------------------------

import React from 'react'

const Post = ({user, post}) => {
  return (
    <div>
      <div className="post">
            <div className="user">
              <div className="img-wrapper">
                <img
                  src={user.profileImage}
                  alt=""
                />
              </div>
              <p>{user.username}</p>
            </div>
            <img
              src={post.imgUrl}
              alt=""
            />
            <div className="icons">
              <div className="left">
                <button>
                  <svg
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path></svg>
                </button>
              </div>
            </div>
            <div className="bottom">
              <p className="caption">{post.caption}</p>
            </div>
          </div>
    </div>
  )
}

export default Post



---------------------------------------------
Frontend > src > features > post > style > feed.scss
---------------------------------------------

.feed-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .feed {
    max-width: 350px;
    width: 100%;

    .posts {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;

      .post {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background-color: rgb(105, 48, 48);
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
        .user {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          .img-wrapper {
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid rgba(255, 0, 0, 0);
            background: conic-gradient(
                from 45deg,
                rgb(255, 102, 0),
                rgb(105, 0, 128),
                rgb(255, 102, 0)
              )
              border-box;
            padding: 0.1rem;
            img {
              width: 2.3rem;
              height: 2.3rem;
              aspect-ratio: 1/1;
              border-radius: 50%;
              object-fit: cover;
              object-position: center;
            }
          }
        }

        .icons {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left {
            display: flex;
            gap: 0.75rem;
          }

          svg {
            width: 1.5rem;
            aspect-ratio: 1/1;
            color: white;
          }

          button {
            background: transparent;
            border: none;
            outline: none;
          }
        }

        img {
          width: 100%;
        }
      }
    }
  }
}



//=============================================

// Now we will see the "like" functionality, we have already created the API for that, now we will just connect it with our frontend, and we will also show the likes on each post.

=> to show if the logged in user has liked the post, we will login the user in frontend and then make changes in getFeedController in backend, we will check ki jo post hai usko kya logged in user ne like kiya hai ya nahi, and then we will send that information to the frontend, and then we will show the like button accordingly.


------------------------------------------------
Backend > src > controllers > post.controller.js
------------------------------------------------

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


feed ke saare posts laa raha hai, aur har post ke andar ye add kar raha hai ki current logged-in user ne us post ko like kiya hai ya nahi

Ab line by line samjho.

const user = req.user;
Ye kya hai?

req matlab request
req.user middleware ne dala hota hai
middleware ne token check karke user ko pehchana hota hai
Toh agar login user rahul hai, toh:

req.user = {
  id: "...",
  username: "rahul"
}
Ab humne usko ek variable me daal diya:

const user = req.user;
Matlab:
ab current user ka info user ke andar aa gaya.

await postModel.find().populate("user").lean()
Isko todte hain 3 pieces me.

1. postModel.find()
Ye database se saare posts nikaal raha hai.

Maan lo DB me 3 posts hain, toh ye un 3 posts ko le aayega.

Example:

[
  { _id: "p1", caption: "hello", user: "u1" },
  { _id: "p2", caption: "hi", user: "u2" }
]
2. .populate("user")
Normally post ke andar user me sirf user ki id hoti hai.

Example before populate:

{
  _id: "p1",
  caption: "hello",
  user: "u1"
}
populate("user") lagane ke baad Mongoose user ki full details bhi bhar deta hai.

Example after populate:

{
  _id: "p1",
  caption: "hello",
  user: {
    _id: "u1",
    username: "aman",
    profileImage: "abc.jpg"
  }
}
Matlab:
sirf id nahi, pura user object aa jata hai.

3. .lean()
Ye Mongoose ko bolta hai:

"mujhe fancy Mongoose document nahi chahiye, simple normal JavaScript object de do"

Ye kyun useful hai?
Kyuki baad me hum post.isLiked = ... karke post object me new property add kar rahe hain.

Simple socho:

lean() = normal plain object
plain object me changes karna easy hota hai
Ab next part:

(await postModel.find().populate("user").lean()).map(
  async (post) => {
Yaha kya ho raha hai?

pehle saare posts fetch ho gaye
ab .map() har post pe chalega
matlab ek-ek post ko uthake usme extra kaam karenge
Suppose 3 posts aaye:

post 1 pe kaam hoga
post 2 pe kaam hoga
post 3 pe kaam hoga
Ab iske andar:

const isLiked = await likeModel.findOne({
  user: user.username,
  post: post._id,
})
Ye sabse important line hai.

Iska matlab:

likes collection me check karo:

kya current logged-in user ka username
aur current post ki id
dono milke koi like record banate hain?
Simple Hindi me:
"क्या ye user ne ye post like kiya hai?"

Example:
current user = rahul
current post id = p1

तो query ye hogi:

findOne({
  user: "rahul",
  post: "p1"
})
Agar aisa record mil gaya:

matlab rahul ne p1 ko like kiya hai
Agar kuch nahi mila:

matlab like nahi kiya
Ab next line:

post.isLiked = Boolean(isLiked);
Ye kya kar rahi hai?

isLiked me do cheezein ho sakti hain:

Case 1: like record mila
Example:

isLiked = { _id: "like1", user: "rahul", post: "p1" }
Toh:

Boolean(isLiked) // true
Case 2: like record nahi mila
Example:

isLiked = null
Toh:

Boolean(null) // false
Toh final result:

record mila -> post.isLiked = true
record nahi mila -> post.isLiked = false
Matlab ab har post ke andar ek nayi field add ho gayi:

{
  _id: "p1",
  caption: "hello",
  user: {...},
  isLiked: true
}
ya

{
  _id: "p2",
  caption: "bye",
  user: {...},
  isLiked: false
}
Simple words me:
har post ke saath backend bol raha hai:

current user ne ise like kiya hai
ya nahi kiya
Next:

return post;
Matlab:
jo post humne update kiya tha, usko wapas bhej do.

Yani:
original post + new isLiked field

Ab sabse outer part:

const posts = await Promise.all(...)
Ye kyun lagaya?

Kyuki .map(async () => {}) jab use karte ho, toh uska result direct final data nahi hota.
Wo promises ka array deta hai.

Matlab aise kuch:

[Promise, Promise, Promise]
Lekin hume actual updated posts chahiye.

Isliye Promise.all(...) lagaya:

sab promises complete hone ka wait karo
phir final updated posts array do
So final posts variable me aayega:

[
  { ...post1, isLiked: true },
  { ...post2, isLiked: false },
  { ...post3, isLiked: true }
]
Ab isko ek story ki tarah samjho

Maan lo:

current logged-in user = rahul
database me 2 posts hain:
post 1 by aman
post 2 by neha
Aur likes collection me sirf ye record hai:

rahul liked post 1
Backend kya karega?

Step 1
current user nikalega:

const user = req.user;
Now user.username = "rahul"

Step 2
saare posts nikaalega:

postModel.find().populate("user").lean()
Mila:

[
  { _id: "p1", caption: "hello", user: { username: "aman" } },
  { _id: "p2", caption: "hi", user: { username: "neha" } }
]
Step 3
har post pe check karega:

kya rahul ne p1 like kiya?

haan
isLiked = true
kya rahul ne p2 like kiya?

nahi
isLiked = false
Step 4
final output banega:

[
  {
    _id: "p1",
    caption: "hello",
    user: { username: "aman" },
    isLiked: true
  },
  {
    _id: "p2",
    caption: "hi",
    user: { username: "neha" },
    isLiked: false
  }
]
Step 5
Frontend ko ye ready-made data mil jayega.

Ab frontend ko khud nahi sochna padega ki kaunsa post liked hai.
Backend already bata raha hai.

Frontend ko iska kya benefit hai?

Frontend me tum future me aise kar sakte ho:

{post.isLiked ? "Unlike" : "Like"}
ya:

red heart show karo if liked
empty heart show karo if not liked
Yani backend ne frontend ka kaam easy kar diya.

Ek line me pura meaning
Ye code:

saare posts fetch karta hai
har post ke liye current user ka like status check karta hai
aur har post me isLiked: true/false add kar deta hai
Agar bahut hi simple example me bolun
Socho school me teacher list bana raha hai:

saare students ki list nikali
har student ke naam ke saamne check kiya "present hai ya absent"
phir final list me likh diya:
Aman - Present
Neha - Absent
Bilkul waise hi:

saare posts laaye
har post ke saamne check kiya "liked hai ya nahi"
final post me add kar diya isLiked
Line-by-line ultra short meaning

const user = req.user;
Current logged-in user le lo

await postModel.find().populate("user").lean()
Saare posts le aao, user details ke saath, normal object form me

.map(async (post) => {
Har post pe kaam karo

const isLiked = await likeModel.findOne({
  user: user.username,
  post: post._id,
})
Check karo current user ne ye post like kiya ya nahi

post.isLiked = Boolean(isLiked);
Like kiya toh true, nahi kiya toh false

return post;
Updated post wapas do

const posts = await Promise.all(...)
Sab updated posts ka final array le lo

//=============================================
=> Ab frontend me jaake isLiked ke basis pe like button ko red kar denge ya normal, aur ye bhi bata denge ki user ne like kiya hai ya nahi.


---------------------------------------------------------
Frontend > src > features > posts > components > Post.jsx
---------------------------------------------------------


    import React from 'react';

    const Post = ({user, post}) => {
    return (
        <div>
        <div className="post">
                <div className="user">
                <div className="img-wrapper">
                    <img
                    src={user.profileImage}
                    alt=""
                    />
                </div>
                <p>{user.username}</p>
                </div>
                <img
                src={post.imgUrl}
                alt=""
                />
                <div className="icons">
                <div className="left">
                    <button>
                    <svg
                    className={post.isLiked ? "liked" : ""}
                    
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path></svg>
                    </button>
                </div>
                </div>
                <div className="bottom">
                <p className="caption">{post.caption}</p>
                </div>
            </div>
        </div>
    )
    }

    export default Post;


//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
//=============================================
