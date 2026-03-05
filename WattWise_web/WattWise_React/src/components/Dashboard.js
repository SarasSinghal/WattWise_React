import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ deviceManager }) => {
  const [stats, setStats] = useState({
    totalPower: 0,
    activeDevices: 0,
    totalDevices: 0,
    powerThreshold: 5000
  });

  useEffect(() => {
    const updateStats = () => {
      setStats({
        totalPower: deviceManager.getTotalPowerConsumption(),
        activeDevices: deviceManager.getActiveDeviceCount(),
        totalDevices: deviceManager.getAllDevices().length,
        powerThreshold: deviceManager.powerThreshold
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [deviceManager]);

  return (
    <section className="dashboard">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      <div className="stats-container">
        <div className="stat-card energy-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-label">Total Power Usage</div>
          <div className="stat-value">{stats.totalPower} W</div>
          <div className="stat-subtext">Current Consumption</div>
        </div>

        <div className="stat-card active-card">
          <div className="stat-icon">✓</div>
          <div className="stat-label">Active Devices</div>
          <div className="stat-value">{stats.activeDevices}</div>
          <div className="stat-subtext">Devices ON</div>
        </div>

        <div className="stat-card threshold-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-label">Power Threshold</div>
          <div className="stat-value">{stats.powerThreshold} W</div>
          <div className="stat-subtext">Safety Limit</div>
        </div>

        <div className="stat-card devices-card">
          <div className="stat-icon">📱</div>
          <div className="stat-label">Total Devices</div>
          <div className="stat-value">{stats.totalDevices}</div>
          <div className="stat-subtext">Connected Devices</div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;