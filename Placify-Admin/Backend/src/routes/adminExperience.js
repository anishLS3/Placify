const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const adminExperienceController = require('../controllers/adminExperienceController');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Apply authentication to all routes
router.use(requireAdmin);

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

// MongoDB ObjectId validation helper
const validateObjectId = (paramName) => {
  return param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID format`);
};

// Pagination validation helper
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Status validation helper
const validateStatus = param('status')
  .isIn(['pending', 'approved', 'rejected'])
  .withMessage('Status must be pending, approved, or rejected');

// Dashboard and analytics routes
router.get('/dashboard/stats', adminExperienceController.getDashboardStats);

// Recent experiences route
router.get('/recent',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  handleValidationErrors,
  adminExperienceController.getRecentExperiences
);

// Main listing routes
router.get('/all', 
  validatePagination,
  handleValidationErrors,
  adminExperienceController.getAllExperiences
);

router.get('/pending',
  validatePagination,
  handleValidationErrors,
  adminExperienceController.getPendingExperiences
);

router.get('/status/:status',
  validateStatus,
  validatePagination,
  handleValidationErrors,
  adminExperienceController.getExperiencesByStatus
);

// Search route
router.get('/search',
  [
    query('q')
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),
    query('status')
      .optional()
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Status must be pending, approved, or rejected'),
    ...validatePagination
  ],
  handleValidationErrors,
  adminExperienceController.searchExperiences
);

// Individual experience routes
router.get('/:id',
  validateObjectId('id'),
  handleValidationErrors,
  adminExperienceController.getExperience
);

// Approval routes
router.post('/:id/approve',
  [
    validateObjectId('id'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
    body('addVerificationBadge')
      .optional()
      .isBoolean()
      .withMessage('addVerificationBadge must be a boolean')
  ],
  handleValidationErrors,
  adminExperienceController.approveExperience
);

router.post('/:id/reject',
  [
    validateObjectId('id'),
    body('notes')
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Rejection notes are required and must be between 10 and 1000 characters')
  ],
  handleValidationErrors,
  adminExperienceController.rejectExperience
);

// Quick action routes
router.post('/:id/quick-approve',
  validateObjectId('id'),
  handleValidationErrors,
  adminExperienceController.quickApprove
);

router.post('/:id/quick-approve-with-badge',
  validateObjectId('id'),
  handleValidationErrors,
  adminExperienceController.quickApproveWithBadge
);

// Status update route
router.patch('/:id/status',
  [
    validateObjectId('id'),
    body('status')
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Status must be pending, approved, or rejected'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ],
  handleValidationErrors,
  adminExperienceController.updateStatus
);

// Verification badge toggle
router.patch('/:id/verification-badge',
  validateObjectId('id'),
  handleValidationErrors,
  adminExperienceController.toggleVerificationBadge
);

// Batch operations
router.post('/batch/approve',
  [
    body('experienceIds')
      .isArray({ min: 1, max: 50 })
      .withMessage('experienceIds must be an array with 1-50 items'),
    body('experienceIds.*')
      .isMongoId()
      .withMessage('Each experience ID must be a valid MongoDB ObjectId')
  ],
  handleValidationErrors,
  adminExperienceController.batchApprove
);

router.post('/batch/reject',
  [
    body('experienceIds')
      .isArray({ min: 1, max: 50 })
      .withMessage('experienceIds must be an array with 1-50 items'),
    body('experienceIds.*')
      .isMongoId()
      .withMessage('Each experience ID must be a valid MongoDB ObjectId'),
    body('notes')
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Rejection notes are required and must be between 10 and 1000 characters')
  ],
  handleValidationErrors,
  adminExperienceController.batchReject
);

module.exports = router;