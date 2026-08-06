============================================
DAY-105
============================================

Aaj Day-105 hai. Kal humne 3 APIs banaye the:

  1. POST /api/posts/              => post create karo
  2. GET /api/posts/               => logged-in user ke saare posts fetch karo
  3. GET /api/posts/details/:postId => specific post ki detail fetch karo

=> In teeno controllers mein humne ek hi kaam baar baar kiya tha — token lena, verify karna, userId nikalna. Yeh code teeno jagah repeat ho raha tha:

  const token = req.cookies.token

  if(!token){
    return res.status(401).json({ message: "Unauthorized access" })
  }

  let decoded;
  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  }
  catch(err){
    return res.status(401).json({ message: "Token Invalid" })
  }

=> Repeated code = bad practice. Iska solution hai MIDDLEWARE!


==========================================


=> Middleware kya hota hai?

=> Normally request ka flow kuch aisa hota hai:

  Request   
     ↓
  app.js
     ↓
  post.routes.js
     ↓
  post.controller.js
     ↓
  MongoDB

=> Ab jab hum middleware use karte hain, flow aisa ho jaata hai:

  Request
     ↓
  app.js
     ↓
  post.routes.js
     ↓
  identifyUser middleware   ← naya step add hua
     ↓
  post.controller.js
     ↓
  MongoDB

=> Matlab pehle request middleware se guzregi, middleware apna kaam karega (user identify karega), phir request controller pe jayegi.


==========================================


=> identifyUser middleware banate hain.

=> Middleware function ka parameter hota hai (req, res, next):
  - req  => request object
  - res  => response object
  - next => yeh ek function hai, jab call karo toh request agle step (controller) pe forward ho jaati hai

=> Agar next() call nahi kiya toh request wahi ruk jaayegi, controller tak kabhi nahi pahunchegi!


--------------------------------------
src > middlewares > auth.middleware.js
--------------------------------------

const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
  // LINE 1: Cookie se token nikalo
  // jab user login karta hai, server uske browser mein ek "token" cookie set karta hai
  // req.cookies.token se woh cookie ka value milta hai
  const token = req.cookies.token;

  // LINE 2: Agar token hi nahi hai toh seedha 401 bhejo
  // matlab user logged in hi nahi hai ya cookie expire ho gayi
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, unauthorized access.",
    });
  }

  // LINE 3: decoded ko bahar declare kiya taaki try-catch ke baad bhi accessible rahe
  // (yeh wahi scope wali galti hai jo humne day-103 mein discover ki thi!)
  let decoded = null;

  // LINE 4: jwt.verify se token ko verify karo aur decode karo
  // jwt.verify do kaam karta hai:
  //   1. Check karta hai ki token valid hai ya tampered hai
  //   2. Token ke andar ka data nikalta hai (payload) — jisme humara { id: user._id } hai
  // Agar token invalid hai ya expire ho gaya => catch mein jaayega
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "user not authorized",
    });
  }

  // LINE 5: decoded data ko req.user mein store karo
  // req ek object hai jo poori request ke saath travel karta hai
  // hum isme apni marzi ki property add kar sakte hain
  // req.user = decoded matlab => { id: "64abc123..." } ab req ke saath controller tak jaayega
  req.user = decoded;

  // LINE 6: next() call karo
  // next() ek special function hai jo express deta hai
  // isko call karne se request agle step (controller) pe forward ho jaati hai
  // agar next() na likho => request yahan ROOK jaayegi, controller kabhi nahi chalega!
  next();
}

module.exports = identifyUser;

================================================

=> req.user kyun?

=> Jab request middleware se controller pe jaati hai, toh req object saath jaata hai.
=> Isliye hum decoded data ko req.user mein daal dete hain.
=> Controller mein req.user.id se directly userId mil jaayega — koi token verify karne ki zaroorat nahi!

=> Naam kuch bhi rakh sakte hain — req.trump, req.modi — but convention hai req.user 😄


==========================================


=> Ab post.routes.js mein identifyUser middleware ko APIs ke beech mein lagao:


-----------------------------
src > routes > post.routes.js
-----------------------------

const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middlewares/auth.middleware");

/**
 * POST /api/posts/ - [protected]
 * req.body = { caption }
 * req.file = { imgUrl }
 */
postRouter.post(
  "/",
  upload.single("imgUrl"),  // pehle multer file padhega
  identifyUser,             // phir user identify hoga
  postController.createPostController,  // phir controller chalega
);

/**
 * GET /api/posts/ - [protected]
 */
postRouter.get("/", identifyUser, postController.getPostController);

/**
 * GET /api/posts/details/:postId - [protected]
 */
postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

module.exports = postRouter;

================================================

=> Route ka flow samajh:

  postRouter.post("/", upload.single("imgUrl"), identifyUser, postController.createPostController)
                              ↑                      ↑                      ↑
                        1st middleware          2nd middleware           controller
                      (file padhega)        (user identify hoga)     (post banega)


==========================================


=> Ab controllers se sara token wala repeated code hata sakte hain, kyunki woh kaam middleware already kar chuka hai.
=> Controllers mein ab sirf req.user.id use karo:


--------------------------------------
src > controllers > post.controller.js
--------------------------------------

const postModel = require("../models/post.model");
const Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// =========================================================
// FUNCTION 1: createPostController
// Kaam: Naya post create karo aur DB mein save karo
// =========================================================
async function createPostController(req, res) {

  // token wala code hata diya — middleware already kar chuka hai yeh kaam ✅
  // req.user ab available hai kyunki identifyUser middleware pehle chal chuka hai

  // LINE 1: Image ko ImageKit pe upload karo
  // req.file.buffer => multer ne image ko RAM mein rakha tha, woh buffer yahan use ho raha hai
  // toFile() => buffer ko ek proper file object mein convert karta hai jo imagekit samajh sake
  // folder: "cohort-2-instagram" => imagekit pe is folder mein file save hogi
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-instagram",
  });

  // LINE 2: Post ko MongoDB mein save karo
  // caption    => req.body.caption — form-data se aaya text
  // imgUrl     => file.url — imagekit ne jo URL diya woh save karo
  // user       => req.user.id — middleware ne set kiya tha, yahi logged-in user ka id hai
  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  // LINE 3: Success response bhejo
  // 201 = "Created" — naya resource successfully bana
  res.status(201).json({
    message: "Post created Successfully",
    post,
  });
}


// =========================================================
// FUNCTION 2: getPostController
// Kaam: Logged-in user ke saare posts fetch karo
// =========================================================
async function getPostController(req, res) {

  // LINE 1: middleware se userId nikalo
  // req.user.id => yeh wahi id hai jo jwt token mein store thi
  // ab hum jaante hain ki request kis user ne ki hai
  const userId = req.user.id;

  // LINE 2: DB se uss user ke saare posts dhundo
  // postModel.find({ user: userId }) =>
  //   "finds" collection mein woh saare documents jinka "user" field = userId hai
  // matlab sirf usi user ke posts aayenge, baaki sab ke nahi
  const posts = await postModel.find({
    user: userId,
  });

  // LINE 3: Success response bhejo saare posts ke saath
  // 200 = "OK" — request successful
  res.status(200).json({
    message: "Posts fetched successfully.",
    posts,
  });
}


// =========================================================
// FUNCTION 3: getPostDetailsController
// Kaam: Ek specific post ki detail fetch karo
//       + check karo ki woh post usi user ka hai jo request kar raha hai
// =========================================================
async function getPostDetailsController(req, res) {

  // LINE 1: middleware se userId nikalo
  const userId = req.user.id;

  // LINE 2: URL se postId nikalo
  // req.params.postId => URL mein jo ":postId" tha woh yahan milta hai
  // eg: GET /api/posts/details/64abc123 => postId = "64abc123"
  const postId = req.params.postId;

  // LINE 3: DB se woh specific post dhundo
  // findById(postId) => sirf ek document dhundta hai jo uss id ka ho
  const post = await postModel.findById(postId);

  // LINE 4: Agar post hi nahi mili toh 404 bhejo
  // ho sakta hai ki galat postId diya ho ya post delete ho gayi ho
  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  // LINE 5: Check karo ki yeh post usi user ka hai jo request kar raha hai
  // post.user => MongoDB ObjectId format mein hai  eg: ObjectId("64abc123")
  // userId    => String format mein hai             eg: "64abc123"
  // dono same value hain but different types hain, isliye directly === kaam nahi karega!
  // .toString() lagane se ObjectId => String ban jaata hai, phir comparison sahi hota hai
  const isValidUser = post.user.toString() === userId;

  // LINE 6: Agar user match nahi kiya toh 403 Forbidden bhejo
  // 403 = "I know who you are, but you're not allowed here"
  // 401 se alag hai — 401 = "I don't know who you are"
  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  // LINE 7: Sab check pass ho gaya, post bhejo
  return res.status(200).json({
    message: "Post fetched successfully.",
    post,
  });
}

module.exports = { createPostController, getPostController, getPostDetailsController };

================================================

=> Dekho kitna clean ho gaya code! Pehle har controller mein 15+ lines ka token code tha, ab woh bilkul nahi hai.


==========================================


=> Ab baat karte hain Follow Feature ki.

=> Instagram pe hum kisi ko follow kar sakte hain. Toh iss data ko store kaise karein?

=> Pehla option — User document ke andar hi followers array store karo:

  {
    _id: userId,
    username: "Ankur",
    followers: [userId1, userId2, userId3],
    following: [userId4, userId5]
  }

=> But yeh sahi nahi hai — neeche dekho kyun.


==========================================


# Edge Collection in MongoDB

==========================================


=> Edge Collection kya hota hai?

=> Yeh ek alag collection hoti hai jo sirf do documents ke beech ki RELATIONSHIP store karti hai.

=> Followers array user document ke andar rakhne ki jagah, hum ek alag "follows" collection banate hain.

=> Yeh concept Graph Databases se inspired hai:
  - Node  => User
  - Edge  => Relationship (Follow)


==========================================


=> Followers array user document mein kyun nahi rakhna chahiye?

Problem 1 - Large array growth:
  - Virat Kohli ke 300 million followers hain
  - Itna bada array ek document mein store nahi ho sakta

Problem 2 - Document size limit:
  - MongoDB ka ek document max 16MB ka ho sakta hai
  - Array badhta jaayega, limit cross ho jaayegi

Problem 3 - Scaling mushkil:
  - Har follow/unfollow pe same document update hoga
  - High traffic pe bahut slow ho jaayega

Problem 4 - Concurrency issues:
  - Ek hi time pe hazaaron log follow karein toh conflicts aayenge


==========================================
users collection:
┌─────────────────────────────────────────┐
│ { _id: 1, username: "Rahul", age: 25 }  │  <- ek document
│ { _id: 2, username: "Priya", age: 22 }  │  <- ek document  
│ { _id: 3, username: "Ankur", age: 28 }  │  <- ek document
└─────────────────────────────────────────┘

Toh:

Collection = users — saare users ka dabba 📦
Document = ek user ka data — { _id: 1, username: "Rahul" } 📄




Jab humne "follows" collection banaya — woh bhi ek collection hi hai, lekin isme sirf relationships store hoti hain:
follows collection:
┌──────────────────────────────────────────────────┐
│ { follower: 1, following: 2 }  <- Rahul follows Priya  │
│ { follower: 1, following: 3 }  <- Rahul follows Ankur  │
│ { follower: 2, following: 3 }  <- Priya follows Ankur  │
└──────────────────────────────────────────────────┘
Isliye "Edge" kehte hain — kyunki yeh sirf do nodes (users) ke beech ka connection store karta hai, koi extra data nahi. 😄

=> Follows Collection (Edge Collection) ka structure:

  Users Collection:
  {
    _id: ObjectId,
    username: String,
    email: String
  }

  Follows Collection (Edge Collection):
  {
    _id: ObjectId,
    follower: ObjectId,   // who follows (source)
    following: ObjectId,  // whom they follow (destination)
    createdAt: Date
  }

=> Example: Agar User A ne User B ko follow kiya, toh ek document banega:

  {
    follower: A,    // A ne follow kiya
    following: B    // B ko follow kiya
  }


==========================================


=> Follow Model banate hain:


----------------------------
src > models > follow.model.js
----------------------------

const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
}, { timestamps: true });

// unique index — ek user doosre ko baar baar follow na kar sake
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;

================================================

=> unique index kyun lagaya?

=> Bina iske User A, User B ko 100 baar follow kar sakta tha.
=> Unique index lagane se ek hi baar follow ho sakta hai — duplicate document nahi banega.


==========================================


=> Follow APIs:


POST /api/follow/:id     => kisi user ko follow karo
DELETE /api/unfollow/:id => kisi user ko unfollow karo


// Follow karo
router.post("/follow/:id", identifyUser, async (req, res) => {
  const followerId = req.user.id;         // jo follow kar raha hai
  const followingId = req.params.id;      // jisko follow kiya ja raha hai

  if (followerId === followingId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  await Follow.create({
    follower: followerId,
    following: followingId,
  });

  res.json({ message: "Followed successfully" });
});


// Unfollow karo
router.delete("/unfollow/:id", identifyUser, async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  res.json({ message: "Unfollowed successfully" });
});


==========================================


=> Followers list fetch karo (kaun kaun follow karta hai mujhe):

  const followers = await Follow.find({ following: userId })
    .populate("follower", "username email");

  // following: userId => jisme userId ka following field match kare
  // matlab => sab jo mujhe follow karte hain


=> Following list fetch karo (main kisko follow karta hun):

  const following = await Follow.find({ follower: userId })
    .populate("following", "username email");


=> Followers count efficiently nikalo:

  const count = await Follow.countDocuments({ following: userId });
  // saare documents count karo, data fetch mat karo — fast hoga!


==========================================


=> Performance ke liye indexing:

  followSchema.index({ follower: 1 });
  followSchema.index({ following: 1 });

=> Bina index ke — MongoDB poora collection scan karega (slow)
=> Index ke saath  — O(log n) mein milega (fast) ✅


==========================================


=> Edge Collection kab use karein?

Use karo jab:
  - Many-to-many relationship ho (A follows B, B follows C, etc.)
  - High scale chahiye
  - Relationship mein metadata ho (timestamp, status, etc.)
  - Social features ban rahe ho (followers, likes, connections)

Mat use karo jab:
  - Relationship chhoti aur bounded ho
  - Low scale application ho


==========================================


FULL FLOW SUMMARY:

  Middleware ka fayda:
  --------------------
  Pehle (repeated code):               Aab (middleware ke saath):
  createPostController - token verify  identifyUser middleware - token verify
  getPostController    - token verify       ↓
  getPostDetailsController - token verify  req.user = decoded
                                            ↓
                                       Controller - sirf req.user.id use karo ✅


  Edge Collection ka fayda:
  -------------------------
  Pehle (array in document):           Aab (edge collection):
  user.followers = [id1, id2, ...]     follows = { follower: A, following: B }
  ❌ 16MB limit                         ✅ Unlimited scale
  ❌ Concurrency issues                 ✅ Clean separation
  ❌ Hard to query                      ✅ Easy to query

======================================