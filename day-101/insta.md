=> Authentication
    => Register
    => Login
    => Logout (token blacklisting)
    => [OTP Based registration]
    

=> post 
    => create a user
    => can see the feed
    => like posts (collection types)
    => save post


=> users 
    => followers
    => following

Lets start with creating the backend first
//================================
----------------------
day-101 > src > app.js
----------------------

const express = require("express");

const app = express();
app.use(express.json());


module.exports = app;



// now lets create server.js


-------------------
day-101 > server.js
-------------------

const app = require('./src/app')

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})


// now lets connect with database, for that we need to create a folder called "config" inside the "src" folder and inside that, a file called database.js, the content inside database.js are as follows:

------------------------------------
day-101 > src > config > database.js
------------------------------------

const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToDB;

=> the above is a database file, here we have connected the database file to a MONGO_URI , which is inside the .env file, with the code:

mongoose.connect(process.env.MONGO_URI)

=> now we need to import the database file to server.js and run the connectToDB() function inside server.js, also we need to connect with .env file , for that we need to install dotenv package. 
=> run - npm i dotenv , after installing we need to import it to server.js file as 
--- require('dotenv').config()  


-------------------
day-101 > server.js
-------------------

require("dotenv").config() 
// this should be the first line of server.js to connect with .env file. if we dont write it at the beginning , we wont be able to connect with .env file.

const app = require('./src/app')
const connectToDB = require('./src/config/database')

connectToDB()

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})


=========================================


=> now we will create a model 

--------------------------------------
day-101 > src > models > user.model.js
--------------------------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    unique: [true, "User name already exists"],
    required: [true, "username is required"],
  },

  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  
  bio: String,
  
  profileImage: {
    type: String,
    default: "https://ik.imagekit.io/lq7qd2rhd/IMG-20251226-WA0073.jpg",
  },

});


const userModel = mongoose.model('users', userSchema)

module.exports = userModel;

====================================

=> abb hum user ko register karenge, register main do kaam hota hai:
1. user ka data save karna
2. token user ko dena

=> abb itna karne k liye hum api create karenge, routes folder k andar

---------------------------------------
day-101 > src > routes > auth.routes.js
---------------------------------------


const express = require("express");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// POST  api/auth/register
authRouter.post("/register", async (req, res) => {
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

  const hash = crypto.createHash("sha256").update(password).digest("hex");

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
  });
});

module.exports = authRouter;


----------------------
day-101 > src > app.js
----------------------
const express = require("express");
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

module.exports = app;



=> you dont need much description about the above day-101 > src > routes > auth.routes.js and day-101 > src > app.js, u know about crypto, cookie-parser, jsonwebtoken, const authRouter = express.Router();



======================================


=> Now, we will create another api called "login", where we will check if a user logged in is a valid user or not, we can login either with username or password


---------------------------------------
day-101 > src > routes > auth.routes.js
---------------------------------------


const express = require("express");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// POST  api/auth/register
authRouter.post("/register", async (req, res) => {
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

  const hash = crypto.createHash("sha256").update(password).digest("hex");

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
});

authRouter.post("/login", async (req, res) => {
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

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  if (user.password !== hash) {
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
});

module.exports = authRouter;


=============================================================================================================================================================



=> Now , we have one more layer called controllers. Controllers wo functions hote hain jo API ki logic handle karte hain.

Matlab:

    - request receive karna

    - database se data lena

    - response bhejna

Simple words me: Controller = API ka brain
=> routes file main sirf api define hota hai, controller main uss api ka function rehta hai


------------------------------------------------
day-101 > src > controllers > auth.controller.js
------------------------------------------------


const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



async function registerController (req, res) {
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

  const hash = crypto.createHash("sha256").update(password).digest("hex");

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


async function loginController (req, res) {
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

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  if (user.password !== hash) {
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
    loginController
}

---------------------------------------
day-101 > src > routes > auth.routes.js
---------------------------------------
const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

// POST  api/auth/register
authRouter.post("/register", authController.registerController);

// POST  api/auth/login

authRouter.post("/login", authController.loginController);

module.exports = authRouter;
