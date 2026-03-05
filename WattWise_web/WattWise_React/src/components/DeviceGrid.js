import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DeviceCard from './DeviceCard';
import AddDeviceModal from './AddDeviceModal';

const DeviceGrid = ({ deviceManager, messageManager }) => {
  const [devices, setDevices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const updateDevices = () => {
      setDevices([...deviceManager.getAllDevices()]);
    };

    updateDevices();
    const interval = setInterval(updateDevices, 1000);
    return () => clearInterval(interval);
  }, [deviceManager]);

  const handleAddDevice = (deviceData) => {
    try {
      deviceManager.addDevice(deviceData.name, deviceData.type, deviceData.powerRating);
      messageManager.addMessage('connected', deviceData.name);
      setShowAddModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      deviceManager.removeDevice(deviceId);
      messageManager.addMessage('disconnected', device.name);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all devices?')) {
      deviceManager.clearAllDevices();
      messageManager.addMessage('disconnected', 'All devices', 'bulk removal');
    }
  };

  return (
    <section className="devices-section">
      <div className="section-header">
        <h2>Device Management</h2>
        <div className="section-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Add Device
          </button>
          <button
            className="btn btn-danger"
            onClick={handleClearAll}
            disabled={devices.length === 0}
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      <div className="devices-grid">
        {devices.length === 0 ? (
          <div className="empty-state">
            <p>No devices connected yet. Click "Add Device" to get started.</p>
          </div>
        ) : (
          devices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onDelete={handleDeleteDevice}
              deviceManager={deviceManager}
              messageManager={messageManager}
            />
          ))
        )}
      </div>

      {showAddModal && (
        <AddDeviceModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDevice}
        />
      )}
    </section>
  );
};

export default DeviceGrid;