import React, { useState, useEffect } from 'react';
import { Power, Trash2 } from 'lucide-react';

const DeviceCard = ({ device, onDelete, deviceManager, messageManager }) => {
  const [currentConsumption, setCurrentConsumption] = useState(0);

  useEffect(() => {
    const updateConsumption = () => {
      setCurrentConsumption(device.calculatePowerConsumption());
    };

    updateConsumption();
    const interval = setInterval(updateConsumption, 1000);
    return () => clearInterval(interval);
  }, [device]);

  const handleToggle = () => {
    if (device.toggle()) {
      const action = device.status ? 'connected' : 'disconnected';
      messageManager.addMessage(action, device.name);
    }
  };

  const handleControlChange = (controlName, value) => {
    device.updateControl(controlName, value);
  };

  const getStatusClass = () => {
    if (device.inCooldown) return 'cooldown';
    return device.status ? 'on' : 'off';
  };

  const getStatusText = () => {
    if (device.inCooldown) return 'COOLDOWN';
    return device.status ? 'ON' : 'OFF';
  };

  const renderControls = () => {
    switch (device.type) {
      case 'fan':
        return (
          <div className="control-group">
            <label>Speed: {device.controls.speed}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.speed}
              onChange={(e) => handleControlChange('speed', e.target.value)}
              disabled={!device.status}
            />
          </div>
        );
      case 'ac':
        return (
          <div className="control-group">
            <label>Temperature: {device.controls.temperature}°C</label>
            <input
              type="range"
              min="16"
              max="30"
              value={device.controls.temperature}
              onChange={(e) => handleControlChange('temperature', e.target.value)}
              disabled={!device.status}
            />
          </div>
        );
      case 'light':
        return (
          <div className="control-group">
            <label>Brightness: {device.controls.brightness}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.brightness}
              onChange={(e) => handleControlChange('brightness', e.target.value)}
              disabled={!device.status}
            />
          </div>
        );
      case 'heater':
        return (
          <div className="control-group">
            <label>Heat Level: {device.controls.heatLevel}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.heatLevel}
              onChange={(e) => handleControlChange('heatLevel', e.target.value)}
              disabled={!device.status}
            />
          </div>
        );
      case 'tv':
        return (
          <div className="control-group">
            <label>Volume: {device.controls.volume}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.volume}
              onChange={(e) => handleControlChange('volume', e.target.value)}
              disabled={!device.status}
            />
          </div>
        );
      case 'generic':
        return (
          <div className="control-group">
            <label>Power Level: {device.controls.power}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.controls.power}
              onChange={(e) => handleControlChange('power', e.target.value)}
              disabled={!device.status}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="device-card">
      <div className="device-header">
        <div>
          <div className="device-title">{device.getIcon()} {device.name}</div>
          <div className="device-type">{device.type.charAt(0).toUpperCase() + device.type.slice(1)}</div>
        </div>
        <span className={`device-status ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="device-info">
        <div className="info-row">
          <span className="info-label">Power Rating</span>
          <span className="info-value">{device.powerRating} W</span>
        </div>
        <div className="info-row">
          <span className="info-label">Status</span>
          <span className="info-value">
            {device.status ? '🔌 Connected' : '⊘ Disconnected'}
          </span>
        </div>
      </div>

      <div className="device-power">
        <div className="power-label">Current Power Draw</div>
        <div className="power-value">{currentConsumption} W</div>
      </div>

      <div className="device-controls">
        {renderControls()}
      </div>

      <div className="device-actions">
        <button
          className={`btn btn-toggle ${device.status ? 'on' : 'off'}`}
          onClick={handleToggle}
          disabled={device.inCooldown}
        >
          <Power size={16} />
          {device.status ? 'Turn OFF' : 'Turn ON'}
        </button>
        <button
          className="btn btn-delete"
          onClick={() => onDelete(device.id)}
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;