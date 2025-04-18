import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, ChevronRight, Bell, Activity, CalendarClock, Pill, Users, Shield } from 'lucide-react';

const FamilyHealthOverview = () => {
  // Mock family members data
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: 'John Cooper',
      relationship: 'Spouse',
      age: 45,
      avatar: '/avatars/john.png',
      permissionLevel: 'full',
      status: 'healthy',
      alerts: 0
    },
    {
      id: 2,
      name: 'Emma Cooper',
      relationship: 'Daughter',
      age: 12,
      avatar: '/avatars/emma.png',
      permissionLevel: 'moderate',
      status: 'needs-attention',
      alerts: 1
    },
    {
      id: 3,
      name: 'Rose Wilson',
      relationship: 'Mother',
      age: 73,
      avatar: '/avatars/rose.png',
      permissionLevel: 'managed',
      status: 'stable',
      alerts: 2
    }
  ]);

  // Permission level badge color
  const getPermissionBadge = (level) => {
    switch(level) {
      case 'full':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Full Access</Badge>;
      case 'moderate': 
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Moderate Access</Badge>;
      case 'managed':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Managed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Limited</Badge>;
    }
  };

  // Status indicator
  const getStatusIndicator = (status) => {
    switch(status) {
      case 'healthy':
        return <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
      case 'needs-attention':
        return <span className="w-2 h-2 bg-amber-500 rounded-full"></span>;
      case 'critical':
        return <span className="w-2 h-2 bg-red-500 rounded-full"></span>;
      default:
        return <span className="w-2 h-2 bg-blue-500 rounded-full"></span>;
    }
  };

  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Users className="mr-2 h-5 w-5" />
          Family Health
        </CardTitle>
        <Link href="/patient/family" className="text-sm text-[#006D77] hover:underline flex items-center">
          Manage <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-[#F0F9FA] rounded-lg border border-[#E8F3F4] text-sm">
            <p className="flex items-center text-[#006D77]">
              <Shield className="h-4 w-4 mr-2" />
              Coordinate care and manage medications for your family members
            </p>
          </div>
          
          {familyMembers.map(member => (
            <div key={member.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div className="relative mr-3">
                <Avatar className="h-10 w-10 border-2 border-[#E8F3F4]">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-[#F0F9FA] text-[#006D77]">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 rounded-full p-0.5 bg-white">
                  {getStatusIndicator(member.status)}
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium flex items-center">
                      {member.name}
                      {member.alerts > 0 && (
                        <Badge variant="outline" className="ml-2 h-5 px-1.5 bg-amber-50 text-amber-800 border-amber-200">
                          {member.alerts}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">{member.age} yrs • {member.relationship}</p>
                  </div>
                  {getPermissionBadge(member.permissionLevel)}
                </div>
              </div>
            </div>
          ))}
          
          <Link href="/patient/family/add">
            <Button variant="outline" className="w-full justify-center border-dashed border-gray-300 text-gray-600 hover:text-[#006D77] hover:border-[#006D77]">
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyHealthOverview;