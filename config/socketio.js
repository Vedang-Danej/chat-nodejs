import { Server } from 'socket.io';
let io;
export const initSocketIO = (server) => {
  io = new Server(server);
  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket IO not initilized');
  return io;
};
