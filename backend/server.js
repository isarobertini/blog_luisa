// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import dependencies
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import route modules
import messageRouter from './routes/messageRouter.js';
import reactionRouter from './routes/reactionRouter.js';

// Create main Express application (central hub / entry point)
const app = express();

// Middleware
app.use(cors());            // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json());    // Parse incoming JSON requests

// Routers
app.use('/api/messages', messageRouter);   // Route requests to messageRouter
app.use('/api/reactions', reactionRouter); // Route requests to reactionRouter

// Optional root route (health check / welcome message)
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
