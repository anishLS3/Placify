const { body, validationResult } = require('express-validator');

// Experience form validation middleware
const validateExperienceForm = [
  // Personal & Academic Details
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\u00C0-\u017F]+$/)
    .withMessage('Full name can only contain letters and spaces')
    .trim()
    .escape(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ min: 5, max: 254 })
    .withMessage('Email must be between 5 and 254 characters')
    .normalizeEmail()
    .trim(),

  body('collegeName')
    .optional()
    .isLength({ max: 200 })
    .withMessage('College name cannot exceed 200 characters')
    .trim()
    .escape(),

  body('branch')
    .optional()
    .isIn(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'])
    .withMessage('Branch must be one of: CSE, IT, ECE, EEE, MECH, CIVIL, Other'),

  body('batchYear')
    .optional()
    .isInt({ min: 2000, max: 2030 })
    .withMessage('Batch year must be between 2000 and 2030'),

  body('linkedinUrl')
    .optional()
    .isURL({ protocols: ['https'], host_whitelist: ['www.linkedin.com'] })
    .withMessage('LinkedIn URL must start with https://www.linkedin.com/')
    .isLength({ max: 500 })
    .withMessage('LinkedIn URL cannot exceed 500 characters')
    .trim(),

  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean value'),

  // Company & Role Details
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters')
    .trim()
    .escape(),

  body('jobRole')
    .notEmpty()
    .withMessage('Job role is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Job role must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('positionType')
    .notEmpty()
    .withMessage('Position type is required')
    .isIn(['Placement', 'Internship'])
    .withMessage('Position type must be either Placement or Internship'),

  body('interviewType')
    .optional()
    .isIn(['On-Campus', 'Off-Campus', 'Referral'])
    .withMessage('Interview type must be On-Campus, Off-Campus, or Referral'),

  body('jobLocation')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Job location cannot exceed 100 characters')
    .trim()
    .escape(),

  body('ctc')
    .optional()
    .matches(/^\d+(\.\d+)?\s*LPA$/i)
    .withMessage('CTC must be in format like "6 LPA" or "6.5 LPA"')
    .isLength({ max: 20 })
    .withMessage('CTC cannot exceed 20 characters')
    .trim(),

  // Selection Process Details
  body('numberOfRounds')
    .notEmpty()
    .withMessage('Number of rounds is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of rounds must be between 1 and 10'),

  body('roundTypes')
    .optional()
    .isArray()
    .withMessage('Round types must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const validTypes = ['Aptitude', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Presentation'];
        const invalidTypes = value.filter(type => !validTypes.includes(type));
        if (invalidTypes.length > 0) {
          throw new Error(`Invalid round types: ${invalidTypes.join(', ')}`);
        }
      }
      return true;
    }),

  body('difficultyLevel')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty level must be Easy, Medium, or Hard'),

  body('overallExperience')
    .notEmpty()
    .withMessage('Overall experience is required')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Overall experience must be between 50 and 2000 characters')
    .trim()
    .escape(),

  // Technical & HR Questions
  body('codingQuestions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Coding questions cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('technicalQuestions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Technical questions cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('hrQuestions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('HR questions cannot exceed 1000 characters')
    .trim()
    .escape(),

  // Preparation Tips
  body('resourcesUsed')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Resources used cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('tipsForCandidates')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Tips for candidates cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('mistakesToAvoid')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Mistakes to avoid cannot exceed 1000 characters')
    .trim()
    .escape(),

  // Rounds validation
  body('rounds')
    .optional()
    .isArray()
    .withMessage('Rounds must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          const round = value[i];
          if (!round.name || round.name.trim().length < 2) {
            throw new Error(`Round ${i + 1}: Name is required and must be at least 2 characters`);
          }
          if (!round.description || round.description.trim().length < 10) {
            throw new Error(`Round ${i + 1}: Description is required and must be at least 10 characters`);
          }
          if (round.name && round.name.length > 100) {
            throw new Error(`Round ${i + 1}: Name cannot exceed 100 characters`);
          }
          if (round.description && round.description.length > 500) {
            throw new Error(`Round ${i + 1}: Description cannot exceed 500 characters`);
          }
        }
      }
      return true;
    }),

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

// Additional custom validation for experience content
const validateExperienceContent = (req, res, next) => {
  const { overallExperience, codingQuestions, technicalQuestions, hrQuestions } = req.body;
  
  // Check for excessive special characters in main content
  const contentFields = [overallExperience, codingQuestions, technicalQuestions, hrQuestions];
  
  contentFields.forEach((field, index) => {
    if (field && typeof field === 'string') {
      const specialCharCount = (field.match(/[!@#$%^&*()_+=\[\]{}|;':",./<>?\\]/g) || []).length;
      if (specialCharCount > field.length * 0.3) {
        const fieldNames = ['overallExperience', 'codingQuestions', 'technicalQuestions', 'hrQuestions'];
        return res.status(400).json({
          success: false,
          message: `${fieldNames[index]} contains too many special characters`
        });
      }

      // Check for URL patterns (potential spam)
      const urlPattern = /(https?:\/\/[^\s]+)/gi;
      if (urlPattern.test(field)) {
        const fieldNames = ['overallExperience', 'codingQuestions', 'technicalQuestions', 'hrQuestions'];
        return res.status(400).json({
          success: false,
          message: `URLs are not allowed in ${fieldNames[index]}`
        });
      }

      // Check for excessive capitalization
      const upperCaseCount = (field.match(/[A-Z]/g) || []).length;
      if (upperCaseCount > field.length * 0.5) {
        const fieldNames = ['overallExperience', 'codingQuestions', 'technicalQuestions', 'hrQuestions'];
        return res.status(400).json({
          success: false,
          message: `${fieldNames[index]} contains too many capital letters`
        });
      }
    }
  });

  // Check for repeated words in overall experience
  if (overallExperience) {
    const words = overallExperience.trim().split(/\s+/);
    const wordCounts = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordCounts[word.toLowerCase()] = (wordCounts[word.toLowerCase()] || 0) + 1;
      }
    });
    
    const maxRepeatedWords = Math.max(...Object.values(wordCounts));
    if (maxRepeatedWords > 5) {
      return res.status(400).json({
        success: false,
        message: 'Overall experience contains too many repeated words'
      });
    }
  }

  next();
};

// LinkedIn URL validation for non-anonymous posts
const validateLinkedInForAnonymous = (req, res, next) => {
  const { isAnonymous, linkedinUrl } = req.body;
  
  if (!isAnonymous && (!linkedinUrl || linkedinUrl.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: 'LinkedIn URL is required for non-anonymous posts'
    });
  }
  
  next();
};

module.exports = {
  validateExperienceForm,
  validateExperienceContent,
  validateLinkedInForAnonymous
};
