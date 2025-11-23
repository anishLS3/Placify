const eventBus = require('../utils/eventBus');

// Real-time notification handlers for experience-related events

// Handle experience submission (from user frontend)
eventBus.on('experienceSubmitted', (data) => {
  try {
    console.log('📩 New experience submitted for review:', data.experience?.companyName);
    
    // Emit to admin dashboard via Socket.IO
    if (global.io) {
      global.io.to('admin-room').emit('newExperienceSubmitted', {
        type: 'NEW_SUBMISSION',
        message: `New experience submitted: ${data.experience?.companyName} - ${data.experience?.jobRole}`,
        experience: {
          id: data.experience?._id,
          company: data.experience?.companyName,
          role: data.experience?.jobRole,
          submittedAt: data.experience?.createdAt || data.timestamp
        },
        timestamp: data.timestamp || new Date()
      });
    }
  } catch (error) {
    console.error('Error handling experienceSubmitted event:', error);
  }
});

// Handle experience approval
eventBus.on('experienceApproved', (data) => {
  try {
    console.log('✅ Experience approved:', data.experience?.companyName);
    
    if (global.io) {
      global.io.to('admin-room').emit('experienceStatusChanged', {
        type: 'APPROVED',
        message: `Experience approved: ${data.experience?.companyName} - ${data.experience?.jobRole}`,
        experience: {
          id: data.experience?._id,
          company: data.experience?.companyName,
          role: data.experience?.jobRole,
          status: 'approved',
          verificationBadge: data.experience?.verificationBadge
        },
        adminId: data.adminId,
        timestamp: data.timestamp
      });
    }
  } catch (error) {
    console.error('Error handling experienceApproved event:', error);
  }
});

// Handle experience rejection
eventBus.on('experienceRejected', (data) => {
  try {
    console.log('❌ Experience rejected:', data.experience?.companyName);
    
    if (global.io) {
      global.io.to('admin-room').emit('experienceStatusChanged', {
        type: 'REJECTED',
        message: `Experience rejected: ${data.experience?.companyName} - ${data.experience?.jobRole}`,
        experience: {
          id: data.experience?._id,
          company: data.experience?.companyName,
          role: data.experience?.jobRole,
          status: 'rejected',
          rejectionReason: data.rejectionReason
        },
        adminId: data.adminId,
        timestamp: data.timestamp
      });
    }
  } catch (error) {
    console.error('Error handling experienceRejected event:', error);
  }
});

// Handle verification badge toggle
eventBus.on('verificationBadgeToggled', (data) => {
  try {
    const action = data.added ? 'added to' : 'removed from';
    console.log(`🏆 Verification badge ${action}:`, data.experience?.companyName);
    
    if (global.io) {
      global.io.to('admin-room').emit('verificationBadgeUpdated', {
        type: data.added ? 'BADGE_ADDED' : 'BADGE_REMOVED',
        message: `Verification badge ${action}: ${data.experience?.companyName} - ${data.experience?.jobRole}`,
        experience: {
          id: data.experience?._id,
          company: data.experience?.companyName,
          role: data.experience?.jobRole,
          verificationBadge: data.added
        },
        adminId: data.adminId,
        timestamp: data.timestamp
      });
    }
  } catch (error) {
    console.error('Error handling verificationBadgeToggled event:', error);
  }
});

// Handle batch operations
eventBus.on('batchExperiencesApproved', (data) => {
  try {
    console.log(`✅ Batch approved ${data.count} experiences`);
    
    if (global.io) {
      global.io.to('admin-room').emit('batchOperationCompleted', {
        type: 'BATCH_APPROVED',
        message: `Approved ${data.count} experiences`,
        count: data.count,
        adminId: data.adminId,
        timestamp: data.timestamp
      });
    }
  } catch (error) {
    console.error('Error handling batchExperiencesApproved event:', error);
  }
});

eventBus.on('batchExperiencesRejected', (data) => {
  try {
    console.log(`❌ Batch rejected ${data.count} experiences`);
    
    if (global.io) {
      global.io.to('admin-room').emit('batchOperationCompleted', {
        type: 'BATCH_REJECTED',
        message: `Rejected ${data.count} experiences`,
        count: data.count,
        rejectionReason: data.rejectionReason,
        adminId: data.adminId,
        timestamp: data.timestamp
      });
    }
  } catch (error) {
    console.error('Error handling batchExperiencesRejected event:', error);
  }
});

// Handle contact form submissions (from user frontend)
eventBus.on('contactSubmitted', (data) => {
  try {
    console.log('📮 New contact form submitted:', data.contact?.subject);
    
    if (global.io) {
      global.io.to('admin-room').emit('newContactSubmitted', {
        type: 'NEW_CONTACT',
        message: `New contact form: ${data.contact?.subject}`,
        contact: {
          id: data.contact?._id,
          name: data.contact?.name,
          email: data.contact?.email,
          subject: data.contact?.subject,
          submittedAt: data.contact?.createdAt || data.timestamp
        },
        timestamp: data.timestamp || new Date()
      });
    }
  } catch (error) {
    console.error('Error handling contactSubmitted event:', error);
  }
});

// Handle system events
eventBus.on('adminLogin', (data) => {
  try {
    console.log('👤 Admin logged in:', data.admin?.email);
    
    // Broadcast to other admin sessions (exclude current session)
    if (global.io) {
      global.io.to('admin-room').emit('adminActivityUpdate', {
        type: 'ADMIN_LOGIN',
        message: `${data.admin?.name} logged in`,
        admin: {
          id: data.admin?._id,
          name: data.admin?.name,
          email: data.admin?.email
        },
        timestamp: data.timestamp || new Date()
      });
    }
  } catch (error) {
    console.error('Error handling adminLogin event:', error);
  }
});

eventBus.on('adminLogout', (data) => {
  try {
    console.log('👤 Admin logged out:', data.admin?.email);
    
    if (global.io) {
      global.io.to('admin-room').emit('adminActivityUpdate', {
        type: 'ADMIN_LOGOUT',
        message: `${data.admin?.name} logged out`,
        admin: {
          id: data.admin?._id,
          name: data.admin?.name,
          email: data.admin?.email
        },
        timestamp: data.timestamp || new Date()
      });
    }
  } catch (error) {
    console.error('Error handling adminLogout event:', error);
  }
});

console.log('🔗 Experience event listeners initialized');