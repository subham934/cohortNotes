============================
day-121 notes
============================

till now, we have set up the email service, we could send email, we just need to send the verification link to the user's email address when he/she registers. 



=> user jab aake register krega, tab uska data db me save ho jayega, but verified = false rahega
=> now what we will do is, we will send a link on the saved user's email, and once the user clicks on the link, we will mark the user as verified.

=> along with that link, we will send a verification token to the user. once the user click on that link, our server receive a request , it will check the token, and based on the data of that perticular token, it will mark the user as verified.

=> we will crate a token inside controller.

----------------------------------
src/controllers/auth.controller.js
----------------------------------


  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );


// this token will be sent to the user's email address
// and we will send this token in the form of link, which will be clickable by the user
//===================================
----------------------------------
src/controllers/auth.controller.js
----------------------------------
  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Verify your email address by clicking on the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });



//===================================

// when someone clicks on the link, a request will be sent to /api/auth/verify-email
=> when the user clicks on the link, the request will come here
=> now we will create a route

----------------------------------
src/routes/auth.routes.js
----------------------------------
import { Router } from "express";
import { register, verifyEmail } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email
 * @query { token }
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;



//===================================
now we will create a route controller, where the request will come

----------------------------------
src/controllers/auth.controller.js
----------------------------------

import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  // here, we have not hashed the password, because we have used pre hook in the user model to hash the password. agar password aaya hoga, toh khud usko hash karke save kar lega database main.

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  // after this, user get registered but not verified
  // so we will send an email to the user to verify the email address
  // this mail will contain a link.
  // when user will click on the link, a request will be sent to server, server identify the user, and set the verified to true.
  // we will implement a feature so that our server could send email, for that we use nodemailer

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Verify your email address by clicking on the link below:</p>
                <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


export async function verifyEmail(req, res){
  const token = req.query.token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  const user = await userModel.findOne({email: decoded.email})

  if(!user){
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: "User not found",
    });
  }

  // agar user mil jata hai, uska varified status ko true kardenge.
  
  user.verified = true;
  await user.save();



  const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified successfully. You can now log in to your account.</p>
    <a href="http://localhost:${process.env.PORT}/login">Login</a>
    <p>Best regards,<br>The Perplexity Team</p>
    `


  res.send(html);
  
}


// we need to make one small changes in user.model.js

------------------------
src/models/user.model.js
------------------------

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 10);
});


//===============================

now, when we click on the link sent by the server to our email we can see the message::



"
Email Verified Successfully
Your email has been verified successfully.

Best regards,
The Perplexity Team

"

=> now , if we go to the database, we can check that the verified status is set to true.

{
  "_id": {
    "$_id": "6a04a18ffd18019fe50bbcdf"
  },
  "username": "SubhamDhar",
  "email": "dharsubham32@gmail.com",
  "password": "$2b$10$5Ju0NGsxMTPGIRILaARUpeKdJS95Z1Y1eki26nFJNiu.rXfkOKcUC",
  "verified": true,
  "createdAt": {
    "$date": "2026-05-13T16:06:39.835Z"
  },
  "updatedAt": {
    "$date": "2026-05-13T16:25:19.417Z"
  },
  "__v": 0
}

=> Ok, let understand the flow one last time, user registers and server sent an email , over the database , we can see that the varified status is marked as false, our server send's an email to the user, with a verification link, it contains a token, when the user click on the link, a request will be sent to server, which will also contain a token that has our email address. when we click on the link, token hits the /api/auth/verify-email. this api reads the token and verify the user on the basis of the email address found in token and we mark the user as verified.


//=====================================

=> now lets create a login API, it will take email and password as input, and return a JWT token if the user is verified and password is correct, otherwise return an error.

=> lets make changes in routes/auth.routes.js and import the login function.

--------------------------------------
src/routes/auth.routes.js
--------------------------------------

import { Router } from "express";
import { register, verifyEmail, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email
 * @access Public
 * @query { token }
 */
authRouter.get("/verify-email", verifyEmail);


export default authRouter;



//=====================================
=> we also need a loginValidator, we can copy the same code from registerValidator, and change accordingly, we can make it in auth.validator.js.

--------------------------------------
src/validators/auth.validator.js
--------------------------------------
import { body, validationResult } from "express-validator";


export function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    validate
];


export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    validate
];


//=====================================

=> now lets create a login controller and export it.

--------------------------------------
src/controllers/auth.controller.js
--------------------------------------


import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  // here, we have not hashed the password, because we have used pre hook in the user model to hash the password. agar password aaya hoga, toh khud usko hash karke save kar lega database main.

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  // after this, user get registered but not verified
  // so we will send an email to the user to verify the email address
  // this mail will contain a link.
  // when user will click on the link, a request will be sent to server, server identify the user, and set the verified to true.
  // we will implement a feature so that our server could send email, for that we use nodemailer

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Verify your email address by clicking on the link below:</p>
                <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  // if user found, then we will check, if the user is verified or not.
  // this check is very important, because, we have to send email verification link to the user at the time of registration.
  // user, jb tak apna email ko verify nhi krega, tab tk user ko login nhi karne denge.

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email address before logging in.",
      success: false,
      err: "User not verified",
    });
  }

  // after this, we will compare the password.

  const isPasswordMatch = user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid password",
      success: false,
      err: "Invalid password",
    });
  }

  // if user is verified and password is valid, then we will generate a jwt token.

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    // agar user mil jata hai, uska varified status ko true kardenge.

    user.verified = true;
    await user.save();

    // await sendEmail({
    //   to: user.email,
    //   subject: "Email verified successfully",
    //   html: `
    //               <p>Hi ${user.username},</p>
    //               <p>Your email has been verified successfully.</p>
    //               <p>Best regards,<br>The Perplexity Team</p>
    //       `,
    // });

    const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified successfully. You can now log in to your account.</p>
    <a href="http://localhost:${process.env.PORT}/login">Login</a>
    <p>Best regards,<br>The Perplexity Team</p>
    `;

    return res.send(html);
  } catch (err) {
    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found",
      });
    }
  }
}



================================
//we can login using the below link in postman
//http://localhost:3000/api/auth/login


//after login, we will get a token, which is stored in the cookie.
//now we need to implement a middleware to check, if the token is valid or not.
//this middleware will be used to protect the routes, which are not accessible to the public.



//=======================================

=> now, lets create the get-me API. but before that we need to create a middleware to check, if the token is valid or not. and if the token is valid, then we will store the user information in the request object. and if the token is not valid, then we will send an error response.

=> middleware bata dega ki kaun sa user request kar raha hai. 

---------------------------------
src/middleware/auth.middleware.js
---------------------------------


import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token",
        });
    }
};


//===========================================

=> now, lets create the get-me API. lets make change in auth.routes.js first

---------------------------------
src/routes/auth.routes.js
---------------------------------
import { Router } from "express";
import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);


/**
 * @route GET /api/auth/get-me
 * @desc Get current user
 * @access Private
 */

authRouter.get("/get-me", authUser, getMe);



/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email
 * @access Public
 * @query { token }
 */
authRouter.get("/verify-email", verifyEmail);


export default authRouter;

//===========================================

// now, we will create the "getMe" controller.



---------------------------------
src/controllers/auth.controller.js
---------------------------------


```javascript
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  // here, we have not hashed the password, because we have used pre hook in the user model to hash the password. agar password aaya hoga, toh khud usko hash karke save kar lega database main.

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  // after this, user get registered but not verified
  // so we will send an email to the user to verify the email address
  // this mail will contain a link.
  // when user will click on the link, a request will be sent to server, server identify the user, and set the verified to true.
  // we will implement a feature so that our server could send email, for that we use nodemailer

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Verify your email address by clicking on the link below:</p>
                <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  // if user found, then we will check, if the user is verified or not.
  // this check is very important, because, we have to send email verification link to the user at the time of registration.
  // user, jb tak apna email ko verify nhi krega, tab tk user ko login nhi karne denge.

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email address before logging in.",
      success: false,
      err: "User not verified",
    });
  }

  // after this, we will compare the password.

  const isPasswordMatch = user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid password",
      success: false,
      err: "Invalid password",
    });
  }

  // if user is verified and password is valid, then we will generate a jwt token.

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @route GET /api/auth/get-me
 * @desc Get current user
 * @access Private
 */


export async function getMe(req, res){
  const userId = req.user.id;
  
  const user = await userModel.findById(userId).select("-password");
  
  if(!user){
    return res.status(400).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  return res.status(200).json({
    message: "User found",
    success: true,
    user,
  });
  
}


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    // agar user mil jata hai, uska varified status ko true kardenge.

    user.verified = true;
    await user.save();

    // await sendEmail({
    //   to: user.email,
    //   subject: "Email verified successfully",
    //   html: `
    //               <p>Hi ${user.username},</p>
    //               <p>Your email has been verified successfully.</p>
    //               <p>Best regards,<br>The Perplexity Team</p>
    //       `,
    // });

    const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified successfully. You can now log in to your account.</p>
    <a href="http://localhost:${process.env.PORT}/login">Login</a>
    <p>Best regards,<br>The Perplexity Team</p>
    `;

    return res.send(html);
  } catch (err) {
    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found",
      });
    }
  }
}
```

//===========================================

=>ab tak, humne authentication implement kar chuke hai, now we will integrate  AI. hum 2-3 AI models use karenge in one application, but primary the 2 models are Gemini and Mistral.

=> so, hum avi dekhenge ki application kaam kaise karega.

=> jo AI banake rakha hai, hum unki services ko use karenge.

=> There are 3 things, 1. User, 2. Server , 3.AI services

=> user message karega, server usko store karega. fir AI ko request karega, fir AI se response leke, usko bhi server store karega, and fir response server user ko send karega.


Flow kuch aisa hota hai:

1. User message bhejta hai
2. Server request receive karta hai
3. Server user ka message database me store karta hai
4. Server AI service ko request bhejta hai
5. AI service response generate karti hai
6. Server AI response receive karta hai
7. Server AI response bhi database me store karta hai
8. Server final response user ko bhej deta hai

//===========================================

User
  ↓
Server/API
  ↓
Database (store user message)
  ↓
AI Service (OpenAI etc.)
  ↓
Server receives AI response
  ↓
Database (store AI response)
  ↓
User gets response





Database mein dono ke messages store hote hain — **User** ke bhi aur **AI** ke bhi. 

Agar aap apne `message.model.js` file ko dekhenge, toh usme ek `role` naam ka field define kiya gaya hai:

```javascript
        role: {
            type: String,
            enum: [ 'user', 'ai' ],
            required: true,
        },
```

Yeh isliye kiya jata hai kyunki:
1. **Chat History Dikhane ke liye:** Jab user wapas us chat ko khelega, toh use poori conversation (kya usne poocha aur kya AI ne jawab diya) dikhani hoti hai.
2. **Context Yaad Rakhne ke liye:** AI ko past messages bhejne padte hain taaki wo aage ke sawaalon ka jawab pehle ki baaton ko dhyan mein rakh kar de sake.

Toh jab bhi koi naya message create hoga, uska `role` ya toh `'user'` hoga (jab aap kuch type karenge) ya `'ai'` hoga (jab system se response aayega).




//===========================================
=> to use AI, we create a file, ai.service.js. jo bhi hum AI se interact karenge, wahi saare functions iss file me likhenge.

=> now, we will use langchain library. we can use langchain with multiple service provider. as of now we will use gemini.



in LangChain, click on Docs > click on "open source", after  that on the left side click on "Pyhton" and change it to "Typescript" then click on "Models". ON the left side, there is a section called "Models". Scroll down and then click on "Google Gemini". Copy this line: 

`npm install @langchain/google-genai`. Paste it in your terminal. and install it. 


also install langchain::
npm install langchain




//============================================


create src/services/ai.service.js file. and add this code in it:

```javascript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});


```


1. go to https://aistudio.google.com
2. click  on "Get API Key". 
3. again, click on "Create API Key". 
4. create a new project
5. then create a new API key, copy that key, make changes in env file:

GEMINI_API_KEY=AIzaSyB-NuRdOUqbBj5n2vpz0_oEDsNrRc2N9uQ


create a function in ai.service.js file and then run the function inside, server.js file. (this is just for testing purpose, )

--------------------------
src/services/ai.service.js
--------------------------


```javascript

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAi(){
    model.invoke("What is the capital of France?").then((res)=>{
        console.log(res.text);
    })
}

```

--------------------------
src/server.js
--------------------------


```javascript
//server.js file ke andr, 


//this file is for testing ai.service.js file.


import { testAi } from "./src/services/ai.service.js";

testAi();

//change the question in ai.service.js file and run the server.js file again. it will show you the response.


```



=> Better look at video to understand, how to use langchain with gemini. start looking from 1:00:00hrs


