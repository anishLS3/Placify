const adminRepository = require('../repositories/adminRepository');
const jwt = require('jsonwebtoken');

class AdminService {
  // Admin login with account locking mechanism
  async login(email, password, ipAddress = null, userAgent = null) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Find admin by email
      const admin = await adminRepository.findByEmail(email.toLowerCase());
      
      if (!admin) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (admin.isLocked) {
        throw new Error('Account is temporarily locked due to too many failed login attempts. Please try again later.');
      }

      // Check if account is active
      if (!admin.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        await admin.incLoginAttempts();
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = admin.generateAuthToken();

      // Update last login and reset login attempts
      await adminRepository.updateLastLogin(admin._id);

      // Log successful login
      await adminRepository.logAction({
        adminId: admin._id,
        action: 'LOGIN',
        resourceType: 'Admin',
        details: {
          loginTime: new Date(),
          ipAddress,
          userAgent
        },
        ipAddress,
        userAgent
      });

      // Return admin info without password
      const adminResponse = admin.toObject();
      delete adminResponse.password;
      delete adminResponse.loginAttempts;
      delete adminResponse.lockUntil;

      return {
        success: true,
        admin: adminResponse,
        token,
        message: 'Login successful'
      };

    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Admin logout
  async logout(adminId, token, ipAddress = null) {
    try {
      // Log logout action
      await adminRepository.logAction({
        adminId,
        action: 'LOGOUT',
        resourceType: 'Admin',
        details: {
          logoutTime: new Date(),
          tokenInvalidated: true
        },
        ipAddress
      });

      return {
        success: true,
        message: 'Logout successful'
      };

    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  // Verify JWT token and get admin
  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key');
      
      // Get admin details
      const admin = await adminRepository.findById(decoded.id);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      if (!admin.isActive) {
        throw new Error('Account is deactivated');
      }

      return {
        success: true,
        admin,
        adminId: admin._id
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      
      throw new Error(error.message || 'Token verification failed');
    }
  }

  // Get admin profile
  async getProfile(adminId) {
    try {
      const admin = await adminRepository.findById(adminId);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Get recent activity stats
      const activityStats = await adminRepository.getActivityStats(adminId, 30);

      return {
        success: true,
        admin,
        activityStats
      };

    } catch (error) {
      throw new Error(`Failed to get admin profile: ${error.message}`);
    }
  }

  // Update admin profile
  async updateProfile(adminId, updateData) {
    try {
      const updatedAdmin = await adminRepository.updateProfile(adminId, updateData);
      
      // Log profile update
      await adminRepository.logAction({
        adminId,
        action: 'UPDATE_PROFILE',
        resourceType: 'Admin',
        resourceId: adminId,
        details: { updatedFields: Object.keys(updateData) },
        newData: updateData
      });

      return {
        success: true,
        admin: updatedAdmin,
        message: 'Profile updated successfully'
      };

    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Change admin password
  async changePassword(adminId, currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
      }

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      // Get admin with password
      const admin = await adminRepository.findByEmail((await adminRepository.findById(adminId)).email);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await adminRepository.changePassword(adminId, newPassword);

      // Log password change
      await adminRepository.logAction({
        adminId,
        action: 'CHANGE_PASSWORD',
        resourceType: 'Admin',
        resourceId: adminId,
        details: { passwordChangedAt: new Date() }
      });

      return {
        success: true,
        message: 'Password changed successfully'
      };

    } catch (error) {
      throw new Error(error.message || 'Failed to change password');
    }
  }

  // Create initial admin (for setup)
  async createInitialAdmin(adminData) {
    try {
      // Check if any admin already exists
      const hasAdmin = await adminRepository.hasAnyAdmin();
      
      if (hasAdmin) {
        throw new Error('Admin already exists. Initial setup is not allowed.');
      }

      // Validate admin data
      if (!adminData.email || !adminData.password || !adminData.name) {
        throw new Error('Email, password, and name are required');
      }

      if (adminData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Create admin
      const admin = await adminRepository.create(adminData);

      // Log admin creation
      await adminRepository.logAction({
        adminId: admin._id,
        action: 'CREATE_ADMIN',
        resourceType: 'Admin',
        resourceId: admin._id,
        details: { 
          initialSetup: true,
          createdAt: new Date()
        }
      });

      // Return admin without password
      const adminResponse = admin.toObject();
      delete adminResponse.password;

      return {
        success: true,
        admin: adminResponse,
        message: 'Initial admin created successfully'
      };

    } catch (error) {
      throw new Error(error.message || 'Failed to create initial admin');
    }
  }

  // Get audit logs
  async getAuditLogs(adminId = null, page = 1, limit = 50) {
    try {
      const result = await adminRepository.getAuditLogs(adminId, page, limit);
      
      return {
        success: true,
        ...result
      };

    } catch (error) {
      throw new Error(`Failed to get audit logs: ${error.message}`);
    }
  }

  // Check if initial setup is needed
  async needsInitialSetup() {
    try {
      const hasAdmin = await adminRepository.hasAnyAdmin();
      
      return {
        success: true,
        needsSetup: !hasAdmin
      };

    } catch (error) {
      throw new Error('Failed to check setup status');
    }
  }
}

module.exports = new AdminService();