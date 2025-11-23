/**
 * State Pattern Implementation for Experience Status Management
 * Ensures controlled state transitions and validation
 */

class ExperienceState {
  constructor(experience) {
    this.experience = experience;
  }

  canTransitionTo(newStatus) {
    throw new Error("canTransitionTo must be implemented by subclass");
  }

  approve(adminId, reason) {
    throw new Error("Cannot approve from this state");
  }

  reject(adminId, reason) {
    throw new Error("Cannot reject from this state");
  }

  reopen(adminId, reason) {
    throw new Error("Cannot reopen from this state");
  }

  getAvailableActions() {
    throw new Error("getAvailableActions must be implemented by subclass");
  }
}

class PendingState extends ExperienceState {
  canTransitionTo(newStatus) {
    return ['approved', 'rejected'].includes(newStatus);
  }

  approve(adminId, reason) {
    this.experience.status = 'approved';
    this.experience.approvedAt = new Date();
    this.experience.moderatedBy = adminId;
    this.experience.moderationNotes = reason;
    return new ApprovedState(this.experience);
  }

  reject(adminId, reason) {
    this.experience.status = 'rejected';
    this.experience.rejectedAt = new Date();
    this.experience.moderatedBy = adminId;
    this.experience.moderationNotes = reason;
    return new RejectedState(this.experience);
  }

  getAvailableActions() {
    return ['approve', 'reject'];
  }
}

class ApprovedState extends ExperienceState {
  canTransitionTo(newStatus) {
    return ['rejected'].includes(newStatus);
  }

  reject(adminId, reason) {
    this.experience.status = 'rejected';
    this.experience.rejectedAt = new Date();
    this.experience.moderatedBy = adminId;
    this.experience.moderationNotes = reason;
    return new RejectedState(this.experience);
  }

  getAvailableActions() {
    return ['reject'];
  }
}

class RejectedState extends ExperienceState {
  canTransitionTo(newStatus) {
    return ['approved', 'pending'].includes(newStatus);
  }

  approve(adminId, reason) {
    this.experience.status = 'approved';
    this.experience.approvedAt = new Date();
    this.experience.rejectedAt = null;
    this.experience.moderatedBy = adminId;
    this.experience.moderationNotes = reason;
    return new ApprovedState(this.experience);
  }

  reopen(adminId, reason) {
    this.experience.status = 'pending';
    this.experience.rejectedAt = null;
    this.experience.moderatedBy = adminId;
    this.experience.moderationNotes = reason;
    return new PendingState(this.experience);
  }

  getAvailableActions() {
    return ['approve', 'reopen'];
  }
}

// State Factory
class ExperienceStateFactory {
  static createState(experience) {
    switch (experience.status) {
      case 'pending':
        return new PendingState(experience);
      case 'approved':
        return new ApprovedState(experience);
      case 'rejected':
        return new RejectedState(experience);
      default:
        return new PendingState(experience);
    }
  }
}

module.exports = {
  ExperienceState,
  PendingState,
  ApprovedState,
  RejectedState,
  ExperienceStateFactory
};