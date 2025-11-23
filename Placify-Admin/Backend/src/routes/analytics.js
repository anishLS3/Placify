const express = require('express');
const { query, validationResult } = require('express-validator');
const { requireAdmin } = require('../middleware/adminAuth');
const experienceService = require('../services/experienceService');
const adminRepository = require('../repositories/adminRepository');
const Experience = require('../models/Experience'); // Use local Experience model

const router = express.Router();

// Apply authentication to all routes
router.use(requireAdmin);

// Validation middleware helper
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Analytics controller class
class AnalyticsController {
  // Get comprehensive dashboard analytics
  async getDashboardAnalytics(req, res, next) {
    try {
      const experienceAnalytics = await experienceService.getDashboardAnalytics();
      
      // Get additional admin activity stats
      const activityStats = await adminRepository.getActivityStats(req.adminId, 30);

      // Get system performance metrics
      const systemStats = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        timestamp: new Date()
      };

      // Log analytics access
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'VIEW_ANALYTICS',
        resourceType: 'System',
        details: { type: 'dashboard', timestamp: new Date() }
      });

      res.status(200).json({
        success: true,
        analytics: {
          experiences: experienceAnalytics.analytics,
          adminActivity: activityStats,
          system: systemStats
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get experience trends over time
  async getExperienceTrends(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const daysInt = Math.min(Math.max(parseInt(days), 1), 365);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysInt);

      // Get daily submission trends using _id timestamp since createdAt doesn't exist
      const trends = await Experience.aggregate([
        {
          $addFields: {
            createdFromId: { $toDate: "$_id" }
          }
        },
        {
          $match: {
            createdFromId: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdFromId' },
              month: { $month: '$createdFromId' },
              day: { $dayOfMonth: '$createdFromId' }
            },
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            approved: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
            },
            rejected: {
              $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
            }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      // Format dates properly
      const formattedTrends = trends.map(item => ({
        date: new Date(item._id.year, item._id.month - 1, item._id.day),
        total: item.total,
        pending: item.pending,
        approved: item.approved,
        rejected: item.rejected
      }));

      res.status(200).json({
        success: true,
        trends: formattedTrends,
        period: {
          days: daysInt,
          startDate,
          endDate: new Date()
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get company analytics
  async getCompanyAnalytics(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      
      const companyStats = await Experience.aggregate([
        // Include all experiences, not just approved ones
        // { $match: { status: 'approved' } }, // Removed this line to show all companies
        {
          $group: {
            _id: '$companyName',
            totalExperiences: { $sum: 1 },
            verifiedCount: {
              $sum: { $cond: [{ $eq: ['$verificationBadge', true] }, 1, 0] }
            },
            placementCount: {
              $sum: { $cond: [{ $eq: ['$positionType', 'Placement'] }, 1, 0] }
            },
            internshipCount: {
              $sum: { $cond: [{ $eq: ['$positionType', 'Internship'] }, 1, 0] }
            },
            roles: { $addToSet: '$jobRole' },
            avgBatch: { $avg: '$batchYear' }
          }
        },
        {
          $project: {
            company: '$_id',
            totalExperiences: 1,
            verifiedCount: 1,
            placementCount: 1,
            internshipCount: 1,
            rolesCount: { $size: '$roles' },
            verificationRate: {
              $round: [
                { $multiply: [{ $divide: ['$verifiedCount', '$totalExperiences'] }, 100] },
                2
              ]
            }
          }
        },
        { $sort: { totalExperiences: -1 } },
        { $limit: parseInt(limit) }
      ]);

      res.status(200).json({
        success: true,
        companies: companyStats
      });

    } catch (error) {
      next(error);
    }
  }

  // Get moderation performance metrics
  async getModerationMetrics(req, res, next) {
    try {
      const { days = 7 } = req.query;
      const daysInt = Math.min(Math.max(parseInt(days), 1), 90);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysInt);

      // Get admin moderation stats
      const moderationStats = await adminRepository.getAuditLogs(req.adminId, 1, 1000);
      
      const relevantActions = moderationStats.logs.filter(log => 
        ['APPROVE_EXPERIENCE', 'REJECT_EXPERIENCE'].includes(log.action) &&
        new Date(log.createdAt) >= startDate
      );

      const metrics = {
        totalActions: relevantActions.length,
        approvals: relevantActions.filter(log => log.action === 'APPROVE_EXPERIENCE').length,
        rejections: relevantActions.filter(log => log.action === 'REJECT_EXPERIENCE').length,
        dailyAverage: Math.round(relevantActions.length / daysInt),
        period: {
          days: daysInt,
          startDate,
          endDate: new Date()
        }
      };

      metrics.approvalRate = metrics.totalActions > 0 
        ? Math.round((metrics.approvals / metrics.totalActions) * 100) 
        : 0;

      res.status(200).json({
        success: true,
        moderationMetrics: metrics
      });

    } catch (error) {
      next(error);
    }
  }

  // Export analytics data
  async exportAnalytics(req, res, next) {
    try {
      const { format = 'json', type = 'full' } = req.query;

      // Get comprehensive data
      const experienceAnalytics = await experienceService.getDashboardAnalytics();
      const activityStats = await adminRepository.getActivityStats(req.adminId, 30);

      const exportData = {
        exportedAt: new Date(),
        exportedBy: req.adminId,
        type,
        data: {
          experiences: experienceAnalytics.analytics,
          adminActivity: activityStats
        }
      };

      // Log export action
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'EXPORT_DATA',
        resourceType: 'System',
        details: { format, type, timestamp: new Date() }
      });

      if (format === 'csv') {
        // Convert to CSV format
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics-export.csv"');
        
        // Simple CSV conversion for summary data
        const csvData = [
          'Metric,Value',
          `Total Experiences,${exportData.data.experiences.summary.total}`,
          `Pending,${exportData.data.experiences.summary.pending}`,
          `Approved,${exportData.data.experiences.summary.approved}`,
          `Rejected,${exportData.data.experiences.summary.rejected}`,
          `Verified,${exportData.data.experiences.summary.verified}`
        ].join('\n');

        res.send(csvData);
      } else {
        // Default JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics-export.json"');
        res.status(200).json({
          success: true,
          export: exportData
        });
      }

    } catch (error) {
      next(error);
    }
  }
}

const analyticsController = new AnalyticsController();

// Routes
router.get('/dashboard', analyticsController.getDashboardAnalytics);

router.get('/trends',
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Days must be between 1 and 365')
  ],
  handleValidationErrors,
  analyticsController.getExperienceTrends
);

router.get('/companies',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  handleValidationErrors,
  analyticsController.getCompanyAnalytics
);

router.get('/moderation',
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 90 })
      .withMessage('Days must be between 1 and 90')
  ],
  handleValidationErrors,
  analyticsController.getModerationMetrics
);

router.get('/export',
  [
    query('format')
      .optional()
      .isIn(['json', 'csv'])
      .withMessage('Format must be json or csv'),
    query('type')
      .optional()
      .isIn(['full', 'summary'])
      .withMessage('Type must be full or summary')
  ],
  handleValidationErrors,
  analyticsController.exportAnalytics
);

module.exports = router;