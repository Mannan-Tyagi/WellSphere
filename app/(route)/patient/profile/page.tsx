"use client";

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Save, 
  CheckCircle, 
  Phone, 
  Mail, 
  Home, 
  Calendar, 
  Users, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Emma',
    lastName: 'Cooper',
    email: 'emma.cooper@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'female',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    emergencyContact: 'John Cooper',
    emergencyPhone: '(555) 987-6543',
    emergencyRelationship: 'Spouse'
  });
  
  // Medical information state
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: 'Penicillin, Peanuts',
    medications: 'Lisinopril 10mg, Atorvastatin 20mg',
    conditions: 'Hypertension, High Cholesterol',
    bloodType: 'O+',
    height: '165',
    weight: '68',
    primaryDoctor: 'Dr. Sarah Johnson',
    insuranceProvider: 'Blue Cross Blue Shield',
    insurancePolicyNumber: 'BCB12345678',
    insuranceGroupNumber: 'G-9876543'
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    allowDataSharing: true,
    allowResearchParticipation: false,
    showFamilyAccess: true,
    allowMarketingCommunications: false,
    enableTwoFactorAuth: true,
    allowAppointmentReminders: true,
    allowMedicationReminders: true
  });
  
  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle medical info changes
  const handleMedicalInfoChange = (e) => {
    const { name, value } = e.target;
    setMedicalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle privacy settings changes
  const handlePrivacySettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle save
  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      
      // Reset to idle after showing "Saved" for a moment
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#006D77]">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        
        <Button 
          onClick={handleSave}
          className="bg-[#006D77] hover:bg-[#00585F] mt-4 md:mt-0"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <>Saving<span className="animate-pulse">...</span></>
          ) : saveStatus === 'saved' ? (
            <><CheckCircle className="mr-2 h-4 w-4" />Saved</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Save Changes</>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Overview */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-[#E8F3F4]">
                  <AvatarImage src="/avatars/emma.png" alt="Emma Cooper" />
                  <AvatarFallback className="text-2xl">EC</AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute bottom-0 right-0 h-8 w-8 p-0 bg-[#006D77] text-white rounded-full shadow-md hover:bg-[#00585F]"
                >
                  <User size={14} />
                </Button>
              </div>
              
              <h2 className="font-medium text-lg mt-4">{personalInfo.firstName} {personalInfo.lastName}</h2>
              <p className="text-gray-500 text-sm">{personalInfo.email}</p>
              
              <div className="w-full border-t mt-6 pt-4">
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/patient/family" 
                      className="flex items-center justify-between text-gray-700 hover:text-[#006D77]"
                    >
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Family Members
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/patient/emergency-contacts" 
                      className="flex items-center justify-between text-gray-700 hover:text-[#006D77]"
                    >
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Emergency Contacts
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/patient/profile/activity" 
                      className="flex items-center justify-between text-gray-700 hover:text-[#006D77]"
                    >
                      <span className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Account Security
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Details Tabs */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy & Sharing</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="personal" className="mt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input 
                        id="dateOfBirth" 
                        name="dateOfBirth" 
                        type="date" 
                        value={personalInfo.dateOfBirth}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select 
                        id="gender" 
                        name="gender" 
                        className="w-full p-2 border rounded-md"
                        value={personalInfo.gender}
                        onChange={handlePersonalInfoChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={personalInfo.city}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={personalInfo.state}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        value={personalInfo.zipCode}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <h3 className="font-medium mb-3">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">Name</Label>
                        <Input 
                          id="emergencyContact" 
                          name="emergencyContact" 
                          value={personalInfo.emergencyContact}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Phone</Label>
                        <Input 
                          id="emergencyPhone" 
                          name="emergencyPhone" 
                          value={personalInfo.emergencyPhone}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyRelationship">Relationship</Label>
                        <Input 
                          id="emergencyRelationship" 
                          name="emergencyRelationship" 
                          value={personalInfo.emergencyRelationship}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="mt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea 
                        id="allergies" 
                        name="allergies" 
                        placeholder="List all allergies"
                        value={medicalInfo.allergies}
                        onChange={handleMedicalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea 
                        id="medications" 
                        name="medications" 
                        placeholder="List all medications"
                        value={medicalInfo.medications}
                        onChange={handleMedicalInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Textarea 
                      id="conditions" 
                      name="conditions" 
                      placeholder="List any chronic conditions"
                      value={medicalInfo.conditions}
                      onChange={handleMedicalInfoChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <select 
                        id="bloodType" 
                        name="bloodType" 
                        className="w-full p-2 border rounded-md"
                        value={medicalInfo.bloodType}
                        onChange={handleMedicalInfoChange}
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input 
                        id="height" 
                        name="height" 
                        type="number" 
                        value={medicalInfo.height}
                        onChange={handleMedicalInfoChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input 
                        id="weight" 
                        name="weight" 
                        type="number" 
                        value={medicalInfo.weight}
                        onChange={handleMedicalInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <h3 className="font-medium mb-3">Provider Information</h3>
                    <div className="mb-4">
                      <Label htmlFor="primaryDoctor">Primary Care Provider</Label>
                      <Input 
                        id="primaryDoctor" 
                        name="primaryDoctor" 
                        value={medicalInfo.primaryDoctor}
                        onChange={handleMedicalInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <h3 className="font-medium mb-3">Insurance Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="insuranceProvider">Provider</Label>
                        <Input 
                          id="insuranceProvider" 
                          name="insuranceProvider" 
                          value={medicalInfo.insuranceProvider}
                          onChange={handleMedicalInfoChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                        <Input 
                          id="insurancePolicyNumber" 
                          name="insurancePolicyNumber" 
                          value={medicalInfo.insurancePolicyNumber}
                          onChange={handleMedicalInfoChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insuranceGroupNumber">Group Number</Label>
                        <Input 
                          id="insuranceGroupNumber" 
                          name="insuranceGroupNumber" 
                          value={medicalInfo.insuranceGroupNumber}
                          onChange={handleMedicalInfoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Data Sharing</h3>
                      <p className="text-sm text-gray-500">
                        Allow your healthcare providers to share your data with each other
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.allowDataSharing} 
                      onCheckedChange={(value) => handlePrivacySettingChange('allowDataSharing', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Research Participation</h3>
                      <p className="text-sm text-gray-500">
                        Allow anonymous data sharing for medical research
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.allowResearchParticipation} 
                      onCheckedChange={(value) => handlePrivacySettingChange('allowResearchParticipation', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Family Access</h3>
                      <p className="text-sm text-gray-500">
                        Allow designated family members to view your health information
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.showFamilyAccess} 
                      onCheckedChange={(value) => handlePrivacySettingChange('showFamilyAccess', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Communications</h3>
                      <p className="text-sm text-gray-500">
                        Receive updates about new features and health services
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.allowMarketingCommunications} 
                      onCheckedChange={(value) => handlePrivacySettingChange('allowMarketingCommunications', value)}
                    />
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <h3 className="font-medium mb-3">Account Security</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch 
                        checked={privacySettings.enableTwoFactorAuth} 
                        onCheckedChange={(value) => handlePrivacySettingChange('enableTwoFactorAuth', value)}
                      />
                    </div>
                    
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Account Verification</h4>
                          <p className="text-sm text-amber-700">
                            To ensure your account security, please verify your email address.
                          </p>
                          <Button className="mt-2 bg-amber-600 hover:bg-amber-700">
                            Verify Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <h3 className="font-medium mb-3">Notification Preferences</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Appointment Reminders</h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications before scheduled appointments
                        </p>
                      </div>
                      <Switch 
                        checked={privacySettings.allowAppointmentReminders} 
                        onCheckedChange={(value) => handlePrivacySettingChange('allowAppointmentReminders', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Medication Reminders</h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications for medication schedules
                        </p>
                      </div>
                      <Switch 
                        checked={privacySettings.allowMedicationReminders} 
                        onCheckedChange={(value) => handlePrivacySettingChange('allowMedicationReminders', value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
