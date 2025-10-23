const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const experienceSchema = new mongoose.Schema({
  // Personal & Academic Details
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  collegeName: {
    type: String,
    required: false
  },
  branch: {
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'],
    required: false
  },
  batchYear: {
    type: Number,
    required: false
  },
  linkedinUrl: {
    type: String,
    required: [true, 'LinkedIn URL is required for students to contact you']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Company & Role Details
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  jobRole: {
    type: String,
    required: [true, 'Job role is required']
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
    required: false
  },
  ctc: {
    type: String,
    required: false
  },
  
  // Selection Process Details
  numberOfRounds: {
    type: Number,
    required: [true, 'Number of rounds is required']
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
    required: [true, 'Overall experience summary is required']
  },
  
  // Detailed Round Descriptions
  rounds: [roundSchema],
  
  // Technical & HR Questions
  codingQuestions: {
    type: String,
    required: false
  },
  technicalQuestions: {
    type: String,
    required: false
  },
  hrQuestions: {
    type: String,
    required: false
  },
  
  // Preparation Tips
  resourcesUsed: {
    type: String,
    required: false
  },
  tipsForCandidates: {
    type: String,
    required: false
  },
  mistakesToAvoid: {
    type: String,
    required: false
  },
  
  // Legacy fields for backward compatibility
  name: {
    type: String,
    required: false
  },
  company: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: false
  },
  experience: {
    type: String,
    required: false
  },
  
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema);