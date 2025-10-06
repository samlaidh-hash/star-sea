/**
 * Star Sea - Event Bus
 * Simple pub/sub event system
 */

class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        for (const callback of callbacks) {
            callback(data);
        }
    }

    clear() {
        this.listeners.clear();
    }
}

// Global event bus instance
const eventBus = new EventBus();
