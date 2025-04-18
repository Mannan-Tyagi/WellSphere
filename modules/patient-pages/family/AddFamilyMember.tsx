import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, User, Users, Calendar, Search, Check, 
  Shield, Bell, EyeOff, Info, AlertCircle
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  RadioGroup, RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { 
  Calendar as CalendarComponent, 
  CalendarCell 
} from '@/components/ui/calendar';

const AddFamilyMember = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [permissionLevel, setPermissionLevel] = useState('moderate');
  const [showHealthConditions, setShowHealthConditions] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: '',
    birthDate: '',
    gender: '',
    address: '',
    emergencyContact: false,
    shareHealthData: true,
    medications: true,
    appointments: true,
    testResults: false,
    healthMetrics: true,
    healthReminders: true,
    specialNeeds: '',
    allergies: [],
    conditions: []
  });
  
  // Handle form changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Navigate to next or previous step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to backend
    // Then navigate to family members page
    router.push('/patient/family');
  };
  
  // Permission level descriptions
  const permissionDescriptions = {
    full: "Full access to all health information, similar to your own access",
    moderate: "Access to selected health information with your approval",
    limited: "Basic information only, minimal access to health records",
    managed: "You manage their health information completely (for dependents)"
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
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
      
      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="relative flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  currentStep > step 
                    ? 'bg-[#006D77] text-white' 
                    : currentStep === step 
                      ? 'bg-[#E8F3F4] text-[#006D77] border border-[#006D77]' 
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {currentStep > step ? <Check size={16} /> : step}
                </div>
                <div className="text-xs mt-1 whitespace-nowrap">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Permissions' : 'Health Info'}
                </div>
              </div>
              
              {step < 3 && (
                <div className={`h-0.5 w-12 md:w-24 ${
                  currentStep > step ? 'bg-[#006D77]' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-[#006D77]">
              {currentStep === 1 && <User className="mr-2 h-5 w-5" />}
              {currentStep === 2 && <Shield className="mr-2 h-5 w-5" />}
              {currentStep === 3 && <Users className="mr-2 h-5 w-5" />}
              {currentStep === 1 
                ? 'Basic Information' 
                : currentStep === 2 
                  ? 'Access Permissions' 
                  : 'Health Information'
              }
            </CardTitle>
            <CardDescription>
              {currentStep === 1 
                ? 'Enter your family member\'s personal information' 
                : currentStep === 2 
                  ? 'Configure what health information this person can access' 
                  : 'Add relevant health details for care coordination'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-[#006D77] border-[#006D77]">
                        <Search size={14} className="mr-1" />
                        Find Existing User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Find Family Member</DialogTitle>
                        <DialogDescription>
                          Search for an existing WellSphere user by email or phone number.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Email or phone number" 
                            className="flex-grow"
                          />
                          <Button className="bg-[#006D77] hover:bg-[#00585F]">
                            <Search size={16} className="mr-1" />
                            Search
                          </Button>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                          No results found. Enter different search criteria or create a new family member.
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowSearchDialog(false)}
                        >
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.relationship} 
                      onValueChange={(value) => handleChange('relationship', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
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
                  <div>
                    <Label htmlFor="birthDate">Date of Birth <span className="text-red-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.birthDate ? format(new Date(formData.birthDate), 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          initialFocus
                          selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                          onSelect={(date) => handleChange('birthDate', date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Gender <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={formData.gender}
                      onValueChange={(value) => handleChange('gender', value)}
                      className="flex space-x-4 mt-2"
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
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mt-4">
                  <Checkbox 
                    id="emergencyContact"
                    checked={formData.emergencyContact}
                    onCheckedChange={(checked) => handleChange('emergencyContact', checked)}
                  />
                  <div>
                    <Label 
                      htmlFor="emergencyContact" 
                      className="font-medium"
                    >
                      Emergency Contact
                    </Label>
                    <p className="text-sm text-gray-500">
                      Designate this person as an emergency contact who can be reached if you need help.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Access Permissions */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Alert className="bg-[#F0F9FA] border-[#E8F3F4]">
                  <Info className="h-4 w-4 text-[#006D77]" />
                  <AlertTitle className="text-[#006D77]">Privacy Information</AlertTitle>
                  <AlertDescription className="text-gray-600">
                    Choose what health information you want to share with this family member.
                    You can change these settings at any time.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label className="text-base font-medium">Access Level</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Select the overall access level for this family member
                  </p>
                  
                  <RadioGroup 
                    value={permissionLevel}
                    onValueChange={setPermissionLevel}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="full" id="full" className="mt-1" />
                      <div>
                        <Label htmlFor="full" className="font-medium">Full Access</Label>
                        <p className="text-sm text-gray-600">{permissionDescriptions.full}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                      <div>
                        <Label htmlFor="moderate" className="font-medium">Moderate Access</Label>
                        <p className="text-sm text-gray-600">{permissionDescriptions.moderate}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="limited" id="limited" className="mt-1" />
                      <div>
                        <Label htmlFor="limited" className="font-medium">Limited Access</Label>
                        <p className="text-sm text-gray-600">{permissionDescriptions.limited}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="managed" id="managed" className="mt-1" />
                      <div>
                        <Label htmlFor="managed" className="font-medium">Managed (You control their health)</Label>
                        <p className="text-sm text-gray-600">{permissionDescriptions.managed}</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Shared Information</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Customize exactly what information is shared
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="shareHealthData"
                          checked={formData.shareHealthData}
                          onCheckedChange={(checked) => handleChange('shareHealthData', checked)}
                        />
                        <div>
                          <Label htmlFor="shareHealthData" className="font-medium">Share Health Data</Label>
                          <p className="text-sm text-gray-600">Enable health data sharing with this person</p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-gray-400 cursor-help">
                              <Info size={16} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              Master toggle for all health data sharing. Turn off to disable all sharing.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {formData.shareHealthData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="medications"
                            checked={formData.medications}
                            onCheckedChange={(checked) => handleChange('medications', checked)}
                          />
                          <Label htmlFor="medications" className="text-sm">Medications</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="appointments"
                            checked={formData.appointments}
                            onCheckedChange={(checked) => handleChange('appointments', checked)}
                          />
                          <Label htmlFor="appointments" className="text-sm">Appointments</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="testResults"
                            checked={formData.testResults}
                            onCheckedChange={(checked) => handleChange('testResults', checked)}
                          />
                          <Label htmlFor="testResults" className="text-sm">Test Results</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="healthMetrics"
                            checked={formData.healthMetrics}
                            onCheckedChange={(checked) => handleChange('healthMetrics', checked)}
                          />
                          <Label htmlFor="healthMetrics" className="text-sm">Health Metrics</Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="healthReminders"
                    checked={formData.healthReminders}
                    onCheckedChange={(checked) => handleChange('healthReminders', checked)}
                  />
                  <div>
                    <Label htmlFor="healthReminders" className="font-medium">Health Reminders</Label>
                    <p className="text-sm text-gray-600">
                      Send medication and appointment reminders to this person
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Health Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="text-[#006D77] border-[#006D77]"
                    onClick={() => setShowHealthConditions(!showHealthConditions)}
                  >
                    {showHealthConditions ? 'Hide Health Conditions' : 'Add Health Conditions'}
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-gray-500 cursor-help">
                          <EyeOff size={14} className="mr-1" />
                          <span className="text-xs">Private Information</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Health information added here is only visible to you and healthcare providers unless you grant explicit access.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {showHealthConditions && (
                  <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium flex items-center">
                      <AlertCircle size={16} className="mr-2 text-amber-600" />
                      Health Conditions
                    </h3>
                    
                    <div>
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input 
                        id="allergies"
                        placeholder="Enter allergies (e.g., Penicillin, Peanuts)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate multiple allergies with commas
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="conditions">Medical Conditions</Label>
                      <Input 
                        id="conditions"
                        placeholder="Enter medical conditions (e.g., Asthma, Diabetes)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate multiple conditions with commas
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="specialNeeds">Special Needs or Considerations</Label>
                      <Input 
                        id="specialNeeds"
                        placeholder="Enter any special needs (e.g., Wheelchair access)"
                        value={formData.specialNeeds}
                        onChange={(e) => handleChange('specialNeeds', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-800" />
                  <AlertTitle className="text-amber-800">Important</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Adding family members to your WellSphere account helps coordinate care across your entire family. 
                    This person will receive an email invitation to connect if you provided their email address.
                  </AlertDescription>
                </Alert>
                
                <div className="border-t pt-4">
                  <Label className="text-base font-medium">Next Steps</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-[#F0F9FA] text-[#006D77] flex items-center justify-center mr-2 flex-shrink-0">
                        1
                      </div>
                      <p className="text-sm text-gray-600">
                        After adding this family member, you can set up specific health monitoring for them.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-[#F0F9FA] text-[#006D77] flex items-center justify-center mr-2 flex-shrink-0">
                        2
                      </div>
                      <p className="text-sm text-gray-600">
                        You'll be able to track medications, appointments, and health metrics in one place.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-[#F0F9FA] text-[#006D77] flex items-center justify-center mr-2 flex-shrink-0">
                        3
                      </div>
                      <p className="text-sm text-gray-600">
                        Caregiving features will be available for members you manage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={goToNextStep}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="bg-[#006D77] hover:bg-[#00585F]"
                >
                  Add Family Member
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddFamilyMember;
