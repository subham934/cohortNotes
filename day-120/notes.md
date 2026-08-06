today, we will create perplexity::
it will contain : 
-> basic chat application
-> search over internet and provide us final response

Features::
- Authentication
- Chat with AI
- Chat History
- Message Storage
- AI with internet research feature.

data modeling: kaise tum apne data ko structure karte ho database me


User: 
    _id,
    username,
    email,
    password_hash,
    verified,
    created_at,
    updated_at


Chat:
    _id,
    user_id,
    title,
    created_at,
    updated_at

Message:
    _id,
    chat_id,
    content,
    role: [user or AI], 


=> Now , with the help of the above list, we will create the code using AI. at-first , lets create server.js , app.js, and database.js


---------------------
src/config/database.js
---------------------


import mongoose from "mongoose";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;

----------
src/app.js
----------

import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});


export default app;


----------
server.js
----------

import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


=> now, if we start the server with `npm run dev`, it will start the server on port 3000 and it will connect to the database.


//==========================================

=> now that our basic server is set, we will create models.

------------------------
src/models/user.model.js
------------------------

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;


-------------------------
src/models/message.model.js
-------------------------

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [ 'user', 'ai' ],
            required: true,
        },
    },
    { timestamps: true }
);

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;


-------------------------
src/models/chat.model.js
-------------------------

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
  },
  { timestamps: true } // automatically adds created_at (createdAt) and updated_at (updatedAt)
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;


//==========================================

=> now that we have created our models, in the user.model.js, we can see that there is a state called "verified" with the boolean value "false" by default, this needs to be changed, until and unless the user is not verified, he should not be able to use the app.

=> till now, what we did was after registration, the server created a token and sent it to the user, and the user was able to use the app. this should not happen. instead of sending the token, the server should send a mail to the user's registered email address, and the user should be able to use the app only after verifying the email address. 

=> after the mail is verified, the verified should change to true, and then the user can use the app. so we wont create token after registration. rather we will send a link to the user's registered email address, and once the user clicks on the link, a request will be sent to the server, and based on that , the verified should change to true, and then the user should login and a token will be generated and sent to user.

=> so the token will only be generated when the verified:true




//==========================================

=> now , we will create authentication system.lets create routes

-------------------------
src/routes/auth.routes.js
-------------------------

import {Router} from 'express';

const authRouter = Router();

authRouter.route("/register")

export default authRouter;

//==========================================

=> we will do validation , for that we use auth.validator.js ::
install npm i express-validator

----------------------------
src/validators/auth.validator.js
----------------------------

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

//==========================================

now , lets make changes in the app.js
-----------
src/app.js
-----------


import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});


app.use('/api/auth', authRouter)

export default app;


//==========================================

let update the routes file::

---------------------------
src/routes/auth.routes.js
---------------------------

import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";

const authRouter = Router();


authRouter.post("/register", registerValidator, register);

export default authRouter;




//==========================================





now , we will create controller, here we will send email to the user to verify the email address
lets install nodemailer::
npm i nodemailer







----------------------------------
src/controllers/auth.controller.js
----------------------------------

import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email }, { username } ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })


      // here, we have not hashed the password, because we have used pre hook in the user model to hash the password. agar password aaya hoga, toh khud usko hash karke save kar lega database main.

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
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

}


https://github.com/ankurdotio/Difference-Backend-video/tree/main/026-nodemailer

read this for understanding nodemailer and how to setup the google oauth2 or better , watch his video

//==========================================
=> in the just above auth.controller.js, i've written the code for sending email, lets create the mail.service.js file to handle this, as it makes our code modular

we will use nodemailer to send email.
we will use google oauth2 to send email.

so first of all, we need to set up the google oauth2.

create a file named .env in the root directory, and add the following variables:
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_USER=your_email

after all the above, create the mail.service.js file, and add the following code::


-----------------------------
src/services/mail.service.js
-----------------------------

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
})


//with nodemailer, we need to create a transporter as well, using which we send the email
// jo hamari mail wali service hai, jo hamari mail handle karti hai, wo sare mail SMTP server ke through hi send karti hai. it cant be done by our webserver. transporter helps in communicating between our web and smtp server.


//The Web Server (Your Node.js app) is like the person writing a letter.
//The SMTP Server (like Gmail, SendGrid, or Mailtrap) is the Post Office.
//The Transporter is the delivery truck or the connection that carries your letter from your house to the post office.

// yaha hum google k smpt server use kar rahe hain, inn server se connect karne k liye auth property use hota hai. so the google id's we have in .env file is used here.



//transporter.verify() checks the email server and confirm that its ready to send emails.


transporter.verify()
    .then(() => { console.log("Email transporter is ready to send emails"); })
    .catch((err) => { console.error("Email transporter verification failed:", err); });


export async function sendEmail({ to, subject, html, text }) {

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
}



//==========================================
