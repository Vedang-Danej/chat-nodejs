import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { getIO } from '../config/socketio.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists.');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    const io = getIO();
    io.emit('user joined', { name: user.name });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid User data.');
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  let isMatch;
  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
  }
  if (isMatch) {
    const io = getIO();
    io.emit('user joined', { name: user.name });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid User or Password');
  }
});
