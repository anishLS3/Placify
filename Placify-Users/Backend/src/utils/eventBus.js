const EventEmitter = require('events');

// Create a global event bus for cross-service communication
class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Increase limit for multiple event types
  }

  // Emit event with automatic error handling
  safeEmit(event, data) {
    try {
      console.log(`📡 Event emitted: ${event}`, { timestamp: new Date().toISOString(), data: typeof data === 'object' ? Object.keys(data) : data });
      this.emit(event, data);
    } catch (error) {
      console.error(`❌ Error emitting event ${event}:`, error);
    }
  }

  // Add listener with automatic error handling
  safeOn(event, listener) {
    try {
      this.on(event, listener);
      console.log(`📡 New listener added for event: ${event}`);
    } catch (error) {
      console.error(`❌ Error adding listener for ${event}:`, error);
    }
  }
}

const eventBus = new EventBus();

module.exports = eventBus;