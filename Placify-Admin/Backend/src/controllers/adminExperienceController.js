const experienceService = require('../services/experienceService');

class AdminExperienceController {
  // Get pending experiences for review
  async getPendingExperiences(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await experienceService.getPendingExperiences(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get experience by ID for detailed review
  async getExperience(req, res, next) {
    try {
      const { id } = req.params;

      const result = await experienceService.getExperience(id, req.adminId);
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get experiences by status (approved, rejected, pending)
  async getExperiencesByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await experienceService.getExperiencesByStatus(
        status,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get recent experiences (all statuses) for dashboard
  async getRecentExperiences(req, res, next) {
    try {
      const { limit = 5 } = req.query;
      const limitInt = Math.min(Math.max(parseInt(limit), 1), 50);

      const result = await experienceService.getRecentExperiences(limitInt);
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get all experiences with optional filters
  async getAllExperiences(req, res, next) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      
      console.log('getAllExperiences called with:', { page, limit, status, search });

      // Sanitize search parameter - empty string should be treated as no search
      const hasSearch = search && search.trim().length > 0;
      
      console.log('hasSearch:', hasSearch, 'status:', status);

      if (hasSearch) {
        console.log('Taking search path');
        // If search query provided, use search function
        const result = await experienceService.searchExperiences(
          search.trim(),
          status || null,
          parseInt(page),
          parseInt(limit)
        );
        return res.status(200).json(result);
      }

      if (status) {
        console.log('Taking status filter path for status:', status);
        // If status filter provided but no search, use status-based query
        const result = await experienceService.getExperiencesByStatus(
          status,
          parseInt(page),
          parseInt(limit)
        );
        return res.status(200).json(result);
      }

      console.log('Taking getAllExperiences path');
      // Get all experiences
      const result = await experienceService.getAllExperiences(
        parseInt(page),
        parseInt(limit)
      );
      
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Approve an experience
  async approveExperience(req, res, next) {
    try {
      const { id } = req.params;
      const { notes, addVerificationBadge } = req.body;

      const result = await experienceService.approveExperience(id, req.adminId, {
        notes: notes?.trim() || '',
        addVerificationBadge: addVerificationBadge === true
      });

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Reject an experience
  async rejectExperience(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      if (!notes || notes.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Rejection notes are required and must be at least 10 characters long'
        });
      }

      const result = await experienceService.rejectExperience(
        id, 
        req.adminId, 
        notes.trim()
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Toggle verification badge on approved experience
  async toggleVerificationBadge(req, res, next) {
    try {
      const { id } = req.params;

      const result = await experienceService.toggleVerificationBadge(id, req.adminId);
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Search experiences across all statuses
  async searchExperiences(req, res, next) {
    try {
      const { q: query, status, page = 1, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await experienceService.searchExperiences(
        query,
        status || null,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Batch approve multiple experiences
  async batchApprove(req, res, next) {
    try {
      const { experienceIds } = req.body;

      if (!Array.isArray(experienceIds) || experienceIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Experience IDs must be provided as a non-empty array'
        });
      }

      if (experienceIds.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Cannot approve more than 50 experiences at once'
        });
      }

      const result = await experienceService.batchApprove(experienceIds, req.adminId);
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Batch reject multiple experiences
  async batchReject(req, res, next) {
    try {
      const { experienceIds, notes } = req.body;

      if (!Array.isArray(experienceIds) || experienceIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Experience IDs must be provided as a non-empty array'
        });
      }

      if (experienceIds.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reject more than 50 experiences at once'
        });
      }

      if (!notes || notes.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Rejection notes are required and must be at least 10 characters long'
        });
      }

      const result = await experienceService.batchReject(
        experienceIds, 
        req.adminId, 
        notes.trim()
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get dashboard analytics and statistics
  async getDashboardStats(req, res, next) {
    try {
      const result = await experienceService.getDashboardAnalytics();
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get all experiences with admin context (for main listing)
  async getAllExperiences(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      let result;

      if (status) {
        result = await experienceService.getExperiencesByStatus(
          status,
          parseInt(page),
          parseInt(limit)
        );
      } else {
        // Get all experiences across all statuses
        const pendingResult = await experienceService.getExperiencesByStatus(
          'pending',
          parseInt(page),
          parseInt(limit)
        );
        
        result = pendingResult;
      }

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Quick action endpoints for common operations
  async quickApprove(req, res, next) {
    try {
      const { id } = req.params;

      const result = await experienceService.approveExperience(id, req.adminId, {
        notes: 'Quick approved - no additional notes',
        addVerificationBadge: false
      });

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  async quickApproveWithBadge(req, res, next) {
    try {
      const { id } = req.params;

      const result = await experienceService.approveExperience(id, req.adminId, {
        notes: 'Approved with verification badge - high quality submission',
        addVerificationBadge: true
      });

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Update experience status
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validate status
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be pending, approved, or rejected'
        });
      }

      const result = await experienceService.updateStatus(id, status, req.adminId, notes);
      res.status(200).json(result);

    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update experience status'
      });
    }
  }
}

module.exports = new AdminExperienceController();