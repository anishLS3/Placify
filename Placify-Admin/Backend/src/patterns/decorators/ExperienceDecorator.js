/**
 * Decorator Pattern Implementation for Experience Enhancement
 * Adding functionality without modifying core objects
 */

class ExperienceDecorator {
  constructor(experience) {
    this.experience = experience;
  }

  // Pass through all original properties
  get id() { return this.experience._id; }
  get companyName() { return this.experience.companyName; }
  get jobRole() { return this.experience.jobRole; }
  get status() { return this.experience.status; }
  get createdAt() { return this.experience.createdAt; }
  
  // Enhanced methods
  toJSON() {
    return this.experience.toJSON();
  }

  save() {
    return this.experience.save();
  }
}

class VerificationBadgeDecorator extends ExperienceDecorator {
  constructor(experience, badgeType = 'verified', reason = '') {
    super(experience);
    this.badgeType = badgeType;
    this.badgeReason = reason;
    this.badgeAddedAt = new Date();
  }

  addVerificationBadge() {
    this.experience.verificationBadge = {
      type: this.badgeType,
      reason: this.badgeReason,
      addedAt: this.badgeAddedAt,
      verified: true
    };
    return this;
  }

  removeVerificationBadge() {
    this.experience.verificationBadge = null;
    return this;
  }

  hasVerificationBadge() {
    return this.experience.verificationBadge && this.experience.verificationBadge.verified;
  }

  getVerificationInfo() {
    return this.experience.verificationBadge || null;
  }
}

class ModerationNotesDecorator extends ExperienceDecorator {
  constructor(experience, moderatorId, notes = '') {
    super(experience);
    this.moderatorId = moderatorId;
    this.moderationNotes = notes;
    this.moderatedAt = new Date();
  }

  addModerationNotes(notes) {
    if (!this.experience.moderationHistory) {
      this.experience.moderationHistory = [];
    }

    this.experience.moderationHistory.push({
      moderatorId: this.moderatorId,
      notes: notes,
      action: 'note_added',
      timestamp: new Date()
    });

    this.experience.moderationNotes = notes;
    this.experience.moderatedBy = this.moderatorId;
    this.experience.moderatedAt = this.moderatedAt;

    return this;
  }

  getModerationHistory() {
    return this.experience.moderationHistory || [];
  }

  getLatestModerationNote() {
    const history = this.getModerationHistory();
    return history.length > 0 ? history[history.length - 1] : null;
  }
}

class PriorityDecorator extends ExperienceDecorator {
  constructor(experience, priority = 'normal', reason = '') {
    super(experience);
    this.priority = priority;
    this.priorityReason = reason;
    this.prioritySetAt = new Date();
  }

  setPriority(priority, reason = '') {
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }

    this.experience.priority = {
      level: priority,
      reason: reason,
      setAt: this.prioritySetAt
    };

    return this;
  }

  getPriority() {
    return this.experience.priority || { level: 'normal', reason: '', setAt: null };
  }

  isHighPriority() {
    const priority = this.getPriority();
    return ['high', 'urgent'].includes(priority.level);
  }
}

class FeaturedDecorator extends ExperienceDecorator {
  constructor(experience, featured = false, reason = '') {
    super(experience);
    this.featured = featured;
    this.featuredReason = reason;
    this.featuredAt = new Date();
  }

  setFeatured(featured = true, reason = '') {
    this.experience.featured = {
      isFeatured: featured,
      reason: reason,
      setAt: featured ? this.featuredAt : null,
      unsetAt: !featured ? this.featuredAt : null
    };

    return this;
  }

  unsetFeatured(reason = '') {
    return this.setFeatured(false, reason);
  }

  isFeatured() {
    return this.experience.featured && this.experience.featured.isFeatured;
  }

  getFeaturedInfo() {
    return this.experience.featured || null;
  }
}

class MetadataDecorator extends ExperienceDecorator {
  constructor(experience) {
    super(experience);
    this.enhancedAt = new Date();
  }

  addMetadata(key, value) {
    if (!this.experience.metadata) {
      this.experience.metadata = {};
    }

    this.experience.metadata[key] = {
      value: value,
      addedAt: new Date()
    };

    return this;
  }

  getMetadata(key) {
    return this.experience.metadata && this.experience.metadata[key] ? 
           this.experience.metadata[key].value : null;
  }

  removeMetadata(key) {
    if (this.experience.metadata && this.experience.metadata[key]) {
      delete this.experience.metadata[key];
    }
    return this;
  }

  getAllMetadata() {
    return this.experience.metadata || {};
  }
}

// Decorator Factory for easy composition
class ExperienceDecoratorFactory {
  static enhance(experience, enhancements = {}) {
    let decorated = new ExperienceDecorator(experience);

    if (enhancements.verificationBadge) {
      decorated = new VerificationBadgeDecorator(
        decorated.experience, 
        enhancements.verificationBadge.type,
        enhancements.verificationBadge.reason
      );
    }

    if (enhancements.moderationNotes) {
      decorated = new ModerationNotesDecorator(
        decorated.experience,
        enhancements.moderationNotes.moderatorId,
        enhancements.moderationNotes.notes
      );
    }

    if (enhancements.priority) {
      decorated = new PriorityDecorator(
        decorated.experience,
        enhancements.priority.level,
        enhancements.priority.reason
      );
    }

    if (enhancements.featured) {
      decorated = new FeaturedDecorator(
        decorated.experience,
        enhancements.featured.isFeatured,
        enhancements.featured.reason
      );
    }

    if (enhancements.metadata) {
      decorated = new MetadataDecorator(decorated.experience);
      Object.keys(enhancements.metadata).forEach(key => {
        decorated.addMetadata(key, enhancements.metadata[key]);
      });
    }

    return decorated;
  }
}

module.exports = {
  ExperienceDecorator,
  VerificationBadgeDecorator,
  ModerationNotesDecorator,
  PriorityDecorator,
  FeaturedDecorator,
  MetadataDecorator,
  ExperienceDecoratorFactory
};