import api from '../utils/api';

export const setupService = {
  // Check if initial setup is needed
  checkSetupNeeded: async () => {
    try {
      const response = await api.get('/setup/status');
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist or returns error, assume setup is needed
      return { needsSetup: true };
    }
  },

  // Create initial admin user
  createInitialAdmin: async (adminData) => {
    const response = await api.post('/setup/admin', adminData);
    return response.data;
  },

  // Complete setup process
  completeSetup: async () => {
    const response = await api.post('/setup/complete');
    return response.data;
  }
};