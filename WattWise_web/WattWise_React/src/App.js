import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DeviceGrid from './components/DeviceGrid';
import ChartsSection from './components/ChartsSection';
import MessagesSection from './components/MessagesSection';
import { DeviceManager } from './services/DeviceManager';
import { MessageManager } from './services/MessageManager';
import { PDFReportService } from './services/PDFReportService';

function App() {
  const [deviceManager] = useState(() => new DeviceManager());
  const [messageManager] = useState(() => new MessageManager());
  const [pdfService] = useState(() => new PDFReportService());
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('wattwise_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme === 'dark' ? 'dark-mode' : '';
    }

    // Initialize sample devices
    deviceManager.initializeSampleDevices();

    // Add initial system messages
    messageManager.addMessage('system', 'WattWise', 'Smart IoT Energy Controller initialized');
    messageManager.addMessage('system', 'WattWise', 'Sample devices loaded and ready for monitoring');

    // Make messageManager globally available for services
    window.messageManager = messageManager;

    // Start real-time updates
    const interval = setInterval(() => {
      deviceManager.updateEnergyConsumption();
    }, 1000);

    return () => clearInterval(interval);
  }, [deviceManager, messageManager]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('wattwise_theme', newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-mode' : '';
  };

  const handleGenerateReport = () => {
    pdfService.generateEnergyReport(deviceManager, messageManager);
  };

  return (
    <div className="App">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onGenerateReport={handleGenerateReport}
      />
      <main className="main-container">
        <Dashboard deviceManager={deviceManager} />
        <DeviceGrid deviceManager={deviceManager} messageManager={messageManager} />
        <ChartsSection deviceManager={deviceManager} />
        <MessagesSection messageManager={messageManager} />
      </main>
    </div>
  );
}

export default App;