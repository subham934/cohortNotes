API response structure should be consistent

in package.json, we have given 
  "type": "module",
so we can import and export modules

today, we will learn about error handling in express.js

1. what is error handling
2. how to handle error in express.js
3. different types of error
4. best practices for error handling


in day-118, we will install "npm i express" for creating a server

------------
src > app.js
------------

import express from 'express'

const app = express()

export default app

//===============================
-------------------
day-118 > server.js
-------------------
import app from "./src/app.js";

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


//===============================//
----------------------
src > routes > auth.routes.js
----------------------

import {Router} from 'express'

const authRouter = Router()


export default authRouter;

//===============================

now , we will go to app.js and import authRouter

-------------------
src > app.js
--------------------

import express from "express";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

export default app;


//===============================/
now, lets create a controller for auth


----------------------------------------
src > controllers > auth.controller.js
----------------------------------------

export async function registerUser(req, res){
    throw new Error("Encounter an error while registering new user");
}

//===============================//

now , we will import authController in authRouter

----------------------
src > routes > auth.routes.js
----------------------

import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);

export default authRouter;

//===============================//

=> now, when we go to postman and type 
http://localhost:3000/api/auth/register

we get an error like below


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Error</title>
</head>

<body>
    <pre>Error: Encounter an error while registering new user<br> &nbsp; &nbsp;at registerUser (file:///E:/cohort/day-118/src/controllers/auth.controller.js:2:11)<br> &nbsp; &nbsp;at Layer.handleRequest (E:\cohort\day-118\node_modules\router\lib\layer.js:152:17)<br> &nbsp; &nbsp;at next (E:\cohort\day-118\node_modules\router\lib\route.js:157:13)<br> &nbsp; &nbsp;at Route.dispatch (E:\cohort\day-118\node_modules\router\lib\route.js:117:3)<br> &nbsp; &nbsp;at handle (E:\cohort\day-118\node_modules\router\index.js:435:11)<br> &nbsp; &nbsp;at Layer.handleRequest (E:\cohort\day-118\node_modules\router\lib\layer.js:152:17)<br> &nbsp; &nbsp;at E:\cohort\day-118\node_modules\router\index.js:295:15<br> &nbsp; &nbsp;at processParams (E:\cohort\day-118\node_modules\router\index.js:582:12)<br> &nbsp; &nbsp;at next (E:\cohort\day-118\node_modules\router\index.js:291:5)<br> &nbsp; &nbsp;at router.handle (E:\cohort\day-118\node_modules\router\index.js:186:3)</pre>
</body>

</html>

=> express has in inbuilt error handling mechanism , which helps us from crashing the server.

=> here, there is a problem with the inbuilt error handler. the error is in HTML format
we want to see the error in JSON format

=>the problem is if there was no error, we would have got the response in JSON format but due to error, we are getting the error in HTML format

=> for that we have to create our own error handling middleware. the error handling middleware always have 4 arguments. (err, req, res, next)


--------------------------------------
src > middleware > error.middleware.js
--------------------------------------


function handleError(err,req, res, next ){
    res.status(500).json({
        message: err.message,
    })
}

export default handleError;

//=====================================//

-> now we will import this error handler in app.js, at the end of the file.

------------------
src > app.js
------------------

import express from "express";
import authRouter from "./routes/auth.routes.js";
import handleError from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

//Error handler middleware
app.use(handleError);

export default app;

//=====================================//

=> we have used the error handling middleware. now , when the error occurs, in this case, its auth.controller.js file, we use try-catch block. 

=> also, every controller has the next parameter as built-in.
--------------------------------------
src > controllers > auth.controller.js
--------------------------------------

export async function registerUser(req, res, next) {
  try {
    throw new Error("Encounter an error while registering new user");
  } catch (err) {
    next(err);
  }
}


=> now, when we trigger the endpoint http://localhost:3000/api/auth/register at postman, we get response in JSON format.

=> if we comment out the app.use(handleError) line in app.js, we get the error in HTML format.


//=====================================//


=> in the middleware, we have used the 500 status code. now , we will throw differnt kind of error like 
400 for bad request (password is too week)
401 for unauthorized

for that we have to use err.status in the middleware function

--------------------------------------
src > controllers > auth.controller.js
--------------------------------------

export async function registerUser(req, res, next) {
  try {
    throw new Error("Password is too week");
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

--------------------------------------
src > middleware > error.middleware.js
--------------------------------------

function handleError(err, req, res, next) {
  res.status(err.status).json({
    message: err.message,
  });
}

export default handleError; 


=> now, when we trigger the endpoint http://localhost:3000/api/auth/register at postman, we get response in JSON format with status code 400 Bad request.

=> if we send better status code, it gets easy for the front-end developer to understand the error. 

//=====================================//

lets try with "user already exist"

--------------------------------------
src > controllers > auth.controller.js
--------------------------------------

export async function registerUser(req, res, next) {
  try {
    throw new Error("user already exist");
  } catch (err) {
    err.status = 409;
    next(err);
  }
}

--------------------------------------
src > middleware > error.middleware.js
--------------------------------------

function handleError(err, req, res, next) {
  res.status(err.status).json({
    message: err.message,
  });
}

export default handleError; 


//=====================================//

=> now, agar humko batana rehta hai ki error exactly aaya kaha pe, iskeliye hum stack use karte hai.

--------------------------------------
src > middleware > error.middleware.js
--------------------------------------

function handleError(err, req, res, next) {
  res.status(err.status).json({
    message: err.message,
    stack: err.stack,
  });
}

export default handleError;

=> abb, hum jab postman pe http://localhost:3000/api/auth/register endpoint trigger karte hai, tab humko response me stack milta hai as below::


{
    "message": "user already exist",
    "stack": "Error: user already exist\n    at registerUser (file:///E:/cohort/day-118/src/controllers/auth.controller.js:3:11)\n    at Layer.handleRequest (E:\\cohort\\day-118\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (E:\\cohort\\day-118\\node_modules\\router\\lib\\route.js:157:13)\n    at Route.dispatch (E:\\cohort\\day-118\\node_modules\\router\\lib\\route.js:117:3)\n    at handle (E:\\cohort\\day-118\\node_modules\\router\\index.js:435:11)\n    at Layer.handleRequest (E:\\cohort\\day-118\\node_modules\\router\\lib\\layer.js:152:17)\n    at E:\\cohort\\day-118\\node_modules\\router\\index.js:295:15\n    at processParams (E:\\cohort\\day-118\\node_modules\\router\\index.js:582:12)\n    at next (E:\\cohort\\day-118\\node_modules\\router\\index.js:291:5)\n    at router.handle (E:\\cohort\\day-118\\node_modules\\router\\index.js:186:3)"
}


=> but, we wont send error stack in production mode. So, we will use environment variable to check if the environment is development mode or production mode.

=> if the environment is development mode, then we will send stack. else we wont send stack.

install npm i dotenv

create a .env file and write as below:

NODE_ENVIRONMENT=development

-> there is one problem with the .env package. hum jis file k ander dotenv.config() method call karte hain, hum uss file k andar hi environment variable use kar sakte hai. not in other files.

-> for example, agar hum ne app.js me call kiya toh, hum sirf app.js me hi environment variable use kar sakte hai. not in other files.

-> abhi k liye , hum kuch aisa karte hai::


--------------------------------------
src > middleware > error.middleware.js
--------------------------------------

import dotenv from "dotenv";

dotenv.config();

function handleError(err, req, res, next) {
  const response = { message: err.message };

  if (process.env.NODE_ENVIRONMENT === "development") {
    response.stack = err.stack;
  }

  res.status(err.status).json(response);
}

export default handleError;


=> now, when we trigger the endpoint http://localhost:3000/api/auth/register at postman, we get response in JSON format with stack.

=> if we go to .env file and change NODE_ENVIRONMENT=development to NODE_ENVIRONMENT=production and restart server, then we wont get stack in response.

//====================================//

=> now, lets see express-validator.

=> install npm i express-validator

when we studies authentication system, tab humne dekha tha ki poore authentication system me 4 pillars hote hain.
1.Authentication
2.Authorization
3.validation
4.verification

-> these are the 4 pillars of authentication system.

=> validation ka matlab hai ki jo data humare pass aah raha hai, uss data ka format check karna. jaisa ki, username string hona chahiye, email valid hona chahiye, password ki length 6 se greater hona chahiye.

=> user request karta hai server pe,
- wo request jata hai app.js pe, 
- app.js pe se authRouter me jata hai, 
- authRouter pe se /api/auth/register route pe jata hai, 
- phir finally wo jati hai controller pe.  


- abhi yehi controller database se communicate karta hai.
- aur finally we send response to the user.

=> agar request controller tak pahucha hi gayi, controller pe heavy operation hota hai , aur wo data database main ja sakta hai. agar hum controller k jane se pehle agar validation lagate hain toh, hum unnecessary database call ko rok sakte hain.

//====================================//

--------------------------
src > routes > auth.routes.js
--------------------------

import { registerUser } from "../controllers/auth.controller.js";
import { Router } from "express";
import { body, validationResult } from "express-validator";


const authRouter = Router();

authRouter.post("/register", [
  body("username").isString().withMessage("Username must be a String"),
  body("email").isEmail().withMessage("Email should be a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], registerUser);

export default authRouter;



--------------------------------------
src > controllers > auth.controller.js
--------------------------------------

export async function registerUser(req, res, next) {
  res.status(201).json({
    message: "user registered successfully",
  });
}



--------------------------


we send the data from postman as::
{
    "username": 123,
    "email": "kaka123@email",
    "password": 111
}

we still get response as :::
{
    "message": "user registered successfully"
}

//=====================================//

=> in the above code, we are not getting the validation errors even after applying the validation rules and sending invalid data from postman.

=> our request is reaching the controller hence we are getting the success response. 

=> we have checked the username, email and password, but we didnot send the response to the user in case of validation errors.for that we write as below::



------------------------------
src > routes > auth.routes.js
------------------------------

import { registerUser } from "../controllers/auth.controller.js";
import { Router } from "express";
import { body, validationResult } from "express-validator";

const authRouter = Router();

authRouter.post(
  "/register",
  [
    body("username").isString().withMessage("Username must be a String"),
    body("email").isEmail().withMessage("Email should be a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      res.status(400).json({ errors: errors.array() });
    },
  ],
  registerUser,
);

export default authRouter;


-----------------------------------

now, if we send the data to http://localhost:3000/api/auth/register endpoint in postman as below::


{
    "username": 123,
    "email": "kaka123@email",
    "password": 111
}

we get the error response as::

{
    "errors": [
        {
            "type": "field",
            "value": 123,
            "msg": "Username must be a String",
            "path": "username",
            "location": "body"
        },
        {
            "type": "field",
            "value": "kaka123@email",
            "msg": "Email should be a valid email",
            "path": "email",
            "location": "body"
        },
        {
            "type": "field",
            "value": 111,
            "msg": "Password must be at least 6 characters long",
            "path": "password",
            "location": "body"
        }
    ]
}



now, if we send the data to http://localhost:3000/api/auth/register endpoint in postman as below::


{
    "username": "123asd",
    "email": "kaka123@email",
    "password": 111
}


we get the error response as::

{
    "errors": [
        {
            "type": "field",
            "value": "kaka123@email",
            "msg": "Email should be a valid email",
            "path": "email",
            "location": "body"
        },
        {
            "type": "field",
            "value": 111,
            "msg": "Password must be at least 6 characters long",
            "path": "password",
            "location": "body"
        }
    ]
}

//========================================//


we will create validation in different file::


---------------------------------------
src > validation > auth.validator.js
---------------------------------------

import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  //check if errors array is empty
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

export const registerValidation = [
  body("username").isString().withMessage("Username must be a String"),
  body("email").isEmail().withMessage("Email should be a valid email"),
  body("password")
    .isLength({ min: 6 , max: 12})
    .withMessage("Password must be at least 6 characters long and at most 12 characters long"),
  validate,
];


-----------------------------
src > routes > auth.routes.js
-----------------------------


import { registerUser } from "../controllers/auth.controller.js";
import { Router } from "express";
import { registerValidation } from "../validation/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerUser);

export default authRouter;

//========================================//

=> we can custom Validation also in express-validator.

---------------------------------------
src > validation > auth.validator.js
---------------------------------------


import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  //check if errors array is empty
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

export const registerValidation = [
  body("username").isString().withMessage("Username must be a String"),
  body("email").isEmail().withMessage("Email should be a valid email"),
  body("password").custom((value) => {
    if (value.length < 6 || value.length > 12) {
      throw new Error(
        "Password must be at least 6 characters long and at most 12 characters long",
      );
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    if (!passwordRegex.test(value)) {
      throw new Error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
    }
    return true;
  }),
  validate,
];
