const jwt = require('jsonwebtoken');
const adminService = require('../services/adminService');

// Middleware to require admin authentication
const requireAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token and get admin
    const result = await adminService.verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message || 'Invalid token'
      });
    }

    // Add admin info to request object
    req.admin = result.admin;
    req.adminId = result.adminId;
    req.token = token;

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

// Middleware for optional admin authentication (for routes that work with/without auth)
const optionalAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No auth provided, continue without admin context
      return next();
    }

    const token = authHeader.substring(7);
    const result = await adminService.verifyToken(token);

    if (result.success) {
      req.admin = result.admin;
      req.adminId = result.adminId;
      req.token = token;
    }

    next();

  } catch (error) {
    // For optional auth, continue even if token verification fails
    console.warn('Optional auth failed:', error.message);
    next();
  }
};

// Socket.IO authentication middleware
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.substring(7);

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const result = await adminService.verifyToken(token);

    if (!result.success) {
      return next(new Error(`Authentication error: ${result.message}`));
    }

    // Add admin info to socket
    socket.admin = result.admin;
    socket.adminId = result.adminId;

    next();

  } catch (error) {
    console.error('Socket auth error:', error);
    next(new Error(`Authentication error: ${error.message}`));
  }
};

// Middleware to extract IP address and User Agent for logging
const extractRequestInfo = (req, res, next) => {
  // Extract real IP address (considering proxies)
  req.clientIp = req.headers['x-forwarded-for'] || 
                 req.headers['x-real-ip'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress ||
                 (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                 req.ip;

  // Extract user agent
  req.userAgent = req.headers['user-agent'] || 'Unknown';

  next();
};

// Middleware for role-based access (future expansion)
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (roles.length > 0 && !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to validate admin account status
const validateAdminStatus = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.admin.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  next();
};

module.exports = {
  requireAdmin,
  optionalAdmin,
  socketAuth,
  extractRequestInfo,
  requireRole,
  validateAdminStatus
};