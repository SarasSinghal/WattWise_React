/**
 * SmartDevice class representing a smart device
 */
export class SmartDevice {
  constructor(name, type, powerRating) {
    this.id = this.generateId();
    this.name = name;
    this.type = type;
    this.powerRating = powerRating;
    this.status = false; // ON/OFF
    this.createdAt = new Date();
    this.inCooldown = false;
    this.cooldownEnd = null;
    this.lastVariationAlert = null; // Track last power variation alert time

    // Type-specific controls
    this.controls = this.initializeControls(type);
  }

  /**
   * Initialize type-specific controls
   */
  initializeControls(type) {
    const controls = {};

    switch(type) {
      case 'fan':
        controls.speed = 50; // 0-100%
        break;
      case 'ac':
        controls.temperature = 22; // Celsius
        break;
      case 'light':
        controls.brightness = 50; // 0-100%
        controls.color = '#ffffff'; // Default white
        break;
      case 'heater':
        controls.heatLevel = 50; // 0-100%
        break;
      case 'tv':
        controls.volume = 50; // 0-100%
        break;
      case 'generic':
        controls.power = 50; // 0-100%
        break;
      default:
        controls.power = 50; // Default power control for unknown types
        break;
    }

    return controls;
  }

  /**
   * Generate unique device ID
   */
  generateId() {
    return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get device icon
   */
  getIcon() {
    switch(this.type) {
      case 'fan': return '💨';
      case 'ac': return '❄️';
      case 'light': return '💡';
      case 'heater': return '🔥';
      case 'tv': return '📺';
      case 'generic': return '⚙️';
      default: return '📱';
    }
  }

  /**
   * Calculate actual power consumption based on device type and controls
   */
  calculatePowerConsumption() {
    if (!this.status || this.inCooldown) return 0;

    let baseConsumption = this.powerRating;
    const controls = this.controls;

    // Adjust consumption based on type-specific controls
    switch(this.type) {
      case 'fan':
        baseConsumption = (this.powerRating * controls.speed) / 100;
        break;
      case 'ac':
        // AC consumes more power at extreme temperatures
        const tempDiff = Math.abs(controls.temperature - 20);
        baseConsumption = this.powerRating * (0.5 + (tempDiff / 20) * 0.5);
        break;
      case 'light':
        baseConsumption = (this.powerRating * controls.brightness) / 100;
        break;
      case 'heater':
        baseConsumption = (this.powerRating * controls.heatLevel) / 100;
        break;
      case 'tv':
        // TV power scales with volume (more power for audio)
        baseConsumption = this.powerRating * (0.7 + (controls.volume / 100) * 0.3);
        break;
      case 'generic':
        baseConsumption = (this.powerRating * controls.power) / 100;
        break;
      default:
        baseConsumption = this.powerRating * 0.5; // Default to 50% power for unknown types
        break;
    }

    // Add realistic power fluctuation (variation in real-time)
    // Time-based oscillation for smooth variation
    const timeOscillation = Math.sin(Date.now() / 1000) * 0.08; // ±8% based on time

    // Random noise for realistic variation
    const randomNoise = (Math.random() - 0.5) * 0.15; // ±7.5% random

    // Apply variation factor (total: ±15.5% variation)
    const variationFactor = 1 + timeOscillation + randomNoise;
    const actualConsumption = baseConsumption * variationFactor;

    // Check for significant power variation (>10%) and notify
    this.checkPowerVariation(baseConsumption, actualConsumption);

    return Math.round(actualConsumption);
  }

  /**
   * Check for significant power variation and show notification
   */
  checkPowerVariation(baseConsumption, actualConsumption) {
    if (baseConsumption === 0) return;

    const variationPercent = Math.abs((actualConsumption - baseConsumption) / baseConsumption) * 100;

    // Only notify if variation exceeds 10% and we haven't notified recently (avoid spam)
    if (variationPercent > 10) {
      const now = Date.now();
      if (!this.lastVariationAlert || (now - this.lastVariationAlert) > 5000) { // 5 second cooldown
        this.lastVariationAlert = now;

        const direction = actualConsumption > baseConsumption ? 'more' : 'less';
        const message = `${this.name} consuming ${variationPercent.toFixed(1)}% ${direction} power than required (${Math.round(actualConsumption)}W vs ${Math.round(baseConsumption)}W)`;

        // Add to activity log
        if (typeof window.messageManager !== 'undefined') {
          window.messageManager.addMessage('power_variation', this.name, message);
        }
      }
    }
  }

  /**
   * Toggle device status
   */
  toggle() {
    if (this.inCooldown) {
      return false; // Cannot toggle during cooldown
    }
    this.status = !this.status;
    return true;
  }

  /**
   * Update device control
   */
  updateControl(controlName, value) {
    if (controlName in this.controls) {
      this.controls[controlName] = this.constrainValue(this.type, controlName, value);
      return true;
    }
    return false;
  }

  /**
   * Constrain control values within acceptable ranges
   */
  constrainValue(type, controlName, value) {
    const numValue = Number(value);

    switch(controlName) {
      case 'speed':
      case 'brightness':
      case 'heatLevel':
      case 'volume':
      case 'power':
        return Math.max(0, Math.min(100, numValue));
      case 'temperature':
        return Math.max(16, Math.min(30, numValue));
      default:
        return numValue;
    }
  }

  /**
   * Activate cooldown period
   */
  activateCooldown(duration) {
    this.inCooldown = true;
    this.status = false; // Turn off device
    this.cooldownEnd = Date.now() + (duration * 1000);
  }

  /**
   * Check if cooldown has expired
   */
  checkCooldown() {
    if (this.inCooldown && Date.now() >= this.cooldownEnd) {
      this.inCooldown = false;
      this.cooldownEnd = null;
      return true; // Cooldown expired
    }
    return false;
  }
}

/**
 * Device Manager - handles device operations
 */
export class DeviceManager {
  constructor() {
    this.devices = [];
    this.powerThreshold = 5000;
    this.cooldownTime = 30;
    this.energyConsumed = 0; // kWh
    this.lastEnergyUpdate = Date.now();
  }

  /**
   * Add a new device
   */
  addDevice(name, type, powerRating) {
    if (!name || !type || !powerRating) {
      throw new Error('All device parameters are required');
    }

    if (powerRating <= 0) {
      throw new Error('Power rating must be greater than 0');
    }

    const device = new SmartDevice(name, type, powerRating);
    this.devices.push(device);
    this.saveDevices();
    return device;
  }

  /**
   * Remove a device
   */
  removeDevice(deviceId) {
    const index = this.devices.findIndex(d => d.id === deviceId);
    if (index !== -1) {
      this.devices.splice(index, 1);
      this.saveDevices();
      return true;
    }
    return false;
  }

  /**
   * Get all devices
   */
  getAllDevices() {
    return this.devices;
  }

  /**
   * Get device by ID
   */
  getDeviceById(deviceId) {
    return this.devices.find(d => d.id === deviceId);
  }

  /**
   * Clear all devices
   */
  clearAllDevices() {
    this.devices = [];
    this.saveDevices();
  }

  /**
   * Get total power consumption
   */
  getTotalPowerConsumption() {
    return this.devices.reduce((total, device) => {
      return total + device.calculatePowerConsumption();
    }, 0);
  }

  /**
   * Get active device count
   */
  getActiveDeviceCount() {
    return this.devices.filter(d => d.status && !d.inCooldown).length;
  }

  /**
   * Check power threshold and shutdown devices if exceeded
   */
  checkPowerThreshold() {
    const totalPower = this.getTotalPowerConsumption();

    if (totalPower > this.powerThreshold) {
      // Find devices to shutdown (prioritize high-power devices)
      const exceedingDevices = this.devices
        .filter(d => d.status && !d.inCooldown)
        .sort((a, b) => b.calculatePowerConsumption() - a.calculatePowerConsumption());

      if (exceedingDevices.length > 0) {
        const deviceToShutdown = exceedingDevices[0];
        deviceToShutdown.activateCooldown(this.cooldownTime);

        // Add message
        if (typeof window.messageManager !== 'undefined') {
          window.messageManager.addMessage('threshold', deviceToShutdown.name,
            `Total power: ${totalPower}W > ${this.powerThreshold}W threshold`);
        }

        return [deviceToShutdown];
      }
    }

    return [];
  }

  /**
   * Update energy consumption tracking
   */
  updateEnergyConsumption() {
    const now = Date.now();
    const timeDiffHours = (now - this.lastEnergyUpdate) / (1000 * 60 * 60); // Convert to hours

    const currentPowerWatts = this.getTotalPowerConsumption();
    const energyConsumedKWh = (currentPowerWatts * timeDiffHours) / 1000;

    this.energyConsumed += energyConsumedKWh;
    this.lastEnergyUpdate = now;

    // Check power threshold and shutdown devices if needed
    this.checkPowerThreshold();

    // Check cooldown expiration
    this.devices.forEach(device => {
      if (device.checkCooldown()) {
        if (typeof window.messageManager !== 'undefined') {
          window.messageManager.addMessage('cooldown', device.name, 'cooldown expired, device available');
        }
      }
    });
  }

  /**
   * Get total energy consumed
   */
  getTotalEnergyConsumed() {
    return this.energyConsumed;
  }

  /**
   * Initialize sample devices
   */
  initializeSampleDevices() {
    if (this.devices.length === 0) {
      this.addDevice('Living Room AC', 'ac', 1500);
      this.addDevice('Bedroom Fan', 'fan', 75);
      this.addDevice('Kitchen Light', 'light', 60);
      this.addDevice('Office Heater', 'heater', 1200);
    }
  }

  /**
   * Save devices to localStorage
   */
  saveDevices() {
    try {
      const deviceData = this.devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type,
        powerRating: device.powerRating,
        status: device.status,
        controls: device.controls,
        createdAt: device.createdAt,
        inCooldown: device.inCooldown,
        cooldownEnd: device.cooldownEnd
      }));
      localStorage.setItem('wattwise_devices', JSON.stringify(deviceData));
    } catch (error) {
      console.error('Failed to save devices:', error);
    }
  }

  /**
   * Load devices from localStorage
   */
  loadDevices() {
    try {
      const deviceData = JSON.parse(localStorage.getItem('wattwise_devices') || '[]');
      this.devices = deviceData.map(data => {
        const device = new SmartDevice(data.name, data.type, data.powerRating);
        device.id = data.id;
        device.status = data.status;
        device.controls = data.controls;
        device.createdAt = new Date(data.createdAt);
        device.inCooldown = data.inCooldown;
        device.cooldownEnd = data.cooldownEnd;
        return device;
      });
    } catch (error) {
      console.error('Failed to load devices:', error);
      this.initializeSampleDevices();
    }
  }
}