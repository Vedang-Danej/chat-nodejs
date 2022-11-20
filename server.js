import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initSocketIO } from './config/socketio.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

const io = initSocketIO(server);

io.on('connection', (socket) => {
  console.log('A user Connected');
});
