"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, Shield, CheckCircle, Accessibility, Download, 
  ChevronRight, QrCode, Bell, Settings, Save
} from 'lucide-react';

import ProfileEditor from './ProfileEditor';
import MedicalIDBuilder from './MedicalIDBuilder';
import PrivacyControls from './PrivacyControls';
import AccessibilitySettings from './AccessibilitySettings';
import EmergencyContacts from './EmergencyContacts';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [flowStep, setFlowStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<null | 'saving' | 'saved'>(null);

  // Mock save function
  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  // Step through the user flow
  const goToNext = () => {
    const steps = ['profile', 'emergency', 'privacy', 'medical-id'];
    const currentIndex = steps.indexOf(activeTab);
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1]);
      setFlowStep(currentIndex + 1);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Profile & Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account, medical ID, and privacy settings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave}
            className="bg-[#006D77] hover:bg-[#00585F]"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <>Saving<span className="animate-pulse">...</span></>
            ) : saveStatus === 'saved' ? (
              <><CheckCircle className="h-4 w-4 mr-2" />Saved</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save Changes</>
            )}
          </Button>
        </div>
      </div>
      
      {/* User Flow Indicator */}
      {flowStep > 0 && (
        <div className="mb-6">
          <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                    <CheckCircle size={16} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-green-800">Profile Settings</p>
                    <p className="text-sm text-gray-600">Basic information updated</p>
                  </div>
                </div>
                <ChevronRight className="mx-4 text-gray-400" size={16} />
                
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${flowStep >= 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {flowStep >= 1 ? <CheckCircle size={16} /> : '2'}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${flowStep >= 1 ? 'text-green-800' : 'text-gray-700'}`}>Emergency Contacts</p>
                    <p className="text-sm text-gray-600">{flowStep >= 1 ? 'Contacts configured' : 'Configure contacts'}</p>
                  </div>
                </div>
                <ChevronRight className="mx-4 text-gray-400" size={16} />
                
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${flowStep >= 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {flowStep >= 2 ? <CheckCircle size={16} /> : '3'}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${flowStep >= 2 ? 'text-green-800' : 'text-gray-700'}`}>Privacy Settings</p>
                    <p className="text-sm text-gray-600">{flowStep >= 2 ? 'Data sharing configured' : 'Configure sharing'}</p>
                  </div>
                </div>
                <ChevronRight className="mx-4 text-gray-400" size={16} />
                
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${flowStep >= 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {flowStep >= 3 ? <CheckCircle size={16} /> : '4'}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${flowStep >= 3 ? 'text-green-800' : 'text-gray-700'}`}>Medical ID</p>
                    <p className="text-sm text-gray-600">{flowStep >= 3 ? 'Medical ID generated' : 'Generate ID'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Emergency Contacts
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="medical-id" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <QrCode className="h-4 w-4 mr-2" />
            Medical ID
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <Accessibility className="h-4 w-4 mr-2" />
            Accessibility
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileEditor onComplete={goToNext} />
        </TabsContent>
        
        <TabsContent value="emergency">
          <EmergencyContacts onComplete={goToNext} />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacyControls onComplete={goToNext} />
        </TabsContent>
        
        <TabsContent value="medical-id">
          <MedicalIDBuilder />
        </TabsContent>
        
        <TabsContent value="accessibility">
          <AccessibilitySettings />
        </TabsContent>
      </Tabs>
      
      {/* Flow Navigation Buttons */}
      {activeTab !== 'accessibility' && (
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={goToNext}
            className="bg-[#006D77] hover:bg-[#00585F]"
            disabled={activeTab === 'medical-id'}
          >
            Continue to {activeTab === 'profile' ? 'Emergency Contacts' : 
                         activeTab === 'emergency' ? 'Privacy Settings' : 
                         activeTab === 'privacy' ? 'Medical ID' : ''}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
