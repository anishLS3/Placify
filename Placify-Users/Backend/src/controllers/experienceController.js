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

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/alert\s*\(/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .trim()
}

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
    const experiences = await Experience.find().sort({ date: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add new experience
exports.addExperience = async (req, res) => {
  try {
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
      recaptchaToken,
      
      // Legacy fields (for backward compatibility)
      name,
      company,
      role,
      experience
    } = req.body;

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
    
    // Return validation errors if any
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
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
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json({ message: 'Experience removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};