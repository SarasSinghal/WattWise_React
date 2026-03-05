/**
 * Message Manager - handles device event logging
 */
export class MessageManager {
  constructor() {
    this.messages = [];
    this.maxMessages = 50; // Keep last 50 messages
    this.loadMessages();
  }

  /**
   * Add a new message
   */
  addMessage(type, deviceName, details = '') {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      type: type, // 'connected', 'disconnected', 'cooldown', 'threshold', 'power_variation'
      deviceName: deviceName,
      details: details
    };

    this.messages.unshift(message); // Add to beginning

    // Keep only the last maxMessages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(0, this.maxMessages);
    }

    this.saveMessages();
    // Trigger UI update if callback exists
    if (this.onMessagesUpdate) {
      this.onMessagesUpdate([...this.messages]);
    }
  }

  /**
   * Get all messages
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Get last N messages
   */
  getLastMessages(count = 10) {
    return this.messages.slice(0, count);
  }

  /**
   * Clear all messages
   */
  clearMessages() {
    this.messages = [];
    this.saveMessages();
    if (this.onMessagesUpdate) {
      this.onMessagesUpdate([]);
    }
  }

  /**
   * Set callback for when messages are updated
   */
  setUpdateCallback(callback) {
    this.onMessagesUpdate = callback;
  }

  /**
   * Save messages to localStorage
   */
  saveMessages() {
    try {
      localStorage.setItem('wattwise_messages', JSON.stringify(this.messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  /**
   * Load messages from localStorage
   */
  loadMessages() {
    try {
      const messagesData = JSON.parse(localStorage.getItem('wattwise_messages') || '[]');
      this.messages = messagesData.map(data => ({
        ...data,
        timestamp: new Date(data.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
      this.messages = [];
    }
  }
}