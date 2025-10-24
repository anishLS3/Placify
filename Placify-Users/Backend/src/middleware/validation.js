const { body, validationResult } = require('express-validator');

// Contact form validation middleware
const validateContactForm = [
  // Name validation with Unicode support
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[\p{L}\s]+$/u)
    .withMessage('Name can only contain letters and spaces (including international characters)')
    .trim()
    .escape(),

  // Email validation
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ min: 5, max: 254 })
    .withMessage('Email must be between 5 and 254 characters')
    .normalizeEmail()
    .trim(),

  // Message validation
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .trim()
    .escape(),

  // reCAPTCHA validation (optional in development)
  body('recaptchaToken')
    .optional()
    .isString()
    .withMessage('reCAPTCHA token must be a string')
    .isLength({ min: 1 })
    .withMessage('reCAPTCHA token cannot be empty'),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];

// Additional custom validation for contact form
const validateContactContent = (req, res, next) => {
  const { message } = req.body;
  
  if (!message) {
    return next();
  }

  // Check for excessive special characters
  const specialCharCount = (message.match(/[!@#$%^&*()_+=\[\]{}|;':",./<>?\\]/g) || []).length;
  if (specialCharCount > message.length * 0.4) {
    return res.status(400).json({
      success: false,
      message: 'Message contains too many special characters'
    });
  }

  // Check for excessive capitalization
  const upperCaseCount = (message.match(/[A-Z]/g) || []).length;
  if (upperCaseCount > message.length * 0.5) {
    return res.status(400).json({
      success: false,
      message: 'Message contains too many capital letters'
    });
  }

  // Check for URL patterns (potential spam)
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  if (urlPattern.test(message)) {
    return res.status(400).json({
      success: false,
      message: 'URLs are not allowed in contact messages'
    });
  }

  next();
};

module.exports = {
  validateContactForm,
  validateContactContent
};
