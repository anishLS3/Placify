const Experience = require('../models/Experience');
const axios = require('axios');

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateLinkedInUrl = (url) => {
  const linkedinRegex = /^https:\/\/www\.linkedin\.com\/.*$/
  return linkedinRegex.test(url)
}

const validateCTC = (ctc) => {
  const ctcRegex = /^\d+(\.\d+)?\s*LPA$/i
  return ctcRegex.test(ctc)
}

// Enhanced input sanitization with Unicode support
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove other potentially dangerous HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove onclick and other event handlers
    .replace(/onclick\s*=/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onmouseover\s*=/gi, '')
    // Remove alert and other dangerous functions
    .replace(/alert\s*\(/gi, '')
    .replace(/confirm\s*\(/gi, '')
    .replace(/prompt\s*\(/gi, '')
    // Remove iframe, object, embed tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines, tabs, and Unicode characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Unicode characters
    .normalize('NFC')
    // Trim whitespace
    .trim()
}

// Advanced spam detection for experience content
const detectExperienceSpam = (overallExperience, companyName, jobRole) => {
  const lowerExperience = overallExperience.toLowerCase();
  const lowerCompany = companyName.toLowerCase();
  const lowerRole = jobRole.toLowerCase();
  
  // Enhanced spam keywords for experience content
  const spamKeywords = [
    'fake', 'spam', 'test', 'dummy', 'placeholder', 'lorem ipsum',
    'click here', 'buy now', 'free money', 'investment', 'cryptocurrency',
    'casino', 'gambling', 'lottery', 'viagra', 'weight loss',
    'seo services', 'marketing', 'promote', 'advertisement'
  ];
  
  // Check for spam keywords in experience content
  if (spamKeywords.some(keyword => lowerExperience.includes(keyword))) {
    return 'Spam detected: suspicious content in experience';
  }
  
  // Check for excessive emojis
  const emojiCount = (overallExperience.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 3) {
    return 'Spam detected: excessive emojis in experience';
  }
  
  // Check for suspicious company names
  const suspiciousCompanies = ['test', 'fake', 'dummy', 'spam', 'company', 'corp'];
  if (suspiciousCompanies.some(suspicious => lowerCompany.includes(suspicious))) {
    return 'Spam detected: suspicious company name';
  }
  
  // Check for suspicious job roles
  const suspiciousRoles = ['test', 'fake', 'dummy', 'spam', 'role', 'position'];
  if (suspiciousRoles.some(suspicious => lowerRole.includes(suspicious))) {
    return 'Spam detected: suspicious job role';
  }
  
  // Check for excessive repetition
  const repeatedChars = /(.)\1{5,}/u;
  if (repeatedChars.test(overallExperience)) {
    return 'Spam detected: excessive repetition in experience';
  }
  
  // Check for URL patterns
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  if (urlPattern.test(overallExperience)) {
    return 'Spam detected: URLs not allowed in experience';
  }
  
  // Check for phone number patterns
  const phonePattern = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  if (phonePattern.test(overallExperience)) {
    return 'Spam detected: phone numbers not allowed in experience';
  }
  
  // Check for excessive special characters
  const specialCharCount = (overallExperience.match(/[!@#$%^&*()_+=\[\]{}|;':",./<>?\\]/g) || []).length;
  if (specialCharCount > overallExperience.length * 0.3) {
    return 'Spam detected: excessive special characters in experience';
  }
  
  return null;
}

// Enhanced data preprocessing for experience data
const preprocessExperienceData = (data) => {
  const processed = {};
  
  // Sanitize all text fields
  const textFields = [
    'fullName', 'email', 'collegeName', 'companyName', 'jobRole', 
    'interviewType', 'jobLocation', 'ctc', 'overallExperience',
    'codingQuestions', 'technicalQuestions', 'hrQuestions',
    'resourcesUsed', 'tipsForCandidates', 'mistakesToAvoid', 'linkedinUrl'
  ];
  
  textFields.forEach(field => {
    if (data[field]) {
      processed[field] = sanitizeInput(data[field].toString()).trim();
    }
  });
  
  // Process rounds array
  if (data.rounds && Array.isArray(data.rounds)) {
    processed.rounds = data.rounds.map(round => ({
      name: sanitizeInput(round.name || '').trim(),
      description: sanitizeInput(round.description || '').trim()
    }));
  }
  
  // Process other fields
  processed.isAnonymous = Boolean(data.isAnonymous);
  processed.positionType = data.positionType;
  processed.branch = data.branch;
  processed.interviewType = data.interviewType;
  processed.difficultyLevel = data.difficultyLevel;
  processed.roundTypes = data.roundTypes || [];
  processed.numberOfRounds = parseInt(data.numberOfRounds) || 1;
  processed.batchYear = data.batchYear ? parseInt(data.batchYear) : null;
  
  return processed;
};

// reCAPTCHA verification function
const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' // Test secret key - replace with your actual secret key
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: token
      }
    })
    
    return response.data.success
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

// Get all experiences
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .select('-__v') // Exclude version field
      .sort({ date: -1 })
      .limit(100); // Limit to prevent large responses
    
    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// Add new experience
exports.addExperience = async (req, res) => {
  try {
    // Preprocess and sanitize input data
    const processedData = preprocessExperienceData(req.body);
    const {
      // Personal & Academic Details
      fullName,
      email,
      collegeName,
      branch,
      batchYear,
      linkedinUrl,
      isAnonymous,
      
      // Company & Role Details
      companyName,
      jobRole,
      positionType,
      interviewType,
      jobLocation,
      ctc,
      
      // Selection Process Details
      numberOfRounds,
      roundTypes,
      difficultyLevel,
      overallExperience,
      
      // Detailed Round Descriptions
      rounds,
      
      // Technical & HR Questions
      codingQuestions,
      technicalQuestions,
      hrQuestions,
      
      // Preparation Tips
      resourcesUsed,
      tipsForCandidates,
      mistakesToAvoid,
      
      // Security
      recaptchaToken
    } = processedData;

    // Comprehensive validation
    const validationErrors = []
    
    // Required field validation
    if (!companyName || companyName.trim().length < 2) {
      validationErrors.push('Company name is required and must be at least 2 characters long')
    }
    
    if (!jobRole || jobRole.trim().length < 2) {
      validationErrors.push('Job role is required and must be at least 2 characters long')
    }
    
    if (!positionType || !['Internship', 'Placement'].includes(positionType)) {
      validationErrors.push('Position type is required and must be either "Internship" or "Placement"')
    }
    
    if (!numberOfRounds || isNaN(numberOfRounds) || numberOfRounds < 1 || numberOfRounds > 10) {
      validationErrors.push('Number of rounds is required and must be between 1 and 10')
    }
    
    if (!overallExperience || overallExperience.trim().length < 50 || overallExperience.trim().length > 2000) {
      validationErrors.push('Overall experience is required and must be between 50 and 2000 characters')
    }
    
    // LinkedIn URL validation (only if not anonymous)
    if (!isAnonymous && (!linkedinUrl || !validateLinkedInUrl(linkedinUrl))) {
      validationErrors.push('LinkedIn URL is required for non-anonymous posts and must start with https://www.linkedin.com/')
    }
    
    // Email validation (if provided)
    if (email && !validateEmail(email)) {
      validationErrors.push('Please provide a valid email address')
    }
    
    // CTC validation (if provided)
    if (ctc && !validateCTC(ctc)) {
      validationErrors.push('CTC must be in format like "6 LPA" or "6.5 LPA"')
    }
    
    // Full name validation (if provided and not anonymous)
    if (!isAnonymous && fullName && fullName.trim().length < 2) {
      validationErrors.push('Full name must be at least 2 characters long')
    }
    
    // Difficulty level validation (if provided)
    if (difficultyLevel && !['Easy', 'Medium', 'Hard'].includes(difficultyLevel)) {
      validationErrors.push('Difficulty level must be Easy, Medium, or Hard')
    }
    
    // Position type validation
    if (positionType && !['Internship', 'Placement'].includes(positionType)) {
      validationErrors.push('Position type must be Internship or Placement')
    }
    
    // Interview type validation (if provided)
    if (interviewType && !['On-Campus', 'Off-Campus', 'Referral'].includes(interviewType)) {
      validationErrors.push('Interview type must be On-Campus, Off-Campus, or Referral')
    }
    
    // Advanced spam detection
    const spamError = detectExperienceSpam(overallExperience, companyName, jobRole);
    if (spamError) {
      return res.status(400).json({ 
        success: false,
        message: 'Submission blocked due to suspicious content',
        reason: spamError
      });
    }
    
    // Duplicate content detection
    const existingExperience = await Experience.findOne({
      $or: [
        { companyName: companyName, jobRole: jobRole },
        { overallExperience: overallExperience }
      ]
    });
    
    if (existingExperience) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate experience submission detected'
      });
    }
    
    // Return validation errors if any
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Verify reCAPTCHA (skip in development mode)
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
      if (!recaptchaToken) {
        return res.status(400).json({ 
          message: 'reCAPTCHA verification is required'
        });
      }

      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return res.status(400).json({ 
          message: 'reCAPTCHA verification failed. Please try again.'
        });
      }
    }

    // Sanitize all text inputs
    const sanitizedData = {
      fullName: sanitizeInput(fullName || name || (isAnonymous ? 'Anonymous' : 'Unknown')),
      email: sanitizeInput(email || ''),
      collegeName: sanitizeInput(collegeName || ''),
      branch: sanitizeInput(branch || ''),
      companyName: sanitizeInput(companyName),
      jobRole: sanitizeInput(jobRole),
      interviewType: sanitizeInput(interviewType || ''),
      jobLocation: sanitizeInput(jobLocation || ''),
      ctc: sanitizeInput(ctc || ''),
      overallExperience: sanitizeInput(overallExperience),
      codingQuestions: sanitizeInput(codingQuestions || ''),
      technicalQuestions: sanitizeInput(technicalQuestions || ''),
      hrQuestions: sanitizeInput(hrQuestions || ''),
      resourcesUsed: sanitizeInput(resourcesUsed || ''),
      tipsForCandidates: sanitizeInput(tipsForCandidates || ''),
      mistakesToAvoid: sanitizeInput(mistakesToAvoid || ''),
      linkedinUrl: isAnonymous ? '' : sanitizeInput(linkedinUrl)
    }

    // Create experience data object with sanitized inputs
    const experienceData = {
      // Personal & Academic Details
      fullName: sanitizedData.fullName,
      email: sanitizedData.email,
      collegeName: sanitizedData.collegeName,
      branch: sanitizedData.branch,
      batchYear: batchYear || null,
      linkedinUrl: sanitizedData.linkedinUrl,
      isAnonymous: isAnonymous || false,
      
      // Company & Role Details
      companyName: sanitizedData.companyName,
      jobRole: sanitizedData.jobRole,
      positionType,
      interviewType: sanitizedData.interviewType,
      jobLocation: sanitizedData.jobLocation,
      ctc: sanitizedData.ctc,
      
      // Selection Process Details
      numberOfRounds: parseInt(numberOfRounds),
      roundTypes: roundTypes || [],
      difficultyLevel: difficultyLevel || '',
      overallExperience: sanitizedData.overallExperience,
      
      // Detailed Round Descriptions
      rounds: (rounds || []).map(round => ({
        name: sanitizeInput(round.name || ''),
        description: sanitizeInput(round.description || '')
      })),
      
      // Technical & HR Questions
      codingQuestions: sanitizedData.codingQuestions,
      technicalQuestions: sanitizedData.technicalQuestions,
      hrQuestions: sanitizedData.hrQuestions,
      
      // Preparation Tips
      resourcesUsed: sanitizedData.resourcesUsed,
      tipsForCandidates: sanitizedData.tipsForCandidates,
      mistakesToAvoid: sanitizedData.mistakesToAvoid,
      
      // Legacy fields for backward compatibility
      name: fullName || name || (isAnonymous ? 'Anonymous' : 'Unknown'),
      company: companyName,
      role: jobRole,
      experience: overallExperience
    };

    const newExperience = new Experience(experienceData);
    const savedExperience = await newExperience.save();
    res.json(savedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update experience
exports.updateExperience = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid experience ID format' 
      });
    }

    // Preprocess and sanitize input data
    const processedData = preprocessExperienceData(req.body);
    
    // Basic validation for update
    if (processedData.companyName && processedData.companyName.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Company name must be at least 2 characters long' 
      });
    }
    
    if (processedData.jobRole && processedData.jobRole.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Job role must be at least 2 characters long' 
      });
    }
    
    if (processedData.overallExperience && processedData.overallExperience.trim().length < 50) {
      return res.status(400).json({ 
        success: false,
        message: 'Overall experience must be at least 50 characters long' 
      });
    }

    // Check if experience exists
    const existingExperience = await Experience.findById(req.params.id);
    if (!existingExperience) {
      return res.status(404).json({ 
        success: false,
        message: 'Experience not found' 
      });
    }

    // Update with sanitized data
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: experience
    });
  } catch (error) {
    console.error('Update experience error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid experience ID format' 
      });
    }

    // Check if experience exists before deletion
    const existingExperience = await Experience.findById(req.params.id);
    if (!existingExperience) {
      return res.status(404).json({ 
        success: false,
        message: 'Experience not found' 
      });
    }

    // Delete the experience
    const experience = await Experience.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Experience deleted successfully',
      data: {
        id: experience._id,
        companyName: experience.companyName,
        jobRole: experience.jobRole
      }
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please try again later.' 
    });
  }
};