import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

// import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { timeStamp } from "console";
import exp from "constants";

///////////// All Commented out sections were stolen from TDShop to be modded later ///////////////
//////////// The returning statements is just proof of concept /////////////////////////////////

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); //using the function from utils/generateToken.js
    
    res.status(200).json({
      _id: user._id,
      name: user.name, 
      email: user.email,
      isMember: user.isMember,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password. Please try again.');
  }
  console.log(req.body);
  res.send('Auth user');
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => { 
  const { name, email, password } = req.body;
  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400); // respond with 400 client error
    throw new Error('User already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    isMember: false,
    isAdmin: false,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name, 
      email: user.email,
      isMember: user.isMember,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data. Please try again.');
  }
  // res.send('Register user');
});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => { 
  // clear the cookie named 'jwt'
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully.' });
  // res.send('Logout user');
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => { 
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name, 
      email: user.email,
      isMember: user.isMember,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
  // res.send('Get user profile');
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => { 
  const user = await User.findById(req.user._id);

  const userExits = await User.findOne({ email });
  if(userExits._id !== req.user._id) {
    res.status(400);
    throw new Error('User already exists. - You cannot update to an existing email.');
  }

  if (user) {
    // dont have to update all fields -- only the ones that are sent
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // if password is sent, update it since its hashed and needs to be re-hashed
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // generateToken(res, updatedUser._id);
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name, 
      email: updatedUser.email,
      isMember: updatedUser.isMember,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
  // res.send('Update user profile');
});

// @desc    Update user Membership
// @route   PUT /api/users/updateMember
// @access  Private
const updateUserMembership = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isMember = req.body.isMember;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name, 
      email: updatedUser.email,
      isMember: updatedUser.isMember,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
  // res.send('Update user membership');
});

// @desc    send forgot password email
// @route   POST /api/users/forgot-password
// @access  public
const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body;
  
  const token = jwt.sign({ id: email, timestamp: new Date().getTime() }, process.env.JWT_SECRET, {expiresIn: '10m'})


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailConfig = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Forgot Password',
    text: `Hi, please follow this link to reset your password: http://localhost:3000/ResetPassword?token=${token}`,
  };

  transporter.sendMail(mailConfig, function(err, info) {
    if (err) {
      console.log(err);
      res.status(500).json({message: 'Error sending email'});
    } else {
      console.log(info);
      res.status(200).json({message: 'Email sent'});
    }
  });
});

// @desc    Reset password
// @route   PUT /api/users/reset-password
// @access  public
const resetPassword = asyncHandler(async (req, res) => {
  //////Currently having issues with getting the token to the backend ///////
  console.log("in the reset password route - userController.js");
  const { password, token } = req.body;

  console.log(`Token received: ${token}`);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(401).json({message: 'Invalid or expired token'});
    } else {
      const { email } = decoded;

      const user = await User.findOne({ email });

      if(user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(200).json({message: 'Password reset successful'});
      } else {
        res.status(404).json({message: 'User not found'});
      }
    }
  });
});

/////////////// admin routes /////////////////
////////////// To be developed at a later release /////////////////

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => { 
  // const users = await User.find({});
  // res.json(users);
  res.send('Get all users');
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => { 
  // const user = await User.findByIdAndDelete(req.params.id);

  // if (user) {
  //   res.json({ message: 'User removed' });
  // } else {
  //   res.status(404);
  //   throw new Error('User not found');
  // }
  res.send('Delete user');
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => { 
  // const user = await User.findById(req.params.id);

  // if (user) {
  //   res.json(user);
  // } else {
  //   res.status(404);
  //   throw new Error('User not found');
  // }
  res.send('Get user by ID');
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => { 
  // const user = await User.findById(req.params.id);

  // if (user) {
  //   user.name = req.body.name || user.name;
  //   user.email = req.body.email || user.email;
  //   // Update other properties as needed

  //   const updatedUser = await user.save();

  //   res.json({
  //     _id: updatedUser._id,
  //     name: updatedUser.name,
  //     email: updatedUser.email,
  //     // Send other properties as needed
  //   });
  // } else {
  //   res.status(404);
  //   throw new Error('User not found');
  // }
  res.send('Update user');
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateUserMembership,
  forgotPassword,
  resetPassword
};