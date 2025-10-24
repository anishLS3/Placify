const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { submitContact } = require('../controllers/contactController');
const { validateContactForm, validateContactContent } = require('../middleware/validation');

// Contact form specific rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 contact form submissions per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many contact form submissions from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  },
  // Skip rate limiting for development
  skip: (req) => process.env.NODE_ENV === 'development'
});

router.post('/', contactLimiter, validateContactForm, validateContactContent, submitContact);

module.exports = router;