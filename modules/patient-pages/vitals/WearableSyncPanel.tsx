"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Watch, 
  RefreshCw, 
  Check, 
  X, 
  AlertCircle, 
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Mock data for available devices
const availableDevices = [
  { 
    id: 'dev2', 
    name: 'Fitbit Sense', 
    type: 'watch',
    supported: true,
    metrics: ['heart-rate', 'spo2', 'temperature']
  },
  { 
    id: 'dev3', 
    name: 'Samsung Galaxy Watch 5', 
    type: 'watch',
    supported: true, 
    metrics: ['heart-rate', 'spo2', 'ecg', 'blood-pressure']
  },
  { 
    id: 'dev4', 
    name: 'Oura Ring', 
    type: 'ring',
    supported: true,
    metrics: ['heart-rate', 'temperature', 'sleep']
  },
  { 
    id: 'dev5', 
    name: 'Withings ScanWatch', 
    type: 'watch',
    supported: true,
    metrics: ['heart-rate', 'spo2', 'ecg']
  },
  { 
    id: 'dev6', 
    name: 'Garmin Forerunner', 
    type: 'watch',
    supported: true,
    metrics: ['heart-rate', 'spo2', 'stress']
  }
];

interface WearableSyncPanelProps {
  onClose: () => void;
  connectedDevices: any[];
  onDeviceConnect: (device: any) => void;
}

const WearableSyncPanel: React.FC<WearableSyncPanelProps> = ({ 
  onClose, 
  connectedDevices,
  onDeviceConnect
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [offlineCache, setOfflineCache] = useState({
    enabled: true,
    lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    pendingUploads: 2
  });

  // Simulate scanning for new devices
  const scanForDevices = () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    
    // Simulate discovering devices over time
    setTimeout(() => {
      setDiscoveredDevices([availableDevices[0]]);
      
      setTimeout(() => {
        setDiscoveredDevices([availableDevices[0], availableDevices[1]]);
        
        setTimeout(() => {
          setDiscoveredDevices([availableDevices[0], availableDevices[1], availableDevices[2]]);
          setIsScanning(false);
        }, 1500);
      }, 1200);
    }, 1000);
  };

  // Simulate connecting to a device
  const connectDevice = (device) => {
    setConnectingDeviceId(device.id);
    
    // Simulate connection process
    setTimeout(() => {
      onDeviceConnect({
        ...device,
        status: 'connected',
        lastSync: new Date()
      });
      setConnectingDeviceId(null);
    }, 2000);
  };

  // Simulate syncing a device
  const syncDevice = (deviceId) => {
    setSyncingDeviceId(deviceId);
    setSyncProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSyncingDeviceId(null);
            // Update last sync time
            const updatedDevices = connectedDevices.map(d => 
              d.id === deviceId ? {...d, lastSync: new Date()} : d
            );
            // This would update state in the parent component
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  // Format device metrics for display
  const formatMetrics = (metrics) => {
    return metrics.map(m => {
      switch(m) {
        case 'heart-rate': return 'Heart Rate';
        case 'spo2': return 'Blood Oxygen';
        case 'ecg': return 'ECG';
        case 'blood-pressure': return 'Blood Pressure';
        case 'temperature': return 'Temperature';
        case 'sleep': return 'Sleep';
        case 'stress': return 'Stress';
        default: return m;
      }
    }).join(', ');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Wearable Device Sync</DialogTitle>
          <DialogDescription>
            Connect and sync your wearable devices to automatically track vital signs
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connected">
          <TabsList className="mb-4">
            <TabsTrigger value="connected">Connected Devices</TabsTrigger>
            <TabsTrigger value="discover">Discover Devices</TabsTrigger>
            <TabsTrigger value="settings">Sync Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected">
            <div className="space-y-4">
              {connectedDevices.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Smartphone className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No devices connected yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => scanForDevices()}
                  >
                    Discover Devices
                  </Button>
                </div>
              ) : (
                <>
                  {connectedDevices.map(device => (
                    <div key={device.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-[#F0F9FA] p-3 rounded-full mr-3">
                            {device.type === 'watch' ? (
                              <Watch className="h-6 w-6 text-[#006D77]" />
                            ) : (
                              <Smartphone className="h-6 w-6 text-[#006D77]" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{device.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                Connected
                              </Badge>
                              <span className="text-xs text-gray-500 ml-2">
                                Last synced: {format(device.lastSync, 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Tracking: {formatMetrics(device.metrics || [])}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          {syncingDeviceId === device.id ? (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2 text-[#006D77]" />
                                <span className="text-sm">{syncProgress}%</span>
                              </div>
                              <div className="w-24 h-1 bg-gray-200 rounded-full mt-1">
                                <div 
                                  className="h-1 bg-[#006D77] rounded-full" 
                                  style={{width: `${syncProgress}%`}}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => syncDevice(device.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" /> Sync Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="discover">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Available Devices</h3>
                <Button 
                  variant="outline"
                  onClick={scanForDevices}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                      Scanning...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" /> 
                      Scan for Devices
                    </>
                  )}
                </Button>
              </div>

              {!isScanning && discoveredDevices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wifi className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No devices found nearby</p>
                  <p className="text-sm mt-1">Make sure your device is in pairing mode</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {isScanning && discoveredDevices.length === 0 && (
                    <div className="text-center py-4">
                      <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-[#006D77]" />
                      <p>Scanning for nearby devices...</p>
                    </div>
                  )}
                  
                  {discoveredDevices.map(device => (
                    <div key={device.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-3 rounded-full mr-3">
                            {device.type === 'watch' ? (
                              <Watch className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Smartphone className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{device.name}</h3>
                            {device.supported ? (
                              <div className="flex items-center mt-1">
                                <Badge className="bg-emerald-50 text-emerald-700">
                                  Compatible
                                </Badge>
                                <span className="text-xs text-gray-500 ml-2">
                                  Supports: {formatMetrics(device.metrics)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center mt-1">
                                <Badge className="bg-amber-50 text-amber-700">
                                  Limited Compatibility
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          {connectingDeviceId === device.id ? (
                            <Button disabled>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting...
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => connectDevice(device)}
                              className="bg-[#006D77] hover:bg-[#00585F]"
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-5">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Offline Data Caching</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Store readings locally when internet connection is unavailable
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="flex items-center">
                      <Badge className={offlineCache.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}>
                        {offlineCache.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      {offlineCache.enabled && (
                        <span className="text-xs text-gray-500 ml-2">
                          Last backup: {format(offlineCache.lastBackup, 'MMM d, h:mm a')}
                        </span>
                      )}
                    </div>
                    
                    {offlineCache.enabled && offlineCache.pendingUploads > 0 && (
                      <div className="flex items-center mt-2 text-amber-600 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {offlineCache.pendingUploads} readings pending upload
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setOfflineCache(prev => ({ ...prev, enabled: !prev.enabled }))}
                  >
                    {offlineCache.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Auto-Sync Frequency</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Control how often connected devices automatically sync data
                </p>
                
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" className="bg-[#F0F9FA] text-[#006D77] border-[#006D77]">
                    Real-time
                  </Button>
                  <Button variant="outline" size="sm">
                    Hourly
                  </Button>
                  <Button variant="outline" size="sm">
                    Daily
                  </Button>
                  <Button variant="outline" size="sm">
                    Manual only
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Data Accuracy & Battery Usage</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Balance between accurate readings and device battery life
                </p>
                
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm">
                    Maximum Accuracy
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#F0F9FA] text-[#006D77] border-[#006D77]">
                    Balanced
                  </Button>
                  <Button variant="outline" size="sm">
                    Battery Saver
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WearableSyncPanel;
