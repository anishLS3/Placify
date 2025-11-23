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
      
      // Add 'isNew' indicator for experiences created within last 24 hours
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      const experiencesWithNewFlag = experiences.map(experience => ({
        ...experience,
        isNew: experience.createdAt ? new Date(experience.createdAt) > twentyFourHoursAgo : false
      }));
      
      return {
        experiences: experiencesWithNewFlag,
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
      
      // Add 'isNew' indicator for experiences created within last 24 hours
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      const experiencesWithNewFlag = experiences.map(experience => ({
        ...experience,
        isNew: experience.createdAt ? new Date(experience.createdAt) > twentyFourHoursAgo : false
      }));
      
      console.log('Repository findAll results:', { 
        experiencesCount: experiences.length, 
        totalInDB: total,
        sampleDoc: experiences[0] 
      });
      
      return {
        success: true,
        experiences: experiencesWithNewFlag,
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

      // Use findByIdAndUpdate to avoid running full validation
      const updatedExperience = await this.Experience.findByIdAndUpdate(
        id,
        {
          verificationBadge: !experience.verificationBadge,
          moderatedBy: adminId
        },
        { new: true, runValidators: false }
      );
      
      return updatedExperience;
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
      console.log('📊 Getting analytics data...');
      
      // Simple counts without complex aggregations
      const [
        totalExperiences,
        pendingCount,
        approvedCount,
        rejectedCount,
        verifiedCount,
        placementCount,
        internshipCount
      ] = await Promise.all([
        this.Experience.countDocuments({}),
        this.Experience.countDocuments({ status: 'pending' }),
        this.Experience.countDocuments({ status: 'approved' }),
        this.Experience.countDocuments({ status: 'rejected' }),
        this.Experience.countDocuments({ verificationBadge: true }),
        this.Experience.countDocuments({ positionType: 'Placement' }),
        this.Experience.countDocuments({ positionType: 'Internship' })
      ]);
      
      console.log('📊 Counts:', { totalExperiences, pendingCount, approvedCount, rejectedCount, verifiedCount, placementCount, internshipCount });
      
      // Get recent submissions (simple find)
      const recentSubmissions = await this.Experience.find({})
        .sort({ _id: -1 })
        .limit(5)
        .select('companyName jobRole status')
        .lean();
        
      console.log('📊 Recent submissions count:', recentSubmissions.length);

      return {
        summary: {
          total: totalExperiences,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          verified: verifiedCount,
          placement: placementCount,
          internship: internshipCount,
          // Simplified month changes
          totalChange: 0,
          pendingChange: 0,
          approvedChange: 0,
          rejectedChange: 0
        },
        recentSubmissions,
        topCompanies: [], // Simplified for now
        monthlyStats: {
          thisMonth: {
            total: totalExperiences,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount
          },
          lastMonth: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
          }
        }
      };
    } catch (error) {
      console.error('Analytics data error:', error);
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

  // This duplicate method was removed - using the first getAnalyticsData method above
}

module.exports = new ExperienceRepository();