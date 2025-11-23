const Contact = require('../models/Contact');
const axios = require('axios');
const { AppError, ERROR_TYPES, handleValidationError, handleSpamError, asyncHandler } = require('../utils/errorHandler');

// Enhanced input sanitization with Unicode support
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove other potentially dangerous HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines, tabs, and Unicode characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Unicode characters
    .normalize('NFC')
    // Trim whitespace
    .trim();
};

// Advanced spam detection with Unicode support
const detectAdvancedSpam = (message, email, name) => {
  const lowerMessage = message.toLowerCase();
  const lowerEmail = email.toLowerCase();
  const lowerName = name.toLowerCase();
  
  // Enhanced spam keywords (including Unicode variations)
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'free money', 'click here', 'buy now',
    'make money', 'work from home', 'investment', 'cryptocurrency', 'bitcoin',
    'loan', 'credit', 'insurance', 'weight loss', 'diet pills', 'seo services',
    'marketing', 'promote', 'advertisement', 'spam', 'scam', 'phishing',
    'get rich', 'earn money', 'online casino', 'gambling', 'poker', 'slots',
    'viаgrа', 'сasino', 'lоttery', 'frее mоney', // Unicode variations
    '💰', '💸', '🎰', '🎲', '💊', '💉', // Emoji spam indicators
    'free', 'win', 'congratulations', 'urgent', 'limited time'
  ];
  
  // Check for spam keywords
  if (spamKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'Spam detected: suspicious content';
  }
  
  // Check for excessive emojis (more than 5)
  const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 5) {
    return 'Spam detected: excessive emojis';
  }
  
  // Check for excessive repetition (including Unicode)
  const repeatedChars = /(.)\1{5,}/u;
  if (repeatedChars.test(message)) {
    return 'Spam detected: excessive repetition';
  }
  
  // Check for random character sequences (including Unicode)
  const randomChars = /[a-z\u00C0-\u017F]{15,}/iu;
  if (randomChars.test(message) && !/\s/.test(message)) {
    return 'Spam detected: random characters';
  }
  
  // Check for suspicious email patterns
  const suspiciousDomains = [
    'tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'throwaway',
    'temp-mail', 'disposable', 'fake', 'spam', 'trash'
  ];
  if (suspiciousDomains.some(domain => lowerEmail.includes(domain))) {
    return 'Spam detected: suspicious email domain';
  }
  
  // Check for suspicious name patterns (more specific matching)
  const suspiciousNames = ['test', 'admin', 'user', 'guest', 'anonymous', 'spam'];
  const nameWords = lowerName.split(' ');
  if (nameWords.some(word => suspiciousNames.includes(word.trim()))) {
    return 'Spam detected: suspicious name pattern';
  }
  
  // Check for excessive numbers (more lenient)
  const numberCount = (message.match(/\d/g) || []).length;
  if (numberCount > message.length * 0.8) {
    return 'Spam detected: excessive numbers';
  }
  
  // Check for excessive special characters (more lenient)
  const specialCharCount = (message.match(/[!@#$%^&*()_+=\[\]{}|;':",./<>?\\]/g) || []).length;
  if (specialCharCount > message.length * 0.6) {
    return 'Spam detected: excessive special characters';
  }
  
  // Check for URL patterns
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  if (urlPattern.test(message)) {
    return 'Spam detected: URLs not allowed';
  }
  
  // Check for phone number patterns
  const phonePattern = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  if (phonePattern.test(message)) {
    return 'Spam detected: phone numbers not allowed';
  }
  
  return null;
};

// Enhanced data preprocessing
const preprocessContactData = (data) => {
  const processed = {};
  
  // Sanitize and trim name
  if (data.name) {
    processed.name = sanitizeInput(data.name.toString()).trim();
  }
  
  // Sanitize and normalize email
  if (data.email) {
    processed.email = sanitizeInput(data.email.toString()).trim().toLowerCase();
  }
  
  // Sanitize message
  if (data.message) {
    processed.message = sanitizeInput(data.message.toString()).trim();
  }
  
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

// Spam detection function
const detectSpam = (message, email) => {
  const lowerMessage = message.toLowerCase();
  const lowerEmail = email.toLowerCase();
  
  // Check for spam keywords
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'free money', 'click here', 'buy now',
    'make money', 'work from home', 'investment', 'cryptocurrency', 'bitcoin',
    'loan', 'credit', 'insurance', 'weight loss', 'diet pills', 'seo services',
    'marketing', 'promote', 'advertisement', 'spam', 'scam', 'phishing',
    'get rich', 'earn money', 'online casino', 'gambling', 'poker', 'slots'
  ];
  
  if (spamKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'Spam detected: suspicious content';
  }
  
  // Check for excessive repetition
  const repeatedChars = /(.)\1{5,}/;
  if (repeatedChars.test(message)) {
    return 'Spam detected: excessive repetition';
  }
  
  // Check for random character sequences
  const randomChars = /[a-z]{15,}/i;
  if (randomChars.test(message) && !/\s/.test(message)) {
    return 'Spam detected: random characters';
  }
  
  // Check email for suspicious patterns
  const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'throwaway'];
  if (suspiciousDomains.some(domain => lowerEmail.includes(domain))) {
    return 'Spam detected: suspicious email domain';
  }
  
  return null;
};

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
  // Preprocess and sanitize input data
  const processedData = preprocessContactData(req.body);
  const { name, email, message, recaptchaToken } = processedData;
  
  // Extract subject from message if it's embedded
  let subject = '';
  let cleanMessage = message;
  
  if (message && message.startsWith('Subject:')) {
    const lines = message.split('\n');
    subject = lines[0].replace('Subject:', '').trim();
    cleanMessage = lines.slice(2).join('\n').trim(); // Skip subject line and empty line
  }
  
  // Validate required fields after preprocessing
  if (!name || !email || !cleanMessage) {
    return res.status(400).json({ 
      message: 'All fields (name, email, message) are required' 
    });
  }
  
  // Check for empty strings after sanitization
  if (name.length === 0 || email.length === 0 || cleanMessage.length === 0) {
    return res.status(400).json({ 
      message: 'All fields must contain valid content' 
    });
  }    // Verify reCAPTCHA (skip in development mode)
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

    // Advanced spam detection
    const spamError = detectAdvancedSpam(cleanMessage, email, name);
    if (spamError) {
      return res.status(400).json({ 
        success: false,
        message: 'Submission blocked due to suspicious content',
        reason: spamError
      });
    }
    
    // Duplicate content detection (only check for exact message matches, not email)
    const existingContact = await Contact.findOne({
      message: cleanMessage,
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Only check last 24 hours
    });
    
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Similar message was recently submitted. Please wait before submitting again.'
      });
    }
    
    // Check for minimum message quality (more lenient)
    const words = cleanMessage.trim().split(/\s+/);
    if (words.length < 3) {
      return res.status(400).json({ 
        message: 'Message seems too short to be meaningful' 
      });
    }
    
    // Check for excessive numbers in message (more lenient)
    const numberCount = (cleanMessage.match(/\d/g) || []).length;
    if (numberCount > cleanMessage.length * 0.8) {
      return res.status(400).json({ 
        message: 'Message contains too many numbers' 
      });
    }
    
    // Additional validation: Check for repeated words (potential spam)
    const wordCounts = {};
    words.forEach(word => {
      if (word.length > 3) { // Only count words longer than 3 characters
        wordCounts[word.toLowerCase()] = (wordCounts[word.toLowerCase()] || 0) + 1;
      }
    });
    
    const maxRepeatedWords = Math.max(...Object.values(wordCounts));
    if (maxRepeatedWords > 3) {
      return res.status(400).json({ 
        message: 'Message contains too many repeated words' 
      });
    }
    
    // Create and save contact with sanitized data and extracted subject
    const contactData = { 
      name, 
      email, 
      message: cleanMessage,
      subject: subject || undefined // Only include subject if it exists
    };
    
    const newContact = new Contact(contactData);
    const contact = await newContact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        date: contact.date
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate submission detected' 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
};