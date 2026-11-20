const UserModel = require("../models/user.model");
const bcrypt = require('bcrypt');

let registerController = async (req, res) => {
  try {
    // Registration logic here
    let {name, email, password} = req.body;
    if(!email || !password ) {
      return res.status(400).send('All fields are required');
    }

    let isExisted = await UserModel.findOne({ email });
    if(isExisted) {
      return res.status(409).send('User already exists with this email');
    }
    let hashPass = bcrypt.hashSync(password, 10);
    let newUser = await UserModel.create({ name, email, password: hashPass });

    

  } catch (error) {
    res.status(500).send(error.message);
  }
};


let loginController = async (req, res) => {
  try {
    // Login logic here
    res.send('User logged in');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { registerController, loginController };