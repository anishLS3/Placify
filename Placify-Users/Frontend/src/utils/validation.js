// Spam detection function
export const detectSpam = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Spam keywords detection
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'free money', 'click here', 'buy now',
    'make money', 'work from home', 'investment', 'cryptocurrency', 'bitcoin',
    'loan', 'credit', 'insurance', 'weight loss', 'diet pills', 'seo services',
    'marketing', 'promote', 'advertisement', 'spam', 'scam', 'phishing',
    'get rich', 'earn money', 'online casino', 'gambling', 'poker', 'slots'
  ];
  
  if (spamKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'Message contains suspicious content';
  }
  
  // Check for excessive repetition (like "aaaaaa" or "111111")
  const repeatedChars = /(.)\1{5,}/;
  if (repeatedChars.test(message)) {
    return 'Message contains suspicious patterns';
  }
  
  // Check for random character sequences
  const randomChars = /[a-z]{15,}/i;
  if (randomChars.test(message) && !/\s/.test(message)) {
    return 'Message appears to contain random characters';
  }
  
  // Check for excessive numbers
  const numberCount = (message.match(/\d/g) || []).length;
  if (numberCount > message.length * 0.5) {
    return 'Message contains too many numbers';
  }
  
  // Check for minimum meaningful content
  const words = message.trim().split(/\s+/);
  if (words.length < 5) {
    return 'Message must contain at least 5 words';
  }
  
  return null;
};

// Validation functions
export const validateField = (name, value) => {
  let error = ''
  
  switch (name) {
    case 'firstName':
      if (!value.trim()) {
        error = 'First name is required'
      } else if (value.trim().length < 2) {
        error = 'First name must be at least 2 characters'
      } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
        error = 'First name can only contain letters and spaces'
      }
      break
    case 'lastName':
      if (!value.trim()) {
        error = 'Last name is required'
      } else if (value.trim().length < 2) {
        error = 'Last name must be at least 2 characters'
      } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
        error = 'Last name can only contain letters and spaces'
      }
      break
    case 'email':
      if (!value.trim()) {
        error = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        error = 'Please enter a valid email address'
      }
      break
    case 'subject':
      if (!value.trim()) {
        error = 'Subject is required'
      } else if (value.trim().length < 5) {
        error = 'Subject must be at least 5 characters'
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
        // Check for spam content
        const spamError = detectSpam(value.trim());
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
    const error = validateField(key, formData[key])
    if (error) {
      errors[key] = error
      isValid = false
    }
  })

  return { errors, isValid }
}
