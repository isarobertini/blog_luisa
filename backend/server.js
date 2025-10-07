import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import messageRouter from './routes/messageRouter.js';
import reactionRouter from './routes/reactionRouter.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routers
app.use('/api/messages', messageRouter);
app.use('/api/reactions', reactionRouter);

// Optional root route
app.get('/', (req, res) => {
    res.send('✅ API is running! Try /api/messages or /api/reactions');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
