import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, Smartphone, Download, Printer, Share2, AlertTriangle, ChevronRight, 
  Wallet, Heart, AlertCircle, Plus, Edit, Shield, Stethoscope,
  X
} from 'lucide-react';

const MedicalIDBuilder = () => {
  const [medicalIDTab, setMedicalIDTab] = useState('phone');
  
  // Mock medical ID data
  const [medicalIDData, setMedicalIDData] = useState({
    name: 'Sarah Cooper',
    dateOfBirth: '1990-06-15',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin', 'Lisinopril'],
    emergencyContact: 'John Cooper (Spouse) - (555) 987-6543',
    organDonor: true,
    medicalNotes: 'Wears contact lenses; history of asthma as a child',
    emergencyAccessEnabled: true,
    wristbandEnabled: true,
    lockScreenEnabled: true,
    includeAllergies: true,
    includeConditions: true,
    includeMedications: true,
    includeEmergencyContact: true,
    includeBloodType: true,
    includeAdvanceDirectives: false
  });
  
  const handleSwitchChange = (field, value) => {
    setMedicalIDData({
      ...medicalIDData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-[#006D77] flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            Medical ID Builder
          </CardTitle>
          <CardDescription>
            Create your medical ID for emergency access with essential health information for first responders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg text-sm">
              <p className="flex items-center text-[#006D77]">
                <AlertCircle className="h-4 w-4 mr-2" />
                Your Medical ID can be accessed by emergency responders even when your phone is locked. Only include information you want to be available in an emergency.
              </p>
            </div>
            
            <Tabs value={medicalIDTab} onValueChange={setMedicalIDTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="phone" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Phone Lock Screen
                </TabsTrigger>
                <TabsTrigger value="wristband" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
                  <Wallet className="h-4 w-4 mr-2" />
                  Medical Wristband
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  ID Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="phone" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">Medical ID Preview</h3>
                        <Button variant="outline" size="sm" className="h-8">
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                      </div>
                      
                      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 max-w-xs mx-auto">
                        <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <Heart className="h-5 w-5 text-red-600 mr-2" />
                              <span className="font-bold text-xl">Medical ID</span>
                            </div>
                            <span className="text-xs text-gray-500">Emergency Access</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-lg font-bold">{medicalIDData.name}</p>
                              <p className="text-sm text-gray-600">DOB: {new Date(medicalIDData.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                            
                            {medicalIDData.includeBloodType && (
                              <div className="flex items-center">
                                <span className="font-bold text-lg text-red-600 mr-2">{medicalIDData.bloodType}</span>
                                <span className="text-sm text-gray-600">Blood Type</span>
                              </div>
                            )}
                            
                            {medicalIDData.includeAllergies && medicalIDData.allergies.length > 0 && (
                              <div>
                                <p className="text-sm font-bold">Allergies:</p>
                                <p className="text-sm">
                                  {medicalIDData.allergies.join(', ')}
                                </p>
                              </div>
                            )}
                            
                            {medicalIDData.includeConditions && medicalIDData.conditions.length > 0 && (
                              <div>
                                <p className="text-sm font-bold">Medical Conditions:</p>
                                <p className="text-sm">
                                  {medicalIDData.conditions.join(', ')}
                                </p>
                              </div>
                            )}
                            
                            {medicalIDData.includeMedications && medicalIDData.medications.length > 0 && (
                              <div>
                                <p className="text-sm font-bold">Medications:</p>
                                <p className="text-sm">
                                  {medicalIDData.medications.join(', ')}
                                </p>
                              </div>
                            )}
                            
                            {medicalIDData.includeEmergencyContact && (
                              <div>
                                <p className="text-sm font-bold">Emergency Contact:</p>
                                <p className="text-sm">{medicalIDData.emergencyContact}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center text-sm mt-2">
                              <Stethoscope size={14} className="mr-1 text-blue-600" />
                              <span>Scan QR for more medical info</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium mb-3">Phone Configuration</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Switch 
                            id="lockScreenEnabled" 
                            checked={medicalIDData.lockScreenEnabled}
                            onCheckedChange={(checked) => handleSwitchChange('lockScreenEnabled', checked)}
                          />
                          <div>
                            <Label htmlFor="lockScreenEnabled" className="font-medium">Enable Lock Screen Access</Label>
                            <p className="text-sm text-gray-600">
                              Allow emergency responders to access your Medical ID from your lock screen
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Switch 
                            id="emergencyAccessEnabled" 
                            checked={medicalIDData.emergencyAccessEnabled}
                            onCheckedChange={(checked) => handleSwitchChange('emergencyAccessEnabled', checked)}
                          />
                          <div>
                            <Label htmlFor="emergencyAccessEnabled" className="font-medium">Enable QR Code</Label>
                            <p className="text-sm text-gray-600">
                              Generate a QR code that links to your medical information for emergency access
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t">
                        <Button variant="outline" className="w-full justify-center">
                          <Smartphone size={16} className="mr-2" />
                          Configure Phone Medical ID
                        </Button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Follow instructions to enable Medical ID on your phone's lock screen
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium mb-3">Download QR Code</h3>
                      <div className="flex flex-col items-center mb-3">
                        <div className="border border-gray-200 p-2 rounded-lg bg-white">
                          <div className="h-32 w-32 bg-[url('/images/sample-qr.png')] bg-contain bg-no-repeat bg-center"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Emergency Medical Information
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 text-sm h-9">
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm h-9">
                          <Printer size={14} className="mr-1" />
                          Print
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm h-9">
                          <Share2 size={14} className="mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wristband" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">Medical Wristband</h3>
                        <Button variant="outline" size="sm" className="h-8">
                          <Edit size={14} className="mr-1" /> Customize
                        </Button>
                      </div>
                      
                      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 max-w-xs mx-auto">
                        <div className="p-2 bg-white rounded-lg border border-gray-300 shadow-sm">
                          <div className="flex items-center justify-center w-full h-32 overflow-hidden rounded-lg relative border border-gray-200">
                            <div className="absolute inset-0 bg-[url('/images/medical-wristband.jpg')] bg-center bg-cover opacity-70"></div>
                            <div className="relative bg-white bg-opacity-90 px-3 py-2 rounded-md text-center">
                              <p className="font-bold">{medicalIDData.name}</p>
                              <p className="text-sm">Blood Type: <span className="font-bold text-red-600">{medicalIDData.bloodType}</span></p>
                              <p className="text-xs">Scan QR for more info</p>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-between px-2">
                            <div className="text-xs space-y-1">
                              <p className="font-bold">Allergies:</p>
                              <p>{medicalIDData.allergies.join(', ')}</p>
                            </div>
                            <div className="h-12 w-12 bg-[url('/images/sample-qr.png')] bg-contain bg-no-repeat bg-center"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium mb-3">Wristband Options</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Switch 
                            id="wristbandEnabled" 
                            checked={medicalIDData.wristbandEnabled}
                            onCheckedChange={(checked) => handleSwitchChange('wristbandEnabled', checked)}
                          />
                          <div>
                            <Label htmlFor="wristbandEnabled" className="font-medium">Generate Wristband Design</Label>
                            <p className="text-sm text-gray-600">
                              Create a printable design for medical alert wristbands
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="wristbandSize" className="text-sm font-medium">Wristband Size</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger id="wristbandSize" className="mt-1">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small (Child/Youth)</SelectItem>
                              <SelectItem value="medium">Medium (Adult Standard)</SelectItem>
                              <SelectItem value="large">Large (Adult Large)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="wristbandStyle" className="text-sm font-medium">Style</Label>
                          <Select defaultValue="classic">
                            <SelectTrigger id="wristbandStyle" className="mt-1">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="sport">Sport</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="medical">Medical Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <Download size={16} className="mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Printer size={16} className="mr-2" />
                          Print Design
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
                      <h3 className="font-medium text-[#006D77] mb-2">Order Professional Wristband</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Order a durable, professionally made medical alert wristband using your custom design.
                      </p>
                      <Button className="w-full bg-[#006D77] hover:bg-[#00585F]">
                        Order Medical Alert Wristband
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium mb-4">Information to Include</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeBloodType" className="flex items-center cursor-pointer">
                        <span className="mr-2">Blood Type</span>
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Critical</span>
                      </Label>
                      <Switch 
                        id="includeBloodType" 
                        checked={medicalIDData.includeBloodType}
                        onCheckedChange={(checked) => handleSwitchChange('includeBloodType', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeAllergies" className="flex items-center cursor-pointer">
                        <span className="mr-2">Allergies</span>
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Critical</span>
                      </Label>
                      <Switch 
                        id="includeAllergies" 
                        checked={medicalIDData.includeAllergies}
                        onCheckedChange={(checked) => handleSwitchChange('includeAllergies', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeConditions" className="cursor-pointer">Medical Conditions</Label>
                      <Switch 
                        id="includeConditions" 
                        checked={medicalIDData.includeConditions}
                        onCheckedChange={(checked) => handleSwitchChange('includeConditions', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeMedications" className="cursor-pointer">Medications</Label>
                      <Switch 
                        id="includeMedications" 
                        checked={medicalIDData.includeMedications}
                        onCheckedChange={(checked) => handleSwitchChange('includeMedications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeEmergencyContact" className="cursor-pointer">Emergency Contact</Label>
                      <Switch 
                        id="includeEmergencyContact" 
                        checked={medicalIDData.includeEmergencyContact}
                        onCheckedChange={(checked) => handleSwitchChange('includeEmergencyContact', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeAdvanceDirectives" className="cursor-pointer">Advance Directives</Label>
                      <Switch 
                        id="includeAdvanceDirectives" 
                        checked={medicalIDData.includeAdvanceDirectives}
                        onCheckedChange={(checked) => handleSwitchChange('includeAdvanceDirectives', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Edit Medical Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bloodType" className="text-sm">Blood Type</Label>
                        <Select value={medicalIDData.bloodType} onValueChange={(value) => handleSwitchChange('bloodType', value)}>
                          <SelectTrigger id="bloodType">
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="allergies" className="text-sm">Allergies</Label>
                        <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded-md bg-gray-50 min-h-10">
                          {medicalIDData.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center bg-white px-2 py-1 rounded-md border text-sm">
                              {allergy}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-5 w-5 p-0 ml-1"
                                onClick={() => {
                                  const newAllergies = [...medicalIDData.allergies];
                                  newAllergies.splice(index, 1);
                                  handleSwitchChange('allergies', newAllergies);
                                }}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="rounded-md text-[#006D77]">
                            <Plus size={14} className="mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
                        <AlertTriangle size={16} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700">
                          Your Medical ID information should be concise and focus on critical information that would help emergency responders provide appropriate care.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalIDBuilder;
