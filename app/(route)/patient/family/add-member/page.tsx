"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

export default function AddFamilyMemberPage() {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  const [step, setStep] = useState(1);
  
  // Form state
  const [memberInfo, setMemberInfo] = useState({
    firstName: '',
    lastName: '',
    relationship: 'child',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phone: '',
    shareData: false,
    shareAll: false,
    shareAppointments: false,
    shareMedications: false,
    shareVitals: false,
    shareLabResults: false,
    isMinor: false,
    isCaregiver: false,
    address: {
      sameAsMe: true,
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMemberInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setMemberInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // If relationship is child, automatically set isMinor to true
    if (name === 'relationship' && value === 'child') {
      setMemberInfo(prev => ({
        ...prev,
        isMinor: true
      }));
    }
    
    // If relationship is parent, automatically set isCaregiver to true
    if (name === 'relationship' && value === 'parent') {
      setMemberInfo(prev => ({
        ...prev,
        isCaregiver: true
      }));
    }
  };
  
  // Handle radio group changes
  const handleRadioChange = (name, value) => {
    setMemberInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSave();
    }
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
        router.push('/patient/family');
      }, 1500);
    }, 2000);
  };
  
  // Check if current step is valid to proceed
  const isStepValid = () => {
    if (step === 1) {
      return memberInfo.firstName && 
             memberInfo.lastName && 
             memberInfo.relationship && 
             memberInfo.dateOfBirth;
    }
    
    if (step === 2) {
      return true; // No required fields in step 2
    }
    
    return true;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 text-gray-500" 
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#006D77]">Add Family Member</h1>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`h-1 flex-grow mx-2 ${
              step >= 2 ? 'bg-[#006D77]' : 'bg-gray-200'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`h-1 flex-grow mx-2 ${
              step >= 3 ? 'bg-[#006D77]' : 'bg-gray-200'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div className="text-center w-full">Basic Info</div>
          <div className="text-center w-full">Contact</div>
          <div className="text-center w-full">Permissions</div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-[#E8F3F4]">
                      <AvatarFallback className="bg-[#F0F9FA] text-[#006D77] text-2xl">
                        {memberInfo.firstName && memberInfo.lastName 
                          ? memberInfo.firstName[0] + memberInfo.lastName[0]
                          : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute bottom-0 right-0 h-8 w-8 p-0 bg-[#006D77] text-white rounded-full shadow-md hover:bg-[#00585F]"
                    >
                      <User size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={memberInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={memberInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <select 
                    id="relationship" 
                    name="relationship" 
                    className="w-full p-2 border rounded-md"
                    value={memberInfo.relationship}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="spouse">Spouse/Partner</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other-family">Other Family Member</option>
                    <option value="caregiver">Caregiver</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input 
                      id="dateOfBirth" 
                      name="dateOfBirth" 
                      type="date" 
                      value={memberInfo.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <RadioGroup 
                      value={memberInfo.gender} 
                      onValueChange={(value) => handleRadioChange('gender', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="gender-male" />
                        <Label htmlFor="gender-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="gender-female" />
                        <Label htmlFor="gender-female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="gender-other" />
                        <Label htmlFor="gender-other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="isMinor" 
                    name="isMinor"
                    checked={memberInfo.isMinor}
                    onCheckedChange={(checked) => handleInputChange({ 
                      target: { name: 'isMinor', type: 'checkbox', checked } 
                    })}
                  />
                  <Label htmlFor="isMinor">This person is a minor</Label>
                </div>
                
                {memberInfo.isMinor && (
                  <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                    For minors under 18, you will be designated as their caregiver and have full access to their health information.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={memberInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={memberInfo.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="sameAddress" 
                      name="address.sameAsMe"
                      checked={memberInfo.address.sameAsMe}
                      onCheckedChange={(checked) => handleInputChange({ 
                        target: { name: 'address.sameAsMe', type: 'checkbox', checked } 
                      })}
                    />
                    <Label htmlFor="sameAddress">Same address as me</Label>
                  </div>
                  
                  {!memberInfo.address.sameAsMe && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input 
                          id="street" 
                          name="address.street" 
                          value={memberInfo.address.street}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="address.city" 
                            value={memberInfo.address.city}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="address.state" 
                            value={memberInfo.address.state}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input 
                            id="zipCode" 
                            name="address.zipCode" 
                            value={memberInfo.address.zipCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isCaregiver" 
                      name="isCaregiver"
                      checked={memberInfo.isCaregiver}
                      onCheckedChange={(checked) => handleInputChange({ 
                        target: { name: 'isCaregiver', type: 'checkbox', checked } 
                      })}
                    />
                    <Label htmlFor="isCaregiver">This person is my caregiver</Label>
                  </div>
                  
                  {memberInfo.isCaregiver && (
                    <div className="p-3 bg-blue-50 rounded-md mt-2 text-sm text-blue-700">
                      As a caregiver, this person will have access to your health information and can help manage your care.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Permissions */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-medium mb-4">Health Information Sharing</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-700">
                        When sharing health information with family members, please consider privacy implications. 
                        You can customize exactly what information is shared below.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <Checkbox 
                    id="shareData" 
                    name="shareData"
                    checked={memberInfo.shareData}
                    onCheckedChange={(checked) => {
                      handleInputChange({ 
                        target: { name: 'shareData', type: 'checkbox', checked } 
                      });
                      
                      // If shareData is unchecked, uncheck all sharing options
                      if (!checked) {
                        handleInputChange({ 
                          target: { name: 'shareAll', type: 'checkbox', checked: false } 
                        });
                        handleInputChange({ 
                          target: { name: 'shareAppointments', type: 'checkbox', checked: false } 
                        });
                        handleInputChange({ 
                          target: { name: 'shareMedications', type: 'checkbox', checked: false } 
                        });
                        handleInputChange({ 
                          target: { name: 'shareVitals', type: 'checkbox', checked: false } 
                        });
                        handleInputChange({ 
                          target: { name: 'shareLabResults', type: 'checkbox', checked: false } 
                        });
                      }
                    }}
                  />
                  <Label htmlFor="shareData" className="font-medium">Share health information with this person</Label>
                </div>
                
                {memberInfo.shareData && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="shareAll" 
                        name="shareAll"
                        checked={memberInfo.shareAll}
                        onCheckedChange={(checked) => {
                          handleInputChange({ 
                            target: { name: 'shareAll', type: 'checkbox', checked } 
                          });
                          
                          // If shareAll is checked, check all options
                          if (checked) {
                            handleInputChange({ 
                              target: { name: 'shareAppointments', type: 'checkbox', checked: true } 
                            });
                            handleInputChange({ 
                              target: { name: 'shareMedications', type: 'checkbox', checked: true } 
                            });
                            handleInputChange({ 
                              target: { name: 'shareVitals', type: 'checkbox', checked: true } 
                            });
                            handleInputChange({ 
                              target: { name: 'shareLabResults', type: 'checkbox', checked: true } 
                            });
                          }
                        }}
                      />
                      <Label htmlFor="shareAll" className="font-medium">Share all health information</Label>
                    </div>
                    
                    {!memberInfo.shareAll && (
                      <div className="space-y-2 pl-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="shareAppointments" 
                            name="shareAppointments"
                            checked={memberInfo.shareAppointments}
                            onCheckedChange={(checked) => handleInputChange({ 
                              target: { name: 'shareAppointments', type: 'checkbox', checked } 
                            })}
                          />
                          <Label htmlFor="shareAppointments">Appointments</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="shareMedications" 
                            name="shareMedications"
                            checked={memberInfo.shareMedications}
                            onCheckedChange={(checked) => handleInputChange({ 
                              target: { name: 'shareMedications', type: 'checkbox', checked } 
                            })}
                          />
                          <Label htmlFor="shareMedications">Medications</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="shareVitals" 
                            name="shareVitals"
                            checked={memberInfo.shareVitals}
                            onCheckedChange={(checked) => handleInputChange({ 
                              target: { name: 'shareVitals', type: 'checkbox', checked } 
                            })}
                          />
                          <Label htmlFor="shareVitals">Vital signs</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="shareLabResults" 
                            name="shareLabResults"
                            checked={memberInfo.shareLabResults}
                            onCheckedChange={(checked) => handleInputChange({ 
                              target: { name: 'shareLabResults', type: 'checkbox', checked } 
                            })}
                          />
                          <Label htmlFor="shareLabResults">Lab results</Label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </Button>
            
            <Button 
              className="bg-[#006D77] hover:bg-[#00585F]"
              onClick={handleNextStep}
              disabled={!isStepValid() || (step === 3 && saveStatus === 'saving')}
            >
              {step < 3 ? (
                'Continue'
              ) : saveStatus === 'saving' ? (
                <>Saving<span className="animate-pulse">...</span></>
              ) : saveStatus === 'saved' ? (
                <><CheckCircle className="mr-2 h-4 w-4" />Saved</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Save Family Member</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
