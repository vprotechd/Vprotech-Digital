// backend/models/Application.js
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  availableTime: {
    type: String,
    required: [true, 'Available interview time is required']
  },
  experience: {
    type: String,
    trim: true,
    default: ''
  },
  coverLetter: {
    type: String,
    trim: true,
    default: ''
  },
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  portfolio: {
    type: String,
    trim: true,
    default: ''
  },
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  resumePublicId: {
    type: String,
    default: ''
  },
  resumeFormat: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  viewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ email: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;