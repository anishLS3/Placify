const AuditLog = require('../../models/AuditLog');

/**
 * Command Pattern Implementation for Admin Actions
 * Encapsulates actions for logging and potential undo operations
 */
class AdminCommand {
  constructor(adminId, action, resourceType, resourceId = null, details = {}, request = null) {
    this.adminId = adminId;
    this.action = action;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.details = details;
    this.ipAddress = request?.ip || 'unknown';
    this.userAgent = request?.get('User-Agent') || 'unknown';
    this.timestamp = new Date();
  }

  async execute() {
    try {
      // Execute the main command logic
      const result = await this.performAction();
      
      // Log the action
      await this.logAction();
      
      return result;
    } catch (error) {
      // Log failed action
      await this.logFailedAction(error);
      throw error;
    }
  }

  async performAction() {
    throw new Error('performAction must be implemented by subclass');
  }

  async logAction() {
    try {
      await AuditLog.create({
        adminId: this.adminId,
        action: this.action,
        resourceType: this.resourceType,
        resourceId: this.resourceId,
        details: this.details,
        ipAddress: this.ipAddress,
        userAgent: this.userAgent
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  async logFailedAction(error) {
    try {
      await AuditLog.create({
        adminId: this.adminId,
        action: `${this.action}_FAILED`,
        resourceType: this.resourceType,
        resourceId: this.resourceId,
        details: {
          ...this.details,
          error: error.message
        },
        ipAddress: this.ipAddress,
        userAgent: this.userAgent
      });
    } catch (logError) {
      console.error('Failed to log failed action:', logError);
    }
  }
}

class ApproveExperienceCommand extends AdminCommand {
  constructor(adminId, experienceId, reason, request) {
    super(adminId, 'APPROVE_EXPERIENCE', 'Experience', experienceId, { reason }, request);
  }

  async performAction() {
    const experienceService = require('../../services/experienceService');
    return await experienceService.approveExperience(this.resourceId, this.adminId, this.details.reason);
  }
}

class RejectExperienceCommand extends AdminCommand {
  constructor(adminId, experienceId, reason, request) {
    super(adminId, 'REJECT_EXPERIENCE', 'Experience', experienceId, { reason }, request);
  }

  async performAction() {
    const experienceService = require('../../services/experienceService');
    return await experienceService.rejectExperience(this.resourceId, this.adminId, this.details.reason);
  }
}

class BulkApproveCommand extends AdminCommand {
  constructor(adminId, experienceIds, reason, request) {
    super(adminId, 'BULK_APPROVE', 'Experience', null, { experienceIds, reason }, request);
  }

  async performAction() {
    const experienceService = require('../../services/experienceService');
    return await experienceService.bulkApprove(this.details.experienceIds, this.adminId, this.details.reason);
  }
}

class BulkRejectCommand extends AdminCommand {
  constructor(adminId, experienceIds, reason, request) {
    super(adminId, 'BULK_REJECT', 'Experience', null, { experienceIds, reason }, request);
  }

  async performAction() {
    const experienceService = require('../../services/experienceService');
    return await experienceService.bulkReject(this.details.experienceIds, this.adminId, this.details.reason);
  }
}

class UpdateContactStatusCommand extends AdminCommand {
  constructor(adminId, contactId, oldStatus, newStatus, notes, request) {
    super(adminId, 'UPDATE_CONTACT_STATUS', 'Contact', contactId, {
      oldValue: { status: oldStatus },
      newValue: { status: newStatus },
      notes
    }, request);
  }

  async performAction() {
    const contactService = require('../../services/contactService');
    return await contactService.updateStatus(this.resourceId, this.details.newValue.status, this.details.notes);
  }
}

module.exports = {
  AdminCommand,
  ApproveExperienceCommand,
  RejectExperienceCommand,
  BulkApproveCommand,
  BulkRejectCommand,
  UpdateContactStatusCommand
};