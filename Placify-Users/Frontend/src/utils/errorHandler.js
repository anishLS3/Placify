// Error handling utilities for browser extension conflicts and other runtime errors

export const handleRuntimeErrors = () => {
  // Handle message port errors (usually from browser extensions)
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

export const suppressExtensionErrors = () => {
  // Override window.onerror to filter extension-related errors
  const originalOnError = window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
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
      return true // Prevent error from showing in console
    }
    
    // Call original error handler for other errors
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error)
    }
    
    return false
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
  })
}

// Initialize error handling
export const initializeErrorHandling = () => {
  handleRuntimeErrors()
  suppressExtensionErrors()
  handleUnhandledRejections()
}
