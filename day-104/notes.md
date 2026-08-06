============================================
DAY-104
============================================

Aaj Day-104 hai, kal humne "createPostController" banaya tha, jisme humne pura logic likha tha ki user exist karta hai ya nahi, token cookies se lena, verify karna, image imagekit pe upload karna aur post DB mein save karna.

Aaj hum 2 nayi APIs banayenge:

  1. GET /api/posts/            => logged-in user ke saare posts fetch karo
  2. GET /api/posts/details/:postId  => ek specific post ki detail fetch karo, aur check karo ki woh post usi user ka hai ya nahi


==========================================


=> Pehli API: GET /api/posts/

=> Scene yeh hai ki lets say 3 users hain — A, B, C. Agar user A request karta hai, toh sirf user A ke posts return honge, B aur C ke nahi.

=> Iska matlab server ko pehle identify karna padega ki request kis user ne ki hai. Yeh kaam token karta hai — token se userId nikalte hain, aur phir us userId ke saare posts DB se find karte hain.


---------------------------------------
src > routes > post.routes.js
---------------------------------------

const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/posts/ - [protected]
 * req.body = { caption }
 * req.file = { imgUrl }
 */
postRouter.post("/", upload.single("imgUrl"), postController.createPostController);

/**
 * GET /api/posts/ - [protected]
 * logged-in user ke saare posts fetch karo
 */
postRouter.get("/", postController.getPostController);

module.exports = postRouter;

================================================


=> Ab controller banate hain getPostController ka:

  - pehle token check karo
  - token verify karo, userId nikalo
  - postModel.find({ user: userId }) se uss user ke saare posts fetch karo
  - response mein posts bhejo


------------------------------------------------
src > controllers > post.controller.js (getPostController)
------------------------------------------------

// =========================================================
// FUNCTION 1: getPostController
// Kaam: Logged-in user ke saare posts fetch karo
// =========================================================
async function getPostController(req, res) {

  // LINE 1: Cookie se token nikalo
  // jab user login karta hai, server uske browser mein ek "token" cookie set karta hai
  // req.cookies.token se woh cookie ka value milta hai
  const token = req.cookies.token;

  // LINE 2: Agar token hi nahi hai toh seedha 401 bhejo
  // matlab user logged in hi nahi hai ya cookie expire ho gayi
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access.",
    });
  }

  // LINE 3: decoded ko bahar declare karo — scope wali problem se bachne ke liye
  // (agar try ke andar const se declare karte toh bahar accessible nahi hota!)
  let decoded = null;

  // LINE 4: jwt.verify se token verify karo aur decode karo
  // jwt.verify 2 kaam karta hai:
  //   1. Check karta hai ki token valid hai ya tampered/expired hai
  //   2. Token ke andar ka data nikalta hai — jisme humara { id: user._id } hai
  // Agar token invalid ya expire => catch mein jaayega
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token, Unauthorized access.",
    });
  }

  // LINE 5: decoded ke andar se userId nikalo
  // decoded = { id: "64abc123...", iat: ..., exp: ... }
  // decoded.id = woh userId jo humne token banate waqt dala tha
  const userId = decoded.id;

  // LINE 6: DB se uss user ke saare posts dhundo
  // postModel.find({ user: userId }) =>
  //   "posts" collection mein woh saare documents dhundo jinka "user" field = userId ho
  // matlab sirf usi user ke posts aayenge, baaki sab ke nahi
  const posts = await postModel.find({
    user: userId,
  });

  // LINE 7: Success response bhejo saare posts ke saath
  // 200 = "OK" — request successful
  res.status(200).json({
    message: "Posts fetched successfully.",
    posts,
  });
}

================================================


==========================================


=> Doosri API: GET /api/posts/details/:postId

=> Scene yeh hai ki hum ek specific post ki detail fetch karna chahte hain, but saath mein yeh bhi check karna hai ki jo user request kar raha hai, kya woh wahi user hai jisne woh post banaya tha?

  - agar haan => post ki details return karo ✅
  - agar nahi => "Forbidden Content" 403 bhejo ❌

=> Yeh authorization check hota hai — authentication (token valid hai ya nahi) ke baad.

=> :postId ek dynamic route parameter hai, yeh URL se aata hai, req.params.postId se access karte hain.


---------------------------------------
src > routes > post.routes.js
---------------------------------------

const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/posts/ - [protected]
 * req.body = { caption }
 * req.file = { imgUrl }
 */
postRouter.post("/", upload.single("imgUrl"), postController.createPostController);

/**
 * GET /api/posts/ - [protected]
 * logged-in user ke saare posts fetch karo
 */
postRouter.get("/", postController.getPostController);

/**
 * GET /api/posts/details/:postId - [protected]
 * specific post ki detail fetch karo
 * check karo ki post usi user ka hai jo request kar raha hai
 */
postRouter.get("/details/:postId", postController.getPostDetailsController);

module.exports = postRouter;

================================================


=> Ab controller banate hain getPostDetailsController ka:

  - token check karo
  - token verify karo, userId nikalo
  - req.params.postId se postId nikalo
  - postModel.findById(postId) se post dhundo
  - agar post nahi mila => 404 Not Found
  - agar post mila => check karo ki post.user === userId
  - agar match nahi kiya => 403 Forbidden
  - agar match kiya => 200 response ke saath post bhejo

=> Ek important cheez:

  const isValidUser = post.user.toString() === userId;

  => post.user ek MongoDB ObjectId hota hai, aur decoded.id ek String hota hai.
  => dono ko compare karne ke liye post.user ko .toString() se String mein convert karna padta hai,
     warna dono kabhi equal nahi honge even if same value ho!


------------------------------------------------
src > controllers > post.controller.js (getPostDetailsController)
------------------------------------------------

// =========================================================
// FUNCTION 2: getPostDetailsController
// Kaam: Ek specific post ki detail fetch karo
//       + check karo ki woh post usi user ka hai jo request kar raha hai
// =========================================================
async function getPostDetailsController(req, res) {

  // LINE 1: Cookie se token nikalo
  const token = req.cookies.token;

  // LINE 2: Token nahi hai toh 401 bhejo
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access.",
    });
  }

  // LINE 3: decoded bahar declare karo — scope issue se bachne ke liye
  let decoded = null;

  // LINE 4: Token verify karo
  // valid hai => decoded mein { id: userId } milega
  // invalid/expired => catch mein jaayega, 401 return hoga
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token, Unauthorized access.",
    });
  }

  // LINE 5: Token se userId nikalo
  // yeh wahi user hai jisne request ki hai
  const userId = decoded.id;

  // LINE 6: URL se postId nikalo
  // req.params.postId => URL ka dynamic part hai
  // eg: GET /api/posts/details/64abc123 => postId = "64abc123"
  // :postId jo routes mein likha tha, wahi yahan milta hai
  const postId = req.params.postId;

  // LINE 7: DB se woh specific post dhundo by id
  // findById(postId) => sirf woh ek document dhundta hai jiska _id = postId ho
  const post = await postModel.findById(postId);

  // LINE 8: Agar post hi nahi mili toh 404 bhejo
  // ho sakta hai galat postId diya ho ya post delete ho gayi ho
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // LINE 9: Check karo ki yeh post usi user ka hai jo request kar raha hai
  // post.user => MongoDB ObjectId format mein hota hai  eg: ObjectId("64abc123")
  // userId    => String format mein hota hai             eg: "64abc123"
  // dono same value hain but alag types hain!
  // === comparison mein type bhi check hoti hai, isliye directly compare karna fail hoga
  // .toString() lagane se ObjectId => String ban jaata hai, phir comparison sahi hoga
  const isValidUser = post.user.toString() === userId;

  // LINE 10: User match nahi kiya toh 403 Forbidden bhejo
  // 403 = "Main jaanta hun tu kaun hai, but iss cheez pe tera haq nahi"
  // 401 se fark:
  //   401 = "Tu logged in hi nahi hai, pehle login kar"
  //   403 = "Tu logged in hai, but yeh tera post nahi hai"
  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  // LINE 11: Sab check pass ho gaya — post ka data bhejo
  // 200 = "OK" — sab theek hai
  return res.status(200).json({
    message: "Post details fetched successfully.",
    post,
  });
}

================================================


=> Status codes yaad rakh:
  - 401 Unauthorized  => token nahi hai ya invalid hai
  - 403 Forbidden     => token valid hai, but is resource pe access nahi hai
  - 404 Not Found     => post exist hi nahi karta
  - 200 OK            => sab theek, data bhejo


==========================================


=> Pura final post.controller.js kuch aisa dikhta hai:


------------------------------------------------
src > controllers > post.controller.js
------------------------------------------------

const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// =========================================================
// FUNCTION 1: createPostController
// Kaam: Naya post create karo aur DB mein save karo
// =========================================================
async function createPostController(req, res) {

  // LINE 1: Cookie se token nikalo
  const token = req.cookies.token;

  // LINE 2: Token nahi hai toh 401 bhejo
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access.",
    });
  }

  // LINE 3: decoded bahar declare karo — scope issue se bachne ke liye
  let decoded = null;

  // LINE 4: Token verify karo aur decode karo
  // success => decoded = { id: "64abc123...", iat: ..., exp: ... }
  // failure => catch mein 401 return hoga
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token, Unauthorized access.",
    });
  }

  // LINE 5: Image ko ImageKit pe upload karo
  // req.file.buffer => multer ne image ko server ki RAM mein rakha tha as raw binary data
  // Buffer.from(req.file.buffer) => buffer object banao
  // toFile(...) => uss buffer ko ek proper file object mein convert karo jo imagekit samjhe
  // folder => imagekit pe is specific folder mein file save hogi
  // imagekit response mein file ka URL, id, size, etc. deta hai
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-instaclone-posts",
  });

  // LINE 6: Post ko MongoDB mein save karo
  // caption => req.body.caption — form-data se aaya text field
  // imgUrl  => file.url — imagekit ne jo hosted URL diya, woh save karo DB mein
  // user    => decoded.id — token se nikala hua userId, yahi post ka owner hai
  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: decoded.id,
  });

  // LINE 7: Success response bhejo
  // 201 = "Created" — naya resource successfully create hua
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

  // LINE 1: Cookie se token nikalo
  const token = req.cookies.token;

  // LINE 2: Token nahi hai toh 401 bhejo
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access.",
    });
  }

  // LINE 3: decoded bahar declare karo
  let decoded = null;

  // LINE 4: Token verify karo
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token, Unauthorized access.",
    });
  }

  // LINE 5: decoded se userId nikalo
  // decoded = { id: "64abc123...", iat: ..., exp: ... }
  const userId = decoded.id;

  // LINE 6: DB se uss user ke saare posts dhundo
  // postModel.find({ user: userId }) =>
  //   "posts" collection mein woh saare documents dhundo jinka "user" field = userId ho
  // sirf usi user ke posts aayenge, baaki sab ke nahi
  const posts = await postModel.find({
    user: userId,
  });

  // LINE 7: Success response bhejo
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

  // LINE 1: Cookie se token nikalo
  const token = req.cookies.token;

  // LINE 2: Token nahi hai toh 401 bhejo
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access.",
    });
  }

  // LINE 3: decoded bahar declare karo
  let decoded = null;

  // LINE 4: Token verify karo
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token, Unauthorized access.",
    });
  }

  // LINE 5: Token se userId nikalo
  const userId = decoded.id;

  // LINE 6: URL se postId nikalo
  // req.params.postId => URL ka dynamic part
  // eg: GET /api/posts/details/64abc123 => postId = "64abc123"
  const postId = req.params.postId;

  // LINE 7: DB se post dhundo by id
  // findById(postId) => sirf woh ek document jiska _id = postId ho
  const post = await postModel.findById(postId);

  // LINE 8: Post nahi mili toh 404 bhejo
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // LINE 9: Check karo ki post usi user ka hai jo request kar raha hai
  // post.user => ObjectId type  eg: ObjectId("64abc123")
  // userId    => String type    eg: "64abc123"
  // .toString() se ObjectId => String ban jaata hai, phir === sahi kaam karta hai
  const isValidUser = post.user.toString() === userId;

  // LINE 10: User match nahi kiya toh 403 Forbidden bhejo
  // 401 vs 403 ka fark:
  //   401 = "Tu logged in hi nahi — pehle login kar"
  //   403 = "Tu logged in hai, but yeh tera post nahi hai"
  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  // LINE 11: Sab theek hai — post bhejo
  return res.status(200).json({
    message: "Post details fetched successfully.",
    post,
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
};

================================================


======================================

FULL FLOW SUMMARY:

  GET /api/posts/
  ---------------
  Request aaya
      |
      | token check (req.cookies.token)
      | jwt.verify se userId nikala
      v
  postModel.find({ user: userId })
      |
      | saare posts mile
      v
  Response => 200 Posts fetched successfully


  GET /api/posts/details/:postId
  -------------------------------
  Request aaya
      |
      | token check karo
      | jwt.verify se userId nikala
      | req.params.postId se postId nikala
      v
  postModel.findById(postId)
      |
      | post nahi mila? => 404
      | post mila, but user match nahi kiya? => 403
      | post mila, user bhi match kiya? => 200 ✅
      v
  Response => 200 Post details fetched successfully

======================================