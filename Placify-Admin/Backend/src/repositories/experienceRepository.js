const mongoose = require('mongoose');

class ExperienceRepository {
  constructor() {
    // Use local Experience model to avoid connection conflicts
    this.Experience = require('../models/Experience');
  }

  // Find experiences by status
  async findByStatus(status, page = 1, limit = 10, sortBy = { _id: -1 }) {
    try {
      const skip = (page - 1) * limit;
      
      const experiences = await this.Experience
        .find({ status })
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean();
        
      const total = await this.Experience.countDocuments({ status });
      
      return {
        experiences,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: experiences.length,
          totalRecords: total
        }
      };
    } catch (error) {
      throw new Error(`Failed to find experiences by status: ${error.message}`);
    }
  }

  // Find pending experiences
  async findPending(page = 1, limit = 10) {
    return this.findByStatus('pending', page, limit, { _id: 1 }); // Oldest first (ascending _id)
  }

  // Find approved experiences
  async findApproved(page = 1, limit = 10) {
    return this.findByStatus('approved', page, limit);
  }

  // Get all experiences (for dashboard stats)
  async findAll(page = 1, limit = 10, options = {}) {
    try {
      const skip = (page - 1) * limit;
      const filter = {};
      
      // Add status filter if provided
      if (options.status) {
        filter.status = options.status;
      }
      
      // Add search filter if provided
      if (options.search) {
        filter.$or = [
          { fullName: { $regex: options.search, $options: 'i' } },
          { companyName: { $regex: options.search, $options: 'i' } },
          { jobRole: { $regex: options.search, $options: 'i' } },
          { collegeName: { $regex: options.search, $options: 'i' } }
        ];
      }

      console.log('Repository findAll filter:', filter);
      console.log('Repository findAll pagination:', { page, limit, skip });

      const experiences = await this.Experience
        .find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
      const total = await this.Experience.countDocuments(filter);
      
      console.log('Repository findAll results:', { 
        experiencesCount: experiences.length, 
        totalInDB: total,
        sampleDoc: experiences[0] 
      });
      
      return {
        success: true,
        experiences,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: experiences.length,
          totalRecords: total
        }
      };
    } catch (error) {
      console.error('Repository findAll error:', error);
      throw new Error(`Failed to find all experiences: ${error.message}`);
    }
  }

  // Find experience by ID
  async findById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid experience ID');
      }
      
      const experience = await this.Experience.findById(id).lean();
      if (!experience) {
        throw new Error('Experience not found');
      }
      
      return experience;
    } catch (error) {
      throw new Error(`Failed to find experience: ${error.message}`);
    }
  }

  // Find recent experiences (all statuses) for dashboard
  async findRecent(limit = 5) {
    try {
      const experiences = await this.Experience
        .find({})
        .sort({ _id: -1 }) // Sort by _id instead of createdAt since createdAt doesn't exist
        .limit(limit)
        .select('fullName companyName jobRole status verificationBadge date positionType')
        .lean();
        
      return experiences;
    } catch (error) {
      throw new Error(`Failed to find recent experiences: ${error.message}`);
    }
  }

  // Find all experiences with pagination
  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      console.log('findAll called with page:', page, 'limit:', limit, 'skip:', skip);
      
      // Try to get total count first to verify database connection
      const total = await this.Experience.countDocuments({});
      console.log('Total documents in database:', total);
      
      if (total === 0) {
        console.log('No documents found in database');
        return {
          experiences: [],
          pagination: {
            current: page,
            total: 0,
            count: 0,
            totalRecords: 0
          }
        };
      }
      
      const experiences = await this.Experience
        .find({})
        .sort({ _id: -1 }) // Sort by _id instead of createdAt
        .skip(skip)
        .limit(limit)
        .lean();
        
      console.log('findAll results:', {
        experiencesFound: experiences.length,
        totalInDB: total,
        page,
        limit,
        skip,
        firstExperience: experiences[0]?._id
      });
      
      return {
        experiences,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: experiences.length,
          totalRecords: total
        }
      };
    } catch (error) {
      throw new Error(`Failed to find all experiences: ${error.message}`);
    }
  }

  // Approve experience
  async approve(id, metadata) {
    try {
      const experience = await this.Experience.findByIdAndUpdate(
        id,
        {
          status: 'approved',
          verificationBadge: metadata.addVerificationBadge || false,
          moderatedBy: metadata.adminId,
          moderationNotes: metadata.notes || '',
          approvedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!experience) {
        throw new Error('Experience not found');
      }

      return experience;
    } catch (error) {
      throw new Error(`Failed to approve experience: ${error.message}`);
    }
  }

  // Reject experience
  async reject(id, notes, adminId) {
    try {
      const experience = await this.Experience.findByIdAndUpdate(
        id,
        {
          status: 'rejected',
          moderatedBy: adminId,
          moderationNotes: notes,
          rejectedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!experience) {
        throw new Error('Experience not found');
      }

      return experience;
    } catch (error) {
      throw new Error(`Failed to reject experience: ${error.message}`);
    }
  }

  // Toggle verification badge
  async toggleVerificationBadge(id, adminId) {
    try {
      const experience = await this.Experience.findById(id);
      if (!experience) {
        throw new Error('Experience not found');
      }

      experience.verificationBadge = !experience.verificationBadge;
      experience.moderatedBy = adminId;
      
      await experience.save();
      return experience;
    } catch (error) {
      throw new Error(`Failed to toggle verification badge: ${error.message}`);
    }
  }

  // Update experience with any data
  async updateExperience(id, updateData) {
    try {
      const experience = await this.Experience.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!experience) {
        throw new Error('Experience not found');
      }
      
      return experience;
    } catch (error) {
      throw new Error(`Failed to update experience: ${error.message}`);
    }
  }

  // Get analytics data
  async getAnalyticsData() {
    try {
      // Calculate date ranges
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

      const [
        totalExperiences,
        pendingCount,
        approvedCount,
        rejectedCount,
        verifiedCount,
        recentSubmissions,
        topCompanies,
        // Current month counts
        thisMonthTotal,
        thisMonthPending,
        thisMonthApproved,
        thisMonthRejected,
        // Last month counts
        lastMonthTotal,
        lastMonthPending,
        lastMonthApproved,
        lastMonthRejected
      ] = await Promise.all([
        // Overall totals
        this.Experience.countDocuments(),
        this.Experience.countDocuments({ status: 'pending' }),
        this.Experience.countDocuments({ status: 'approved' }),
        this.Experience.countDocuments({ status: 'rejected' }),
        this.Experience.countDocuments({ verificationBadge: true }),
        this.Experience.find()
          .sort({ _id: -1 })
          .limit(5)
          .select('companyName jobRole status')
          .lean(),
        this.Experience.aggregate([
          { $match: { status: 'approved' } },
          { $group: { _id: '$companyName', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]),
        // This month (using ObjectId timestamp since no createdAt field)
        this.Experience.countDocuments({
          _id: { $gte: new mongoose.Types.ObjectId.createFromTime(thisMonthStart.getTime() / 1000) }
        }),
        this.Experience.countDocuments({
          status: 'pending',
          _id: { $gte: new mongoose.Types.ObjectId.createFromTime(thisMonthStart.getTime() / 1000) }
        }),
        this.Experience.countDocuments({
          status: 'approved',
          _id: { $gte: new mongoose.Types.ObjectId.createFromTime(thisMonthStart.getTime() / 1000) }
        }),
        this.Experience.countDocuments({
          status: 'rejected',
          _id: { $gte: new mongoose.Types.ObjectId.createFromTime(thisMonthStart.getTime() / 1000) }
        }),
        // Last month (using ObjectId timestamp)
        this.Experience.countDocuments({
          _id: { 
            $gte: new mongoose.Types.ObjectId.createFromTime(lastMonthStart.getTime() / 1000),
            $lte: new mongoose.Types.ObjectId.createFromTime(lastMonthEnd.getTime() / 1000)
          }
        }),
        this.Experience.countDocuments({
          status: 'pending',
          _id: { 
            $gte: new mongoose.Types.ObjectId.createFromTime(lastMonthStart.getTime() / 1000),
            $lte: new mongoose.Types.ObjectId.createFromTime(lastMonthEnd.getTime() / 1000)
          }
        }),
        this.Experience.countDocuments({
          status: 'approved',
          _id: { 
            $gte: new mongoose.Types.ObjectId.createFromTime(lastMonthStart.getTime() / 1000),
            $lte: new mongoose.Types.ObjectId.createFromTime(lastMonthEnd.getTime() / 1000)
          }
        }),
        this.Experience.countDocuments({
          status: 'rejected',
          _id: { 
            $gte: new mongoose.Types.ObjectId.createFromTime(lastMonthStart.getTime() / 1000),
            $lte: new mongoose.Types.ObjectId.createFromTime(lastMonthEnd.getTime() / 1000)
          }
        })
      ]);

      // Calculate percentage changes
      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      return {
        summary: {
          total: totalExperiences,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          verified: verifiedCount,
          // Add month-over-month changes
          totalChange: calculateChange(thisMonthTotal, lastMonthTotal),
          pendingChange: calculateChange(thisMonthPending, lastMonthPending),
          approvedChange: calculateChange(thisMonthApproved, lastMonthApproved),
          rejectedChange: calculateChange(thisMonthRejected, lastMonthRejected)
        },
        recentSubmissions,
        topCompanies: topCompanies.map(item => ({
          company: item._id,
          count: item.count
        })),
        monthlyStats: {
          thisMonth: {
            total: thisMonthTotal,
            pending: thisMonthPending,
            approved: thisMonthApproved,
            rejected: thisMonthRejected
          },
          lastMonth: {
            total: lastMonthTotal,
            pending: lastMonthPending,
            approved: lastMonthApproved,
            rejected: lastMonthRejected
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to get analytics data: ${error.message}`);
    }
  }

  // Search experiences
  async search(query, status = null, page = 1, limit = 10) {
    try {
      const searchCriteria = {
        $or: [
          { companyName: { $regex: query, $options: 'i' } },
          { jobRole: { $regex: query, $options: 'i' } },
          { fullName: { $regex: query, $options: 'i' } }
        ]
      };

      if (status) {
        searchCriteria.status = status;
      }

      const skip = (page - 1) * limit;
      
      const experiences = await this.Experience
        .find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
      const total = await this.Experience.countDocuments(searchCriteria);
      
      return {
        experiences,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: experiences.length,
          totalRecords: total
        }
      };
    } catch (error) {
      throw new Error(`Failed to search experiences: ${error.message}`);
    }
  }

  // Batch operations
  async batchApprove(ids, adminId) {
    try {
      const result = await this.Experience.updateMany(
        { _id: { $in: ids } },
        {
          status: 'approved',
          moderatedBy: adminId,
          approvedAt: new Date()
        }
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to batch approve experiences: ${error.message}`);
    }
  }

  async batchReject(ids, adminId, notes) {
    try {
      const result = await this.Experience.updateMany(
        { _id: { $in: ids } },
        {
          status: 'rejected',
          moderatedBy: adminId,
          moderationNotes: notes,
          rejectedAt: new Date()
        }
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to batch reject experiences: ${error.message}`);
    }
  }

  // Get analytics data for dashboard
  async getAnalyticsData() {
    try {
      // Use a single aggregation to get all counts efficiently
      const analytics = await this.Experience.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            pending: [
              { $match: { status: 'pending' } },
              { $count: "count" }
            ],
            approved: [
              { $match: { status: 'approved' } },
              { $count: "count" }
            ],
            rejected: [
              { $match: { status: 'rejected' } },
              { $count: "count" }
            ],
            verified: [
              { $match: { verificationBadge: true } },
              { $count: "count" }
            ],
            recentExperiences: [
              { $sort: { _id: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 1,
                  companyName: 1,
                  jobRole: 1,
                  status: 1,
                  verificationBadge: 1,
                  createdDate: { $toDate: "$_id" }
                }
              }
            ]
          }
        }
      ]);

      const result = analytics[0];
      
      // Extract counts safely
      const totalCount = result.total[0]?.count || 0;
      const pendingCount = result.pending[0]?.count || 0;
      const approvedCount = result.approved[0]?.count || 0;
      const rejectedCount = result.rejected[0]?.count || 0;
      const verifiedCount = result.verified[0]?.count || 0;
      const recentExperiences = result.recentExperiences || [];

      return {
        summary: {
          total: totalCount,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          verified: verifiedCount
        },
        trends: {
          totalTrend: 0, // Simplified for now
          pendingTrend: 0,
          approvedTrend: 0,
          rejectedTrend: 0
        },
        recentExperiences: recentExperiences,
        metadata: {
          lastUpdated: new Date(),
          period: '30 days'
        }
      };
    } catch (error) {
      console.error('Analytics data error:', error);
      throw new Error(`Failed to get analytics data: ${error.message}`);
    }
  }
}

module.exports = new ExperienceRepository();