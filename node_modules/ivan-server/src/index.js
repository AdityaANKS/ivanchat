// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';
import rateLimit from 'express-rate-limit';

// Config
import connectDB from './config/database.js';
import { setupSocketHandlers } from './socket/handlers.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import channelRoutes from './routes/channels.js';
import messageRoutes from './routes/messages.js';
import serverRoutes from './routes/servers.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';
import { metricsMiddleware, metricsEndpoint } from './metrics/prometheus.js';

// HTTPS
import fs from "fs";
import https from "https";
import app from "./app.js";

const options = {
  key: fs.readFileSync("./private/server.key"),
  cert: fs.readFileSync("./certs/server.crt"),
};

const app = express();
const httpServer = createServer(app);

// --- Redis Setup ---
const pubClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});
const subClient = pubClient.duplicate();

// --- Socket.io Setup ---
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

// --- Connect MongoDB ---
connectDB();

// --- Security Middleware ---
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// --- Rate Limiting (protects against spam/flooding) ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per window per IP
});
app.use('/api/', limiter);

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Metrics & Monitoring ---
app.use(metricsMiddleware);
app.get('/metrics', metricsEndpoint);

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/channels', authenticateToken, channelRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
app.use('/api/servers', authenticateToken, serverRoutes);

// --- Socket Handlers ---
setupSocketHandlers(io);

// --- Error Handling ---
app.use(errorHandler);

// --- Global Socket Access ---
global.io = io;

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`🚀 HTTPS Server running at https://localhost:${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
});

export default app;
