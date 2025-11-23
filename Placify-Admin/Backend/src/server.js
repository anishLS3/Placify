const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const setupRoutes = require('./routes/setup');
const adminAuthRoutes = require('./routes/adminAuth');
const adminExperienceRoutes = require('./routes/adminExperience');
const adminContactRoutes = require('./routes/adminContact');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Import event system
const eventBus = require('./utils/eventBus');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ADMIN_FRONTEND_URL || ["http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with enhanced timeout settings
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds  
  maxPoolSize: 10 // Maintain up to 10 socket connections
})
.then(() => console.log('✅ Admin Backend: MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/setup', setupRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/experiences', adminExperienceRoutes);
app.use('/api/admin/contacts', adminContactRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// Health check
app.get('/api/admin/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'placify-admin-backend',
    timestamp: new Date().toISOString()
  });
});

// Test analytics endpoint (temporary for debugging)
app.get('/api/admin/test-analytics', async (req, res) => {
  try {
    const repo = require('./repositories/experienceRepository');
    const data = await repo.getAnalyticsData();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.ADMIN_PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Placify Admin Backend running on port ${PORT}`);
});

module.exports = app;