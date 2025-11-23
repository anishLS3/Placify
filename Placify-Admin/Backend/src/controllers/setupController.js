const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Setup Controller
 * Handles initial system setup and admin creation
 */
class SetupController {
  
  /**
   * Check if initial setup is needed
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkSetupNeeded(req, res) {
    try {
      // Check if any admin exists
      const adminCount = await Admin.countDocuments();
      
      res.json({
        needsSetup: adminCount === 0,
        hasAdmins: adminCount > 0,
        adminCount
      });
    } catch (error) {
      console.error('Setup check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check setup status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Create initial admin user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createInitialAdmin(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Check if any admin already exists
      const existingAdminCount = await Admin.countDocuments();
      if (existingAdminCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Initial setup has already been completed'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Create initial admin (password will be hashed by model pre-save middleware)
      const admin = new Admin({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // Let the model handle hashing
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin._id, 
          email: admin.email,
          role: admin.role 
        },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
        }
      );

      // Log the setup completion
      console.log(`✅ Initial admin created: ${admin.email}`);

      res.status(201).json({
        success: true,
        message: 'Initial admin created successfully',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt
        },
        token
      });

    } catch (error) {
      console.error('Initial admin creation error:', error);
      
      // Handle duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'An admin with this email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create initial admin',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Complete setup process
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async completeSetup(req, res) {
    try {
      // Check if at least one admin exists
      const adminCount = await Admin.countDocuments();
      
      if (adminCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'No admin users found. Please create an admin first.'
        });
      }

      // Setup is considered complete if we have at least one admin
      res.json({
        success: true,
        message: 'Setup completed successfully',
        setupComplete: true,
        adminCount
      });

    } catch (error) {
      console.error('Setup completion error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete setup',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Reset setup (development only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetSetup(req, res) {
    try {
      // Only allow in development
      if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
          success: false,
          message: 'Setup reset is only available in development mode'
        });
      }

      // Delete all admins
      const result = await Admin.deleteMany({});

      console.log('🔄 Setup reset: All admins deleted');

      res.json({
        success: true,
        message: 'Setup reset successfully',
        deletedCount: result.deletedCount
      });

    } catch (error) {
      console.error('Setup reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset setup',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new SetupController();