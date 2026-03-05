import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const MessagesSection = ({ messageManager }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const updateMessages = () => {
      setMessages([...messageManager.getMessages()]);
    };

    // Set up real-time message updates
    messageManager.setUpdateCallback(updateMessages);

    // Initial load
    updateMessages();

    // Cleanup callback on unmount
    return () => {
      messageManager.setUpdateCallback(null);
    };
  }, [messageManager]);

  const handleClearMessages = () => {
    // For now, we'll just clear the local state
    // In a real implementation, you'd want to clear from messageManager
    setMessages([]);
  };

  const formatMessage = (message) => {
    const time = message.timestamp.toLocaleTimeString();
    const date = message.timestamp.toLocaleDateString();

    let icon = '';
    let action = '';

    switch(message.type) {
      case 'connected':
        icon = '🔌';
        action = 'connected';
        break;
      case 'disconnected':
        icon = '🔌';
        action = 'disconnected';
        break;
      case 'cooldown':
        icon = '⏰';
        action = 'entered cooldown';
        break;
      case 'threshold':
        icon = '⚠️';
        action = 'auto-disconnected (power threshold)';
        break;
      case 'power_variation':
        icon = '⚡';
        action = 'power variation detected';
        break;
      case 'system':
        icon = '📄';
        action = 'system message';
        break;
      default:
        icon = '📝';
        action = message.type;
    }

    return {
      icon,
      text: `${icon} ${message.deviceName} ${action} at ${time} on ${date}`,
      fullText: `${icon} ${message.deviceName} ${action} at ${time} on ${date}${message.details ? ' - ' + message.details : ''}`,
      timestamp: message.timestamp
    };
  };

  return (
    <section className="messages-section">
      <div className="messages-header">
        <h2>Device Activity Log</h2>
        <button
          className="btn btn-small btn-secondary"
          onClick={handleClearMessages}
        >
          <Trash2 size={16} />
          Clear Log
        </button>
      </div>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="message-item empty-message">
            <p>📝 No device activity yet. Messages will appear here when devices are connected/disconnected.</p>
          </div>
        ) : (
          messages.map(message => {
            const formatted = formatMessage(message);
            const typeClass = `message-${message.type}`;

            return (
              <div key={message.id} className={`message-item ${typeClass}`}>
                <div className="message-text">{formatted.fullText}</div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default MessagesSection;