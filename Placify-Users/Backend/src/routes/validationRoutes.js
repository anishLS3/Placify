const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  validateContactField,
  validateExperienceField,
  checkDuplicateContent,
  analyzeContentQuality
} = require('../controllers/validationController');

const router = express.Router();

// Validation rate limiting (more permissive for real-time validation)
const validationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 validation requests per minute
  message: {
    success: false,
    message: 'Too many validation requests, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false
});

// Real-time validation routes
router.post('/contact/field', validationLimiter, validateContactField);
router.post('/experience/field', validationLimiter, validateExperienceField);
router.post('/duplicate', validationLimiter, checkDuplicateContent);
router.post('/quality', validationLimiter, analyzeContentQuality);

module.exports = router;
