import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/mail.service.js';
import crypto from 'crypto';

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
      message: 'User with this email or username already exists',
      success: false,
      err: 'User already exists',
    });
  }

  const user = await userModel.create({ username, email, password });

  // here, we have not hashed the password, because we have used pre hook in the user model to hash the password. agar password aaya hoga, toh khud usko hash karke save kar lega database main.

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET
  );

  // after this, user get registered but not verified
  // so we will send an email to the user to verify the email address
  // this mail will contain a link.
  // when user will click on the link, a request will be sent to server, server identify the user, and set the verified to true.
  // we will implement a feature so that our server could send email, for that we use nodemailer

  const verificationUrl = `http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}`;

  await sendEmail({
    to: email,
    subject: 'Welcome to NexusAI - Verify Your Email',
    html: `
<div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090f; color: #f3f4f6; padding: 40px 20px; margin: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #0e111a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 40px 30px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; color: #31b8c6; font-size: 26px; font-weight: 800; text-decoration: none; font-family: 'Outfit', sans-serif;">
        <span style="vertical-align: middle;">✦ NexusAI</span>
      </div>
    </div>
    
    <!-- Heading -->
    <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 20px; text-align: center; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">
      Verify Your Email
    </h1>
    
    <!-- Content -->
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">Hi ${username},</p>
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
      Thank you for registering at <strong>NexusAI</strong>. We're excited to have you on board! To activate your account and start using our platform, please verify your email address by clicking the button below:
    </p>
    
    <!-- Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background-color: #31b8c6; color: #07090f; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 32px; border-radius: 8px; box-shadow: 0 10px 20px rgba(49, 184, 198, 0.15);" target="_blank">
        Verify Email Address
      </a>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 10px;">
      If the button above doesn't work, copy and paste this link into your browser:
    </p>
    <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 12px; font-size: 12px; word-break: break-all; color: #6b7280; text-align: center; line-height: 1.4; margin-bottom: 30px;">
      <a href="${verificationUrl}" style="color: #31b8c6; text-decoration: underline;">${verificationUrl}</a>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
      Best regards,<br />
      <strong>The NexusAI Team</strong>
    </p>
    
    <!-- Divider -->
    <div style="height: 1px; background-color: rgba(255, 255, 255, 0.08); margin: 30px 0;"></div>
    
    <!-- Footer -->
    <div style="text-align: center; font-size: 11px; color: #4b5563; line-height: 1.5;">
      <p style="margin-bottom: 8px; color: #4b5563;">This is an automated verification email. If you did not sign up for a NexusAI account, you can safely ignore this email.</p>
      <p style="margin: 0; color: #4b5563;">&copy; ${new Date().getFullYear()} NexusAI. All rights reserved.</p>
    </div>
  </div>
</div>
    `,
  });

  res.status(201).json({
    message: 'User registered successfully',
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
      message: 'User not found',
      success: false,
      err: 'User not found',
    });
  }

  // if user found, then we will check, if the user is verified or not.
  // this check is very important, because, we have to send email verification link to the user at the time of registration.
  // user, jb tak apna email ko verify nhi krega, tab tk user ko login nhi karne denge.

  if (!user.verified) {
    return res.status(400).json({
      message: 'Please verify your email address before logging in.',
      success: false,
      err: 'User not verified',
    });
  }

  // after this, we will compare the password.

  const isPasswordMatch = user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'Invalid password',
      success: false,
      err: 'Invalid password',
    });
  }

  // if user is verified and password is valid, then we will generate a jwt token.

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  res.cookie('token', token);

  res.status(200).json({
    message: 'User logged in successfully',
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

export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select('-password');

  if (!user) {
    return res.status(400).json({
      message: 'User not found',
      success: false,
      err: 'User not found',
    });
  }

  return res.status(200).json({
    message: 'User found',
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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified Successfully - NexusAI</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #07090f;
      color: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      max-width: 420px;
      width: 90%;
      background-color: rgba(8, 11, 18, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 45px 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
    }
    .icon-container {
      width: 64px;
      height: 64px;
      background-color: rgba(49, 184, 198, 0.1);
      border: 1px solid rgba(49, 184, 198, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px auto;
      color: #31b8c6;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #9ca3af;
      margin: 0 0 32px 0;
    }
    .btn {
      display: block;
      background-color: #31b8c6;
      color: #07090f !important;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      padding: 14px;
      border-radius: 10px;
      box-shadow: 0 10px 20px rgba(49, 184, 198, 0.15);
      transition: all 0.2s ease;
    }
    .btn:hover {
      background-color: #279ba7;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-container">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <h1>Email Verified!</h1>
    <p>Your email address has been verified successfully. You can now close this tab and sign in to your dashboard.</p>
    <a href="${process.env.FRONTEND_URL}/login" class="btn">Sign In to Dashboard</a>
  </div>
</body>
</html>
    `;

    return res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid token',
      success: false,
      err: err.message,
    });
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.status(200).json({
    message: 'User logged out successfully',
    success: true,
  });
}

/**
  * @route POST /api/auth/forgot-password
  * @desc Forgot Password - Send recovery email
  * @access Public
  */
export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'No user registered with this email address',
        success: false,
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store in DB with 15 minutes expiry
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Verification URL redirecting to frontend Client URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Password Request - NexusAI',
      html: `
<div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090f; color: #f3f4f6; padding: 40px 20px; margin: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #0e111a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 40px 30px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; color: #31b8c6; font-size: 26px; font-weight: 800; text-decoration: none; font-family: 'Outfit', sans-serif;">
        <span style="vertical-align: middle;">✦ NexusAI</span>
      </div>
    </div>
    
    <!-- Heading -->
    <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 20px; text-align: center; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">
      Reset Your Password
    </h1>
    
    <!-- Content -->
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">Hi ${user.username},</p>
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
      We received a request to reset the password for your NexusAI account. Please click the button below to set a new password. This link will expire in 15 minutes.
    </p>
    
    <!-- Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${resetUrl}" style="display: inline-block; background-color: #31b8c6; color: #07090f; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 32px; border-radius: 8px; box-shadow: 0 10px 20px rgba(49, 184, 198, 0.15);" target="_blank">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 10px;">
      If the button above doesn't work, copy and paste this link into your browser:
    </p>
    <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 12px; font-size: 12px; word-break: break-all; color: #6b7280; text-align: center; line-height: 1.4; margin-bottom: 30px;">
      <a href="${resetUrl}" style="color: #31b8c6; text-decoration: underline;">${resetUrl}</a>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
      If you did not request a password reset, you can safely ignore this email; your password will remain unchanged.
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
      Best regards,<br />
      <strong>The NexusAI Team</strong>
    </p>
    
    <!-- Divider -->
    <div style="height: 1px; background-color: rgba(255, 255, 255, 0.08); margin: 30px 0;"></div>
    
    <!-- Footer -->
    <div style="text-align: center; font-size: 11px; color: #4b5563; line-height: 1.5;">
      <p style="margin-bottom: 8px; color: #4b5563;">This is an automated security email. Please do not reply directly to it.</p>
      <p style="margin: 0; color: #4b5563;">&copy; ${new Date().getFullYear()} NexusAI. All rights reserved.</p>
    </div>
  </div>
</div>
      `
    });

    return res.status(200).json({
      message: 'Password reset link sent successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to process forgot password request',
      success: false,
      err: error.message
    });
  }
}

/**
  * @route POST /api/auth/reset-password
  * @desc Reset Password - Set new password
  * @access Public
  */
export async function resetPassword(req, res) {
  const { token, password } = req.body;

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset token is invalid or has expired',
        success: false
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      message: 'Password has been reset successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to reset password',
      success: false,
      err: error.message
    });
  }
}
