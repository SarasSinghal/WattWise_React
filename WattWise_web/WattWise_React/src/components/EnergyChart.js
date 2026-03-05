import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import '../styles/EnergyChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EnergyChart = ({ devices }) => {
  const [timeData, setTimeData] = useState([]);
  const [consumptionHistory, setConsumptionHistory] = useState([]);
  const [deviceLabels, setDeviceLabels] = useState([]);
  const [deviceConsumption, setDeviceConsumption] = useState([]);

  // Update real-time consumption history
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const totalConsumption = devices.reduce((sum, d) => sum + d.calculatePowerConsumption(), 0);

      setTimeData(prev => {
        const updated = [...prev, timeLabel];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });

      setConsumptionHistory(prev => {
        const updated = [...prev, totalConsumption];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [devices]);

  // Update per-device consumption
  useEffect(() => {
    const labels = devices.map(d => d.name);
    const consumption = devices.map(d => d.calculatePowerConsumption());

    setDeviceLabels(labels);
    setDeviceConsumption(consumption);
  }, [devices]);

  const lineChartData = {
    labels: timeData,
    datasets: [
      {
        label: 'Total Power Consumption (W)',
        data: consumptionHistory,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const barChartData = {
    labels: deviceLabels,
    datasets: [
      {
        label: 'Power Usage (W)',
        data: deviceConsumption,
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#f39c12',
          '#e74c3c',
          '#9b59b6'
        ],
        borderColor: [
          '#2980b9',
          '#27ae60',
          '#d68910',
          '#c0392b',
          '#8e44ad'
        ],
        borderWidth: 1,
        borderRadius: 5
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#2c3e50',
          font: { size: 12 }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#7f8c8d'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          color: '#7f8c8d'
        },
        grid: {
          display: false
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#2c3e50',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#7f8c8d'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          color: '#7f8c8d'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="energy-chart-section">
      <div className="chart-container">
        <div className="chart-title">
          <h3>Real-time Power Consumption (W)</h3>
        </div>
        <div className="chart">
          {timeData.length > 0 ? (
            <Line data={lineChartData} options={lineChartOptions} />
          ) : (
            <p className="no-data">Waiting for data...</p>
          )}
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">
          <h3>Power Usage by Device</h3>
        </div>
        <div className="chart">
          {deviceLabels.length > 0 ? (
            <Bar data={barChartData} options={barChartOptions} />
          ) : (
            <p className="no-data">No devices connected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnergyChart;
