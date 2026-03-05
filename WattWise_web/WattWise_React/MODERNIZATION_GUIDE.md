# WattWise IoT Dashboard - Modern Smart Home Energy Controller

## 🎯 Project Overview

WattWise is a modern, responsive React-based IoT smart home energy controller simulator. It provides real-time monitoring and control of smart devices with advanced energy management features, interactive charts, and PDF report generation.

## ✨ Key Features

### 1. **Modern Dashboard Layout**
- Clean, professional UI with card-based design
- Real-time statistics display
- Color-coded device status indicators
- Responsive grid layout that works on all devices

### 2. **Device Control Panel**
Each smart device appears as a modern device card with:
- **Device Icons**: Visual representation (💡 Light, 💨 Fan, ❄️ AC, 📺 TV, 🔥 Heater)
- **Power Display**: Current power consumption in Watts with visual bar indicator
- **Status Indicator**: Green for active, gray for off with pulsing animation
- **Toggle Control**: Smooth ON/OFF switch with visual feedback
- **Device-Specific Controls**: 
  - Fan: Speed control (0-100%)
  - AC: Temperature adjustment (16-30°C)
  - Light: Brightness control (0-100%)
  - Heater: Heat level control (0-100%)
  - TV: Volume control (0-100%)

### 3. **Automatic Power Management**
- **Power Limit Detection**: Automatically detects when device consumption exceeds 85% of rating
- **Auto Disable**: Activates cooldown period when limits are exceeded
- **Visual Alerts**: Warning banners on device cards
- **Smart Energy Control**: Re-enables devices after safe cooldown period

### 4. **Energy Monitoring Charts**
- **Real-time Power Graph**: Line chart showing total power consumption over time
- **Per-Device Usage**: Bar chart displaying power usage by individual devices
- **Live Updates**: Charts update automatically every 2 seconds
- **Professional Styling**: Interactive, responsive chart visualization

### 5. **Energy Report Generator**
- **PDF Export**: One-click PDF report generation
- **Comprehensive Data**: Includes device status, power consumption, and summary statistics
- **Professional Formatting**: Properly formatted tables and headers
- **Automatic Download**: Reports automatically save to your device

### 6. **Dashboard Statistics**
Real-time overview showing:
- Total Devices Connected
- Active Devices (currently ON)
- Total Power Consumption (Watts)
- Energy Limit Alerts (if any)

### 7. **Dark Mode Support**
- Toggle between light and dark themes
- Theme preference saved in localStorage
- Smooth transitions between themes
- Professional color schemes for both modes

## 📊 Technologies Used

### Frontend Framework
- **React** - UI library with hooks (useState, useEffect)
- **Create React App** - Development environment

### Charting & Visualization
- **Chart.js** - Modern charting library
- **react-chartjs-2** - React wrapper for Chart.js
- **CSS3** - Advanced styling with animations and gradients

### Report Generation
- **jsPDF** - PDF generation library
- **jspdf-autotable** - Automatic table generation for PDFs

### Icons & UI
- **react-icons** - Icon library (for future enhancements)
- **Emoji Icons** - Native emoji for device representation

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AddDeviceModal.js         # Modal for adding new devices
│   ├── ChartsSection.js           # Charts display section
│   ├── Dashboard.js               # Main dashboard with stats
│   ├── DashboardStats.js          # Summary statistics cards (NEW)
│   ├── DeviceCard.js              # Individual device card component
│   ├── DeviceGrid.js              # Grid layout for devices
│   ├── EnergyChart.js             # Power consumption charts (NEW)
│   ├── Header.js                  # Navigation header
│   ├── MessagesSection.js         # System messages display
│   └── ReportGenerator.js         # PDF report generation (NEW)
│
├── services/
│   ├── DeviceManager.js           # Smart device management
│   ├── MessageManager.js          # System message handling
│   └── PDFReportService.js        # PDF generation service
│
├── styles/                        # NEW: Modular CSS files
│   ├── Dashboard.css              # Dashboard styling
│   ├── DashboardStats.css         # Statistics cards styling
│   ├── DeviceCard.css             # Device card styling
│   ├── EnergyChart.css            # Chart styling
│   └── ReportGenerator.css        # Report button styling
│
├── App.js                         # Main app component
├── App.css                        # Global styles
├── index.js                       # Application entry point
└── index.css                      # Global CSS

build/                             # Production build folder
public/                            # Static assets
package.json                       # Project dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 14+ 
- npm 6+

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/SarasSinghal/WattWise_React.git
cd WattWise_React
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm start
```
The app will open at `http://localhost:3000`

4. **Build for Production**
```bash
npm run build
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "chart.js": "^4.0.0",
  "react-chartjs-2": "^5.0.0",
  "jspdf": "^2.5.0",
  "jspdf-autotable": "^3.5.0",
  "react-icons": "^4.0.0"
}
```

## 🎨 UI/UX Features

### Color Scheme
- **Primary Blue**: #3498db - Main actions and focus
- **Success Green**: #2ecc71 - Active devices and positive actions
- **Warning Orange**: #f39c12 - Warnings and limits
- **Danger Red**: #e74c3c - Critical issues and off states
- **Neutral Gray**: #95a5a6 - Disabled states

### Responsive Design
- **Desktop (1200px+)**: Full multi-column layout
- **Tablet (768px-1199px)**: 2-column grid, adjusted spacing
- **Mobile (<768px)**: Single column, optimized for touch

### Animations
- Smooth hover transitions on cards
- Power bar fill animations
- Pulse animations for active device indicators
- Fade-in animations for new elements
- Alert banner slide-in animations

## 🔄 Real-time Updates

- **Device Status**: Updates every 1 second
- **Power Consumption**: Calculated and displayed in real-time
- **Chart Data**: Updates every 2 seconds with new data points
- **Statistics**: Recalculated every 1 second for accuracy

## 📋 Component Documentation

### DashboardStats
Displays four key metric cards:
- Total devices (with count)
- Active devices (currently powered on)
- Total power consumption (in Watts)
- Energy alerts (number of limit warnings)

**Props**: `devices` (array of device objects)

### DeviceCard
Shows individual device with:
- Device icon and name
- Active/off status indicator
- Current power consumption with bar
- Device-specific controls
- Toggle ON/OFF button
- Delete option

**Props**: `device`, `onToggle`, `onDelete`, `deviceManager`, `messageManager`

### EnergyChart
Displays two interactive charts:
- Line chart: Real-time power consumption over time
- Bar chart: Power usage per device

**Props**: `devices` (array of device objects)

### ReportGenerator
Button to generate and download PDF reports containing:
- Device list with status
- Power consumption details
- Summary statistics
- Formatted tables and headers

**Props**: `devices` (array of device objects)

## ⚡ Smart Device Management

### Supported Device Types
```javascript
{
  name: string,           // Device name
  type: 'light|fan|ac|tv|heater|generic',
  powerRating: number,    // Max power in Watts
  status: boolean,        // ON/OFF state
  inCooldown: boolean,    // Cooling down flag
  calculatePowerConsumption(): number
}
```

### Power Control Logic
- Devices automatically enter cooldown when exceeding 85% of power rating
- Cooldown period prevents rapid on/off cycling
- User receives visual warning during cooldown
- Device automatically re-enables after cooldown expires

## 🎯 Usage Examples

### Adding a Device
1. Click "Add Device" button
2. Enter device name (e.g., "Living Room Light")
3. Select device type
4. Set power rating (Watts)
5. Click "Add" - device appears in grid

### Controlling a Device
1. Click device card to view details
2. Adjust device-specific controls (brightness, temperature, etc.)
3. Click toggle button to turn ON/OFF
4. Observe power consumption in real-time

### Generating a Report
1. Click "Generate Energy Report" button
2. Wait for PDF to download
3. Open PDF to view detailed energy statistics

### Switching Theme
1. Click moon/sun icon in header
2. Theme switches between light and dark modes
3. Preference is saved automatically

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔔 System Features

### Message System
- System notifications for device connections
- Power limit warnings
- Cooldown alerts
- Real-time event logging

### Error Handling
- Device limit validation
- Power rating bounds checking
- Graceful error messages to user

### Data Persistence
- Theme preference saved to localStorage
- Chart history maintained in memory during session

## 🚀 Performance Optimizations

- Efficient re-renders with React hooks
- Debounced chart updates
- CSS animations use GPU acceleration
- Optimized build size (~435KB gzipped)
- Lazy loading support for code splitting

## 📈 Future Enhancement Ideas

- [ ] Backend API integration
- [ ] Device scheduling and automation
- [ ] Historical data storage
- [ ] More chart types (pie, radar)
- [ ] Energy cost calculations
- [ ] Device grouping and scenes
- [ ] Real device API integration (MQTT, etc.)
- [ ] Multi-user support
- [ ] Mobile app version

## 🐛 Known Issues & Limitations

- Currently simulates device data (no real hardware connection)
- Chart history resets on page refresh
- Maximum 10 devices recommended for optimal performance

## 💡 Tips & Best Practices

1. **Device Naming**: Use descriptive names like "Bedroom Light" instead of "Device 1"
2. **Power Ratings**: Use realistic power ratings (e.g., LED Light: 10W, AC: 1500W)
3. **Monitoring**: Check power consumption regularly to avoid limit alerts
4. **Reports**: Generate reports before clearing devices for record keeping
5. **Theme**: Use dark mode for reduced eye strain during nighttime monitoring

## 📝 Development Guide

### Adding New Components
1. Create component file in `src/components/`
2. Create corresponding CSS in `src/styles/`
3. Import in `App.js` or parent component
4. Test in development server

### Modifying Styles
- Edit modular CSS files in `src/styles/`
- Use CSS variables for consistent theming
- Ensure mobile responsive design
- Test dark mode compatibility

### Testing
```bash
npm test                    # Run tests
npm run build               # Build for production
npm run eject               # Eject from CRA (not reversible)
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Saras Singhal**
- GitHub: [@SarasSinghal](https://github.com/SarasSinghal)
- Project: [WattWise React](https://github.com/SarasSinghal/WattWise_React)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Last Updated**: March 2026
**Version**: 2.0.0 (Modern Dashboard)
