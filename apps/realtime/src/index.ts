import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sentinel-realtime' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Journey tracking events
  socket.on('journey:start', (data) => {
    console.log('Journey started:', data);
    // Broadcast to trusted contacts
    socket.broadcast.emit('journey:update', data);
  });

  socket.on('journey:update', (data) => {
    console.log('Journey update:', data);
    socket.broadcast.emit('journey:update', data);
  });

  socket.on('journey:end', (data) => {
    console.log('Journey ended:', data);
    socket.broadcast.emit('journey:complete', data);
  });

  // Panic button - CRITICAL
  socket.on('emergency:panic', (data) => {
    console.log('⚠️  PANIC BUTTON ACTIVATED:', data);
    // Broadcast to all users in area + emergency contacts
    io.emit('emergency:alert', {
      ...data,
      timestamp: new Date().toISOString(),
      priority: 'CRITICAL'
    });
  });

  // Incident reporting
  socket.on('incident:report', (data) => {
    console.log('Incident reported:', data);
    // Broadcast to users in vicinity
    socket.broadcast.emit('incident:new', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚨 Sentinel Nigeria - Realtime Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, io };
