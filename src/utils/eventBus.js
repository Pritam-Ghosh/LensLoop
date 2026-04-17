// utils/eventBus.js
const listeners = {};

const eventBus = {
  addListener(event, callback) {
    console.log(`📻 EventBus: Adding listener for "${event}"`);
    if (!listeners[event]) {
      listeners[event] = [];
    }

    listeners[event].push(callback);
    console.log(`📻 EventBus: Total listeners for "${event}":`, listeners[event].length);

    return {
      remove() {
        console.log(`📻 EventBus: Removing listener for "${event}"`);
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    };
  },

  emit(event, data) {
    console.log(`📡 EventBus: Emitting "${event}"`, data);
    console.log(`📡 EventBus: Listeners for "${event}":`, listeners[event]?.length || 0);
    
    if (listeners[event]) {
      listeners[event].forEach((cb, index) => {
        console.log(`📡 EventBus: Calling listener #${index}`);
        cb(data);
      });
    } else {
      console.log(`⚠️ EventBus: No listeners registered for "${event}"`);
    }
  },

  removeListener(event, callback) {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    }
  },
};

export default eventBus;