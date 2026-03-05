import html2pdf from 'html2pdf.js';

/**
 * PDF Report Service - generates energy reports for React app
 */
export class PDFReportService {
  constructor() {
    this.reportTitle = 'WattWise Energy Report';
  }
  generateEnergyReport(deviceManager, messageManager) {
    const devices = deviceManager.getAllDevices();

    if (devices.length === 0) {
      messageManager.addMessage('system', 'PDF Report', 'No devices to generate report');
      return;
    }

    // Create report HTML content
    const reportHTML = this.createReportHTML(devices, deviceManager);

    // Configure PDF options
    const opt = {
      margin: 10,
      filename: `WattWise-Energy-Report-${this.getFormattedDate()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    // Generate PDF
    html2pdf().set(opt).from(reportHTML).save();

    messageManager.addMessage('system', 'PDF Report', 'Energy report generated successfully!');
  }

  /**
   * Create HTML content for report
   */
  createReportHTML(devices, deviceManager) {
    const totalConsumption = deviceManager.getTotalPowerConsumption();
    const currentTime = new Date().toLocaleString();
    const activeDevices = devices.filter(d => d.status && !d.inCooldown).length;

    // HTML template
    const html = `
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #fff;
            }
            .report-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }
            .report-header h1 {
                margin: 0;
                color: #2563eb;
                font-size: 28px;
            }
            .report-header .subtitle {
                color: #666;
                margin-top: 5px;
                font-size: 14px;
            }
            .summary-section {
                background-color: #f0f4f8;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-top: 15px;
            }
            .summary-item {
                background-color: #fff;
                padding: 15px;
                border-left: 4px solid #2563eb;
                border-radius: 4px;
            }
            .summary-label {
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            .summary-value {
                color: #2563eb;
                font-size: 20px;
                font-weight: bold;
            }
            .devices-section h2 {
                color: #2563eb;
                font-size: 18px;
                margin-top: 30px;
                margin-bottom: 15px;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 10px;
            }
            .device-item {
                background-color: #f9fafb;
                padding: 15px;
                margin-bottom: 12px;
                border-radius: 6px;
                border-left: 3px solid #10b981;
                page-break-inside: avoid;
            }
            .device-header {
                display: grid;
                grid-template-columns: 1fr auto;
                align-items: center;
                margin-bottom: 10px;
            }
            .device-name {
                font-size: 14px;
                font-weight: bold;
                color: #1a1a1a;
            }
            .device-icon {
                font-size: 20px;
            }
            .device-type {
                color: #888;
                font-size: 11px;
                margin-bottom: 8px;
            }
            .device-details {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                font-size: 12px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
            }
            .detail-label {
                color: #666;
            }
            .detail-value {
                font-weight: bold;
                color: #1a1a1a;
            }
            .status-on {
                color: #10b981;
            }
            .status-off {
                color: #ef4444;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #ddd;
                text-align: center;
                font-size: 11px;
                color: #888;
            }
            .page-break {
                page-break-after: always;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
                font-size: 12px;
            }
            th {
                background-color: #2563eb;
                color: white;
                padding: 10px;
                text-align: left;
                font-weight: bold;
            }
            td {
                padding: 10px;
                border-bottom: 1px solid #e0e0e0;
            }
            tr:last-child td {
                border-bottom: none;
            }
            .power-consumption {
                background-color: #eff6ff;
                color: #2563eb;
                font-weight: bold;
            }
        </style>

        <div class="report-header">
            <h1>⚡ WattWise Energy Report</h1>
            <p class="subtitle">Smart IoT Energy Controller Simulator</p>
            <p class="subtitle">Generated on: ${currentTime}</p>
        </div>

        <div class="summary-section">
            <h2 style="color: #2563eb; margin-top: 0;">Energy Summary</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">Total Power Usage</div>
                    <div class="summary-value">${totalConsumption} W</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Active Devices</div>
                    <div class="summary-value">${activeDevices}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Total Devices</div>
                    <div class="summary-value">${devices.length}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Power Threshold</div>
                    <div class="summary-value">${deviceManager.powerThreshold} W</div>
                </div>
            </div>
        </div>

        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Connected Devices</h2>

        <table>
            <thead>
                <tr>
                    <th>Device Name</th>
                    <th>Type</th>
                    <th>Power Rating</th>
                    <th>Current consumption</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${this.generateDeviceRows(devices)}
            </tbody>
        </table>

        <div class="devices-section">
            ${this.generateDetailedDeviceCards(devices, deviceManager)}
        </div>

        <div class="footer">
            <p>This report was automatically generated by WattWise Energy Controller Simulator.</p>
            <p>For more information, visit your dashboard.</p>
        </div>
    `;

    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    return tempDiv;
  }

  /**
   * Generate device table rows
   */
  generateDeviceRows(devices) {
    return devices.map(device => {
      const consumption = device.calculatePowerConsumption();
      const statusClass = device.status ? 'status-on' : 'status-off';
      const statusText = device.status ? 'ON' : 'OFF';

      return `
          <tr>
              <td><strong>${device.getIcon()} ${device.name}</strong></td>
              <td>${this.formatDeviceType(device.type)}</td>
              <td>${device.powerRating} W</td>
              <td class="power-consumption">${consumption} W</td>
              <td><span class="${statusClass}"><strong>${statusText}</strong></span></td>
          </tr>
      `;
    }).join('');
  }

  /**
   * Generate detailed device cards for PDF
   */
  generateDetailedDeviceCards(devices, deviceManager) {
    return devices.map((device, index) => {
      const consumption = device.calculatePowerConsumption();
      const percentage = deviceManager.getTotalPowerConsumption() > 0
        ? ((consumption / deviceManager.getTotalPowerConsumption()) * 100).toFixed(1)
        : 0;

      let controlDetails = '';

      switch(device.type) {
        case 'fan':
          controlDetails = `<div class="detail-row"><span class="detail-label">Speed:</span> <span class="detail-value">${device.controls.speed}%</span></div>`;
          break;
        case 'ac':
          controlDetails = `<div class="detail-row"><span class="detail-label">Temperature:</span> <span class="detail-value">${device.controls.temperature}°C</span></div>`;
          break;
        case 'light':
          controlDetails = `<div class="detail-row"><span class="detail-label">Brightness:</span> <span class="detail-value">${device.controls.brightness}%</span></div>`;
          break;
        case 'heater':
          controlDetails = `<div class="detail-row"><span class="detail-label">Heat Level:</span> <span class="detail-value">${device.controls.heatLevel}%</span></div>`;
          break;
        case 'tv':
          controlDetails = `<div class="detail-row"><span class="detail-label">Volume:</span> <span class="detail-value">${device.controls.volume}%</span></div>`;
          break;
        case 'generic':
          controlDetails = `<div class="detail-row"><span class="detail-label">Power:</span> <span class="detail-value">${device.controls.power}%</span></div>`;
          break;
        default:
          controlDetails = `<div class="detail-row"><span class="detail-label">Status:</span> <span class="detail-value">${device.status ? 'Active' : 'Inactive'}</span></div>`;
          break;
      }

      const statusClass = device.status ? 'status-on' : 'status-off';

      return `
          <div class="device-item">
              <div class="device-header">
                  <div>
                      <div class="device-name">${device.getIcon()} ${device.name}</div>
                      <div class="device-type">${this.formatDeviceType(device.type)}</div>
                  </div>
                  <span class="${statusClass}"><strong>${device.status ? 'ON' : 'OFF'}</strong></span>
              </div>
              <div class="device-details">
                  <div class="detail-row">
                      <span class="detail-label">Power Rating:</span>
                      <span class="detail-value">${device.powerRating} W</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Current Draw:</span>
                      <span class="detail-value">${consumption} W (${percentage}%)</span>
                  </div>
                  ${controlDetails}
                  <div class="detail-row">
                      <span class="detail-label">Created:</span>
                      <span class="detail-value">${device.createdAt.toLocaleDateString()}</span>
                  </div>
              </div>
          </div>
      `;
    }).join('');
  }

  /**
   * Format device type for display
   */
  formatDeviceType(type) {
    const types = {
      fan: 'Fan',
      ac: 'Air Conditioner',
      light: 'Light',
      heater: 'Heater',
      tv: 'Television',
      generic: 'Generic Device'
    };
    return types[type] || type;
  }

  /**
   * Get formatted date for filename
   */
  getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}${minutes}`;
  }
}