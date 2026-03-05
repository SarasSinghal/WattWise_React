import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale
);

const ChartsSection = ({ deviceManager }) => {
  const [chartData, setChartData] = useState({
    consumption: { labels: [], datasets: [] },
    status: { labels: [], datasets: [] }
  });

  const [realTimeData, setRealTimeData] = useState({
    labels: [],
    datasets: [{
      label: 'Total Power Consumption (W)',
      data: [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    }]
  });

  const [stats, setStats] = useState({
    totalConsumption: 0,
    activeDevices: 0,
    totalDevices: 0,
    efficiency: 0
  });

  useEffect(() => {
    const updateCharts = () => {
      const devices = deviceManager.getAllDevices();

      // Consumption breakdown chart
      const consumptionLabels = devices.map(d => d.name);
      const consumptionData = devices.map(d => d.calculatePowerConsumption());

      const consumptionChartData = {
        labels: consumptionLabels,
        datasets: [{
          label: 'Power Consumption (W)',
          data: consumptionData,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
          ],
          borderWidth: 1
        }]
      };

      // Status distribution chart
      const activeDevices = devices.filter(d => d.status && !d.inCooldown).length;
      const inactiveDevices = devices.filter(d => !d.status || d.inCooldown).length;
      const cooldownDevices = devices.filter(d => d.inCooldown).length;

      const statusChartData = {
        labels: ['Active', 'Inactive', 'Cooldown'],
        datasets: [{
          label: 'Device Status',
          data: [activeDevices, inactiveDevices, cooldownDevices],
          backgroundColor: ['#4CAF50', '#F44336', '#FF9800'],
          borderWidth: 1
        }]
      };

      setChartData({
        consumption: consumptionChartData,
        status: statusChartData
      });
    };

    // Real-time chart update
    const updateRealTimeChart = () => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();
      const totalConsumption = deviceManager.getTotalPowerConsumption();

      setRealTimeData(prevData => {
        const newLabels = [...prevData.labels, timeLabel];
        const newData = [...prevData.datasets[0].data, totalConsumption];

        // Keep only last 20 data points for real-time view
        if (newLabels.length > 20) {
          newLabels.shift();
          newData.shift();
        }

        return {
          labels: newLabels,
          datasets: [{
            ...prevData.datasets[0],
            data: newData
          }]
        };
      });
    };

    // Stats update
    const updateStats = () => {
      const devices = deviceManager.getAllDevices();
      const totalConsumption = deviceManager.getTotalPowerConsumption();
      const activeDevices = devices.filter(d => d.status && !d.inCooldown).length;
      const totalDevices = devices.length;

      // Calculate efficiency based on active vs total devices
      const efficiency = totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0;

      setStats({
        totalConsumption: Math.round(totalConsumption),
        activeDevices,
        totalDevices,
        efficiency
      });
    };

    updateCharts();
    updateStats();
    const chartsInterval = setInterval(updateCharts, 2000);
    const realTimeInterval = setInterval(updateRealTimeChart, 1000);
    const statsInterval = setInterval(updateStats, 1000);

    return () => {
      clearInterval(chartsInterval);
      clearInterval(realTimeInterval);
      clearInterval(statsInterval);
    };
  }, [deviceManager]);

  const consumptionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Power Consumption Breakdown'
      }
    }
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Device Status Distribution'
      }
    }
  };

  const realTimeOptions = {
    responsive: true,
    animation: {
      duration: 500,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Real-Time Power Consumption'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Power (Watts)'
        },
        beginAtZero: true
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <section className="charts-section">
      <h2>Energy Statistics</h2>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalConsumption}W</div>
            <div className="stat-label">Total Power</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeDevices}/{stats.totalDevices}</div>
            <div className="stat-label">Active Devices</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.efficiency}%</div>
            <div className="stat-label">Efficiency</div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper realtime-chart">
          <Line data={realTimeData} options={realTimeOptions} />
        </div>
        <div className="chart-wrapper">
          <Doughnut data={chartData.consumption} options={consumptionOptions} />
        </div>
        <div className="chart-wrapper">
          <Bar data={chartData.status} options={statusOptions} />
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;