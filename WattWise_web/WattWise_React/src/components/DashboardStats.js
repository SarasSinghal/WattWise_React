import React from 'react';
import '../styles/DashboardStats.css';

const DashboardStats = ({ devices }) => {
  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.status).length;
  const totalPowerConsumption = devices.reduce((sum, d) => sum + d.calculatePowerConsumption(), 0);
  const alertDevices = devices.filter(d => d.status && d.calculatePowerConsumption() > d.powerRating * 0.9).length;

  const stats = [
    {
      label: 'Total Devices',
      value: totalDevices,
      icon: '📱',
      color: '#3498db'
    },
    {
      label: 'Active Devices',
      value: activeDevices,
      icon: '✓',
      color: '#2ecc71'
    },
    {
      label: 'Power Usage (W)',
      value: totalPowerConsumption.toFixed(2),
      icon: '⚡',
      color: '#f39c12'
    },
    {
      label: 'Alerts',
      value: alertDevices,
      icon: '⚠️',
      color: alertDevices > 0 ? '#e74c3c' : '#95a5a6'
    }
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: stat.color }}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">{stat.label}</p>
            <h3 className="stat-value">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
