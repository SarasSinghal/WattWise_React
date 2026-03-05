# WattWise Modern Dashboard - Component Guide

## 🎯 New Components Overview

This guide details all the new and updated components in the modernized WattWise dashboard.

---

## 📊 DashboardStats Component

### Purpose
Displays real-time summary statistics of all connected devices as visually appealing cards.

### Location
`src/components/DashboardStats.js` | Styles: `src/styles/DashboardStats.css`

### Props
```javascript
{
  devices: Array<SmartDevice>  // Array of all devices
}
```

### Displayed Metrics
1. **Total Devices**: Count of all connected devices (📱)
2. **Active Devices**: Count of devices currently turned ON (✓)
3. **Power Usage**: Total power consumption in Watts (⚡)
4. **Alerts**: Number of devices exceeding power limits (⚠️)

### Features
- Real-time metric calculations
- Color-coded cards (Blue, Green, Orange, Red)
- Hover animation effects
- Responsive grid layout
- Dark mode support

### Usage Example
```javascript
import DashboardStats from './components/DashboardStats';

<DashboardStats devices={devicesList} />
```

---

## ⚡ DeviceCard Component (Updated)

### Purpose
Displays and controls individual smart devices with real-time power monitoring.

### Location
`src/components/DeviceCard.js` | Styles: `src/styles/DeviceCard.css`

### Props
```javascript
{
  device: SmartDevice,
  onToggle: Function,
  onDelete: Function,
  deviceManager: DeviceManager,
  messageManager: MessageManager
}
```

### Features

#### Visual Elements
- **Device Icon**: Emoji representation of device type
- **Status Indicator**: Pulsing light showing active/inactive state
- **Power Bar**: Visual progress bar showing power consumption level
- **Alert Banner**: Warning when power consumption is high

#### Interactions
- **Toggle Button**: Turn device ON/OFF
- **Delete Button**: Remove device from dashboard
- **Device Controls**: Type-specific sliders (brightness, temperature, speed, volume)

#### Controls by Device Type
```javascript
light:   Brightness slider (0-100%)
fan:     Speed slider (0-100%)
ac:      Temperature slider (16-30°C)
heater:  Heat level slider (0-100%)
tv:      Volume slider (0-100%)
generic: Power level slider (0-100%)
```

#### Power Indicators
- **Green Bar (Low)**: 0-50% of power rating
- **Orange Bar (Medium)**: 50-85% of power rating
- **Red Bar (High)**: 85-100% of power rating

#### Cooldown States
- Shows cooling down message when device exceeds limits
- Button disabled during cooldown period
- Visual styling change to indicate locked state

### Styling Classes
- `.device-card` - Main card container
- `.device-card.active` - Green border for active devices
- `.device-card.inactive` - Gray styling for off devices
- `.power-bar` - Power consumption visualization
- `.toggle-btn` - ON/OFF button
- `.delete-btn` - Remove device button

### Usage Example
```javascript
<DeviceCard
  device={device}
  onToggle={handleToggleDevice}
  onDelete={handleDeleteDevice}
  deviceManager={deviceManager}
  messageManager={messageManager}
/>
```

---

## 📈 EnergyChart Component (New)

### Purpose
Visualizes real-time power consumption using interactive Chart.js charts.

### Location
`src/components/EnergyChart.js` | Styles: `src/styles/EnergyChart.css`

### Props
```javascript
{
  devices: Array<SmartDevice>  // Array of all devices
}
```

### Features

#### Chart 1: Real-Time Power Graph
- **Type**: Line chart
- **Updates**: Every 2 seconds
- **Timeframe**: Last 20 data points (~40 seconds)
- **Shows**: Total system power consumption over time
- **Colors**: Blue line with light blue fill
- **Interactive**: Hover to see exact values

#### Chart 2: Per-Device Usage
- **Type**: Bar chart
- **Updates**: Real-time with device changes
- **Shows**: Current power usage for each device
- **Colors**: Multi-colored bars (Blue, Green, Orange, Red, Purple)
- **Interactive**: Hover for device details

### Data Management
- Maintains rolling 20-point history for time-series data
- Automatically removes oldest data points as new ones arrive
- Efficiently updates without full re-renders

### Responsive Behavior
- Two-column layout on desktop (400px+ width)
- Single column on tablets and mobile
- Full responsive grid system

### Usage Example
```javascript
import EnergyChart from './components/EnergyChart';

<EnergyChart devices={devicesList} />
```

### Chart Configuration
```javascript
// Line Chart Options
{
  responsive: true,
  tension: 0.3,
  fill: true,
  pointRadius: 4
}

// Bar Chart Options
{
  responsive: true,
  borderRadius: 5,
  categoryPercentage: 0.8
}
```

---

## 📄 ReportGenerator Component (New)

### Purpose
Generates and downloads professional PDF reports of energy consumption data.

### Location
`src/components/ReportGenerator.js` | Styles: `src/styles/ReportGenerator.css`

### Props
```javascript
{
  devices: Array<SmartDevice>  // Array of all devices
}
```

### Features

#### Report Contents
1. **Header Section**
   - Report title: "WattWise IoT Dashboard"
   - Generation timestamp
   - Professional branding

2. **Energy Summary**
   - Total devices connected
   - Active devices count
   - Total power consumption
   - Average power per device

3. **Device Details Table**
   - Device name
   - Device type
   - Current status (Active/Off)
   - Current power usage (Watts)
   - Power rating (Watts)

#### Formatting
- Professional color scheme (Blue/White)
- Alternating row colors for readability
- Automatic page breaks for long device lists
- Page numbering on multi-page reports
- Responsive table layout

#### Download Behavior
- Automatically triggers browser download
- Filename format: `WattWise-Energy-Report-YYYY-MM-DD.pdf`
- Works in all modern browsers

### Libraries Used
- **jsPDF**: PDF generation engine
- **jspdf-autotable**: Automatic table creation

### Usage Example
```javascript
import ReportGenerator from './components/ReportGenerator';

<ReportGenerator devices={devicesList} />
```

### PDF Configuration
```javascript
{
  orientation: 'portrait',
  format: 'a4',
  margins: { top: 10, left: 15, right: 15, bottom: 10 },
  pageWidth: 210,
  pageHeight: 297
}
```

---

## 🎨 Updated Dashboard Component

### Location
`src/components/Dashboard.js` | Styles: `src/styles/Dashboard.css`

### Enhancements
- Added dashboard title
- Improved stat card styling
- Color-coded cards for different metrics
- Smooth hover animations
- Better visual hierarchy

### Stat Cards
Each card shows:
- **Icon**: Emoji representation (⚡, ✓, ⚙️, 📱)
- **Label**: Metric name
- **Value**: Current metric value
- **Subtext**: Additional context

---

## 🎨 CSS Architecture

### Modular CSS Structure
All component styling is organized in `src/styles/` directory:

#### Files
- `DashboardStats.css` - Statistics cards styling
- `DeviceCard.css` - Device card components styling
- `EnergyChart.css` - Chart containers styling
- `ReportGenerator.css` - Report button styling
- `Dashboard.css` - Main dashboard layout

#### Global Styling
- `App.css` - Global styles, theme variables, responsive breakpoints

### CSS Variables (in App.css)
```css
--primary-color: #3b82f6        /* Main color */
--success-color: #10b981        /* Positive states */
--warning-color: #f59e0b        /* Warnings */
--danger-color: #ef4444         /* Errors/Off states */
--background-color: #ffffff     /* Light mode bg */
--text-primary: #111827         /* Main text */
--text-secondary: #6b7280       /* Secondary text */
```

### Dark Mode Support
All components include dark mode CSS:
```css
.dark-mode .component-class {
  /* Dark mode specific styles */
}
```

---

## 🔄 Data Flow

```
App.js (Main Component)
  ↓
├─ Header (Navigation & Theme)
├─ Dashboard (Stats Overview)
├─ DashboardStats (Summary Cards) [NEW]
├─ ReportGenerator (PDF Export) [NEW]
├─ DeviceGrid
│  └─ DeviceCard (Device Controls) [UPDATED]
├─ EnergyChart (Charts) [NEW]
├─ ChartsSection (Legacy Charts)
└─ MessagesSection (System Messages)

DeviceManager
  ├─ Device state management
  ├─ Power calculations
  └─ Cooldown logic

MessageManager
  ├─ System notifications
  └─ Event logging
```

---

## ⚡ Real-Time Updates

### Update Intervals
- **Device Status**: Every 1 second
- **Power Calculations**: Every 1 second
- **Chart Updates**: Every 2 seconds
- **Statistics**: Every 1 second
- **UI Renders**: React optimized

### State Management
All components use React Hooks:
- `useState` - Local component state
- `useEffect` - Side effects and subscriptions

---

## 🎯 Performance Considerations

### Optimization Strategies
1. **Efficient Renders**: Only re-render when necessary
2. **Memoization**: Calculated values cached when possible
3. **Event Throttling**: Only update charts every 2 seconds
4. **CSS Animations**: GPU-accelerated transitions
5. **Bundle Size**: ~435KB gzipped

### Recommended Limits
- Maximum 10 devices for smooth performance
- Maximum 100 chart data points before memory concerns
- Recommended 1920x1080 or higher resolution for desktop

---

## 🧪 Testing Components

### Unit Testing
Test individual components:
```bash
npm test
```

### Manual Testing
1. **DashboardStats**: Verify metrics update in real-time
2. **DeviceCard**: Test toggle, delete, and controls
3. **EnergyChart**: Verify charts update smoothly
4. **ReportGenerator**: Generate and validate PDF

---

## 🚀 Integration Checklist

- ✅ Components created and styled
- ✅ Chart.js integration complete
- ✅ PDF generation working
- ✅ Real-time updates functional
- ✅ Dark mode implemented
- ✅ Responsive design verified
- ✅ Build tested and passes
- ✅ GitHub deployment ready

---

## 📋 Component Prop Validation

All components use loose prop validation. For stricter validation, consider adding PropTypes:

```javascript
import PropTypes from 'prop-types';

DashboardStats.propTypes = {
  devices: PropTypes.arrayOf(PropTypes.object).isRequired
};
```

---

## 🔧 Troubleshooting

### Chart Not Showing
- Verify devices array is not empty
- Check browser console for errors
- Ensure chart.js is installed

### PDF Download Issues
- Check browser popup blocker
- Verify jsPDF is properly installed
- Ensure device list has data

### Styling Not Applied
- Clear browser cache
- Rebuild project: `npm run build`
- Verify CSS import paths

### Real-time Updates Slow
- Check for performance issues in DevTools
- Reduce number of devices
- Close unnecessary browser tabs

---

## 📚 References

### Libraries
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [react-chartjs-2 Guide](https://react-chartjs-2.js.org/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [React Hooks Reference](https://react.dev/reference/react)

### Frameworks
- [React Documentation](https://react.dev/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

**Last Updated**: March 2026
**Version**: 2.0.0
