const AuditLog = require('../models/AuditLog');

/**
 * Repository Pattern Implementation for Audit Logs
 * Clean separation between business logic and data access
 */
class AuditLogRepository {
  async create(auditData) {
    return await AuditLog.create(auditData);
  }

  async findByFilters(filters = {}, options = {}) {
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [logs, total] = await Promise.all([
      AuditLog.find(filters)
        .populate('adminId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(filters)
    ]);

    return {
      logs,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async findByAdminId(adminId, limit = 20) {
    return await AuditLog.find({ adminId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findRecent(limit = 10) {
    return await AuditLog.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getActionCounts(filters = {}) {
    return await AuditLog.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async getActivityByTimeRange(startDate, endDate, groupBy = 'day') {
    const groupStage = this.getTimeGroupStage(groupBy);
    
    return await AuditLog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: groupStage,
          count: { $sum: 1 },
          actions: { $push: '$action' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
  }

  getTimeGroupStage(groupBy) {
    switch (groupBy) {
      case 'hour':
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
      case 'day':
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
      case 'month':
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
      default:
        return {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }
  }

  async deleteOldLogs(daysOld = 90) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    return await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
  }
}

module.exports = AuditLogRepository;