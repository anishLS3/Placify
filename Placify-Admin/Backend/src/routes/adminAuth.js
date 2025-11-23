const express = require('express');
const { body, validationResult } = require('express-validator');
const adminAuthController = require('../controllers/adminAuthController');
const { requireAdmin, extractRequestInfo } = require('../middleware/adminAuth');

const router = express.Router();

// Middleware to extract request info for all routes
router.use(extractRequestInfo);

// Validation middleware helper
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Public routes (no authentication required)

// Check if initial setup is needed
router.get('/setup/check', adminAuthController.checkSetup);

// Create initial admin (only works if no admin exists)
router.post('/setup/initial',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
  ],
  handleValidationErrors,
  adminAuthController.createInitialAdmin
);

// Admin login
router.post('/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  adminAuthController.login
);

// Protected routes (require authentication)

// Admin logout
router.post('/logout', requireAdmin, adminAuthController.logout);

// Verify token
router.get('/verify', requireAdmin, adminAuthController.verifyToken);

// Get admin profile
router.get('/profile', requireAdmin, adminAuthController.getProfile);

// Update admin profile
router.put('/profile',
  requireAdmin,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  handleValidationErrors,
  adminAuthController.updateProfile
);

// Change password
router.put('/password',
  requireAdmin,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      })
  ],
  handleValidationErrors,
  adminAuthController.changePassword
);

// Get audit logs
router.get('/audit-logs',
  requireAdmin,
  [
    // Query parameter validation
    (req, res, next) => {
      const { page, limit } = req.query;
      
      if (page && (!Number.isInteger(+page) || +page < 1)) {
        return res.status(400).json({
          success: false,
          message: 'Page must be a positive integer'
        });
      }
      
      if (limit && (!Number.isInteger(+limit) || +limit < 1 || +limit > 100)) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be a positive integer between 1 and 100'
        });
      }
      
      next();
    }
  ],
  adminAuthController.getAuditLogs
);

module.exports = router;