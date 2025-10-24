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
  message: {
    type: String,
    required: [true, 'Please add your message'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);