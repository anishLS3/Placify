const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Round name is required'],
    trim: true,
    minlength: [2, 'Round name must be at least 2 characters long'],
    maxlength: [100, 'Round name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Round description is required'],
    trim: true,
    minlength: [10, 'Round description must be at least 10 characters long'],
    maxlength: [500, 'Round description cannot exceed 500 characters']
  }
});

const experienceSchema = new mongoose.Schema({
  // Personal & Academic Details
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Full name can only contain letters and spaces']
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    maxlength: [254, 'Email cannot exceed 254 characters']
  },
  collegeName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'College name cannot exceed 200 characters']
  },
  branch: {
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'],
    required: false
  },
  batchYear: {
    type: Number,
    required: false,
    min: [2000, 'Batch year must be 2000 or later'],
    max: [2030, 'Batch year cannot be later than 2030']
  },
  linkedinUrl: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    },
    validate: {
      validator: function(v) {
        if (!this.isAnonymous && v) {
          return /^https:\/\/www\.linkedin\.com\/.*$/.test(v);
        }
        return true;
      },
      message: 'LinkedIn URL must start with https://www.linkedin.com/'
    },
    trim: true,
    maxlength: [500, 'LinkedIn URL cannot exceed 500 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Company & Role Details
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters long'],
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  jobRole: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true,
    minlength: [2, 'Job role must be at least 2 characters long'],
    maxlength: [100, 'Job role cannot exceed 100 characters']
  },
  positionType: {
    type: String,
    enum: ['Placement', 'Internship'],
    required: [true, 'Position type is required']
  },
  interviewType: {
    type: String,
    enum: ['On-Campus', 'Off-Campus', 'Referral'],
    required: false
  },
  jobLocation: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Job location cannot exceed 100 characters']
  },
  ctc: {
    type: String,
    required: false,
    trim: true,
    match: [/^\d+(\.\d+)?\s*LPA$/i, 'CTC must be in format like "6 LPA" or "6.5 LPA"'],
    maxlength: [20, 'CTC cannot exceed 20 characters']
  },
  
  // Selection Process Details
  numberOfRounds: {
    type: Number,
    required: [true, 'Number of rounds is required'],
    min: [1, 'Number of rounds must be at least 1'],
    max: [10, 'Number of rounds cannot exceed 10']
  },
  roundTypes: [{
    type: String,
    enum: ['Aptitude', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Presentation']
  }],
  difficultyLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  overallExperience: {
    type: String,
    required: [true, 'Overall experience summary is required'],
    trim: true,
    minlength: [50, 'Overall experience must be at least 50 characters long'],
    maxlength: [2000, 'Overall experience cannot exceed 2000 characters']
  },
  
  // Detailed Round Descriptions
  rounds: [roundSchema],
  
  // Technical & HR Questions
  codingQuestions: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Coding questions cannot exceed 1000 characters']
  },
  technicalQuestions: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Technical questions cannot exceed 1000 characters']
  },
  hrQuestions: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'HR questions cannot exceed 1000 characters']
  },
  
  // Preparation Tips
  resourcesUsed: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Resources used cannot exceed 1000 characters']
  },
  tipsForCandidates: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Tips for candidates cannot exceed 1000 characters']
  },
  mistakesToAvoid: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Mistakes to avoid cannot exceed 1000 characters']
  },
  
  // Legacy fields for backward compatibility
  name: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'Company cannot exceed 200 characters']
  },
  role: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  experience: {
    type: String,
    required: false,
    trim: true,
    maxlength: [2000, 'Experience cannot exceed 2000 characters']
  },
  
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema);