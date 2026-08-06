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
