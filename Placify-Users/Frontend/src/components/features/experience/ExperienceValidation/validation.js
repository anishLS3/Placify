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

// CTC validation
export const validateCTC = (ctc) => {
  const ctcRegex = /^\d+(\.\d+)?\s*LPA$/i
  return ctcRegex.test(ctc)
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
export const validateField = (name, value) => {
  switch (name) {
    case 'email':
      return validateEmail(value) || value === ''
    case 'linkedinUrl':
      return validateLinkedInUrl(value) || value === ''
    case 'ctc':
      return validateCTC(value) || value === ''
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
  
  if (formData.ctc && !validateCTC(formData.ctc)) {
    validationErrors.push('CTC must be in format like "6 LPA" or "6.5 LPA"')
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
