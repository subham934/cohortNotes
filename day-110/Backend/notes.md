

# Edge Collection in MongoDB

---

## 1 What is an Edge Collection?

An **Edge Collection** is a separate collection that stores **relationships between two documents**.

Instead of embedding relationships inside documents (like storing followers array inside user), we create a **dedicated collection** to represent connections.

It’s inspired by graph databases(you don't need to know graph databases yet) where:

* **Node** → User
* **Edge** → Relationship (Follow)

---

## 2 Why Not Store Followers Inside User?

You *could* do this:

```js
{
  _id: userId,
  name: "Ankur",
  followers: [userId1, userId2, userId3],
  following: [userId4, userId5]
}
```

### Problems:

| Problem             | Why It’s Bad                                  |
| ------------------- | --------------------------------------------- |
| Large array growth  | A popular user(celebrity eg: Virat kohli) may have millions of followers |
| Document size limit | MongoDB has 16MB document limit               |
| Hard to scale       | Every follow/unfollow updates same document   |
| Concurrency issues  | High contention on popular users              |

So instead of embedding, we create a **relationship collection**.

---

# 3 Edge Collection for Followers

## Collections Structure

### Users Collection

```js
{
  _id: ObjectId,
  username: String,
  email: String
}
```

---

### Follows Collection (Edge Collection)

```js
{
  _id: ObjectId,
  follower: ObjectId,   // who follows
  following: ObjectId,  // whom they follow
  createdAt: Date
}


```

Here:

* `follower` → source node
* `following` → destination node

This document represents:

> User A follows User B

---

# 4 Real World Example – Instagram Style

Imagine on Instagram:

If **User A follows User B**

We store:

```js
{
  follower: A,
  following: B
}
```

This is exactly how large systems model relationships internally — not via arrays inside user document.

---

# 5 Schema Implementation (Mongoose)

### User Model

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String
});

module.exports = mongoose.model("User", userSchema);
```

---

### Follow Model (Edge Collection)

```js
const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
```

### Why Unique Index?

To prevent:

```
User A follows User B multiple times
```

---

# 6 Follow API (Express)

### Follow User

```js
router.post("/follow/:id", async (req, res) => {
  const followerId = req.user.id;  // from auth middleware
  const followingId = req.params.id;

  if (followerId === followingId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const follow = await Follow.create({
    follower: followerId,
    following: followingId
  });

  res.json({ message: "Followed successfully" });
});
```

---

### Unfollow User

```js
router.delete("/unfollow/:id", async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId
  });

  res.json({ message: "Unfollowed successfully" });
});
```

---

# 7 Getting Followers List

```js
const followers = await Follow.find({ following: userId })
  .populate("follower", "username email");
```

This means:

> Give me all users who follow this user.

---

# 8 Getting Following List

```js
const following = await Follow.find({ follower: userId })
  .populate("following", "username email");
```

---

# 9 Counting Followers Efficiently

Instead of fetching all documents:

```js
const count = await Follow.countDocuments({ following: userId });
```

---

# 10 Indexing for Performance

Always index:

```js
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });
```

Why?

Because queries will mostly be:

* Who follows X?
* Who does X follow?

Without index → Full collection scan
With index → O(log n)

---

# 11 Benefits of Edge Collection

| Feature                  | Benefit                    |
| ------------------------ | -------------------------- |
| Separate collection      | Clean separation of data   |
| Scales to millions       | No document growth issue   |
| Easy querying            | Simple find queries        |
| Works well with sharding | High scalability           |
| Graph-like modeling      | Supports complex relations |

---

# 12 Advanced: Mutual Followers (Common Friends)

```js
db.follows.aggregate([
  { $match: { follower: userA } },
  {
    $lookup: {
      from: "follows",
      localField: "following",
      foreignField: "follower",
      as: "mutual"
    }
  }
]);
```

Edge collection makes graph-style queries possible.

---

# 13 When To Use Edge Collection?

Use it when:

* Many-to-many relationships
* High scalability requirement
* Relationship has metadata (timestamp, status)
* Social features (followers, friends, likes, connections)

Avoid it when:

* Relationship is small and bounded
* Low scale application

---

# Final Understanding

Edge collection means:

> Instead of storing relationships inside document,
> Store them as separate documents representing connections.

For followers feature:

* Users = Nodes
* Follows = Edges

That’s scalable system design.




Edge Collection basically two documents k beech main relation bol raha hain, ak user kis user ko follow kar 
raha hai.

=> below is the model of edge collection, 

----------------------------------------
day-106 > src > models > follow.model.js
----------------------------------------

const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Follower is required"],
    },
    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Followee is required"],
    },
  },
  {
    timestamps: true,
  },
);

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;



=================================================

=> today we will develop certain features like someone can follow or unfollow other people
=> we will create certain API for that 

----------------------------------------
day-106 > src > routes > user.routes.js
----------------------------------------

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
  "/follow/:username", // jiss user ko follow karna chahte ho uss user ka username pass kar do, 
  identifyUser,
  userController.followUserController,
);


module.exports = userRouter;


//hum jab yaha pe identifyUser ko as a middleware use karenge toh uske aage hum jo bhi controller use karenge , uss controller main req.user jisko hum read karke pata kar sakte hain ki kaun sa user request kar raha hai. 

//here we use the controller named followUserController

===============================================

=> abhi is API ka controller create karenge par usse pehle lets make changes in app.js file

----------------------------------------
day-106 > src > app.js
----------------------------------------
const express = require("express");
const cookieParser = require('cookie-parser')



const app = express()
app.use(express.json())
app.use(cookieParser())


// require routes
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.routes')

// using routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('./api/users', userRouter)

module.exports = app;



------------------------------------------------
day-106 > src > controllers > user.controller.js
------------------------------------------------


const followModel = require("../models/follow.model");

async function followUserController(req, res) {

  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se uska id use karenge

  const id = req.user.id; // yaha pe jo bhi user request kar raha hai usska id nikal liya


  const username = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai 

}

module.exports = {
  followUserController,
};


================================================

=> aab , humko pata hai, token 2 jagah create hota hai, ak register k time pe , ak login k time pe, toh hum iss bar jab token create karenge toh hum id aur username dono pass karenge , toh hum id aur username dono ko pata kar sakte hain ki kaun sa user request kar raha hai. 


------------------------------------------------
day-106 > src > controllers > auth.controller.js
------------------------------------------------


const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        "User already Exists " +
        (isUserAlreadyExists.email == email
          ? "Email already exists"
          : "Username already exists"),
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash,
  });

  const token = jwt.sign(
    {
      /*
        - user ka data hona chahiye,
        - data unique hona chahiye
    */

      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User Registered Successfully",
    user: {
      name: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
    token,
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;

  /*
      user can either login with either: {username, password} OR {email, password }
    */

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
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "User LoggedIn Successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
  registerController,
  loginController,
};




================================================


=> aab , kyun ki humne token pe id aur username pass kar rahe hai, toh hum user.controller.js pe username ko use karenge instead of id

------------------------------------------------
day-106 > src > controllers > user.controller.js
------------------------------------------------


const followModel = require("../models/follow.model");

async function followUserController(req, res) {

  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se uska id use karenge

  const followerUsername = req.user.username; // yaha pe jo bhi user request kar raha hai uska USERNAME nikal liya


  const followeeUsername = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai 

}

module.exports = {
  followUserController,
};


=> Now we need to change the model too, to save the followerUsername and followeeUsername in the database , to do that we will create a new model called "follow.model.js"

================================================



----------------------------------------
day-106 > src > models > follow.model.js
----------------------------------------

const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;



================================================


------------------------------------------------
day-106 > src > controllers > user.controller.js
------------------------------------------------


const followModel = require("../models/follow.model");

async function followUserController(req, res) {

  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se uska id use karenge

  const followerUsername = req.user.username; // yaha pe jo bhi user request kar raha hai usska id nikal liya


  const followeeUsername = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai 

  // now , followerUsername wants to follow followeeUsername , for that we write a logic below as  

  const followRecord  = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername
  })


  res.status(201).json({
    message: "You are now following ${followeeUsername} !",
    follow: followRecord
  })

}

module.exports = {
  followUserController,
};



================================================

=> abhi humko aisa code likhna hai taki ak user khudko follow nahi kar paaye, nahi agar wo kisiko akbar follow kiya hai, toh dusri bar follow kar sakenge , toh isko ek hi baar follow kar sakta hai. also to check if the user we want to follow exist or not, for all of these, we write a logic below as:


------------------------------------------------
day-106 > src > controllers > user.controller.js
------------------------------------------------


const followModel = require("../models/follow.model");
const userModel = require('../models/user.model');
async function followUserController(req, res) {

  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se yaha pe jo bhi user request kar raha hai uska USERNAME nikal liya

  const followerUsername = req.user.username; // yaha pe jo bhi user request kar raha hai usska id nikal liya

  const followeeUsername = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai

  // Can't follow yourself logic
  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself!",
    });
  }

  
  // now, to check if the user we want to follow exist or not, for that we write a logic below as

  const isFolloweeUser = await userModel.findOne({ username: followeeUsername });

  if (!isFolloweeUser) {
    return res.status(404).json({
      message: `User ${followeeUsername} not found!`,
    });
  } 



  // cant follow one user multiple times
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    return res.status(409).json({
      message: `You are already following ${followeeUsername}!`,
      follow: isAlreadyFollowing,
    });
  }



  // now , followerUsername wants to follow followeeUsername , for that we write a logic below as

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `You are now following ${followeeUsername}!`,
    follow: followRecord,
  });
}

module.exports = {
  followUserController,
};

================================================

=> we will make changes in the model to check one follower is following someone only once:


------------------------------------------------
day-106 > src > models > follow.model.js
------------------------------------------------

const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

followSchema.index({ follower: 1, followee: 1 }, { unique: true });


const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;



================================================

=>Now we will write code to unfollow user, for that at first lets create an API inside routes:

---------------------------------------
day-106 > src > routes > user.routes.js
---------------------------------------
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

module.exports = userRouter;


------------------------------------------------
day-106 > src > controllers > user.controller.js
------------------------------------------------


const followModel = require("../models/follow.model");
const userModel = require('../models/user.model');


async function followUserController(req, res) {
  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se yaha pe jo bhi user request kar raha hai uska USERNAME nikal liya

  const followerUsername = req.user.username; // yaha pe jo bhi user request kar raha hai usska id nikal liya

  const followeeUsername = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai

  // Can't follow yourself logic
  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself!",
    });
  }

  
  // now, to check if the user we want to follow exist or not, for that we write a logic below as

  const isFolloweeUser = await userModel.findOne({ username: followeeUsername });

  if (!isFolloweeUser) {
    return res.status(404).json({
      message: `User ${followeeUsername} not found!`,
    });
  } 



  // cant follow one user multiple times
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    return res.status(409).json({
      message: `You are already following ${followeeUsername}!`,
      follow: isAlreadyFollowing,
    });
  }



  // now , followerUsername wants to follow followeeUsername , for that we write a logic below as

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `You are now following ${followeeUsername}!`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res){
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if(!isUserFollowing){
    return res.status(404).json({
      message: `You are not following ${followeeUsername}!`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You have unfollowed ${followeeUsername}!`,
  });
}

module.exports = {
  followUserController,
  unfollowUserController
};


================================================

=> Now we shell create one more edge collection for likes, to see which user liked which post, at first we will create a model for it: like.model.js

--------------------------------------
day-106 > src > models > like.model.js
--------------------------------------
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "post id is required for creating a like"],
    },
    user: {
      type: String,
      required: [true, "username is required for creating a like"],
    },
  },
  {
    timestamps: true,
  },
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = mongoose.model("likes", likeSchema);

module.exports = likeModel;

============================================
=> Now we will create an API inside post.router.js

---------------------------------------
day-106 > src > routes > post.routes.js
---------------------------------------

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


module.exports = postRouter;



===========================================

now , inside the post.controller.js, we will create a controller for likePostController

------------------------------------------------
day-106 > src > controllers > post.controller.js
------------------------------------------------

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
    user: username,
    post: postId,
  });

  res.status(201).json({
    message: "Post liked successfully.",
    like,
  });


}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController
};


===========================================

=> we have created one more features , that is to accept or reject a follow request done by the user which is loggedIn to any other user, for that, when the user makes a follow request , the request will be in pending state , the followee can login and either choose to accept or reject the request for that we will create 2 routes , one for accept and one for reject, but at first we will need to makes changes in follow.model.js

----------------------------------------
day-106 > src > models > follow.model.js
----------------------------------------


const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
    },
    status:{
      type: String,
      default: "pending",
      enum:{
        values: ["pending", "accepted", "rejected"],
        message: "Status must be either 'pending' or 'accepted' or 'rejected'"
      }
    }
  },
  {
    timestamps: true,
  },
);

followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;


============================================
=> now lets makes changes in user.controller.js & user.routes.js


------------------------------------------------
day-106 > src > controllers > user.controller.js
------------------------------------------------
const followModel = require("../models/follow.model");
const userModel = require('../models/user.model');


async function followUserController(req, res) {
  // kyunki humne identifyUser middleware use kiya hai , aur uska kaam rehta hai ki kaun sa user request kar raha hai usse identify karke req.user variable me store karna , toh req.user se yaha pe jo bhi user request kar raha hai uska USERNAME nikal liya

  const followerUsername = req.user.username; // yaha pe jo bhi user request kar raha hai usska id nikal liya

  const followeeUsername = req.params.username; //  req.params.username => URL mein jo ":username" tha woh yahan milta hai

  // Can't follow yourself logic
  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself!",
    });
  }

  
  // now, to check if the user we want to follow exist or not, for that we write a logic below as

  const isFolloweeUser = await userModel.findOne({ username: followeeUsername });

  if (!isFolloweeUser) {
    return res.status(404).json({
      message: `User ${followeeUsername} not found!`,
    });
  } 



  // cant follow one user multiple times
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    return res.status(409).json({
      message: `You are already following ${followeeUsername}!`,
      follow: isAlreadyFollowing,
    });
  }



  // now , followerUsername wants to follow followeeUsername , for that we write a logic below as

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `You are now following ${followeeUsername}!`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res){
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if(!isUserFollowing){
    return res.status(404).json({
      message: `You are not following ${followeeUsername}!`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You have unfollowed ${followeeUsername}!`,
  });
}

async function acceptFollowController(req, res) {

  // followee = jo accept/reject kar raha hai = request karne wala
  const followeeUsername = req.user.username;

  // follower = jisne follow request bheja tha = URL se aayega
  const followerUsername = req.params.username;

  // DB mein us record ko dhundo aur status update karo
  const followRecord = await followModel.findOneAndUpdate(
    { follower: followerUsername, followee: followeeUsername },
    { status: "accepted" },
    { new: true }  // updated document return karo
  );

  if (!followRecord) {
    return res.status(404).json({
      message: "Follow request not found!",
    });
  }

  res.status(200).json({
    message: `You accepted ${followerUsername}'s follow request!`,
    follow: followRecord,
  });
}

async function rejectFollowController(req, res) {
  const followeeUsername = req.user.username;
  const followerUsername = req.params.username;

  const followRecord = await followModel.findOneAndUpdate(
    { follower: followerUsername, followee: followeeUsername },
    { status: "rejected" },
    { new: true }
  );

  if (!followRecord) {
    return res.status(404).json({
      message: "Follow request not found!",
    });
  }

  res.status(200).json({
    message: `You rejected ${followerUsername}'s follow request!`,
    follow: followRecord,
  });
}



module.exports = {
  followUserController,
  unfollowUserController,
  acceptFollowController,
  rejectFollowController
};


---------------------------------------
day-106 > src > routes > user.routes.js
---------------------------------------

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








please read notes from :

https://github.com/ankurdotio/cohort-2.0/tree/main/notes