Here is the full notes of this lacture:

Today I'll see about JWT and authentication:

=> user sends a request for registering with name, email, password, to the server.
=> server saves this details on DB and creates a token .
=> this token is signed with JWT secret and returned to user.
=> there is a rule about authentication, once the user is registered, and he has a token , then any amount of request sent by our user to server has to have the token to identify the user.



At first lets create a folder day-97 and install express and mongoose

=> day-97 > src > app.js
------------------------

const express = require("express");

const app = express();
app.use(express.json());

module.exports = app;


=> day-97 > server.js
---------------------


const app = require("./src/app");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


=> here, once we run the server , over the console we see "Server is running on port 3000"




=> Now, lets connect it with database, for that we create another file inside the newly created config folder

=> day-97 > src > config > database.js
--------------------------------------


const mongoose = require("mongoose")

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    }   
    ).catch((err) => {
        console.log("Error connecting to MongoDB", err)
    })
}

module.exports = connectDB;

the MONGO_URI is inside the .env file, to access the variable inside .env we need to install another package called "npm i dotenv", then we go to server.js and write as : 

=> day-97 > server.js
---------------------

require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB()


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


=> after doing this , we need to start the server and we can see over the console that "Server is running on port 3000" and "Connected to MongoDB" (I know how to connect to server & MONGO_URI)

=> Now to save any data inside database we need to tell its format or schema of the data, for that we create another folder called models

=> day-97 > src > models > user.model.js
----------------------------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;


=> we create Schema for format and create Model to perform operation over the user


=======================


Now we will create an API call "/ragister" to ragister the users info on our database , and also create a token , so all these time, we were creating our api inside app.js , but now we will do so inside a new file called auth.routes.js
=> Inside this file , we will create our api and export to app.js

day-97 > src > routes > auth.routes.js
--------------------------------------


const express = require("express");

const authRouter = express.Router(); 
// if we wish to create api in another file apart from app.js we need to use this function express.Router()


authRouter.post("/register", (req, res) => {
  const { email, name, password } = req.body;

})


module.exports = authRouter;


=> Now we need to save data inside database , for that we need userModel

day-97 > src > routes > auth.routes.js
--------------------------------------

const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router(); 
// if we wish to create api in another file apart from app.js we need to use this function express.Router()


authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

    const user = await userModel.create({
    email,
    password,
    name,
  });

  res.status(201).json({
    message: "User Registered",
    user,
  });

})


module.exports = authRouter;

=> here, in this file we have created an api but our express server knows nothing about it, to make sure our express server knows it, we need to import it on app.js

=> day-97 > src > app.js
------------------------

const express = require("express");
const authRouter = require("./routes/auth.routes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter); // this means that to use "/register" we need to write it as "/api/auth/register", we need to use this on postman to send data to our server to save it on database

module.exports = app;

=> Only now we can send the details to our database

========================================


=> now there is one problem, logically, we can't create multiple account with same email address but here, we did not do any authentication , for that we will modify our schema


=> day-97 > src > models > user.model.js
----------------------------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: {
    type: String,
    unique: [true, "With this email user account already exists."]
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

//now we see that we wont create a duplicte user with same email ID. We see an error message pop up as With this email user account already exists and also a "500 Internal Server Error", we dont show "500 Internal Server Error" , instead of that we give a proper valid response, for that we go to auth.routes.js and check if the user from the perticular email exist, if so, display a message stating: "User Already Exist with this email address"



day-97 > src > routes > auth.routes.js
--------------------------------------

const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router(); 
// if we wish to create api in another file apart from app.js we need to use this function express.Router()


authRouter.post("/register", async (req, res) => {
    const { email, name, password } = req.body;


    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already Exist with this email address",
    });
    }


    const user = await userModel.create({
    email,
    password,
    name,
  });

  res.status(201).json({
    message: "User Registered",
    user,
  });

})


module.exports = authRouter;


=> Now that user registration is done , we need to create a token, for that we need a package called 
=> npm i jsonwebtoken
=> after installing we need to require it inside auth.routes.js and use it there,
=> when we create a token we do it with user data , and the server signs it with JWT_SECRET
=> JWT_SECRET for different servers are different, instagram, whatsapp, twitter has different JWT token
=> to generate a JWT Secret we go to a website called https://jwtsecrets.com/    
=> we generate a jwt_secret key and paste it inside .env file

day-97 > .env
-------------

MONGO_URI = 'mongodb+srv://subham:BMpgGzjJqEkWKvVC@cluster0.weka4h8.mongodb.net/day-97'

JWT_SECRET = 83650a8add2caaa8911ee692a5ab1f2bf8a08922de9e3d1c970d2e1b2f4f4cb0


day-97 > src > routes > auth.routes.js
--------------------------------------

const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router(); 
// if we wish to create api in another file apart from app.js we need to use this function express.Router()
const jwt = require("jsonwebtoken");


authRouter.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already Exist with this email address",
    });
    }


    const user = await userModel.create({
    email,
    password,
    name,
    });

    const token = jwt.sign(
    {
      id: user._id, // we can use either one of the two or both
      email: user.email,
    },
        process.env.JWT_SECRET,
    );


    res.status(201).json({
    message: "User Registered",
    user,
    token, // tokan is a string , combination of userdata and jwt secret, with the help of jwt.sign, our server create a token and return it back to us

    });
})

module.exports = authRouter;


=> now a token is generated and when we copy the token and paste it on https://www.jwt.io we get the data of user

=> now after we get the token, whenever we request anything to the server we need to provide the token, for that we use storages. 

=> server has direct access to cookies storage. 


=> 👉 Server can read and write only the cookies that belong to its own domain and are sent in the request.


=> now we will set token inside cookies, for that we need one more package npm i cookie-parser
=> cookie perser is used as a middleware , and for that we need to import it on app.js

------------------------
=> day-97 > src > app.js
------------------------

const express = require("express");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser()); // its a middleware

app.use("/api/auth", authRouter);
module.exports = app;



day-97 > src > routes > auth.routes.js
--------------------------------------

const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router(); 
// if we wish to create api in another file apart from app.js we need to use this function express.Router()
const jwt = require("jsonwebtoken");


authRouter.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already Exist with this email address",
    });
    }


    const user = await userModel.create({
    email,
    password,
    name,
    });

    const token = jwt.sign(
    {
      id: user._id, // we can use either one of the two or both
      email: user.email,
    },
        process.env.JWT_SECRET,
    );

    // saving token in cookies 
    res.cookie("jwt_token", token);

    res.status(201).json({
    message: "User Registered",
    user,
    token, // tokan is a string , combination of userdata and jwt secret, with the help of jwt.sign, our server create a token and return it back to us

    });
})

module.exports = authRouter;