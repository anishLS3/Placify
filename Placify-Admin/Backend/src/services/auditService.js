const AuditLogRepository = require('../repositories/auditLogRepository');

/**
 * Service Layer Pattern Implementation for Audit Trail
 * Business logic for audit trail management
 */
class AuditService {
  constructor(auditLogRepository = null) {
    this.auditLogRepository = auditLogRepository || new AuditLogRepository();
  }

  async logAdminAction(adminId, action, resourceType, resourceId, details = {}, request = null) {
    try {
      const auditData = {
        adminId,
        action,
        resourceType,
        resourceId,
        details,
        ipAddress: request?.ip || 'unknown',
        userAgent: request?.get('User-Agent') || 'unknown'
      };

      return await this.auditLogRepository.create(auditData);
    } catch (error) {
      console.error('Failed to log admin action:', error);
      throw error;
    }
  }

  async getAuditLogs(filters = {}, options = {}) {
    const {
      adminId,
      action,
      resourceType,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = filters;

    const query = {};

    if (adminId) query.adminId = adminId;
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    return await this.auditLogRepository.findByFilters(query, {
      page: parseInt(page),
      limit: parseInt(limit),
      ...options
    });
  }

  async getRecentActivity(limit = 10) {
    return await this.auditLogRepository.findRecent(limit);
  }

  async getAdminActivity(adminId, limit = 20) {
    return await this.auditLogRepository.findByAdminId(adminId, limit);
  }

  async getActionStatistics(filters = {}) {
    const {
      startDate,
      endDate,
      adminId,
      resourceType
    } = filters;

    const query = {};

    if (adminId) query.adminId = adminId;
    if (resourceType) query.resourceType = resourceType;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    return await this.auditLogRepository.getActionCounts(query);
  }

  async getActivityTrends(startDate, endDate, groupBy = 'day') {
    return await this.auditLogRepository.getActivityByTimeRange(
      new Date(startDate),
      new Date(endDate),
      groupBy
    );
  }

  async generateAuditReport(filters = {}) {
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate = new Date(),
      adminId,
      includeDetails = false
    } = filters;

    const [
      totalActions,
      actionBreakdown,
      adminActivity,
      timelineTrends
    ] = await Promise.all([
      this.auditLogRepository.findByFilters({
        createdAt: { $gte: startDate, $lte: endDate },
        ...(adminId && { adminId })
      }),
      this.getActionStatistics({ startDate, endDate, adminId }),
      adminId ? this.getAdminActivity(adminId, 50) : [],
      this.getActivityTrends(startDate, endDate, 'day')
    ]);

    return {
      summary: {
        totalActions: totalActions.total,
        dateRange: { startDate, endDate },
        adminId: adminId || 'all'
      },
      actionBreakdown,
      adminActivity,
      timelineTrends,
      ...(includeDetails && { detailedLogs: totalActions.logs })
    };
  }

  async cleanupOldLogs(daysOld = 90) {
    return await this.auditLogRepository.deleteOldLogs(daysOld);
  }

  // Helper method for middleware
  createAuditMiddleware() {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(data) {
        // Log successful actions
        if (req.user && res.statusCode < 400) {
          const action = req.auditAction || `${req.method}_${req.route?.path || req.path}`;
          const resourceType = req.auditResourceType || 'System';
          const resourceId = req.params.id || null;
          
          // Don't await to avoid blocking response
          req.app.get('auditService').logAdminAction(
            req.user.id,
            action,
            resourceType,
            resourceId,
            {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode
            },
            req
          ).catch(error => {
            console.error('Audit logging failed:', error);
          });
        }
        
        return originalSend.call(this, data);
      };
      
      next();
    };
  }
}

module.exports = AuditService;