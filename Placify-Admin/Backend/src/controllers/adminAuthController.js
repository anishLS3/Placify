const adminService = require('../services/adminService');
const { extractRequestInfo } = require('../middleware/adminAuth');

class AdminAuthController {
  // Admin login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Attempt login with IP tracking
      const result = await adminService.login(
        email, 
        password, 
        req.clientIp, 
        req.userAgent
      );

      // Set secure HTTP-only cookie with token (optional)
      if (process.env.USE_COOKIES === 'true') {
        res.cookie('admin_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
      }

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Admin logout
  async logout(req, res, next) {
    try {
      const result = await adminService.logout(
        req.adminId, 
        req.token, 
        req.clientIp
      );

      // Clear cookie if used
      if (process.env.USE_COOKIES === 'true') {
        res.clearCookie('admin_token');
      }

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Get admin profile
  async getProfile(req, res, next) {
    try {
      const result = await adminService.getProfile(req.adminId);
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Update admin profile
  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields provided for update'
        });
      }

      const result = await adminService.updateProfile(req.adminId, updateData);
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password, new password, and confirmation are required'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password and confirmation do not match'
        });
      }

      const result = await adminService.changePassword(
        req.adminId,
        currentPassword,
        newPassword
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Create initial admin (for first-time setup)
  async createInitialAdmin(req, res, next) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Validate input
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, password, and confirmation are required'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password and confirmation do not match'
        });
      }

      const result = await adminService.createInitialAdmin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'admin'
      });

      res.status(201).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Check if initial setup is needed
  async checkSetup(req, res, next) {
    try {
      const result = await adminService.needsInitialSetup();
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // Verify token (for frontend token validation)
  async verifyToken(req, res, next) {
    try {
      // If middleware passed, token is valid
      res.status(200).json({
        success: true,
        admin: {
          id: req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          lastLogin: req.admin.lastLogin
        },
        message: 'Token is valid'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get audit logs
  async getAuditLogs(req, res, next) {
    try {
      const { page = 1, limit = 50, adminId } = req.query;
      
      const result = await adminService.getAuditLogs(
        adminId || null, 
        parseInt(page), 
        parseInt(limit)
      );

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminAuthController();