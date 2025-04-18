"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Droplets, 
  Thermometer, 
  Zap, 
  Smartphone, 
  Share2, 
  Bell, 
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import VitalChartCard from './VitalChartCard';
import WearableSyncPanel from './WearableSyncPanel';
import PredictiveTrendsWidget from './PredictiveTrendsWidget';
import CaregiverAlertSettings from './CaregiverAlertSettings';
import VitalThresholdSettings from './VitalThresholdSettings';

// Mock data for vital signs
const mockVitalsData = {
  bloodPressure: {
    readings: [
      { date: '2024-03-01', systolic: 125, diastolic: 82 },
      { date: '2024-03-02', systolic: 128, diastolic: 84 },
      { date: '2024-03-03', systolic: 130, diastolic: 85 },
      { date: '2024-03-04', systolic: 127, diastolic: 83 },
      { date: '2024-03-05', systolic: 132, diastolic: 87 },
      { date: '2024-03-06', systolic: 129, diastolic: 84 },
      { date: '2024-03-07', systolic: 126, diastolic: 82 },
    ],
    thresholds: {
      warning: { systolic: 130, diastolic: 85 },
      critical: { systolic: 140, diastolic: 90 }
    },
    unit: 'mmHg',
    latestReading: { value: '126/82', timestamp: new Date() }
  },
  heartRate: {
    readings: [
      { date: '2024-03-01', value: 68 },
      { date: '2024-03-02', value: 72 },
      { date: '2024-03-03', value: 75 },
      { date: '2024-03-04', value: 70 },
      { date: '2024-03-05', value: 69 },
      { date: '2024-03-06', value: 67 },
      { date: '2024-03-07', value: 71 },
    ],
    thresholds: {
      warning: { min: 50, max: 90 },
      critical: { min: 45, max: 100 }
    },
    unit: 'bpm',
    latestReading: { value: 71, timestamp: new Date() }
  },
  oxygenSaturation: {
    readings: [
      { date: '2024-03-01', value: 98 },
      { date: '2024-03-02', value: 97 },
      { date: '2024-03-03', value: 98 },
      { date: '2024-03-04', value: 96 },
      { date: '2024-03-05', value: 97 },
      { date: '2024-03-06', value: 98 },
      { date: '2024-03-07', value: 97 },
    ],
    thresholds: {
      warning: { min: 94 },
      critical: { min: 90 }
    },
    unit: '%',
    latestReading: { value: 97, timestamp: new Date() }
  },
  temperature: {
    readings: [
      { date: '2024-03-01', value: 98.2 },
      { date: '2024-03-02', value: 98.4 },
      { date: '2024-03-03', value: 98.6 },
      { date: '2024-03-04', value: 98.3 },
      { date: '2024-03-05', value: 98.7 },
      { date: '2024-03-06', value: 98.4 },
      { date: '2024-03-07', value: 98.2 },
    ],
    thresholds: {
      warning: { min: 97.0, max: 99.5 },
      critical: { min: 96.0, max: 100.4 }
    },
    unit: '°F',
    latestReading: { value: 98.2, timestamp: new Date() }
  },
  hydrationLevel: {
    readings: [
      { date: '2024-03-01', value: 65 },
      { date: '2024-03-02', value: 62 },
      { date: '2024-03-03', value: 67 },
      { date: '2024-03-04', value: 70 },
      { date: '2024-03-05', value: 68 },
      { date: '2024-03-06', value: 72 },
      { date: '2024-03-07', value: 69 },
    ],
    thresholds: {
      warning: { min: 60 },
      critical: { min: 50 }
    },
    unit: '%',
    latestReading: { value: 69, timestamp: new Date() }
  }
};

const VitalsTrackingDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showWearablePanel, setShowWearablePanel] = useState(false);
  const [showThresholdSettings, setShowThresholdSettings] = useState(false);
  const [showCaregiverSettings, setShowCaregiverSettings] = useState(false);
  const [vitalsData, setVitalsData] = useState(mockVitalsData);
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'dev1', name: 'Apple Watch Series 8', status: 'connected', lastSync: new Date() }
  ]);

  // Simulate refreshing vitals data
  const refreshVitals = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, this would fetch new data from an API
    }, 1500);
  };

  // Get status color based on reading and thresholds
  const getStatusInfo = (vitalType, reading) => {
    const thresholds = vitalsData[vitalType].thresholds;
    
    if (vitalType === 'bloodPressure') {
      const systolic = reading?.systolic || parseInt(reading?.value?.split('/')[0]);
      const diastolic = reading?.diastolic || parseInt(reading?.value?.split('/')[1]);
      
      if (systolic >= thresholds.critical.systolic || diastolic >= thresholds.critical.diastolic) {
        return { color: 'text-red-600', bgColor: 'bg-red-100', status: 'Critical' };
      } else if (systolic >= thresholds.warning.systolic || diastolic >= thresholds.warning.diastolic) {
        return { color: 'text-amber-600', bgColor: 'bg-amber-100', status: 'Warning' };
      }
    } else {
      const value = reading?.value;
      
      if (thresholds.critical.max && value > thresholds.critical.max || 
          thresholds.critical.min && value < thresholds.critical.min) {
        return { color: 'text-red-600', bgColor: 'bg-red-100', status: 'Critical' };
      } else if (thresholds.warning.max && value > thresholds.warning.max || 
                thresholds.warning.min && value < thresholds.warning.min) {
        return { color: 'text-amber-600', bgColor: 'bg-amber-100', status: 'Warning' };
      }
    }
    
    return { color: 'text-emerald-600', bgColor: 'bg-emerald-100', status: 'Normal' };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vital Signs Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor your health metrics and connect with wearable devices</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowWearablePanel(true)}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Sync Devices
          </Button>
          <Button 
            variant="outline" 
            onClick={refreshVitals}
            disabled={isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-[#006D77] hover:bg-[#00585F]">
            <Plus className="h-4 w-4 mr-2" />
            Add Reading
          </Button>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex justify-between mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Vitals</TabsTrigger>
              <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
              <TabsTrigger value="heart">Heart Rate</TabsTrigger>
              <TabsTrigger value="o2">Oxygen</TabsTrigger>
              <TabsTrigger value="temp">Temperature</TabsTrigger>
              <TabsTrigger value="hydration">Hydration</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => setShowThresholdSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Thresholds
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => setShowCaregiverSettings(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* All Vitals View */}
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VitalChartCard 
                title="Blood Pressure"
                icon={<Heart className="h-5 w-5 text-rose-500" />}
                data={vitalsData.bloodPressure}
                type="bloodPressure"
                latestReading={vitalsData.bloodPressure.latestReading}
                statusInfo={getStatusInfo('bloodPressure', vitalsData.bloodPressure.latestReading)}
              />
              <VitalChartCard 
                title="Heart Rate"
                icon={<Activity className="h-5 w-5 text-purple-500" />}
                data={vitalsData.heartRate}
                type="heartRate"
                latestReading={vitalsData.heartRate.latestReading}
                statusInfo={getStatusInfo('heartRate', vitalsData.heartRate.latestReading)}
              />
              <VitalChartCard 
                title="Oxygen Saturation"
                icon={<Zap className="h-5 w-5 text-blue-500" />}
                data={vitalsData.oxygenSaturation}
                type="oxygenSaturation"
                latestReading={vitalsData.oxygenSaturation.latestReading}
                statusInfo={getStatusInfo('oxygenSaturation', vitalsData.oxygenSaturation.latestReading)}
              />
              <VitalChartCard 
                title="Temperature"
                icon={<Thermometer className="h-5 w-5 text-amber-500" />}
                data={vitalsData.temperature}
                type="temperature"
                latestReading={vitalsData.temperature.latestReading}
                statusInfo={getStatusInfo('temperature', vitalsData.temperature.latestReading)}
              />
              <VitalChartCard 
                title="Hydration Level"
                icon={<Droplets className="h-5 w-5 text-blue-400" />}
                data={vitalsData.hydrationLevel}
                type="hydrationLevel"
                latestReading={vitalsData.hydrationLevel.latestReading}
                statusInfo={getStatusInfo('hydrationLevel', vitalsData.hydrationLevel.latestReading)}
              />
              <PredictiveTrendsWidget vitalsData={vitalsData} />
            </div>
          </TabsContent>

          {/* Individual vital tabs */}
          <TabsContent value="bp" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <VitalChartCard 
                title="Blood Pressure"
                icon={<Heart className="h-5 w-5 text-rose-500" />}
                data={vitalsData.bloodPressure}
                type="bloodPressure"
                latestReading={vitalsData.bloodPressure.latestReading}
                statusInfo={getStatusInfo('bloodPressure', vitalsData.bloodPressure.latestReading)}
                expanded={true}
              />
            </div>
          </TabsContent>
          
          {/* Add similar TabsContent blocks for other vital types */}
        </Tabs>
      </div>

      {/* Modals/panels */}
      {showWearablePanel && (
        <WearableSyncPanel 
          onClose={() => setShowWearablePanel(false)} 
          connectedDevices={connectedDevices}
          onDeviceConnect={(device) => setConnectedDevices([...connectedDevices, device])}
        />
      )}
      
      {showThresholdSettings && (
        <VitalThresholdSettings
          onClose={() => setShowThresholdSettings(false)}
          thresholds={{
            bloodPressure: vitalsData.bloodPressure.thresholds,
            heartRate: vitalsData.heartRate.thresholds,
            oxygenSaturation: vitalsData.oxygenSaturation.thresholds,
            temperature: vitalsData.temperature.thresholds,
            hydrationLevel: vitalsData.hydrationLevel.thresholds
          }}
          onSaveThresholds={(newThresholds) => {
            // Update thresholds logic would go here
            setShowThresholdSettings(false);
          }}
        />
      )}
      
      {showCaregiverSettings && (
        <CaregiverAlertSettings
          onClose={() => setShowCaregiverSettings(false)}
          onSaveSettings={(settings) => {
            // Save caregiver alert settings logic would go here
            setShowCaregiverSettings(false);
          }}
        />
      )}
    </div>
  );
};

export default VitalsTrackingDashboard;
