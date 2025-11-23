// Experience Form Validation Utilities

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// LinkedIn URL validation
export const validateLinkedInUrl = (url) => {
  const linkedinRegex = /^https:\/\/www\.linkedin\.com\/.*$/
  return linkedinRegex.test(url)
}

// CTC validation - supports both internship and placement formats
export const validateCTC = (ctc, positionType) => {
  if (!ctc) return true; // Optional field
  
  // For Internship: X,XXX/month format
  const internshipRegex = /^[\d,]+\/month$/i;
  // For Placement: X LPA format
  const placementRegex = /^\d+(\.\d+)?\s*LPA$/i;
  
  if (positionType === 'Internship') {
    return internshipRegex.test(ctc);
  } else if (positionType === 'Placement') {
    return placementRegex.test(ctc);
  }
  
  // If no position type specified, allow either format
  return internshipRegex.test(ctc) || placementRegex.test(ctc);
}

// Input sanitization
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return input
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove onclick and other event handlers
    .replace(/onclick\s*=/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove alert and other dangerous functions
    .replace(/alert\s*\(/gi, '')
    .replace(/confirm\s*\(/gi, '')
    .replace(/prompt\s*\(/gi, '')
    // Remove other potentially dangerous HTML tags
    .replace(/<[^>]*>/g, '')
    // Only trim if the result is empty or just whitespace
    .replace(/^\s+$/, '')
}

// Field validation
export const validateField = (name, value, formData = {}) => {
  switch (name) {
    case 'email':
      return validateEmail(value) || value === ''
    case 'linkedinUrl':
      return validateLinkedInUrl(value) || value === ''
    case 'ctc':
      return validateCTC(value, formData.positionType) || value === ''
    case 'overallExperience':
      return value.length >= 50 && value.length <= 2000
    case 'fullName':
      return value.length >= 2 && value.length <= 100
    case 'companyName':
      return value.length >= 2 && value.length <= 100
    case 'jobRole':
      return value.length >= 2 && value.length <= 100
    default:
      return true
  }
}

// Form validation
export const validateExperienceForm = (formData) => {
  const requiredFields = ['companyName', 'jobRole', 'positionType', 'numberOfRounds', 'overallExperience']
  
  // Add LinkedIn URL and fullName to required fields only if not anonymous
  if (!formData.isAnonymous) {
    requiredFields.push('linkedinUrl', 'fullName')
  }
  
  // Check for missing required fields
  const missing = requiredFields.filter(field => !formData[field] || formData[field].trim() === '')
  
  if (missing.length > 0) {
    return {
      isValid: false,
      error: `The following fields are required: ${missing.join(', ')}`
    }
  }

  // Validate field formats
  const validationErrors = []
  
  if (formData.email && !validateEmail(formData.email)) {
    validationErrors.push('Please enter a valid email address')
  }
  
  // LinkedIn URL validation - only if not anonymous
  if (!formData.isAnonymous) {
    if (!formData.linkedinUrl || !validateLinkedInUrl(formData.linkedinUrl)) {
      validationErrors.push('LinkedIn URL is required and must start with https://www.linkedin.com/')
    }
  }
  
  // Position type validation
  if (formData.positionType && !['Placement', 'Internship'].includes(formData.positionType)) {
    validationErrors.push('Position type must be either "Placement" or "Internship"')
  }
  
  // CTC validation (if provided)
  if (formData.ctc && !validateCTC(formData.ctc, formData.positionType)) {
    if (formData.positionType === 'Internship') {
      validationErrors.push('CTC must be in format "X,XXX/month" (e.g., 50,000/month)');
    } else if (formData.positionType === 'Placement') {
      validationErrors.push('CTC must be in format "X LPA" (e.g., 6 LPA or 6.5 LPA)');
    } else {
      validationErrors.push('Please select position type first to determine CTC format');
    }
  }
  
  if (formData.overallExperience.length < 50) {
    validationErrors.push('Overall experience must be at least 50 characters long')
  }
  
  if (formData.overallExperience.length > 2000) {
    validationErrors.push('Overall experience must be less than 2000 characters')
  }
  
  if (formData.fullName && formData.fullName.length < 2) {
    validationErrors.push('Full name must be at least 2 characters long')
  }
  
  if (formData.companyName.length < 2) {
    validationErrors.push('Company name must be at least 2 characters long')
  }
  
  if (formData.jobRole.length < 2) {
    validationErrors.push('Job role must be at least 2 characters long')
  }

  if (validationErrors.length > 0) {
    return {
      isValid: false,
      error: validationErrors[0]
    }
  }
  
  return { isValid: true, error: null }
}
