// Comprehensive error handling utilities following industry standards

// Error types enum for consistent error handling
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// Standardized error response format
export class AppError extends Error {
  constructor(type, message, status = 500, errors = [], reason = null, details = {}) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.status = status
    this.errors = errors
    this.reason = reason
    this.details = details
    this.timestamp = new Date().toISOString()
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

// Error handler for different error types
export const handleError = (error, context = {}) => {
  console.error('Error Handler:', {
    error,
    context,
    timestamp: new Date().toISOString()
  })

  // Handle different error types
  if (error instanceof AppError) {
    return {
      type: error.type,
      message: error.message,
      status: error.status,
      errors: error.errors,
      reason: error.reason,
      details: error.details,
      timestamp: error.timestamp
    }
  }

  // Handle API errors (from axios interceptor)
  if (error.type === 'API_ERROR') {
    return {
      type: ERROR_TYPES.API_ERROR,
      message: error.message,
      status: error.status,
      errors: error.errors,
      reason: error.reason,
      details: { url: error.url, duration: error.duration },
      timestamp: error.timestamp
    }
  }

  // Handle network errors
  if (error.type === 'NETWORK_ERROR') {
    return {
      type: ERROR_TYPES.NETWORK_ERROR,
      message: 'Unable to connect to server. Please check your internet connection and try again.',
      status: 0,
      errors: [],
      reason: 'Network connection failed',
      details: { url: error.url },
      timestamp: error.timestamp
    }
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return {
      type: ERROR_TYPES.TIMEOUT_ERROR,
      message: 'Request timed out. Please try again.',
      status: 408,
      errors: [],
      reason: 'Request timeout',
      details: {},
      timestamp: new Date().toISOString()
    }
  }

  // Handle validation errors
  if (error.response?.status === 400 && error.response?.data?.errors) {
    return {
      type: ERROR_TYPES.VALIDATION_ERROR,
      message: error.response.data.message || 'Validation failed',
      status: 400,
      errors: error.response.data.errors,
      reason: error.response.data.reason || 'Invalid input data',
      details: { url: error.config?.url },
      timestamp: new Date().toISOString()
    }
  }

  // Handle authentication errors
  if (error.response?.status === 401) {
    return {
      type: ERROR_TYPES.AUTHENTICATION_ERROR,
      message: 'Authentication required. Please log in and try again.',
      status: 401,
      errors: [],
      reason: 'Unauthorized access',
      details: { url: error.config?.url },
      timestamp: new Date().toISOString()
    }
  }

  // Handle authorization errors
  if (error.response?.status === 403) {
    return {
      type: ERROR_TYPES.AUTHORIZATION_ERROR,
      message: 'You do not have permission to perform this action.',
      status: 403,
      errors: [],
      reason: 'Insufficient permissions',
      details: { url: error.config?.url },
      timestamp: new Date().toISOString()
    }
  }

  // Handle not found errors
  if (error.response?.status === 404) {
    return {
      type: ERROR_TYPES.NOT_FOUND_ERROR,
      message: 'The requested resource was not found.',
      status: 404,
      errors: [],
      reason: 'Resource not found',
      details: { url: error.config?.url },
      timestamp: new Date().toISOString()
    }
  }

  // Handle server errors
  if (error.response?.status >= 500) {
    return {
      type: ERROR_TYPES.SERVER_ERROR,
      message: 'Server error occurred. Please try again later.',
      status: error.response.status,
      errors: [],
      reason: 'Internal server error',
      details: { url: error.config?.url },
      timestamp: new Date().toISOString()
    }
  }

  // Handle client errors (4xx)
  if (error.response?.status >= 400) {
    return {
      type: ERROR_TYPES.CLIENT_ERROR,
      message: error.response.data?.message || 'Client error occurred.',
      status: error.response.status,
      errors: error.response.data?.errors || [],
      reason: error.response.data?.reason || 'Client request error',
      details: { url: error.config?.url },
      timestamp: new Date().toISOString()
    }
  }

  // Handle unknown errors
  return {
    type: ERROR_TYPES.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again.',
    status: 500,
    errors: [],
    reason: error.message || 'Unknown error',
    details: { originalError: error.message },
    timestamp: new Date().toISOString()
  }
}

// User-friendly error messages
export const getUserFriendlyMessage = (errorType, originalMessage = '') => {
  const messages = {
    [ERROR_TYPES.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ERROR_TYPES.NETWORK_ERROR]: 'Unable to connect to server. Please check your internet connection.',
    [ERROR_TYPES.API_ERROR]: originalMessage || 'Server error occurred. Please try again.',
    [ERROR_TYPES.AUTHENTICATION_ERROR]: 'Please log in and try again.',
    [ERROR_TYPES.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
    [ERROR_TYPES.NOT_FOUND_ERROR]: 'The requested information was not found.',
    [ERROR_TYPES.SERVER_ERROR]: 'Server is temporarily unavailable. Please try again later.',
    [ERROR_TYPES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
    [ERROR_TYPES.CLIENT_ERROR]: originalMessage || 'Invalid request. Please check your input.',
    [ERROR_TYPES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
  }

  return messages[errorType] || 'An error occurred. Please try again.'
}

// Error boundary utility functions for React error handling
export const logErrorToMonitoring = (error, errorInfo) => {
  console.error('Error Boundary caught an error:', error, errorInfo)
  
  // Log error to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
  }
}

// Handle runtime errors (browser extension conflicts)
export const handleRuntimeErrors = () => {
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args[0]
    
    // Filter out common browser extension errors
    if (
      typeof message === 'string' && 
      (
        message.includes('message port closed') ||
        message.includes('runtime.lastError') ||
        message.includes('Extension context invalidated') ||
        message.includes('The message port closed before a response was received') ||
        message.includes('Unchecked runtime.lastError')
      )
    ) {
      // Silently ignore these errors as they're from browser extensions
      return
    }
    
    // Log other errors normally
    originalConsoleError.apply(console, args)
  }
}

// Handle unhandled promise rejections
export const handleUnhandledRejections = () => {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    const message = reason?.message || reason
    
    // Filter out browser extension related rejections
    if (
      typeof message === 'string' && 
      (
        message.includes('message port closed') ||
        message.includes('runtime.lastError') ||
        message.includes('Extension context invalidated') ||
        message.includes('The message port closed before a response was received') ||
        message.includes('Unchecked runtime.lastError')
      )
    ) {
      event.preventDefault() // Prevent the error from showing in console
      return
    }
    
    // Log other unhandled rejections
    console.error('Unhandled promise rejection:', event.reason)
  })
}

// Initialize comprehensive error handling
export const initializeErrorHandling = () => {
  handleRuntimeErrors()
  handleUnhandledRejections()
  
  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service
    }
  })
}

// Validation error formatter
export const formatValidationErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return []
  
  return errors.map(error => {
    if (typeof error === 'string') {
      return error
    }
    
    if (error.field && error.message) {
      return `${error.field}: ${error.message}`
    }
    
    if (error.message) {
      return error.message
    }
    
    return 'Validation error'
  })
}

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError
}