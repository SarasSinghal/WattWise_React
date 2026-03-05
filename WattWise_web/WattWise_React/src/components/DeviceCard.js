import React, { useState, useEffect } from 'react';
import '../styles/DeviceCard.css';

const DeviceCard = ({ device, onToggle, onDelete, deviceManager, messageManager }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentConsumption, setCurrentConsumption] = useState(0);

  useEffect(() => {
    const updateConsumption = () => {
      setCurrentConsumption(device.calculatePowerConsumption());
    };

    updateConsumption();
    const interval = setInterval(updateConsumption, 1000);
    return () => clearInterval(interval);
  }, [device]);

  useEffect(() => {
    const consumption = device.calculatePowerConsumption();
    if (device.status && consumption > device.powerRating * 0.85) {
      setShowAlert(true);
      setAlertMessage(`High power usage: ${consumption.toFixed(2)}W`);
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [device.status, device.powerRating, device.calculatePowerConsumption]);

  const getDeviceIcon = (type) => {
    const icons = {
      light: '💡',
      fan: '💨',
      ac: '❄️',
      tv: '📺',
      heater: '🔥',
      default: '⚡'
    };
    return <span style={{ fontSize: '24px' }}>{icons[type] || icons.default}</span>;
  };

  const handleToggle = () => {
    if (device.toggle()) {
      const action = device.status ? 'connected' : 'disconnected';
      if (messageManager) {
        messageManager.addMessage(action, device.name);
      }
    }
  };

  const handleControlChange = (controlName, value) => {
    device.updateControl(controlName, value);
  };

  const powerPercentage = (currentConsumption / device.powerRating) * 100;

  return (
    <div className={`device-card ${device.status ? 'active' : 'inactive'}`}>
      {showAlert && (
        <div className="alert-banner">
          ⚠️ {alertMessage}
        </div>
      )}

      <div className="device-header">
        <div className="device-icon-wrapper">
          <div className={`device-icon ${device.status ? 'powered-on' : 'powered-off'}`}>
            {getDeviceIcon(device.type)}
          </div>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(device.id)}
          title="Remove device"
        >
          ×
        </button>
      </div>

      <h3 className="device-name">{device.name}</h3>

      <div className="device-status">
        <span className={`status-indicator ${device.status ? 'active' : 'inactive'}`}></span>
        <span className="status-text">
          {device.status ? 'Active' : 'Off'}
        </span>
      </div>

      <div className="power-info">
        <div className="power-row">
          <span className="power-label">Power:</span>
          <span className="power-value">{currentConsumption.toFixed(2)}W</span>
        </div>
        <div className="power-bar-container">
          <div
            className={`power-bar ${powerPercentage > 85 ? 'high' : powerPercentage > 50 ? 'medium' : 'low'}`}
            style={{ width: `${Math.min(powerPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {device.inCooldown && (
        <div className="cooldown-notice">
          ⏱️ Cooling down... Power limit exceeded
        </div>
      )}

      {/* Render Controls */}
      <div className="device-controls">
        {device.type === 'fan' && (
          <div className="control-group">
            <label>Speed: {device.controls.speed}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.speed}
              onChange={(e) => handleControlChange('speed', parseInt(e.target.value))}
              disabled={!device.status}
            />
          </div>
        )}
        {device.type === 'ac' && (
          <div className="control-group">
            <label>Temperature: {device.controls.temperature}°C</label>
            <input
              type="range"
              min="16"
              max="30"
              value={device.controls.temperature}
              onChange={(e) => handleControlChange('temperature', parseInt(e.target.value))}
              disabled={!device.status}
            />
          </div>
        )}
        {device.type === 'light' && (
          <div className="control-group">
            <label>Brightness: {device.controls.brightness}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.brightness}
              onChange={(e) => handleControlChange('brightness', parseInt(e.target.value))}
              disabled={!device.status}
            />
          </div>
        )}
        {device.type === 'heater' && (
          <div className="control-group">
            <label>Heat Level: {device.controls.heatLevel}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.heatLevel}
              onChange={(e) => handleControlChange('heatLevel', parseInt(e.target.value))}
              disabled={!device.status}
            />
          </div>
        )}
        {device.type === 'tv' && (
          <div className="control-group">
            <label>Volume: {device.controls.volume}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.volume}
              onChange={(e) => handleControlChange('volume', parseInt(e.target.value))}
              disabled={!device.status}
            />
          </div>
        )}
        {device.type === 'generic' && (
          <div className="control-group">
            <label>Power Level: {device.controls.power}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.power}
              onChange={(e) => handleControlChange('power', parseInt(e.target.value))}
              disabled={!device.status}
            />
          </div>
        )}
      </div>

      <button
        className={`toggle-btn ${device.status ? 'on' : 'off'}`}
        onClick={handleToggle}
        disabled={device.inCooldown}
      >
        <span>⚡</span>
        <span>{device.status ? 'Turn Off' : 'Turn On'}</span>
      </button>
    </div>
  );
};

export default DeviceCard;