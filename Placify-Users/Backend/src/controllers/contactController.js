const Contact = require('../models/Contact');

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
    const { name, email, message } = req.body;
    
    // Additional spam detection
    const spamError = detectSpam(message, email);
    if (spamError) {
      return res.status(400).json({ 
        message: 'Submission blocked due to suspicious content' 
      });
    }
    
    // Check for minimum message quality
    const words = message.trim().split(/\s+/);
    if (words.length < 5) {
      return res.status(400).json({ 
        message: 'Message seems too short to be meaningful' 
      });
    }
    
    // Check for excessive numbers in message
    const numberCount = (message.match(/\d/g) || []).length;
    if (numberCount > message.length * 0.5) {
      return res.status(400).json({ 
        message: 'Message contains too many numbers' 
      });
    }
    
    const newContact = new Contact({ name, email, message });
    const contact = await newContact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};