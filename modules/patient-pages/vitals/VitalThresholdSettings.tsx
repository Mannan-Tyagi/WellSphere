import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Activity,
  Zap,
  Thermometer,
  Droplets,
  Smartphone,
  Bell,
  BellOff,
  AlertTriangle,
} from 'lucide-react';

interface VitalThresholdSettingsProps {
  onClose: () => void;
  thresholds: any;
  onSaveThresholds: (thresholds: any) => void;
}

const VitalThresholdSettings: React.FC<VitalThresholdSettingsProps> = ({
  onClose,
  thresholds,
  onSaveThresholds,
}) => {
  const [currentThresholds, setCurrentThresholds] = useState(thresholds);
  const [activeVital, setActiveVital] = useState('bloodPressure');
  const [doctorApproved, setDoctorApproved] = useState({
    bloodPressure: true,
    heartRate: true,
    oxygenSaturation: true,
    temperature: false,
    hydrationLevel: false,
  });

  const handleThresholdChange = (vitalType, level, property, value) => {
    const parsedValue = !isNaN(value) ? parseFloat(value) : value;

    setCurrentThresholds((prev) => ({
      ...prev,
      [vitalType]: {
        ...prev[vitalType],
        thresholds: {
          ...prev[vitalType].thresholds,
          [level]: {
            ...prev[vitalType].thresholds[level],
            [property]: parsedValue,
          },
        },
      },
    }));
  };

  const getThresholdInputs = (vitalType) => {
    const vitalThresholds = currentThresholds[vitalType].thresholds;

    switch (vitalType) {
      case 'bloodPressure':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Warning Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolicWarning">Systolic (mmHg)</Label>
                  <Input
                    id="systolicWarning"
                    type="number"
                    value={vitalThresholds.warning.systolic}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'systolic',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 130</p>
                </div>
                <div>
                  <Label htmlFor="diastolicWarning">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolicWarning"
                    type="number"
                    value={vitalThresholds.warning.diastolic}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'diastolic',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 85</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Critical Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolicCritical">Systolic (mmHg)</Label>
                  <Input
                    id="systolicCritical"
                    type="number"
                    value={vitalThresholds.critical.systolic}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'systolic',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 140</p>
                </div>
                <div>
                  <Label htmlFor="diastolicCritical">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolicCritical"
                    type="number"
                    value={vitalThresholds.critical.diastolic}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'diastolic',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 90</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'heartRate':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Warning Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minHrWarning">Minimum (bpm)</Label>
                  <Input
                    id="minHrWarning"
                    type="number"
                    value={vitalThresholds.warning.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'min',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50</p>
                </div>
                <div>
                  <Label htmlFor="maxHrWarning">Maximum (bpm)</Label>
                  <Input
                    id="maxHrWarning"
                    type="number"
                    value={vitalThresholds.warning.max}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'max',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 90</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Critical Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minHrCritical">Minimum (bpm)</Label>
                  <Input
                    id="minHrCritical"
                    type="number"
                    value={vitalThresholds.critical.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'min',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 45</p>
                </div>
                <div>
                  <Label htmlFor="maxHrCritical">Maximum (bpm)</Label>
                  <Input
                    id="maxHrCritical"
                    type="number"
                    value={vitalThresholds.critical.max}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'max',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 100</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'oxygenSaturation':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Warning Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minO2Warning">Minimum (%)</Label>
                  <Input
                    id="minO2Warning"
                    type="number"
                    value={vitalThresholds.warning.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'min',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 94</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Critical Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minO2Critical">Minimum (%)</Label>
                  <Input
                    id="minO2Critical"
                    type="number"
                    value={vitalThresholds.critical.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'min',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 90</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'temperature':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Warning Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minTempWarning">Minimum (°F)</Label>
                  <Input
                    id="minTempWarning"
                    type="number"
                    value={vitalThresholds.warning.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'min',
                        e.target.value
                      )
                    }
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 97.0</p>
                </div>
                <div>
                  <Label htmlFor="maxTempWarning">Maximum (°F)</Label>
                  <Input
                    id="maxTempWarning"
                    type="number"
                    value={vitalThresholds.warning.max}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'max',
                        e.target.value
                      )
                    }
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 99.5</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Critical Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minTempCritical">Minimum (°F)</Label>
                  <Input
                    id="minTempCritical"
                    type="number"
                    value={vitalThresholds.critical.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'min',
                        e.target.value
                      )
                    }
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 96.0</p>
                </div>
                <div>
                  <Label htmlFor="maxTempCritical">Maximum (°F)</Label>
                  <Input
                    id="maxTempCritical"
                    type="number"
                    value={vitalThresholds.critical.max}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'max',
                        e.target.value
                      )
                    }
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 100.4</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hydrationLevel':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Warning Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minHydrationWarning">Minimum (%)</Label>
                  <Input
                    id="minHydrationWarning"
                    type="number"
                    value={vitalThresholds.warning.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'warning',
                        'min',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 60</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Critical Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minHydrationCritical">Minimum (%)</Label>
                  <Input
                    id="minHydrationCritical"
                    type="number"
                    value={vitalThresholds.critical.min}
                    onChange={(e) =>
                      handleThresholdChange(
                        vitalType,
                        'critical',
                        'min',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getVitalIcon = (vitalType) => {
    switch (vitalType) {
      case 'bloodPressure':
        return <Heart className="h-4 w-4 text-rose-500" />;
      case 'heartRate':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'oxygenSaturation':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'temperature':
        return <Thermometer className="h-4 w-4 text-amber-500" />;
      case 'hydrationLevel':
        return <Droplets className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getVitalName = (vitalType) => {
    switch (vitalType) {
      case 'bloodPressure':
        return 'Blood Pressure';
      case 'heartRate':
        return 'Heart Rate';
      case 'oxygenSaturation':
        return 'Oxygen Saturation';
      case 'temperature':
        return 'Temperature';
      case 'hydrationLevel':
        return 'Hydration Level';
      default:
        return vitalType;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Vital Sign Thresholds</DialogTitle>
          <DialogDescription>
            Customize when you'll receive alerts for abnormal readings
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-6">
          <div className="w-56">
            <h3 className="text-sm font-medium mb-3">Vital Signs</h3>
            <div className="space-y-2">
              {Object.keys(currentThresholds).map((vitalType) => (
                <div
                  key={vitalType}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeVital === vitalType
                      ? 'bg-[#F0F9FA] border border-[#006D77]/20'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveVital(vitalType)}
                >
                  <div className="mr-2">{getVitalIcon(vitalType)}</div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium">
                      {getVitalName(vitalType)}
                    </div>
                  </div>
                  {doctorApproved[vitalType] && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <span className="text-[10px]">Dr. Approved</span>
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium">Alert Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 text-gray-500 mr-2" />
                    <Label htmlFor="mobileAlerts" className="text-sm">
                      Mobile Alerts
                    </Label>
                  </div>
                  <Switch id="mobileAlerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 text-gray-500 mr-2" />
                    <Label htmlFor="criticalAlertsOnly" className="text-sm">
                      Critical Alerts Only
                    </Label>
                  </div>
                  <Switch id="criticalAlertsOnly" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BellOff className="h-4 w-4 text-gray-500 mr-2" />
                    <Label htmlFor="quietHours" className="text-sm">
                      Quiet Hours
                    </Label>
                  </div>
                  <Switch id="quietHours" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow border-l pl-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center">
                {getVitalIcon(activeVital)}
                <span className="ml-2">{getVitalName(activeVital)} Thresholds</span>
              </h2>

              {doctorApproved[activeVital] ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Doctor Approved
                </Badge>
              ) : (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  Custom Settings
                </Badge>
              )}
            </div>

            {getThresholdInputs(activeVital)}

            {!doctorApproved[activeVital] && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  These settings have not been reviewed by your healthcare
                  provider. Consider discussing these thresholds with your
                  doctor.
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-[#006D77] text-[#006D77]"
              onClick={() => {
                // Logic to reset to doctor-recommended values would go here
              }}
            >
              Reset to Recommended
            </Button>
            <Button
              className="bg-[#006D77] hover:bg-[#00585F]"
              onClick={() => onSaveThresholds(currentThresholds)}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VitalThresholdSettings;