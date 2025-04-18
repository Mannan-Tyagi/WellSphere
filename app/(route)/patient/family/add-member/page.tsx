"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  UserPlus, 
  CalendarClock, 
  Mail, 
  Phone, 
  Heart, 
  AlertTriangle, 
  Shield, 
  Save,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function AddFamilyMemberPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: false,
    healthcareDecisionMaker: false,
    healthConditions: [] as string[],
    allergies: [] as string[],
    medications: [] as string[],
    notes: '',
    accessLevel: 'limited',
  });
  
  const [accessSettings, setAccessSettings] = useState({
    appointments: true,
    medications: true,
    conditions: true,
    allergies: true,
    testResults: false,
    billing: false,
  });
  
  const [activeTab, setActiveTab] = useState('personal');
  
  // Handle text input changes
  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle checkbox changes for health conditions
  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setFormData({ 
        ...formData, 
        healthConditions: [...formData.healthConditions, condition] 
      });
    } else {
      setFormData({
        ...formData,
        healthConditions: formData.healthConditions.filter(c => c !== condition)
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, accessSettings);
    // In a real app, we would save this data to the backend
    
    // Navigate back to the family health hub
    router.push('/patient/family');
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Link href="/patient/family" className="mr-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Add Family Member</h1>
            <p className="text-gray-600 mt-1">
              Add a family member to manage their health information
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="health">Health Profile</TabsTrigger>
            <TabsTrigger value="access">Access Settings</TabsTrigger>
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card className="border-[#E8F3F4]">
              <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select 
                      value={formData.relationship}
                      onValueChange={(value) => handleChange('relationship', value)}
                      required
                    >
                      <SelectTrigger id="relationship">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date" 
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label>Gender</Label>
                    <RadioGroup 
                      value={formData.gender}
                      onValueChange={(value) => handleChange('gender', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Non-binary/Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3 md:col-span-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Textarea 
                      id="address" 
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emergencyContact"
                      checked={formData.emergencyContact}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, emergencyContact: checked as boolean })
                      }
                    />
                    <Label htmlFor="emergencyContact">Add as emergency contact</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="healthcareDecisionMaker"
                      checked={formData.healthcareDecisionMaker}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, healthcareDecisionMaker: checked as boolean })
                      }
                    />
                    <Label htmlFor="healthcareDecisionMaker">Designate as healthcare decision maker</Label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => router.push('/patient/family')}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-[#006D77] hover:bg-[#005a66]"
                    onClick={() => setActiveTab('health')}
                  >
                    Continue to Health Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Health Profile Tab */}
          <TabsContent value="health" className="space-y-4 mt-4">
            <Card className="border-[#E8F3F4]">
              <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <Heart className="mr-2 h-5 w-5" />
                  Health Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">Health Conditions</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Select any health conditions this family member has been diagnosed with
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Hypertension', 'Type 2 Diabetes', 'Type 1 Diabetes', 'Heart Disease',
                        'Asthma', 'Allergies', 'Arthritis', 'Cancer', 'Stroke', 'COPD',
                        'Kidney Disease', 'Liver Disease', 'Thyroid Disorder', 'Mental Health Condition'
                      ].map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`condition-${condition}`}
                            checked={formData.healthConditions.includes(condition)}
                            onCheckedChange={(checked) => 
                              handleConditionChange(condition, checked as boolean)
                            }
                          />
                          <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-base" htmlFor="allergies">Allergies</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      List any allergies, including medications, food, and environmental
                    </p>
                    <Textarea 
                      id="allergies" 
                      placeholder="Enter allergies, separated by commas"
                      value={formData.allergies.join(', ')}
                      onChange={(e) => {
                        const allergiesArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                        setFormData({ ...formData, allergies: allergiesArray });
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-base" htmlFor="medications">Current Medications</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      List any medications this family member is currently taking
                    </p>
                    <Textarea 
                      id="medications" 
                      placeholder="Enter medications, separated by commas"
                      value={formData.medications.join(', ')}
                      onChange={(e) => {
                        const medsArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                        setFormData({ ...formData, medications: medsArray });
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-base" htmlFor="notes">Additional Health Notes</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Any other important health information
                    </p>
                    <Textarea 
                      id="notes" 
                      placeholder="Enter any additional health information"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setActiveTab('personal')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-[#006D77] hover:bg-[#005a66]"
                    onClick={() => setActiveTab('access')}
                  >
                    Continue to Access Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Access Settings Tab */}
          <TabsContent value="access" className="space-y-4 mt-4">
            <Card className="border-[#E8F3F4]">
              <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <Shield className="mr-2 h-5 w-5" />
                  Access Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">Access Level</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Determine how much access this family member has to your health information
                    </p>
                    
                    <RadioGroup 
                      value={formData.accessLevel}
                      onValueChange={(value) => handleChange('accessLevel', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="owner" id="owner" className="mt-1" />
                        <div>
                          <Label htmlFor="owner" className="text-base">Account Owner</Label>
                          <p className="text-sm text-gray-500">
                            Full access to manage all family health information and account settings
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="full" id="full" className="mt-1" />
                        <div>
                          <Label htmlFor="full" className="text-base">Full Access</Label>
                          <p className="text-sm text-gray-500">
                            Can view and manage all health records, but cannot change account settings
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="guardian" id="guardian" className="mt-1" />
                        <div>
                          <Label htmlFor="guardian" className="text-base">Guardian Access</Label>
                          <p className="text-sm text-gray-500">
                            Parent/guardian access for a dependent's health records
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 p-3 border rounded-md bg-[#F0F9FA]">
                        <RadioGroupItem value="limited" id="limited" className="mt-1" checked />
                        <div>
                          <Label htmlFor="limited" className="text-base">Limited Access</Label>
                          <p className="text-sm text-gray-500">
                            Can only view specific health information that you allow
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-base">Information Sharing</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Select what specific health information to share with this family member
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <CalendarClock className="h-5 w-5 mr-2 text-[#006D77]" />
                          <Label htmlFor="appointments">Appointments</Label>
                        </div>
                        <Switch 
                          id="appointments"
                          checked={accessSettings.appointments}
                          onCheckedChange={(checked) => 
                            setAccessSettings({ ...accessSettings, appointments: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-[#006D77]" />
                          <Label htmlFor="conditions">Health Conditions</Label>
                        </div>
                        <Switch 
                          id="conditions"
                          checked={accessSettings.conditions}
                          onCheckedChange={(checked) => 
                            setAccessSettings({ ...accessSettings, conditions: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-[#006D77]" />
                          <Label htmlFor="allergies">Allergies</Label>
                        </div>
                        <Switch 
                          id="allergies"
                          checked={accessSettings.allergies}
                          onCheckedChange={(checked) => 
                            setAccessSettings({ ...accessSettings, allergies: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-[#006D77]" />
                          <Label htmlFor="testResults">Test Results</Label>
                        </div>
                        <Switch 
                          id="testResults"
                          checked={accessSettings.testResults}
                          onCheckedChange={(checked) => 
                            setAccessSettings({ ...accessSettings, testResults: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-[#006D77]" />
                          <Label htmlFor="medications">Medications</Label>
                        </div>
                        <Switch 
                          id="medications"
                          checked={accessSettings.medications}
                          onCheckedChange={(checked) => 
                            setAccessSettings({ ...accessSettings, medications: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setActiveTab('health')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#006D77] hover:bg-[#005a66]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
