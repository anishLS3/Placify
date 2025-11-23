const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Name can only contain letters and spaces']
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    trim: true,
    lowercase: true,
    minlength: [5, 'Email must be at least 5 characters long'],
    maxlength: [254, 'Email cannot exceed 254 characters'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please add a valid email address']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add your message'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  // Admin management fields
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false
  },
  response: {
    type: String,
    trim: true,
    maxlength: [2000, 'Response cannot exceed 2000 characters']
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false
  },
  respondedAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'account', 'feedback', 'bug-report', 'feature-request'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Original date field maintained for compatibility
  date: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
contactSchema.index({ status: 1, date: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ category: 1, priority: 1 });
contactSchema.index({ date: -1 });

// Virtual for extracting subject from message
contactSchema.virtual('extractedSubject').get(function() {
  if (this.subject && this.subject.trim()) {
    return this.subject.trim();
  }
  // Extract subject from message if it starts with "Subject:"
  if (this.message && this.message.startsWith('Subject:')) {
    const lines = this.message.split('\n');
    const subjectLine = lines[0];
    return subjectLine.replace('Subject:', '').trim() || 'No subject';
  }
  return 'No subject';
});

// Virtual for extracting clean message (without subject line)
contactSchema.virtual('cleanMessage').get(function() {
  if (this.message && this.message.startsWith('Subject:')) {
    const lines = this.message.split('\n');
    return lines.slice(2).join('\n').trim(); // Skip "Subject:" line and empty line
  }
  return this.message;
});

// Virtual for response status
contactSchema.virtual('hasResponse').get(function() {
  return Boolean(this.response && this.response.length > 0);
});

// Virtual for admin assignment status
contactSchema.virtual('isAssigned').get(function() {
  return Boolean(this.assignedTo);
});

// Ensure virtual fields are serialized
contactSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema);