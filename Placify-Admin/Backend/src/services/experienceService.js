const experienceRepository = require('../repositories/experienceRepository');
const adminRepository = require('../repositories/adminRepository');
const eventBus = require('../utils/eventBus');

// State machine for experience status transitions
const EXPERIENCE_STATES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const VALID_TRANSITIONS = {
  [EXPERIENCE_STATES.PENDING]: [EXPERIENCE_STATES.APPROVED, EXPERIENCE_STATES.REJECTED],
  [EXPERIENCE_STATES.APPROVED]: [EXPERIENCE_STATES.REJECTED], // Can reject approved experiences
  [EXPERIENCE_STATES.REJECTED]: [EXPERIENCE_STATES.APPROVED]  // Can re-approve rejected experiences
};

class ExperienceService {
  // Validate state transition
  validateStateTransition(currentStatus, newStatus) {
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid state transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ')}`
      );
    }
    
    return true;
  }

  // Decorator pattern: Add approval metadata to experience
  decorateApprovedExperience(experience, adminId, options = {}) {
    const decoratedData = {
      status: EXPERIENCE_STATES.APPROVED,
      moderatedBy: adminId,
      approvedAt: new Date(),
      moderationNotes: options.notes || '',
      verificationBadge: options.addVerificationBadge || false
    };

    return decoratedData;
  }

  // Decorator pattern: Add rejection metadata to experience
  decorateRejectedExperience(experience, adminId, notes) {
    return {
      status: EXPERIENCE_STATES.REJECTED,
      moderatedBy: adminId,
      rejectedAt: new Date(),
      moderationNotes: notes,
      verificationBadge: false // Remove verification badge on rejection
    };
  }

  // Approve experience with business logic
  async approveExperience(experienceId, adminId, options = {}) {
    try {
      // Get current experience
      const experience = await experienceRepository.findById(experienceId);
      
      // Validate state transition
      this.validateStateTransition(experience.status, EXPERIENCE_STATES.APPROVED);
      
      // Prepare approval metadata using decorator pattern
      const approvalData = this.decorateApprovedExperience(experience, adminId, options);
      
      // Update experience in database
      const updatedExperience = await experienceRepository.approve(experienceId, {
        adminId,
        notes: options.notes,
        addVerificationBadge: options.addVerificationBadge
      });
      
      // Log admin action for audit trail
      await this.logAdminAction({
        adminId,
        action: 'APPROVE_EXPERIENCE',
        resourceType: 'Experience',
        resourceId: experienceId,
        details: {
          addedVerificationBadge: options.addVerificationBadge,
          notes: options.notes
        },
        previousData: { status: experience.status },
        newData: { status: EXPERIENCE_STATES.APPROVED }
      });
      
      // Emit event for real-time notifications
      eventBus.emit('experienceApproved', {
        experience: updatedExperience,
        adminId,
        timestamp: new Date()
      });
      
      return {
        success: true,
        experience: updatedExperience,
        message: 'Experience approved successfully'
      };
      
    } catch (error) {
      // Log error for debugging
      console.error('Error approving experience:', error);
      
      throw new Error(`Failed to approve experience: ${error.message}`);
    }
  }

  // Reject experience with business logic
  async rejectExperience(experienceId, adminId, notes) {
    try {
      if (!notes || notes.trim().length < 10) {
        throw new Error('Rejection notes are required and must be at least 10 characters');
      }
      
      // Get current experience
      const experience = await experienceRepository.findById(experienceId);
      
      // Validate state transition
      this.validateStateTransition(experience.status, EXPERIENCE_STATES.REJECTED);
      
      // Update experience in database
      const updatedExperience = await experienceRepository.reject(experienceId, notes, adminId);
      
      // Log admin action for audit trail
      await this.logAdminAction({
        adminId,
        action: 'REJECT_EXPERIENCE',
        resourceType: 'Experience',
        resourceId: experienceId,
        details: { rejectionReason: notes },
        previousData: { status: experience.status },
        newData: { status: EXPERIENCE_STATES.REJECTED }
      });
      
      // Emit event for real-time notifications
      eventBus.emit('experienceRejected', {
        experience: updatedExperience,
        adminId,
        rejectionReason: notes,
        timestamp: new Date()
      });
      
      return {
        success: true,
        experience: updatedExperience,
        message: 'Experience rejected successfully'
      };
      
    } catch (error) {
      console.error('Error rejecting experience:', error);
      throw new Error(`Failed to reject experience: ${error.message}`);
    }
  }

  // Toggle verification badge
  async toggleVerificationBadge(experienceId, adminId) {
    try {
      const experience = await experienceRepository.findById(experienceId);
      
      // Only approved experiences can have verification badges
      if (experience.status !== EXPERIENCE_STATES.APPROVED) {
        throw new Error('Only approved experiences can have verification badges');
      }
      
      const updatedExperience = await experienceRepository.toggleVerificationBadge(experienceId, adminId);
      
      // Log admin action
      await this.logAdminAction({
        adminId,
        action: updatedExperience.verificationBadge ? 'ADD_VERIFICATION_BADGE' : 'REMOVE_VERIFICATION_BADGE',
        resourceType: 'Experience',
        resourceId: experienceId,
        details: { verificationBadge: updatedExperience.verificationBadge },
        previousData: { verificationBadge: experience.verificationBadge },
        newData: { verificationBadge: updatedExperience.verificationBadge }
      });
      
      // Emit event
      eventBus.emit('verificationBadgeToggled', {
        experience: updatedExperience,
        adminId,
        added: updatedExperience.verificationBadge,
        timestamp: new Date()
      });
      
      return {
        success: true,
        experience: updatedExperience,
        message: `Verification badge ${updatedExperience.verificationBadge ? 'added' : 'removed'} successfully`
      };
      
    } catch (error) {
      console.error('Error toggling verification badge:', error);
      throw new Error(`Failed to toggle verification badge: ${error.message}`);
    }
  }

  // Get pending experiences for admin review
  async getPendingExperiences(page = 1, limit = 10) {
    try {
      const result = await experienceRepository.findPending(page, limit);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new Error(`Failed to get pending experiences: ${error.message}`);
    }
  }

  // Get experience by ID with admin context
  async getExperience(experienceId, adminId) {
    try {
      const experience = await experienceRepository.findById(experienceId);
      
      // Log admin view action
      await this.logAdminAction({
        adminId,
        action: 'VIEW_EXPERIENCE',
        resourceType: 'Experience',
        resourceId: experienceId,
        details: { viewedAt: new Date() }
      });
      
      return {
        success: true,
        experience
      };
    } catch (error) {
      throw new Error(`Failed to get experience: ${error.message}`);
    }
  }

  // Get experiences by status
  async getExperiencesByStatus(status, page = 1, limit = 10) {
    try {
      if (!Object.values(EXPERIENCE_STATES).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }
      
      const result = await experienceRepository.findByStatus(status, page, limit);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new Error(`Failed to get experiences by status: ${error.message}`);
    }
  }

  // Get all experiences with optional filters
  async getAllExperiences(page = 1, limit = 10, options = {}) {
    try {
      console.log('Service getAllExperiences called with:', { page, limit, options });
      
      const result = await experienceRepository.findAll(page, limit, options);
      
      console.log('Service getAllExperiences result:', {
        success: result.success,
        count: result.experiences.length,
        total: result.pagination.totalRecords
      });
      
      return result;
    } catch (error) {
      console.error('Service getAllExperiences error:', error);
      throw new Error(`Failed to get all experiences: ${error.message}`);
    }
  }

  // Get recent experiences for dashboard
  async getRecentExperiences(limit = 5) {
    try {
      const result = await experienceRepository.findRecent(limit);
      
      return {
        success: true,
        experiences: result,
        count: result.length
      };
    } catch (error) {
      throw new Error(`Failed to get recent experiences: ${error.message}`);
    }
  }

  // Search experiences
  async searchExperiences(query, status = null, page = 1, limit = 10) {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }
      
      const result = await experienceRepository.search(query, status, page, limit);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new Error(`Failed to search experiences: ${error.message}`);
    }
  }

  // Batch approve experiences
  async batchApprove(experienceIds, adminId) {
    try {
      if (!Array.isArray(experienceIds) || experienceIds.length === 0) {
        throw new Error('Experience IDs must be a non-empty array');
      }
      
      const result = await experienceRepository.batchApprove(experienceIds, adminId);
      
      // Log batch action
      await this.logAdminAction({
        adminId,
        action: 'APPROVE_EXPERIENCE',
        resourceType: 'Experience',
        details: { 
          batchOperation: true,
          experienceIds,
          count: experienceIds.length
        }
      });
      
      // Emit batch event
      eventBus.emit('batchExperiencesApproved', {
        experienceIds,
        adminId,
        count: result.modifiedCount,
        timestamp: new Date()
      });
      
      return {
        success: true,
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} experiences approved successfully`
      };
      
    } catch (error) {
      throw new Error(`Failed to batch approve experiences: ${error.message}`);
    }
  }

  // Batch reject experiences
  async batchReject(experienceIds, adminId, notes) {
    try {
      if (!Array.isArray(experienceIds) || experienceIds.length === 0) {
        throw new Error('Experience IDs must be a non-empty array');
      }
      
      if (!notes || notes.trim().length < 10) {
        throw new Error('Rejection notes are required and must be at least 10 characters');
      }
      
      const result = await experienceRepository.batchReject(experienceIds, adminId, notes);
      
      // Log batch action
      await this.logAdminAction({
        adminId,
        action: 'REJECT_EXPERIENCE',
        resourceType: 'Experience',
        details: { 
          batchOperation: true,
          experienceIds,
          count: experienceIds.length,
          rejectionReason: notes
        }
      });
      
      // Emit batch event
      eventBus.emit('batchExperiencesRejected', {
        experienceIds,
        adminId,
        count: result.modifiedCount,
        rejectionReason: notes,
        timestamp: new Date()
      });
      
      return {
        success: true,
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} experiences rejected successfully`
      };
      
    } catch (error) {
      throw new Error(`Failed to batch reject experiences: ${error.message}`);
    }
  }

  // Get dashboard analytics
  async getDashboardAnalytics() {
    try {
      const analytics = await experienceRepository.getAnalyticsData();
      
      return {
        success: true,
        analytics
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard analytics: ${error.message}`);
    }
  }

  // Helper method to log admin actions
  async logAdminAction(actionData) {
    try {
      await adminRepository.logAction(actionData);
    } catch (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  // Update experience status
  async updateStatus(id, status, adminId, notes = '') {
    try {
      const experience = await experienceRepository.findById(id);
      
      if (!experience) {
        throw new Error('Experience not found');
      }

      // Update status and moderation info
      const updateData = {
        status,
        moderatedBy: adminId,
        moderationNotes: notes || experience.moderationNotes,
      };

      // Set appropriate timestamp
      if (status === 'approved') {
        updateData.approvedAt = new Date();
        updateData.rejectedAt = null;
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
        updateData.approvedAt = null;
      } else if (status === 'pending') {
        updateData.approvedAt = null;
        updateData.rejectedAt = null;
      }

      const updatedExperience = await experienceRepository.updateExperience(id, updateData);

      // Create audit log entry
      await this.logAdminAction({
        adminId,
        action: 'STATUS_UPDATE',
        resourceType: 'Experience',
        resourceId: id,
        details: {
          previousStatus: experience.status,
          newStatus: status,
          notes: notes || 'No notes provided'
        }
      });

      // Emit real-time event
      eventBus.emit('experienceStatusChanged', {
        experienceId: id,
        previousStatus: experience.status,
        newStatus: status,
        moderatedBy: adminId,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        message: `Experience status updated to ${status}`,
        experience: updatedExperience
      };

    } catch (error) {
      console.error('Error updating experience status:', error);
      throw error;
    }
  }
}

module.exports = new ExperienceService();