/**
 * Factory Pattern Implementation for Service Creation
 * Centralized object creation and dependency management
 */

class ServiceFactory {
  static createExperienceService() {
    const ExperienceRepository = require('../repositories/experienceRepository');
    const AuditService = require('../services/auditService');
    const ExperienceService = require('../services/experienceService');
    
    const experienceRepository = new ExperienceRepository();
    const auditService = this.createAuditService();
    
    return new ExperienceService(experienceRepository, auditService);
  }

  static createContactService() {
    const ContactRepository = require('../repositories/contactRepository');
    const AuditService = require('../services/auditService');
    const ContactService = require('../services/contactService');
    
    const contactRepository = new ContactRepository();
    const auditService = this.createAuditService();
    
    return new ContactService(contactRepository, auditService);
  }

  static createAnalyticsService() {
    const ExperienceRepository = require('../repositories/experienceRepository');
    const ContactRepository = require('../repositories/contactRepository');
    const AnalyticsService = require('../services/analyticsService');
    
    const experienceRepository = new ExperienceRepository();
    const contactRepository = new ContactRepository();
    
    return new AnalyticsService(experienceRepository, contactRepository);
  }

  static createAuditService() {
    const AuditLogRepository = require('../repositories/auditLogRepository');
    const AuditService = require('../services/auditService');
    
    const auditLogRepository = new AuditLogRepository();
    return new AuditService(auditLogRepository);
  }

  static createAdminService() {
    const AdminRepository = require('../repositories/adminRepository');
    const AuditService = require('../services/adminService');
    const AdminService = require('../services/adminService');
    
    const adminRepository = new AdminRepository();
    const auditService = this.createAuditService();
    
    return new AdminService(adminRepository, auditService);
  }

  // Factory method pattern for creating services with dependencies
  static createServiceWithDependencies(serviceName, dependencies = {}) {
    switch (serviceName) {
      case 'experience':
        const ExperienceService = require('../services/experienceService');
        const ExperienceRepository = require('../repositories/experienceRepository');
        
        return new ExperienceService(
          dependencies.repository || new ExperienceRepository(),
          dependencies.auditService || this.createAuditService()
        );

      case 'contact':
        const ContactService = require('../services/contactService');
        const ContactRepository = require('../repositories/contactRepository');
        
        return new ContactService(
          dependencies.repository || new ContactRepository(),
          dependencies.auditService || this.createAuditService()
        );

      case 'analytics':
        const AnalyticsService = require('../services/analyticsService');
        const ExperienceRepository = require('../repositories/experienceRepository');
        const ContactRepository = require('../repositories/contactRepository');
        
        return new AnalyticsService(
          dependencies.experienceRepository || new ExperienceRepository(),
          dependencies.contactRepository || new ContactRepository()
        );

      case 'audit':
        return this.createAuditService();

      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  }

  // Singleton pattern for services that should be shared
  static getInstance(serviceName) {
    if (!this.instances) {
      this.instances = {};
    }

    if (!this.instances[serviceName]) {
      this.instances[serviceName] = this.createServiceWithDependencies(serviceName);
    }

    return this.instances[serviceName];
  }

  // Factory for creating controllers with proper dependencies
  static createController(controllerName) {
    switch (controllerName) {
      case 'experience':
        const ExperienceController = require('../controllers/experienceController');
        const experienceService = this.getInstance('experience');
        return new ExperienceController(experienceService);

      case 'contact':
        const ContactController = require('../controllers/contactController');
        const contactService = this.getInstance('contact');
        return new ContactController(contactService);

      case 'analytics':
        const AnalyticsController = require('../controllers/analyticsController');
        const analyticsService = this.getInstance('analytics');
        return new AnalyticsController(analyticsService);

      case 'admin':
        const AdminController = require('../controllers/adminController');
        const adminService = this.getInstance('admin');
        return new AdminController(adminService);

      default:
        throw new Error(`Unknown controller: ${controllerName}`);
    }
  }
}

module.exports = ServiceFactory;