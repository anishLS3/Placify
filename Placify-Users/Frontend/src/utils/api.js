import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds timeout
  validateStatus: (status) => status < 500 // Don't throw for 4xx errors
})

// Request interceptor for logging and adding auth headers
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime
    console.log(`API Request to ${response.config.url} completed in ${duration}ms`)
    return response
  },
  (error) => {
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 'unknown'
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      console.error(`API Error ${status} for ${error.config?.url}:`, data)
      
      // Create standardized error object
      const apiError = {
        type: 'API_ERROR',
        status,
        message: data?.message || `Server error (${status})`,
        errors: data?.errors || [],
        reason: data?.reason || null,
        timestamp: new Date().toISOString(),
        url: error.config?.url,
        duration
      }
      
      return Promise.reject(apiError)
      
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.request)
      
      const networkError = {
        type: 'NETWORK_ERROR',
        message: 'Unable to connect to server. Please check your internet connection.',
        status: 0,
        errors: [],
        reason: 'Network connection failed',
        timestamp: new Date().toISOString(),
        url: error.config?.url,
        duration
      }
      
      return Promise.reject(networkError)
      
    } else {
      // Request setup error
      console.error('Request setup error:', error.message)
      
      const setupError = {
        type: 'REQUEST_ERROR',
        message: 'Request could not be processed. Please try again.',
        status: 0,
        errors: [],
        reason: error.message,
        timestamp: new Date().toISOString(),
        url: error.config?.url,
        duration
      }
      
      return Promise.reject(setupError)
    }
  }
)

// Enhanced API functions with proper error handling
export const getExperiences = async () => {
  try {
    const response = await api.get('/experiences')
    return response.data
  } catch (error) {
    throw error // Re-throw the standardized error
  }
}

export const addExperience = async (data) => {
  try {
    const response = await api.post('/experiences', data)
    return response.data
  } catch (error) {
    throw error // Re-throw the standardized error
  }
}

export const submitContact = async (data) => {
  try {
    const response = await api.post('/contact', data)
    return response.data
  } catch (error) {
    throw error // Re-throw the standardized error
  }
}

export default api