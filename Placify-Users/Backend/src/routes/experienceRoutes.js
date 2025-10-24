const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');
const { 
  validateExperienceForm, 
  validateExperienceContent, 
  validateLinkedInForAnonymous 
} = require('../middleware/experienceValidation');

// Experience submission rate limiting
const experienceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 experience submissions per windowMs
  message: {
    success: false,
    message: 'Too many experience submissions from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many experience submissions from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  },
  // Skip rate limiting for development
  skip: (req) => process.env.NODE_ENV === 'development'
});

// Update/Delete rate limiting (more restrictive)
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 update/delete requests per windowMs
  message: {
    success: false,
    message: 'Too many update/delete requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many update/delete requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  },
  // Skip rate limiting for development
  skip: (req) => process.env.NODE_ENV === 'development'
});

router.route('/')
  .get(getExperiences)
  .post(experienceLimiter, validateExperienceForm, validateExperienceContent, validateLinkedInForAnonymous, addExperience);

router.route('/:id')
  .put(updateLimiter, updateExperience)
  .delete(updateLimiter, deleteExperience);

module.exports = router;