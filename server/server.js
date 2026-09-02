require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/learning', require('./routes/learning'));
app.use('/api/social-links', require('./routes/socialLinks'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/api/health', (req, res) => res.status(200).json({ success: true, message: 'Server is running' }));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
