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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Heart,
  Activity,
  Zap,
  Thermometer,
  Droplets,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CaregiverAlertSettingsProps {
  onClose: () => void;
  onSaveSettings: (settings: any) => void;
}

const CaregiverAlertSettings: React.FC<CaregiverAlertSettingsProps> = ({
  onClose,
  onSaveSettings
}) => {
  // Mock data for caregivers
  const [caregivers, setCaregivers] = useState([
    {
      id: 'cg1',
      name: 'Richard Cooper',
      relationship: 'Spouse',
      phone: '555-123-4567',
      email: 'richard@example.com',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      alertConfig: {
        enabled: true,
        types: ['critical', 'warning'],
        vitals: ['bloodPressure', 'heartRate', 'oxygenSaturation']
      }
    },
    {
      id: 'cg2',
      name: 'Amy Cooper',
      relationship: 'Daughter',
      phone: '555-987-6543',
      email: 'amy@example.com',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      alertConfig: {
        enabled: true,
        types: ['critical'],
        vitals: ['bloodPressure', 'heartRate', 'oxygenSaturation', 'temperature', 'hydrationLevel']
      }
    }
  ]);

  const [newCaregiver, setNewCaregiver] = useState({
    name: '',
    relationship: 'Family Member',
    phone: '',
    email: '',
    alertConfig: {
      enabled: true,
      types: ['critical'],
      vitals: ['bloodPressure', 'heartRate']
    }
  });

  const [showAddCaregiver, setShowAddCaregiver] = useState(false);
  const [expandedCaregiverId, setExpandedCaregiverId] = useState('cg1');
  const [testMessageSent, setTestMessageSent] = useState<string | null>(null);

  // Add a new caregiver
  const addCaregiver = () => {
    if (newCaregiver.name && (newCaregiver.phone || newCaregiver.email)) {
      setCaregivers([
        ...caregivers,
        {
          ...newCaregiver,
          id: `cg${caregivers.length + 1}`
        }
      ]);
      setNewCaregiver({
        name: '',
        relationship: 'Family Member',
        phone: '',
        email: '',
        alertConfig: {
          enabled: true,
          types: ['critical'],
          vitals: ['bloodPressure', 'heartRate']
        }
      });
      setShowAddCaregiver(false);
    }
  };

  // Remove a caregiver
  const removeCaregiver = (id) => {
    setCaregivers(caregivers.filter(cg => cg.id !== id));
  };

  // Update caregiver alert settings
  const updateCaregiverAlerts = (caregiverId, field, value) => {
    setCaregivers(caregivers.map(cg => {
      if (cg.id === caregiverId) {
        return {
          ...cg,
          alertConfig: {
            ...cg.alertConfig,
            [field]: value
          }
        };
      }
      return cg;
    }));
  };

  // Toggle vital in caregiver's alert configuration
  const toggleVitalAlert = (caregiverId, vitalType) => {
    setCaregivers(caregivers.map(cg => {
      if (cg.id === caregiverId) {
        const vitals = [...cg.alertConfig.vitals];
        
        if (vitals.includes(vitalType)) {
          return {
            ...cg,
            alertConfig: {
              ...cg.alertConfig,
              vitals: vitals.filter(v => v !== vitalType)
            }
          };
        } else {
          return {
            ...cg,
            alertConfig: {
              ...cg.alertConfig,
              vitals: [...vitals, vitalType]
            }
          };
        }
      }
      return cg;
    }));
  };

  // Toggle alert type in caregiver's alert configuration
  const toggleAlertType = (caregiverId, alertType) => {
    setCaregivers(caregivers.map(cg => {
      if (cg.id === caregiverId) {
        const types = [...cg.alertConfig.types];
        
        if (types.includes(alertType)) {
          return {
            ...cg,
            alertConfig: {
              ...cg.alertConfig,
              types: types.filter(t => t !== alertType)
            }
          };
        } else {
          return {
            ...cg,
            alertConfig: {
              ...cg.alertConfig,
              types: [...types, alertType]
            }
          };
        }
      }
      return cg;
    }));
  };

  // Get vital name from type
  const getVitalName = (vitalType) => {
    switch (vitalType) {
      case 'bloodPressure': return 'Blood Pressure';
      case 'heartRate': return 'Heart Rate';
      case 'oxygenSaturation': return 'Oxygen Saturation';
      case 'temperature': return 'Temperature';
      case 'hydrationLevel': return 'Hydration Level';
      default: return vitalType;
    }
  };

  // Get icon for vital type
  const getVitalIcon = (vitalType) => {
    switch (vitalType) {
      case 'bloodPressure': return <Heart className="h-4 w-4 text-rose-500" />;
      case 'heartRate': return <Activity className="h-4 w-4 text-purple-500" />;
      case 'oxygenSaturation': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'temperature': return <Thermometer className="h-4 w-4 text-amber-500" />;
      case 'hydrationLevel': return <Droplets className="h-4 w-4 text-blue-400" />;
      default: return null;
    }
  };

  // Simulate sending a test message
  const sendTestMessage = (caregiverId) => {
    setTestMessageSent(caregiverId);
    setTimeout(() => setTestMessageSent(null), 3000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Caregiver Alert Settings
          </DialogTitle>
          <DialogDescription>
            Manage who receives alerts about your vital signs and health metrics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Connected Caregivers</h3>
            <Button
              onClick={() => setShowAddCaregiver(!showAddCaregiver)}
              className="bg-[#006D77] hover:bg-[#00585F]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Caregiver
            </Button>
          </div>

          {/* Add new caregiver form */}
          {showAddCaregiver && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3">Add New Caregiver</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="caregiverName">Name</Label>
                  <Input
                    id="caregiverName"
                    value={newCaregiver.name}
                    onChange={(e) => setNewCaregiver({...newCaregiver, name: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={newCaregiver.relationship}
                    onValueChange={(value) => setNewCaregiver({...newCaregiver, relationship: value})}
                  >
                    <SelectTrigger id="relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Caretaker">Caretaker</SelectItem>
                      <SelectItem value="Family Member">Other Family Member</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newCaregiver.phone}
                    onChange={(e) => setNewCaregiver({...newCaregiver, phone: e.target.value})}
                    placeholder="For SMS alerts"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCaregiver.email}
                    onChange={(e) => setNewCaregiver({...newCaregiver, email: e.target.value})}
                    placeholder="For email alerts"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddCaregiver(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={addCaregiver}
                  disabled={!newCaregiver.name || (!newCaregiver.phone && !newCaregiver.email)}
                  className="bg-[#006D77] hover:bg-[#00585F]"
                >
                  Add Caregiver
                </Button>
              </div>
            </div>
          )}

          {/* Caregiver list */}
          <div className="space-y-3">
            {caregivers.map(caregiver => (
              <div key={caregiver.id} className="border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={caregiver.photo} alt={caregiver.name} />
                        <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">{caregiver.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">{caregiver.relationship}</span>
                          <Separator orientation="vertical" className="h-3 mx-1" />
                          {caregiver.phone && <span className="mr-2">{caregiver.phone}</span>}
                          {caregiver.email && <span>{caregiver.email}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={caregiver.alertConfig.enabled}
                        onCheckedChange={(checked) => updateCaregiverAlerts(caregiver.id, 'enabled', checked)}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setExpandedCaregiverId(
                          expandedCaregiverId === caregiver.id ? '' : caregiver.id
                        )}
                      >
                        {expandedCaregiverId === caregiver.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex mt-2 items-center flex-wrap gap-1">
                    {caregiver.alertConfig.vitals.map(vitalType => (
                      <Badge key={vitalType} variant="outline" className="bg-gray-50">
                        {getVitalIcon(vitalType)}
                        <span className="ml-1 text-xs">{getVitalName(vitalType)}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {expandedCaregiverId === caregiver.id && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Alert Types</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Switch
                              checked={caregiver.alertConfig.types.includes('critical')}
                              onCheckedChange={() => toggleAlertType(caregiver.id, 'critical')}
                              id={`${caregiver.id}-critical`}
                            />
                            <Label 
                              htmlFor={`${caregiver.id}-critical`}
                              className="ml-2 flex items-center"
                            >
                              <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                              Critical Alerts
                            </Label>
                          </div>
                          
                          <div className="flex items-center">
                            <Switch
                              checked={caregiver.alertConfig.types.includes('warning')}
                              onCheckedChange={() => toggleAlertType(caregiver.id, 'warning')}
                              id={`${caregiver.id}-warning`}
                            />
                            <Label 
                              htmlFor={`${caregiver.id}-warning`}
                              className="ml-2 flex items-center"
                            >
                              <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                              Warning Alerts
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Monitored Vitals</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {['bloodPressure', 'heartRate', 'oxygenSaturation', 'temperature', 'hydrationLevel'].map(vitalType => (
                            <div key={vitalType} className="flex items-center">
                              <Switch
                                checked={caregiver.alertConfig.vitals.includes(vitalType)}
                                onCheckedChange={() => toggleVitalAlert(caregiver.id, vitalType)}
                                id={`${caregiver.id}-${vitalType}`}
                              />
                              <Label 
                                htmlFor={`${caregiver.id}-${vitalType}`}
                                className="ml-2 flex items-center"
                              >
                                {getVitalIcon(vitalType)}
                                <span className="ml-1">{getVitalName(vitalType)}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeCaregiver(caregiver.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendTestMessage(caregiver.id)}
                          disabled={testMessageSent === caregiver.id}
                        >
                          {testMessageSent === caregiver.id ? (
                            <>
                              <Mail className="h-4 w-4 mr-1 text-green-600" />
                              Test Alert Sent
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1" />
                              Send Test Alert
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#006D77] text-[#006D77]"
                        >
                          <User className="h-4 w-4 mr-1" />
                          Share Timeline Access
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {caregivers.length === 0 && (
            <div className="text-center py-6 border rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">No caregivers have been added yet</p>
              <Button 
                className="mt-2 bg-[#006D77] hover:bg-[#00585F]"
                onClick={() => setShowAddCaregiver(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Caregiver
              </Button>
            </div>
          )}
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">About Caregiver Alerts</p>
              <p className="mt-1">
                Caregivers will receive alerts via SMS or email when your vital signs exceed the thresholds you've set. They will also have the option to view your vital timeline if you grant them access.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-[#006D77] hover:bg-[#00585F]"
            onClick={() => onSaveSettings(caregivers)}
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CaregiverAlertSettings;
