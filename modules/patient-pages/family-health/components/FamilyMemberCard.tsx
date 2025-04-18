"use client";

import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  ChevronRight, 
  Heart, 
  MoreVertical, 
  Pill, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Medication {
  name: string;
  dosage: string;
  schedule: string;
}

interface Appointment {
  id: string;
  date: Date;
  provider: string;
  type: string;
}

interface Alert {
  type: string;
  message: string;
  severity: string;
}

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  photo: string | null;
  color: string;
  isPrimary: boolean;
  healthStatus: string;
  conditions: string[];
  upcomingAppointments: Appointment[];
  medications: Medication[];
  alerts: Alert[];
  lastCheckup: Date;
  accessLevel: string;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  isSelected: boolean;
  onClick: () => void;
  onAction: () => void;
  getHealthStatusColor: (status: string) => string;
  formatDate: (date: Date) => string;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  isSelected,
  onClick,
  onAction,
  getHealthStatusColor,
  formatDate
}) => {
  // Get the next appointment, if any
  const nextAppointment = member.upcomingAppointments[0];
  
  // Get active medications count
  const medicationsCount = member.medications.length;
  
  // Get alerts count
  const alertsCount = member.alerts.length;

  // Get relationship-specific styling
  const getRelationshipStyle = (relationship: string, age: number) => {
    // Children get softer colors
    if (relationship === 'Son' || relationship === 'Daughter' || age < 18) {
      return "border-l-[#E9C46A]";
    }
    
    // Parents get warmer colors
    if (relationship === 'Father' || relationship === 'Mother') {
      return "border-l-[#F4A261]";
    }
    
    // Spouse gets a complementary color
    if (relationship === 'Spouse' || relationship === 'Partner') {
      return "border-l-[#2A9D8F]";
    }
    
    // Self gets the primary color
    if (relationship === 'Self') {
      return "border-l-[#006D77]";
    }
    
    // Other relationships
    return "border-l-gray-400";
  };

  // Get avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get the appropriate health icon
  const getHealthIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'good':
        return <Heart className="h-4 w-4 text-green-500" />;
      case 'fair':
        return <Heart className="h-4 w-4 text-amber-500" />;
      case 'poor':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Heart className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card 
      className={`border-l-4 transition-all ${getRelationshipStyle(member.relationship, member.age)} ${
        isSelected ? 'ring-2 ring-[#006D77] ring-opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: member.color }}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  getInitials(member.name)
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{member.relationship}</span>
                  {member.isPrimary && (
                    <Badge variant="outline" className="text-xs border-[#006D77] text-[#006D77]">
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Manage {member.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Schedule Appointment</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Manage Medications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-sm">
              <span className="text-gray-500">Age:</span> {member.age}
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Gender:</span> {member.gender}
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Status:</span>{' '}
              <span className="inline-flex items-center">
                {getHealthIcon(member.healthStatus)}
                <span className="ml-1">{member.healthStatus.charAt(0).toUpperCase() + member.healthStatus.slice(1)}</span>
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Last Checkup:</span> {formatDate(member.lastCheckup)}
            </div>
          </div>
          
          {member.conditions.length > 0 && (
            <div className="mt-3">
              <div className="text-sm text-gray-500 mb-1">Health Conditions:</div>
              <div className="flex flex-wrap gap-1">
                {member.conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4">
              {medicationsCount > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                  <Pill className="h-4 w-4 mr-1" />
                  <span>{medicationsCount}</span>
                </Button>
              )}
              
              {nextAppointment && (
                <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(nextAppointment.date, 'MMM d')}</span>
                </Button>
              )}
              
              {alertsCount > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>{alertsCount}</span>
                </Button>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-[#006D77]"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
                onAction();
              }}
            >
              Manage
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;
