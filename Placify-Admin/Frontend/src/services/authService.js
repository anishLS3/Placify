import api from '../utils/api'

class AuthService {
  // Check if initial setup is needed
  async checkSetupNeeded() {
    try {
      const response = await api.get('/admin/auth/setup/check')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Create initial admin
  async createInitialAdmin(adminData) {
    try {
      const response = await api.post('/admin/auth/setup/initial', adminData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Login admin
  async login(credentials) {
    try {
      const response = await api.post('/admin/auth/login', credentials)
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('admin_token', response.data.token)
        localStorage.setItem('admin_user', JSON.stringify(response.data.admin))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Logout admin
  async logout() {
    try {
      await api.post('/admin/auth/logout')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      this.clearAuthData()
    }
  }

  // Verify token
  async verifyToken() {
    try {
      const response = await api.get('/admin/auth/verify')
      return response.data
    } catch (error) {
      this.clearAuthData()
      throw error.response?.data || error
    }
  }

  // Get admin profile
  async getProfile() {
    try {
      const response = await api.get('/admin/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Update admin profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/admin/auth/profile', profileData)
      
      if (response.data.success) {
        // Update stored user data
        localStorage.setItem('admin_user', JSON.stringify(response.data.admin))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/admin/auth/password', passwordData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Helper methods
  getToken() {
    return localStorage.getItem('admin_token')
  }

  getUser() {
    const userData = localStorage.getItem('admin_user')
    return userData ? JSON.parse(userData) : null
  }

  isAuthenticated() {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user)
  }

  clearAuthData() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }
}

export const authService = new AuthService()

// Export individual functions for convenience
export const {
  checkSetupNeeded,
  createInitialAdmin,
  login,
  logout,
  verifyToken,
  getProfile,
  updateProfile,
  changePassword,
  getToken,
  getUser,
  isAuthenticated,
  clearAuthData
} = authService