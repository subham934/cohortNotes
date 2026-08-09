import userModel from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';



export async function register(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(409).json({
      success: false,
      message: 'Username or email already exists',
    });
  }

  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );



  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      username: user.username,
      email: user.email,
    },
  });
}


export async function getMe(req, res){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Token not Found"
        })
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    if(!decodedToken){
        return res.status(401).json({
            success:false,
            message:"Token not Valid"
        })
    }

    const user = await userModel.findById(decodedToken.id);

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }

    res.status(200).json({
        success:true,
        user
    })

}