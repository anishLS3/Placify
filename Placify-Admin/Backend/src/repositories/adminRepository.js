const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');

class AdminRepository {
  // Find admin by email
  async findByEmail(email) {
    try {
      return await Admin.findOne({ email }).select('+password');
    } catch (error) {
      throw new Error(`Failed to find admin by email: ${error.message}`);
    }
  }

  // Find admin by ID
  async findById(id) {
    try {
      return await Admin.findById(id);
    } catch (error) {
      throw new Error(`Failed to find admin by ID: ${error.message}`);
    }
  }

  // Create admin
  async create(adminData) {
    try {
      const admin = new Admin(adminData);
      await admin.save();
      return admin;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Admin with this email already exists');
      }
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  // Update last login
  async updateLastLogin(adminId) {
    try {
      return await Admin.findByIdAndUpdate(
        adminId,
        { 
          lastLogin: new Date(),
          $unset: { loginAttempts: 1, lockUntil: 1 }
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  }

  // Log admin action (Audit Trail)
  async logAction(actionData) {
    try {
      const auditLog = new AuditLog(actionData);
      await auditLog.save();
      return auditLog;
    } catch (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw error for audit log failures to prevent breaking main functionality
      return null;
    }
  }

  // Get audit logs
  async getAuditLogs(adminId = null, page = 1, limit = 50) {
    try {
      const filter = adminId ? { adminId } : {};
      const skip = (page - 1) * limit;

      const logs = await AuditLog
        .find(filter)
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await AuditLog.countDocuments(filter);

      return {
        logs,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: logs.length,
          totalRecords: total
        }
      };
    } catch (error) {
      throw new Error(`Failed to get audit logs: ${error.message}`);
    }
  }

  // Get admin activity stats
  async getActivityStats(adminId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await AuditLog.aggregate([
        {
          $match: {
            adminId: adminId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      return stats;
    } catch (error) {
      throw new Error(`Failed to get activity stats: ${error.message}`);
    }
  }

  // Check if any admin exists (for initial setup)
  async hasAnyAdmin() {
    try {
      const count = await Admin.countDocuments();
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check admin existence: ${error.message}`);
    }
  }

  // Get all admins (for management)
  async findAll() {
    try {
      return await Admin.find().select('-password');
    } catch (error) {
      throw new Error(`Failed to get all admins: ${error.message}`);
    }
  }

  // Update admin profile
  async updateProfile(adminId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated this way
      const { password, role, isActive, loginAttempts, lockUntil, ...allowedUpdates } = updateData;
      
      return await Admin.findByIdAndUpdate(
        adminId,
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password');
    } catch (error) {
      throw new Error(`Failed to update admin profile: ${error.message}`);
    }
  }

  // Change password
  async changePassword(adminId, newPassword) {
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        throw new Error('Admin not found');
      }

      admin.password = newPassword;
      await admin.save();
      
      return admin;
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }
}

module.exports = new AdminRepository();