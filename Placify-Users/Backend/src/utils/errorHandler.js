// Comprehensive backend error handling utilities following industry standards

// Error types enum for consistent error handling
const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  SPAM_ERROR: 'SPAM_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
}

// Standardized error response format
class AppError extends Error {
  constructor(type, message, statusCode = 500, errors = [], reason = null, details = {}) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.errors = errors
    this.reason = reason
    this.details = details
    this.timestamp = new Date().toISOString()
    this.isOperational = true
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

// Validation error handler
const handleValidationError = (errors) => {
  const formattedErrors = errors.array().map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }))
  
  return new AppError(
    ERROR_TYPES.VALIDATION_ERROR,
    'Validation failed',
    400,
    formattedErrors,
    'Invalid input data provided'
  )
}

// Mongoose validation error handler
const handleMongooseValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }))
  
  return new AppError(
    ERROR_TYPES.VALIDATION_ERROR,
    'Data validation failed',
    400,
    errors,
    'Invalid data format or constraints violated'
  )
}

// Duplicate key error handler
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0]
  const value = error.keyValue[field]
  
  return new AppError(
    ERROR_TYPES.DUPLICATE_ERROR,
    `${field} already exists`,
    409,
    [{ field, message: `${field} with value '${value}' already exists` }],
    'Duplicate resource detected'
  )
}

// Cast error handler (invalid ObjectId, etc.)
const handleCastError = (error) => {
  return new AppError(
    ERROR_TYPES.VALIDATION_ERROR,
    `Invalid ${error.path}: ${error.value}`,
    400,
    [{ field: error.path, message: `Invalid ${error.path} format` }],
    'Invalid data format'
  )
}

// Spam detection error handler
const handleSpamError = (reason) => {
  return new AppError(
    ERROR_TYPES.SPAM_ERROR,
    'Submission blocked due to suspicious content',
    400,
    [],
    reason,
    { blocked: true }
  )
}

// Database connection error handler
const handleDatabaseError = (error) => {
  return new AppError(
    ERROR_TYPES.DATABASE_ERROR,
    'Database connection error',
    503,
    [],
    'Unable to connect to database',
    { retryable: true }
  )
}

// External API error handler
const handleExternalAPIError = (error, service) => {
  return new AppError(
    ERROR_TYPES.EXTERNAL_API_ERROR,
    `External service error: ${service}`,
    502,
    [],
    `Failed to communicate with ${service}`,
    { service, retryable: true }
  )
}

// Main error handler
const handleError = (error, req, res, next) => {
  console.error('Error Handler:', {
    error: error.message,
    stack: error.stack,
    type: error.type,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Handle known error types
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      type: error.type,
      message: error.message,
      errors: error.errors,
      reason: error.reason,
      details: error.details,
      timestamp: error.timestamp
    })
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const appError = handleMongooseValidationError(error)
    return res.status(appError.statusCode).json({
      success: false,
      type: appError.type,
      message: appError.message,
      errors: appError.errors,
      reason: appError.reason,
      timestamp: appError.timestamp
    })
  }

  // Handle duplicate key errors
  if (error.code === 11000) {
    const appError = handleDuplicateKeyError(error)
    return res.status(appError.statusCode).json({
      success: false,
      type: appError.type,
      message: appError.message,
      errors: appError.errors,
      reason: appError.reason,
      timestamp: appError.timestamp
    })
  }

  // Handle cast errors (invalid ObjectId, etc.)
  if (error.name === 'CastError') {
    const appError = handleCastError(error)
    return res.status(appError.statusCode).json({
      success: false,
      type: appError.type,
      message: appError.message,
      errors: appError.errors,
      reason: appError.reason,
      timestamp: appError.timestamp
    })
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      type: ERROR_TYPES.VALIDATION_ERROR,
      message: 'Invalid JSON format',
      errors: [{ field: 'body', message: 'Request body contains invalid JSON' }],
      reason: 'JSON parsing failed',
      timestamp: new Date().toISOString()
    })
  }

  // Handle rate limiting errors
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      type: ERROR_TYPES.RATE_LIMIT_ERROR,
      message: 'Too many requests',
      errors: [],
      reason: 'Rate limit exceeded',
      timestamp: new Date().toISOString(),
      details: { retryAfter: error.retryAfter }
    })
  }

  // Handle database connection errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    const appError = handleDatabaseError(error)
    return res.status(appError.statusCode).json({
      success: false,
      type: appError.type,
      message: appError.message,
      errors: appError.errors,
      reason: appError.reason,
      timestamp: appError.timestamp,
      details: appError.details
    })
  }

  // Handle external API errors
  if (error.isAxiosError) {
    const appError = handleExternalAPIError(error, 'External API')
    return res.status(appError.statusCode).json({
      success: false,
      type: appError.type,
      message: appError.message,
      errors: appError.errors,
      reason: appError.reason,
      timestamp: appError.timestamp,
      details: appError.details
    })
  }

  // Handle unknown errors
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return res.status(500).json({
    success: false,
    type: ERROR_TYPES.INTERNAL_SERVER_ERROR,
    message: isDevelopment ? error.message : 'Internal server error',
    errors: [],
    reason: isDevelopment ? error.stack : 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: error.stack })
  })
}

// 404 handler for undefined routes
const handleNotFound = (req, res, next) => {
  const error = new AppError(
    ERROR_TYPES.NOT_FOUND_ERROR,
    `Route ${req.originalUrl} not found`,
    404,
    [],
    'The requested endpoint does not exist'
  )
  next(error)
}

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    }
    
    if (res.statusCode >= 400) {
      console.error('HTTP Error:', logData)
    } else {
      console.log('HTTP Request:', logData)
    }
  })
  
  next()
}

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  next()
}

// Error monitoring (placeholder for production monitoring services)
const logError = (error, context = {}) => {
  // In production, this would send to monitoring service (Sentry, LogRocket, etc.)
  console.error('Error Log:', {
    error: error.message,
    stack: error.stack,
    type: error.type,
    context,
    timestamp: new Date().toISOString()
  })
}

module.exports = {
  AppError,
  ERROR_TYPES,
  handleError,
  handleNotFound,
  handleValidationError,
  handleSpamError,
  asyncHandler,
  requestLogger,
  securityHeaders,
  logError
}
