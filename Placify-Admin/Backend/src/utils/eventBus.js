const { EventEmitter } = require('events');

// Create a central event bus for admin backend
class AdminEventBus extends EventEmitter {
  constructor() {
    super();
    
    // Increase max listeners to handle multiple admin sessions
    this.setMaxListeners(50);
    
    // Enable event logging in development
    if (process.env.NODE_ENV === 'development') {
      this.on('newListener', (event) => {
        console.log(`📡 New listener added for event: ${event}`);
      });
      
      this.on('removeListener', (event) => {
        console.log(`📡 Listener removed for event: ${event}`);
      });
    }
  }

  // Helper method to emit events with error handling
  safeEmit(event, data) {
    try {
      this.emit(event, data);
    } catch (error) {
      console.error(`🔥 Error emitting event ${event}:`, error);
    }
  }

  // Helper method to log events
  logEvent(event, data) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 Event emitted: ${event}`, {
        timestamp: new Date().toISOString(),
        data: data
      });
    }
  }

  // Override emit to include logging
  emit(event, data) {
    this.logEvent(event, data);
    return super.emit(event, data);
  }
}

// Create singleton instance
const eventBus = new AdminEventBus();

// Export the singleton instance
module.exports = eventBus;