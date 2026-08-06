
============================================
DAY-102
============================================



till now, while registering, we used to hash the password and then store it to database and when we used come to login, we convert the password to hash annd compare it to see if it matches our hashed password saved in DB or not. if both are same, we say the password matches or if not then Invalid password.

now for the same thing we install a package called bcryptjs npm i bcryptjs

we could use crypto , but thats for basic level stuff and now we are at prolevel


======================================

=> previously we did manual thing, performing low level code while hashing the password , atfirst we hashed it with :

  const hash = crypto.createHash('sha256').update(password).digest('hex');

and for the confirmation also , we did hased the new password and compared it to our database's hashed password, and it was quite noob thing.

=> Now with bycryptjs we hash it with the code :
const hash = await bcrypt.hash(password, 10) 

=> ✅ 10 = salt rounds (cost factor)

It means:

bcrypt internally random salt generate karta hai

2^10 = 1024 rounds of processing

Zyada rounds = zyada slow = more secure

So 10 is computational cost, not layers.  

=>and now to compare the saved password of database to the new login password we do as below:


    const hash = await bcrypt.compare(password, user.password)

the entire code is as below:


--------------------------------------
src > controllers > auth.controller.js
--------------------------------------
const userModel = require("../models/user.model");
// const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;

  // // check if user already exists with this email
  // const isUserExistByEmail = await userModel.findOne({email})

  // if(isUserExistByEmail){
  //     return res.status(409).json({
  //         message: "User already exists with same email"
  //     })
  // }

  // // check if user already exists with this username
  // const isUserExistByUsername = await userModel.findOne({username})

  // if(isUserExistByUsername){
  //     return res.status(409).json({
  //         message: "user already exist by username"
  //     })
  // }

  // in this above case we are calling the database twice for varification which might result in overload to database , why dont we call it once so that the load on database reduces significiently and make it more efficient

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

  //   const hash = crypto.createHash("sha256").update(password).digest("hex");

  const hash = await bcrypt.hash(password, 10); // 10 is salt rounds

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

  //   const hash = crypto.createHash("sha256").update(password).digest("hex");

  //   if (user.password !== hash) {
  //     return res.status(401).json({
  //       message: "Invalid Password",
  //     });
  //   }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      /*
            - user ka data hona chahiye,
            - data unique hona chahiye
        */

      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User Logged In Successfully",
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



========================================


Lets say we have a post in instagram, it has data like

{
  caption: String,
  img_url : String,
  user: userID,
}

Now, lets create a model , for that we need to create a file inside models:


----------------------------
src > models > post.model.js
----------------------------


const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default : ""
    },
    imgUrl: {
        type: String,
        required: [true, "img_url is required for creating a post"]
    },
    <!-- our database name is instagram, and inside it has one collection called "users", and similarly we are creating one more collection called "posts" . This "posts" has a userID apart from caption and imageUrl to tell which user has created this post. the userID should come from "users" collection , now the question arise, which users id is it,  for that we provide a referance as below  -->
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user id is required for creating a post"],
    }
})

const postModel = mongoose.model("posts",postSchema)

module.exports = postModel;


==========================================


=> Abhi, hum upar k post.model.js k liye ak post.routes.js file create karenge

---------------------------------------
day-102 > src > routes > post.routes.js
---------------------------------------


const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");


/**
 * POST /api/posts-[protected]
 * -req.body = {caption, imgUrl}
 * /api/posts/
 */

postRouter.post("/", postController.createPostController);

module.exports = postRouter;

===============================================


=> iss API main jo req.body hoga , usme kuch data aayega, like caption, imgUrl from the user

=> Yeh API protected rahega, iss API pe sirf wo user request kar sakte hai jinke paas ak valid token hoga. agar kisi user k pass valid token nhi hoga toh wo request nhi kar sakte

=> humko ak controller banana hoga, jo user ke liye post create karne ke liye work kare


------------------------------------------------
day-102 > src > controllers > post.controller.js
------------------------------------------------

const postModel = require('../models/post.model')

async function createPostController(req, res){
    console.log(req.body);    
}


module.exports = {
    createPostController
}
 
===============================================


=> yeh jo postRouter hai, usko hum app.js main use karenge , for that we write as below:


----------------------
day-102 > src > app.js
----------------------

const express = require("express");
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes')


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/posts',postRouter);
module.exports = app;

================================================


=> ab hum postman main ak POST method se request karenge aur uska URL hoga http://localhost:3000/api/posts/,
  - aab hum body k andar raw format main JSON data dete nahi , hum denge form-data format main
  - hum dange form-data main data, like caption, imgUrl   
  - hum jab data ko send karenge, request hit karegi postRouter.post("/", postController.createPostController);, which will go to controller createPostController. once we do that , over the console we can see "undefined"
  - to read the data in form-data format we use a middleware called multer, which will read the data from form-data format and store it in req.body 
  - npm i multer

=> 

---------------------------------------
day-102 > src > routes > post.routes.js
---------------------------------------

const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/posts-[protected]
 * -req.body = {caption, imgUrl}
 * /api/posts/
 */

postRouter.post("/", upload.single("imgUrl"), postController.createPostController);

module.exports = postRouter;

================================================

=> Yaha pe FE jis naam se image bhej raha hai, hum usi naam se file bhejte hai, eg: postman main jo image hain hum usko "imgUrl" main bhejte hai, usko req.body ke andar "imgUrl" main store karenge
  
    - upload.single("imgUrl")

=> abhi hum check karange, toh console main caption toh aayega but image file nahi aayega kyunki humne post.controller.js bus req.body ko console kiya , but image ko req.file 

async function createPostController(req, res){
    console.log(req.body);    
}


------------------------------------------------
day-102 > src > controllers > post.controller.js
------------------------------------------------

const postModel = require("../models/post.model");

async function createPostController(req, res) {
  console.log(req.body, req.file);
}

module.exports = {
  createPostController,
};




=> now when we go to post.controller.js we can see that the console.log(req.body, req.file);
give response to as below 

[Object: null prototype] { caption: 'my_picture' } {
  fieldname: 'imgUrl',
  originalname: 'WhatsApp Image 2024-11-12 at 9.50.02 AM.jpeg',        
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 06 06 06 06 07 06 07 08 08 07 0a 0b 0a 0b 0a 0f 0e 0c 0c 0e 0f 16 10 11 10 ... 142196 more bytes>,
  size: 142246


=> Toh abhi tak bus ak kaam kiya hai, user ak file bhejta hai humare server tak, server wo file read nahi kar pata for that we use multer. aab hum chahte hai ki server uss image file ko cloud storage pe bhej de, for that we use imageKit(cloud storage).

=> Install imagekit first, npm install @imagekit/nodejs


------------------------------------------------
day-102 > src > controllers > post.controller.js
------------------------------------------------

const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  console.log(req.body, req.file);


   const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
  });

  res.send(file);
}

module.exports = {
  createPostController,
};
================================================

=> now, with the help of POST method if we create a request to http://localhost:3000/api/posts/

=> this below gives us the detail of the uploaded file and where it is saved in imagekit, the link and everything.

{
    "fileId": "69b2b4e75c7cd75eb875fd7b",
    "name": "Test_m_7TyWOoF",
    "size": 2144606,
    "versionInfo": {
        "id": "69b2b4e75c7cd75eb875fd7b",
        "name": "Version 1"
    },
    "filePath": "/Test_m_7TyWOoF",
    "url": "https://ik.imagekit.io/lq7qd2rhd/Test_m_7TyWOoF",
    "fileType": "image",
    "height": 1024,
    "width": 1536,
    "thumbnailUrl": "https://ik.imagekit.io/lq7qd2rhd/tr:n-ik_ml_thumbnail/Test_m_7TyWOoF",
    "AITags": null,
    "description": null
}