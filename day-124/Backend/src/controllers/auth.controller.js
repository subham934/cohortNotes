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
