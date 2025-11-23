// Global error handler middleware for admin backend
const errorHandler = (error, req, res, next) => {
  console.error('🔥 Admin Backend Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    adminId: req.adminId || 'Unknown',
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map(err => err.message);
  } else if (error.name === 'CastError') {
    // Invalid ObjectId
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.code === 11000) {
    // Duplicate key error
    statusCode = 409;
    message = 'Resource already exists';
    const field = Object.keys(error.keyValue)[0];
    details = `${field} already exists`;
  } else if (error.name === 'JsonWebTokenError') {
    // JWT errors
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  } else if (error.message) {
    // Custom error messages
    if (error.message.includes('not found')) {
      statusCode = 404;
      message = error.message;
    } else if (error.message.includes('Invalid') || error.message.includes('required')) {
      statusCode = 400;
      message = error.message;
    } else if (error.message.includes('Unauthorized') || error.message.includes('Access denied')) {
      statusCode = 401;
      message = error.message;
    } else if (error.message.includes('Forbidden') || error.message.includes('permission')) {
      statusCode = 403;
      message = error.message;
    } else {
      message = error.message;
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    details,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error.name
    })
  });
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/api/admin/auth/*',
      experiences: '/api/admin/experiences/*',
      contacts: '/api/admin/contacts/*',
      analytics: '/api/admin/analytics/*'
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};