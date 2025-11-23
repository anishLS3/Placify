import api from '../utils/api';

export const contactService = {
  // Get all contacts
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const response = await api.get(`/admin/contacts?${params.toString()}`);
    return response.data;
  },

  // Get contact by ID
  getById: async (id) => {
    const response = await api.get(`/admin/contacts/${id}`);
    return response.data;
  },

  // Update contact status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/contacts/${id}`, { status });
    return response.data;
  },

  // Delete contact
  delete: async (id) => {
    const response = await api.delete(`/admin/contacts/${id}`);
    return response.data;
  },

  // Mark as contacted
  markContacted: async (id) => {
    return await contactService.updateStatus(id, 'contacted');
  },

  // Mark as resolved
  markResolved: async (id) => {
    return await contactService.updateStatus(id, 'resolved');
  },

  // Send response to contact
  respond: async (id, response) => {
    const result = await api.patch(`/admin/contacts/${id}/respond`, { response });
    return result.data;
  },

  // Get contact statistics
  getStats: async () => {
    const response = await api.get('/admin/contacts/stats');
    return response.data;
  },

  // Update contact details (priority, category, tags, etc.)
  updateDetails: async (id, details) => {
    const response = await api.patch(`/admin/contacts/${id}/details`, details);
    return response.data;
  }
};