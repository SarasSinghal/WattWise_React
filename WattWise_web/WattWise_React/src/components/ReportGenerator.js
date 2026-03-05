import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/ReportGenerator.css';

const ReportGenerator = ({ devices }) => {
  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Set colors and fonts
    const primaryColor = [52, 152, 219]; // Blue
    const lightGray = [240, 240, 240];
    const darkGray = [44, 62, 80];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('WattWise IoT Dashboard', 15, 20);

    // Report Info
    doc.setTextColor(...darkGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 15, 45);

    // Summary Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Energy Summary', 15, 58);

    const totalPower = devices.reduce((sum, d) => sum + d.calculatePowerConsumption(), 0);
    const activeDevices = devices.filter(d => d.status).length;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Devices: ${devices.length}`, 15, 68);
    doc.text(`Active Devices: ${activeDevices}`, 15, 75);
    doc.text(`Total Power Consumption: ${totalPower.toFixed(2)} W`, 15, 82);
    doc.text(`Average Power per Device: ${(totalPower / devices.length).toFixed(2)} W`, 15, 89);

    // Device Details Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Device Details', 15, 105);

    const tableData = devices.map(device => [
      device.name,
      device.type.charAt(0).toUpperCase() + device.type.slice(1),
      device.status ? 'Active' : 'Off',
      device.calculatePowerConsumption().toFixed(2) + ' W',
      device.powerRating + ' W'
    ]);

    doc.autoTable({
      head: [['Device Name', 'Type', 'Status', 'Current Usage', 'Power Rating']],
      body: tableData,
      startY: 110,
      theme: 'grid',
      headerStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: lightGray
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 50 },
        1: { halign: 'center', cellWidth: 30 },
        2: { halign: 'center', cellWidth: 25 },
        3: { halign: 'right', cellWidth: 35 },
        4: { halign: 'right', cellWidth: 35 }
      }
    });

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i < doc.internal.pages.length; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`WattWise-Energy-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="report-generator">
      <button
        className="generate-report-btn"
        onClick={generatePDFReport}
        title="Generate and download energy report"
      >
        <span>📥</span>
        <span>Generate Energy Report</span>
      </button>
      <p className="report-info">
        Download a detailed PDF report of all connected devices and their power consumption.
      </p>
    </div>
  );
};

export default ReportGenerator;
