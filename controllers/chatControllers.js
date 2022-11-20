import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import { getIO } from '../config/socketio.js';

export const newMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const chat = await Chat.create({
    message,
    name: req.user.name,
    user: req.user._id,
  });
  const io = getIO();
  io.emit('chat message', chat);
  res.json(chat);
});

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await Chat.find({ user: req.user._id });
  const newMessages = messages.map((obj) => {
    return {
      user: req.user.name,
      message: obj.message,
    };
  });
  res.json(newMessages);
});
