import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { CalendarIcon, Camera, MapPin, Info, Edit, User, Phone } from 'lucide-react';

interface ProfileEditorProps {
  onComplete: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onComplete }) => {
  // Mock user data
  const [userData, setUserData] = useState({
    firstName: 'Sarah',
    lastName: 'Cooper',
    email: 'sarah.cooper@example.com',
    phone: '(555) 123-4567',
    dob: new Date('1990-06-15'),
    gender: 'female',
    address: '123 Main Street, Apartment 4B',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    bio: 'I am focused on maintaining a healthy lifestyle and managing my chronic conditions effectively.',
    isCaregiver: true,
    profilePhoto: '/avatars/sarah.jpg'
  });
  
  const handleChange = (field: string, value: any) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-[#006D77] flex items-center">
            <User className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <Avatar className="h-24 w-24 border-2 border-[#E8F3F4]">
                <AvatarImage src={userData.profilePhoto} alt={`${userData.firstName} ${userData.lastName}`} />
                <AvatarFallback className="bg-[#E8F3F4] text-[#006D77] text-2xl">
                  {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full bg-[#006D77] text-white hover:bg-[#00585F]"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-lg font-medium">{userData.firstName} {userData.lastName}</h2>
              <p className="text-gray-500 text-sm flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {userData.city}, {userData.state}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={userData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={userData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={userData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="dob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {userData.dob ? format(userData.dob, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={userData.dob}
                    onSelect={(date) => handleChange('dob', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-3">
              <Label htmlFor="gender">Gender</Label>
              <Select value={userData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-[#006D77] flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-3">
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address" 
                value={userData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                value={userData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="state">State</Label>
              <Select value={userData.state} onValueChange={(value) => handleChange('state', value)}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MA">Massachusetts</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  {/* More states would be added here */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input 
                id="zipCode" 
                value={userData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-[#006D77] flex items-center">
            <Info className="mr-2 h-5 w-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="bio">About Me</Label>
              <Textarea 
                id="bio" 
                value={userData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="min-h-32"
              />
              <p className="text-xs text-gray-500">This information may be visible to your healthcare providers.</p>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Switch 
                id="isCaregiver" 
                checked={userData.isCaregiver} 
                onCheckedChange={(checked) => handleChange('isCaregiver', checked)}
              />
              <Label htmlFor="isCaregiver" className="font-medium">I am a caregiver for someone else</Label>
            </div>
            <p className="text-sm text-gray-600 pl-7">
              This gives you access to caregiving features and family management tools.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button className="bg-[#006D77] hover:bg-[#00585F]" onClick={onComplete}>
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditor;
