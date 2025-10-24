const Contact = require('../models/Contact');
const Experience = require('../models/Experience');

// Real-time validation for contact form
exports.validateContactField = async (req, res) => {
  try {
    const { field, value } = req.body;
    
    if (!field || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Field and value are required'
      });
    }
    
    const validationResults = {
      isValid: true,
      errors: [],
      suggestions: []
    };
    
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) {
          validationResults.isValid = false;
          validationResults.errors.push('Name must be at least 2 characters long');
        }
        if (value && value.length > 100) {
          validationResults.isValid = false;
          validationResults.errors.push('Name cannot exceed 100 characters');
        }
        if (value && !/^[a-zA-Z\s\u00C0-\u017F]+$/.test(value)) {
          validationResults.isValid = false;
          validationResults.errors.push('Name can only contain letters and spaces');
        }
        break;
        
      case 'email':
        if (!value || value.trim().length < 5) {
          validationResults.isValid = false;
          validationResults.errors.push('Email must be at least 5 characters long');
        }
        if (value && value.length > 254) {
          validationResults.isValid = false;
          validationResults.errors.push('Email cannot exceed 254 characters');
        }
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          validationResults.isValid = false;
          validationResults.errors.push('Please provide a valid email address');
        }
        // Check for duplicate email
        if (value) {
          const existingContact = await Contact.findOne({ email: value.toLowerCase() });
          if (existingContact) {
            validationResults.isValid = false;
            validationResults.errors.push('This email has already been used');
          }
        }
        break;
        
      case 'message':
        if (!value || value.trim().length < 10) {
          validationResults.isValid = false;
          validationResults.errors.push('Message must be at least 10 characters long');
        }
        if (value && value.length > 1000) {
          validationResults.isValid = false;
          validationResults.errors.push('Message cannot exceed 1000 characters');
        }
        // Check for spam indicators
        if (value) {
          const spamKeywords = ['viagra', 'casino', 'lottery', 'free money', 'click here'];
          const lowerValue = value.toLowerCase();
          if (spamKeywords.some(keyword => lowerValue.includes(keyword))) {
            validationResults.isValid = false;
            validationResults.errors.push('Message contains suspicious content');
          }
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid field name'
        });
    }
    
    res.json({
      success: true,
      field: field,
      value: value,
      validation: validationResults
    });
    
  } catch (error) {
    console.error('Contact validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Validation service error'
    });
  }
};

// Real-time validation for experience form
exports.validateExperienceField = async (req, res) => {
  try {
    const { field, value } = req.body;
    
    if (!field || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Field and value are required'
      });
    }
    
    const validationResults = {
      isValid: true,
      errors: [],
      suggestions: []
    };
    
    switch (field) {
      case 'companyName':
        if (!value || value.trim().length < 2) {
          validationResults.isValid = false;
          validationResults.errors.push('Company name must be at least 2 characters long');
        }
        if (value && value.length > 200) {
          validationResults.isValid = false;
          validationResults.errors.push('Company name cannot exceed 200 characters');
        }
        // Check for suspicious company names
        if (value) {
          const suspiciousCompanies = ['test', 'fake', 'dummy', 'spam'];
          const lowerValue = value.toLowerCase();
          if (suspiciousCompanies.some(suspicious => lowerValue.includes(suspicious))) {
            validationResults.isValid = false;
            validationResults.errors.push('Company name appears to be suspicious');
          }
        }
        break;
        
      case 'jobRole':
        if (!value || value.trim().length < 2) {
          validationResults.isValid = false;
          validationResults.errors.push('Job role must be at least 2 characters long');
        }
        if (value && value.length > 100) {
          validationResults.isValid = false;
          validationResults.errors.push('Job role cannot exceed 100 characters');
        }
        break;
        
      case 'overallExperience':
        if (!value || value.trim().length < 50) {
          validationResults.isValid = false;
          validationResults.errors.push('Experience must be at least 50 characters long');
        }
        if (value && value.length > 2000) {
          validationResults.isValid = false;
          validationResults.errors.push('Experience cannot exceed 2000 characters');
        }
        // Check for spam indicators
        if (value) {
          const spamKeywords = ['fake', 'spam', 'test', 'dummy', 'lorem ipsum'];
          const lowerValue = value.toLowerCase();
          if (spamKeywords.some(keyword => lowerValue.includes(keyword))) {
            validationResults.isValid = false;
            validationResults.errors.push('Experience contains suspicious content');
          }
        }
        break;
        
      case 'linkedinUrl':
        if (value && !/^https:\/\/www\.linkedin\.com\/.*$/.test(value)) {
          validationResults.isValid = false;
          validationResults.errors.push('LinkedIn URL must start with https://www.linkedin.com/');
        }
        if (value && value.length > 500) {
          validationResults.isValid = false;
          validationResults.errors.push('LinkedIn URL cannot exceed 500 characters');
        }
        break;
        
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          validationResults.isValid = false;
          validationResults.errors.push('Please provide a valid email address');
        }
        if (value && value.length > 254) {
          validationResults.isValid = false;
          validationResults.errors.push('Email cannot exceed 254 characters');
        }
        break;
        
      case 'ctc':
        if (value && !/^\d+(\.\d+)?\s*LPA$/i.test(value)) {
          validationResults.isValid = false;
          validationResults.errors.push('CTC must be in format like "6 LPA" or "6.5 LPA"');
        }
        if (value && value.length > 20) {
          validationResults.isValid = false;
          validationResults.errors.push('CTC cannot exceed 20 characters');
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid field name'
        });
    }
    
    res.json({
      success: true,
      field: field,
      value: value,
      validation: validationResults
    });
    
  } catch (error) {
    console.error('Experience validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Validation service error'
    });
  }
};

// Check for duplicate content
exports.checkDuplicateContent = async (req, res) => {
  try {
    const { type, content } = req.body;
    
    if (!type || !content) {
      return res.status(400).json({
        success: false,
        message: 'Type and content are required'
      });
    }
    
    let isDuplicate = false;
    let duplicateInfo = null;
    
    if (type === 'contact') {
      const existingContact = await Contact.findOne({
        $or: [
          { message: content },
          { email: content }
        ]
      });
      
      if (existingContact) {
        isDuplicate = true;
        duplicateInfo = {
          type: 'contact',
          id: existingContact._id,
          date: existingContact.date
        };
      }
    } else if (type === 'experience') {
      const existingExperience = await Experience.findOne({
        $or: [
          { overallExperience: content },
          { companyName: content }
        ]
      });
      
      if (existingExperience) {
        isDuplicate = true;
        duplicateInfo = {
          type: 'experience',
          id: existingExperience._id,
          companyName: existingExperience.companyName,
          date: existingExperience.date
        };
      }
    }
    
    res.json({
      success: true,
      isDuplicate: isDuplicate,
      duplicateInfo: duplicateInfo
    });
    
  } catch (error) {
    console.error('Duplicate check error:', error);
    res.status(500).json({
      success: false,
      message: 'Duplicate check service error'
    });
  }
};

// Content quality analysis
exports.analyzeContentQuality = async (req, res) => {
  try {
    const { content, type } = req.body;
    
    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Content and type are required'
      });
    }
    
    const analysis = {
      qualityScore: 0,
      issues: [],
      suggestions: []
    };
    
    // Basic quality checks
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Word count analysis
    if (wordCount < 10) {
      analysis.issues.push('Content is too short');
      analysis.suggestions.push('Add more details to improve quality');
    } else if (wordCount > 500) {
      analysis.issues.push('Content is very long');
      analysis.suggestions.push('Consider breaking into smaller sections');
    }
    
    // Sentence structure analysis
    const avgWordsPerSentence = wordCount / sentenceCount;
    if (avgWordsPerSentence < 5) {
      analysis.issues.push('Sentences are too short');
      analysis.suggestions.push('Combine related ideas into longer sentences');
    } else if (avgWordsPerSentence > 25) {
      analysis.issues.push('Sentences are too long');
      analysis.suggestions.push('Break long sentences into shorter ones');
    }
    
    // Special character analysis
    const specialCharCount = (content.match(/[!@#$%^&*()_+=\[\]{}|;':",./<>?\\]/g) || []).length;
    const specialCharRatio = specialCharCount / charCount;
    
    if (specialCharRatio > 0.1) {
      analysis.issues.push('Too many special characters');
      analysis.suggestions.push('Reduce special characters for better readability');
    }
    
    // Repetition analysis
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    
    const maxRepeatedWords = Math.max(...Object.values(wordCounts));
    if (maxRepeatedWords > 3) {
      analysis.issues.push('Excessive word repetition');
      analysis.suggestions.push('Use synonyms to avoid repetition');
    }
    
    // Calculate quality score
    let score = 100;
    score -= analysis.issues.length * 10;
    score -= Math.max(0, 10 - wordCount) * 5;
    score -= Math.max(0, specialCharRatio - 0.05) * 100;
    score -= Math.max(0, maxRepeatedWords - 2) * 5;
    
    analysis.qualityScore = Math.max(0, Math.min(100, score));
    
    res.json({
      success: true,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('Content analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Content analysis service error'
    });
  }
};
