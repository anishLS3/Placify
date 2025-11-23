const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'APPROVE_EXPERIENCE',
      'REJECT_EXPERIENCE',
      'ADD_VERIFICATION_BADGE',
      'REMOVE_VERIFICATION_BADGE',
      'UPDATE_EXPERIENCE_STATUS',
      'RESPOND_TO_CONTACT',
      'LOGIN',
      'LOGOUT',
      'VIEW_EXPERIENCE',
      'VIEW_ANALYTICS',
      'VIEW_DASHBOARD',
      'VIEW_CONTACTS',
      'VIEW_CONTACT',
      'UPDATE_CONTACT_STATUS',
      'UPDATE_CONTACT_DETAILS',
      'EXPORT_DATA',
      'DELETE_EXPERIENCE',
      'BULK_UPDATE',
      'SYSTEM_ACTION'
    ]
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['Experience', 'Contact', 'Admin', 'System']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  details: {
    type: Object,
    required: false
  },
  previousData: {
    type: Object,
    required: false
  },
  newData: {
    type: Object,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);