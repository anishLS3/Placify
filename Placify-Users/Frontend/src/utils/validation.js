// Enhanced spam detection function with Unicode support
export const detectSpam = (message, email = '', name = '') => {
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
    return 'Message contains suspicious content';
  }
  
  // Check for excessive emojis (more than 5)
  const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 5) {
    return 'Message contains excessive emojis';
  }
  
  // Check for excessive repetition (including Unicode)
  const repeatedChars = /(.)\1{5,}/u;
  if (repeatedChars.test(message)) {
    return 'Message contains suspicious patterns';
  }
  
  // Check for random character sequences (including Unicode)
  const randomChars = /[a-z\u00C0-\u017F]{15,}/iu;
  if (randomChars.test(message) && !/\s/.test(message)) {
    return 'Message appears to contain random characters';
  }
  
  // Check for suspicious email patterns
  if (email) {
    const suspiciousDomains = [
      'tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'throwaway',
      'temp-mail', 'disposable', 'fake', 'spam', 'trash'
    ];
    if (suspiciousDomains.some(domain => lowerEmail.includes(domain))) {
      return 'Suspicious email domain detected';
    }
  }
  
  // Check for suspicious name patterns
  if (name) {
    const suspiciousNames = ['test', 'admin', 'user', 'guest', 'anonymous', 'spam'];
    if (suspiciousNames.some(suspicious => lowerName.includes(suspicious))) {
      return 'Suspicious name pattern detected';
    }
  }
  
  // Check for excessive numbers
  const numberCount = (message.match(/\d/g) || []).length;
  if (numberCount > message.length * 0.6) {
    return 'Message contains too many numbers';
  }
  
  // Check for excessive special characters
  const specialCharCount = (message.match(/[!@#$%^&*()_+=\[\]{}|;':",./<>?\\]/g) || []).length;
  if (specialCharCount > message.length * 0.4) {
    return 'Message contains too many special characters';
  }
  
  // Check for URL patterns
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  if (urlPattern.test(message)) {
    return 'URLs are not allowed in contact messages';
  }
  
  // Check for phone number patterns
  const phonePattern = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  if (phonePattern.test(message)) {
    return 'Phone numbers are not allowed in contact messages';
  }
  
  // Check for minimum meaningful content
  const words = message.trim().split(/\s+/);
  if (words.length < 5) {
    return 'Message must contain at least 5 words';
  }
  
  return null;
};

// Enhanced validation functions with Unicode support
export const validateField = (name, value, formData = {}) => {
  let error = ''
  
  switch (name) {
    case 'firstName':
      if (!value.trim()) {
        error = 'First name is required'
      } else if (value.trim().length < 2) {
        error = 'First name must be at least 2 characters'
      } else if (value.trim().length > 50) {
        error = 'First name must be less than 50 characters'
      } else if (!/^[\p{L}\s]+$/u.test(value.trim())) {
        error = 'First name can only contain letters and spaces (including international characters)'
      }
      break
    case 'lastName':
      if (!value.trim()) {
        error = 'Last name is required'
      } else if (value.trim().length < 2) {
        error = 'Last name must be at least 2 characters'
      } else if (value.trim().length > 50) {
        error = 'Last name must be less than 50 characters'
      } else if (!/^[\p{L}\s]+$/u.test(value.trim())) {
        error = 'Last name can only contain letters and spaces (including international characters)'
      }
      break
    case 'email':
      if (!value.trim()) {
        error = 'Email is required'
      } else if (value.trim().length < 5) {
        error = 'Email must be at least 5 characters'
      } else if (value.trim().length > 254) {
        error = 'Email must be less than 254 characters'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        error = 'Please enter a valid email address'
      } else {
        // Check for suspicious email domains
        const lowerEmail = value.toLowerCase();
        const suspiciousDomains = [
          'tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'throwaway',
          'temp-mail', 'disposable', 'fake', 'spam', 'trash'
        ];
        if (suspiciousDomains.some(domain => lowerEmail.includes(domain))) {
          error = 'Suspicious email domain detected'
        }
      }
      break
    case 'subject':
      if (!value.trim()) {
        error = 'Subject is required'
      } else if (value.trim().length < 5) {
        error = 'Subject must be at least 5 characters'
      } else if (value.trim().length > 200) {
        error = 'Subject must be less than 200 characters'
      }
      break
    case 'message':
      if (!value.trim()) {
        error = 'Message is required'
      } else if (value.trim().length < 10) {
        error = 'Message must be at least 10 characters'
      } else if (value.trim().length > 1000) {
        error = 'Message must be less than 1000 characters'
      } else {
        // Check for spam content with enhanced detection
        const spamError = detectSpam(value.trim(), formData.email || '', `${formData.firstName || ''} ${formData.lastName || ''}`.trim());
        if (spamError) {
          error = spamError;
        }
      }
      break
    default:
      break
  }
  
  return error
}

export const validateForm = (formData) => {
  const errors = {}
  let isValid = true

  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key], formData)
    if (error) {
      errors[key] = error
      isValid = false
    }
  })

  return { errors, isValid }
}
