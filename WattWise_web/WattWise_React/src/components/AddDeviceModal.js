import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddDeviceModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'fan',
    powerRating: ''
  });

  const deviceTypes = [
    { value: 'fan', label: 'Fan', icon: '💨' },
    { value: 'ac', label: 'Air Conditioner', icon: '❄️' },
    { value: 'light', label: 'Light', icon: '💡' },
    { value: 'heater', label: 'Heater', icon: '🔥' },
    { value: 'tv', label: 'Television', icon: '📺' },
    { value: 'generic', label: 'Generic Device', icon: '⚙️' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a device name');
      return;
    }
    const powerRating = parseInt(formData.powerRating);
    if (!powerRating || powerRating <= 0) {
      alert('Power rating must be greater than 0');
      return;
    }

    onAdd({
      name: formData.name.trim(),
      type: formData.type,
      powerRating: powerRating
    });

    setFormData({ name: '', type: 'fan', powerRating: '' });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Device</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="deviceName">Device Name</label>
            <input
              type="text"
              id="deviceName"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter device name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deviceType">Device Type</label>
            <select
              id="deviceType"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              {deviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="powerRating">Power Rating (Watts)</label>
            <input
              type="number"
              id="powerRating"
              value={formData.powerRating}
              onChange={(e) => handleChange('powerRating', e.target.value)}
              placeholder="Enter power rating"
              min="1"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;