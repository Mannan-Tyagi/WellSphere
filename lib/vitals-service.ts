/**
 * Service for handling vital signs data and wearable device integrations
 */

import { format } from 'date-fns';

// Supported wearable device types
export const SUPPORTED_DEVICES = [
  'Apple Watch',
  'Fitbit',
  'Samsung Galaxy Watch',
  'Garmin',
  'Oura Ring',
  'Withings',
  'Google Pixel Watch',
  'Amazfit',
  'Xiaomi Mi Band',
  'Polar'
];

// Available vital metrics
export const VITAL_METRICS = {
  bloodPressure: {
    name: 'Blood Pressure',
    units: 'mmHg',
    defaultThresholds: {
      warning: { systolic: 130, diastolic: 85 },
      critical: { systolic: 140, diastolic: 90 }
    }
  },
  heartRate: {
    name: 'Heart Rate',
    units: 'bpm',
    defaultThresholds: {
      warning: { min: 50, max: 90 },
      critical: { min: 45, max: 100 }
    }
  },
  oxygenSaturation: {
    name: 'Oxygen Saturation',
    units: '%',
    defaultThresholds: {
      warning: { min: 94 },
      critical: { min: 90 }
    }
  },
  temperature: {
    name: 'Temperature',
    units: '°F',
    defaultThresholds: {
      warning: { min: 97.0, max: 99.5 },
      critical: { min: 96.0, max: 100.4 }
    }
  },
  hydrationLevel: {
    name: 'Hydration Level',
    units: '%',
    defaultThresholds: {
      warning: { min: 60 },
      critical: { min: 50 }
    }
  }
};

// Interface for vital reading
export interface VitalReading {
  type: string;
  value: any;
  timestamp: Date;
  source: string;
  deviceId?: string;
}

// Check if a vital reading is in critical range
export const isCriticalReading = (reading: VitalReading, thresholds: any): boolean => {
  const metric = reading.type;
  const value = reading.value;
  
  if (metric === 'bloodPressure') {
    const systolic = typeof value === 'string' ? parseInt(value.split('/')[0]) : value.systolic;
    const diastolic = typeof value === 'string' ? parseInt(value.split('/')[1]) : value.diastolic;
    
    return systolic >= thresholds.bloodPressure.critical.systolic || 
           diastolic >= thresholds.bloodPressure.critical.diastolic;
  }
  
  const metricThresholds = thresholds[metric]?.critical;
  if (!metricThresholds) return false;
  
  if (metricThresholds.min && value < metricThresholds.min) return true;
  if (metricThresholds.max && value > metricThresholds.max) return true;
  
  return false;
};

// Check if a vital reading is in warning range (but not critical)
export const isWarningReading = (reading: VitalReading, thresholds: any): boolean => {
  const metric = reading.type;
  const value = reading.value;
  
  // If it's already critical, it's not just a warning
  if (isCriticalReading(reading, thresholds)) return false;
  
  if (metric === 'bloodPressure') {
    const systolic = typeof value === 'string' ? parseInt(value.split('/')[0]) : value.systolic;
    const diastolic = typeof value === 'string' ? parseInt(value.split('/')[1]) : value.diastolic;
    
    return systolic >= thresholds.bloodPressure.warning.systolic || 
           diastolic >= thresholds.bloodPressure.warning.diastolic;
  }
  
  const metricThresholds = thresholds[metric]?.warning;
  if (!metricThresholds) return false;
  
  if (metricThresholds.min && value < metricThresholds.min) return true;
  if (metricThresholds.max && value > metricThresholds.max) return true;
  
  return false;
};

// Format a vital reading for display
export const formatVitalReading = (reading: VitalReading): string => {
  const { type, value, units } = reading;
  
  switch (type) {
    case 'bloodPressure':
      if (typeof value === 'string') return value;
      return `${value.systolic}/${value.diastolic} mmHg`;
      
    case 'heartRate':
      return `${value} bpm`;
      
    case 'oxygenSaturation':
      return `${value}%`;
      
    case 'temperature':
      return `${value}°F`;
      
    case 'hydrationLevel':
      return `${value}%`;
      
    default:
      return `${value} ${units || ''}`;
  }
};

// Offline data caching tools
export const offlineCache = {
  // Store a reading in local storage
  storeReading: (reading: VitalReading): void => {
    try {
      // Get existing cached readings or initialize empty array
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      const cachedReadings = cachedReadingsJson ? JSON.parse(cachedReadingsJson) : [];
      
      // Add the new reading with timestamp
      cachedReadings.push({
        ...reading,
        timestamp: reading.timestamp.toISOString()
      });
      
      // Save back to local storage
      localStorage.setItem('offlineVitalReadings', JSON.stringify(cachedReadings));
      localStorage.setItem('lastOfflineBackup', new Date().toISOString());
    } catch (error) {
      console.error('Failed to cache reading offline:', error);
    }
  },
  
  // Get all cached readings
  getReadings: (): VitalReading[] => {
    try {
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      if (!cachedReadingsJson) return [];
      
      const cachedReadings = JSON.parse(cachedReadingsJson);
      
      // Convert ISO strings back to Date objects
      return cachedReadings.map(reading => ({
        ...reading,
        timestamp: new Date(reading.timestamp)
      }));
    } catch (error) {
      console.error('Failed to retrieve cached readings:', error);
      return [];
    }
  },
  
  // Clear synced readings from cache
  clearSyncedReadings: (syncedReadingIds: string[]): void => {
    try {
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      if (!cachedReadingsJson) return;
      
      const cachedReadings = JSON.parse(cachedReadingsJson);
      const remainingReadings = cachedReadings.filter(reading => 
        !syncedReadingIds.includes(reading.id)
      );
      
      localStorage.setItem('offlineVitalReadings', JSON.stringify(remainingReadings));
    } catch (error) {
      console.error('Failed to clear synced readings:', error);
    }
  },
  
  // Get number of pending readings
  getPendingCount: (): number => {
    try {
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      if (!cachedReadingsJson) return 0;
      
      const cachedReadings = JSON.parse(cachedReadingsJson);
      return cachedReadings.length;
    } catch (error) {
      console.error('Failed to get pending count:', error);
      return 0;
    }
  }
};

// Functions for wearable device integration
export const wearableSync = {
  // Mock function to simulate device discovery
  discoverDevices: async (): Promise<any[]> => {
    // This would use Web Bluetooth API or device-specific SDKs in a real implementation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { 
            id: 'dev1', 
            name: 'Apple Watch Series 8',
            type: 'watch',
            supported: true,
            metrics: ['heart-rate', 'spo2', 'ecg']
          },
          { 
            id: 'dev2', 
            name: 'Fitbit Sense',
            type: 'watch',
            supported: true,
            metrics: ['heart-rate', 'spo2', 'temperature']
          }
        ]);
      }, 2000);
    });
  },
  
  // Connect to a device
  connectDevice: async (deviceId: string): Promise<any> => {
    // This would use device-specific connection logic in a real implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            id: deviceId,
            status: 'connected',
            lastSync: new Date()
          });
        } else {
          reject(new Error('Failed to connect to device'));
        }
      }, 2000);
    });
  },
  
  // Sync data from a device
  syncDevice: async (deviceId: string): Promise<VitalReading[]> => {
    // This would pull actual data from the device in a real implementation
    return new Promise(resolve => {
      setTimeout(() => {
        const readings: VitalReading[] = [
          {
            type: 'heartRate',
            value: Math.floor(65 + Math.random() * 15),
            timestamp: new Date(),
            source: 'wearable',
            deviceId
          },
          {
            type: 'oxygenSaturation',
            value: Math.floor(95 + Math.random() * 5),
            timestamp: new Date(),
            source: 'wearable',
            deviceId
          }
        ];
        resolve(readings);
      }, 3000);
    });
  }
};

// Functions for predictive analytics
export const predictiveAnalytics = {
  // Predict blood pressure for next 7 days
  predictBloodPressure: (historicalData: any[]): any[] => {
    // In a real implementation, this would use a statistical model or ML
    // For demo purposes, we'll create synthetic predictions
    const lastReading = historicalData[historicalData.length - 1];
    const predictions = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Add some random variation to create realistic predictions
      const systolicVariation = Math.floor(Math.random() * 7) - 3; // -3 to +3
      const diastolicVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      
      predictions.push({
        date: format(date, 'yyyy-MM-dd'),
        systolic: lastReading.systolic + systolicVariation,
        diastolic: lastReading.diastolic + diastolicVariation,
        prediction: true
      });
    }
    
    return predictions;
  },
  
  // Predict hydration risk
  predictHydrationRisk: (historicalData: any[]): any[] => {
    // Again, simplified for demo purposes
    const lastValue = historicalData[historicalData.length - 1].value;
    const predictions = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Create a pattern that shows dehydration risk on days 3-5
      let value;
      let risk = false;
      let warning = false;
      
      if (i >= 3 && i <= 5) {
        value = Math.max(lastValue - 10 + (i - 3) * 2, 50);
        risk = value < 60;
        warning = value >= 60 && value < 65;
      } else {
        value = lastValue + Math.floor(Math.random() * 5) - 2;
      }
      
      predictions.push({
        date: format(date, 'yyyy-MM-dd'),
        value,
        prediction: true,
        risk,
        warning
      });
    }
    
    return predictions;
  },
  
  // Generate AI insights based on vital trends
  generateInsights: (vitalsData: any): any[] => {
    const insights = [];
    
    // Blood pressure insights
    const bpData = vitalsData.bloodPressure.readings;
    const latestBP = bpData[bpData.length - 1];
    const prevBP = bpData[bpData.length - 2];
    
    if (latestBP.systolic > prevBP.systolic + 5) {
      insights.push({
        title: "Rising Blood Pressure Trend",
        description: `Your systolic blood pressure has increased by ${latestBP.systolic - prevBP.systolic} points in your last reading.`,
        type: "warning",
        confidence: 0.82,
        recommendation: "Consider reducing sodium intake and monitoring more frequently."
      });
    } else if (latestBP.systolic < prevBP.systolic - 5) {
      insights.push({
        title: "Improving Blood Pressure Trend",
        description: "Your blood pressure readings are showing improvement over the last few days.",
        type: "positive",
        confidence: 0.86,
        recommendation: "Continue your current medication and exercise regimen."
      });
    }
    
    // Check for correlations
    const hrData = vitalsData.heartRate.readings;
    const hydrationData = vitalsData.hydrationLevel.readings;
    
    if (hrData[hrData.length - 1].value > 80 && hydrationData[hydrationData.length - 1].value < 65) {
      insights.push({
        title: "Potential Dehydration Detected",
        description: "Elevated heart rate combined with lower hydration levels may indicate dehydration.",
        type: "warning",
        confidence: 0.75,
        recommendation: "Increase fluid intake and rest if experiencing fatigue."
      });
    }
    
    return insights;
  }
};

// Functions for alert management
export const alertManagement = {
  // Send alert to caregivers
  notifyCaregivers: async (reading: VitalReading, caregivers: any[]): Promise<boolean> => {
    // This would integrate with SMS/email services in a real implementation
    console.log(`Alert would be sent to ${caregivers.length} caregivers about ${reading.type}`);
    return true;
  },
  
  // Send test alert to a caregiver
  sendTestAlert: async (caregiverId: string): Promise<boolean> => {
    // This would send an actual test message in a real implementation
    console.log(`Test alert would be sent to caregiver ${caregiverId}`);
    return true;
  }
};

export default {
  SUPPORTED_DEVICES,
  VITAL_METRICS,
  isCriticalReading,
  isWarningReading,
  formatVitalReading,
  offlineCache,
  wearableSync,
  predictiveAnalytics,
  alertManagement
};
