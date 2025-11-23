const express = require('express');
const { param, body, query, validationResult } = require('express-validator');
const adminContactController = require('../controllers/adminContactController');
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

// Get contact statistics
router.get('/stats', adminContactController.getContactStats);

// Get all contacts with filtering and pagination
router.get('/',
  [
    ...validatePagination,
    query('status')
      .optional()
      .isIn(['new', 'in-progress', 'resolved', 'closed'])
      .withMessage('Status must be new, in-progress, resolved, or closed'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'name', 'email', 'subject', 'status'])
      .withMessage('sortBy must be one of: createdAt, name, email, subject, status'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('sortOrder must be asc or desc')
  ],
  handleValidationErrors,
  adminContactController.getContacts
);

// Get specific contact
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid contact ID format'),
  handleValidationErrors,
  adminContactController.getContact
);

// Update contact status
router.patch('/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid contact ID format'),
    body('status')
      .isIn(['new', 'in-progress', 'resolved', 'closed'])
      .withMessage('Status must be new, in-progress, resolved, or closed')
  ],
  handleValidationErrors,
  adminContactController.updateContactStatus
);

// Update contact status (alternative route)
router.patch('/:id',
  [
    param('id').isMongoId().withMessage('Invalid contact ID format'),
    body('status')
      .optional()
      .isIn(['new', 'in-progress', 'resolved', 'closed'])
      .withMessage('Status must be new, in-progress, resolved, or closed')
  ],
  handleValidationErrors,
  adminContactController.updateContactStatus
);

// Add response to contact (POST method)
router.post('/:id/respond',
  [
    param('id').isMongoId().withMessage('Invalid contact ID format'),
    body('response')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Response must be between 10 and 2000 characters')
  ],
  handleValidationErrors,
  adminContactController.respondToContact
);

// Add response to contact (PATCH method - alternative)
router.patch('/:id/respond',
  [
    param('id').isMongoId().withMessage('Invalid contact ID format'),
    body('response')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Response must be between 10 and 2000 characters')
  ],
  handleValidationErrors,
  adminContactController.respondToContact
);

// Update contact details (priority, category, tags, etc.)
router.patch('/:id/details',
  [
    param('id').isMongoId().withMessage('Invalid contact ID format'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Priority must be low, medium, high, or urgent'),
    body('category')
      .optional()
      .isIn(['general', 'technical', 'account', 'feedback', 'bug-report', 'feature-request'])
      .withMessage('Invalid category'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ],
  handleValidationErrors,
  adminContactController.updateContactDetails
);

module.exports = router;