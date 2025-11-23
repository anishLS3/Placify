import api from '../utils/api';

export const analyticsService = {
  // Get analytics data
  getAnalytics: async (timeRange = '30d') => {
    const response = await api.get(`/admin/analytics/dashboard?timeRange=${timeRange}`);
    return response.data;
  },

  // Get overview statistics
  getOverview: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },

  // Get submission trends
  getSubmissionTrend: async (timeRange = '30d') => {
    // Convert timeRange to days for the backend
    const daysMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    const days = daysMap[timeRange] || 30;
    
    const response = await api.get(`/admin/analytics/trends?days=${days}`);
    return response.data;
  },

  // Get company statistics
  getCompanyStats: async (timeRange = '30d') => {
    const response = await api.get(`/admin/analytics/companies?limit=50`);
    return response.data;
  },

  // Get status distribution
  getStatusDistribution: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async (timeRange = '30d') => {
    // Convert timeRange to days for moderation metrics
    const daysMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 90 // Cap at 90 days for moderation metrics
    };
    const days = daysMap[timeRange] || 7;
    
    const response = await api.get(`/admin/analytics/moderation?days=${days}`);
    return response.data;
  },

  // Export analytics data
  exportAnalytics: async (format = 'json', type = 'full') => {
    const response = await api.get(`/admin/analytics/export?format=${format}&type=${type}`);
    return response.data;
  }
};