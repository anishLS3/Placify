const mongoose = require('mongoose');

// Define the Experience schema for admin backend
// This is a copy of the schema from the user backend to avoid connection conflicts
const experienceSchema = new mongoose.Schema({
  // Student Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
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
    required: [true, 'Batch year is required'],
    min: [2020, 'Batch year must be at least 2020'],
    max: [2030, 'Batch year cannot exceed 2030']
  },
  linkedinUrl: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?([\w\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/, 'Please provide a valid LinkedIn URL']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },

  // Company Information
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  jobRole: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true,
    maxlength: [150, 'Job role cannot exceed 150 characters']
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
    required: [true, 'Job location is required'],
    trim: true,
    maxlength: [150, 'Job location cannot exceed 150 characters']
  },
  ctc: {
    type: String,
    required: [true, 'CTC is required'],
    trim: true,
    maxlength: [50, 'CTC cannot exceed 50 characters']
  },

  // Interview Process
  numberOfRounds: {
    type: Number,
    required: [true, 'Number of rounds is required'],
    min: [1, 'Number of rounds must be at least 1'],
    max: [10, 'Number of rounds cannot exceed 10']
  },
  roundTypes: [{
    type: String,
    enum: ['Aptitude', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Case Study', 'Presentation']
  }],
  difficultyLevel: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  overallExperience: {
    type: String,
    required: [true, 'Overall experience is required'],
    trim: true,
    maxlength: [1000, 'Overall experience cannot exceed 1000 characters']
  },

  // Detailed Interview Information
  rounds: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Round name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Round description cannot exceed 1000 characters']
    }
  }],
  codingQuestions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Coding questions cannot exceed 2000 characters']
  },
  technicalQuestions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Technical questions cannot exceed 2000 characters']
  },
  hrQuestions: {
    type: String,
    trim: true,
    maxlength: [1000, 'HR questions cannot exceed 1000 characters']
  },

  // Preparation and Advice
  resourcesUsed: {
    type: String,
    trim: true,
    maxlength: [1000, 'Resources used cannot exceed 1000 characters']
  },
  tipsForCandidates: {
    type: String,
    trim: true,
    maxlength: [1000, 'Tips for candidates cannot exceed 1000 characters']
  },
  mistakesToAvoid: {
    type: String,
    trim: true,
    maxlength: [1000, 'Mistakes to avoid cannot exceed 1000 characters']
  },

  // Metadata
  date: {
    type: Date,
    required: [true, 'Interview date is required']
  },

  // Admin Moderation Fields (added during migration)
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationBadge: {
    type: Boolean,
    default: false
  },
  moderatedBy: {
    type: String,
    default: null
  },
  moderationNotes: {
    type: String,
    default: '',
    maxlength: [1000, 'Moderation notes cannot exceed 1000 characters']
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: false // Don't add createdAt/updatedAt since they don't exist in the data
});

// Index for better performance
experienceSchema.index({ status: 1, _id: -1 });
experienceSchema.index({ companyName: 1 });
experienceSchema.index({ jobRole: 1 });
experienceSchema.index({ verificationBadge: 1 });

// Create and export the model
const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;