import api from '../utils/api';

export const experienceService = {
  // Get all experiences with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.company) params.append('company', filters.company);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const url = `/admin/experiences/all?${params.toString()}`;
    console.log('experienceService.js:15');
    console.log('API URL:', url);
    console.log('Filters passed to service:', filters);
    
    const response = await api.get(url);
    console.log('experienceService.js:19'); 
    console.log('API Response:', response.data);
    return response.data;
  },

  // Get experience by ID
  getById: async (id) => {
    const response = await api.get(`/admin/experiences/${id}`);
    return response.data;
  },

  // Get recent experiences
  getRecent: async (limit = 5) => {
    const response = await api.get(`/admin/experiences/recent?limit=${limit}`);
    
    // Extract the experiences array from the response
    if (response.data.success && response.data.experiences) {
      return {
        success: true,
        experiences: response.data.experiences.map(exp => ({
          ...exp,
          // Map field names to match what Dashboard expects
          studentName: exp.fullName,
          company: exp.companyName,
          role: exp.jobRole,
          // Use positionType (Internship, Full-time, Part-time, Contract) for duration
          duration: exp.positionType || 'Position Type Not Specified',
          // Use the interview date or fallback to ObjectId timestamp
          createdAt: exp.date || new Date(parseInt(exp._id.substring(0, 8), 16) * 1000).toISOString()
        }))
      };
    }
    
    // Fallback
    return {
      success: false,
      experiences: []
    };
  },

  // Get experiences by status
  getByStatus: async (status, page = 1, limit = 10) => {
    let endpoint;
    if (status === 'pending') {
      endpoint = `/admin/experiences/pending?page=${page}&limit=${limit}`;
    } else {
      endpoint = `/admin/experiences/status/${status}?page=${page}&limit=${limit}`;
    }
    const response = await api.get(endpoint);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    
    // Extract the statistics from the nested response structure
    if (response.data.success && response.data.analytics && response.data.analytics.experiences) {
      const { summary } = response.data.analytics.experiences;
      
      // Return the expected flat structure for the Dashboard component
      return {
        total: summary.total || 0,
        pending: summary.pending || 0,
        approved: summary.approved || 0,
        rejected: summary.rejected || 0,
        verified: summary.verified || 0,
        // Use actual calculated month-over-month changes
        totalChange: summary.totalChange || 0,
        pendingChange: summary.pendingChange || 0,
        approvedChange: summary.approvedChange || 0,
        rejectedChange: summary.rejectedChange || 0
      };
    }
    
    // Fallback if structure is unexpected
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      verified: 0,
      totalChange: 0,
      pendingChange: 0,
      approvedChange: 0,
      rejectedChange: 0
    };
  },

  // Approve experience
  approve: async (id, notes = '') => {
    const response = await api.post(`/admin/experiences/${id}/approve`, {
      moderationNotes: notes
    });
    return response.data;
  },

  // Reject experience
  reject: async (id, notes) => {
    const response = await api.post(`/admin/experiences/${id}/reject`, {
      moderationNotes: notes
    });
    return response.data;
  },

  // Update experience status
  updateStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/admin/experiences/${id}/status`, {
      status,
      moderationNotes: notes
    });
    return response.data;
  },

  // Toggle verification badge
  toggleVerificationBadge: async (id) => {
    const response = await api.patch(`/admin/experiences/${id}/verification-badge`);
    return response.data;
  },

  // Batch operations
  batchApprove: async (ids) => {
    const response = await api.post('/admin/experiences/batch/approve', { ids });
    return response.data;
  },

  batchReject: async (ids, notes) => {
    const response = await api.post('/admin/experiences/batch/reject', { 
      ids,
      moderationNotes: notes 
    });
    return response.data;
  }
};