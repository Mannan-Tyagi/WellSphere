"use client";

import React, { useState } from 'react';
import { format, isPast, isToday, addMonths } from 'date-fns';
import { 
  Syringe, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Info,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  // Other properties not needed for this component
  [key: string]: any;
}

interface VaccinationScheduleProps {
  familyMembers: FamilyMember[];
}

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({ familyMembers }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Mock vaccination data
  const vaccinations = [
    {
      id: 1,
      memberId: 1, // John Smith
      type: 'Influenza',
      date: addMonths(new Date(), 1),
      status: 'scheduled',
      location: 'Central Medical Center',
      notes: 'Annual flu shot'
    },
    {
      id: 2,
      memberId: 3, // Emma Smith
      type: 'Influenza',
      date: addMonths(new Date(), 1),
      status: 'scheduled',
      location: 'Central Medical Center',
      notes: 'Annual flu shot - pediatric dose'
    },
    {
      id: 3,
      memberId: 3, // Emma Smith
      type: 'DTaP',
      date: addMonths(new Date(), 2),
      status: 'due',
      location: null,
      notes: 'Booster shot needed'
    },
    {
      id: 4,
      memberId: 4, // Robert Smith
      type: 'Pneumococcal',
      date: addMonths(new Date(), -3),
      status: 'completed',
      location: 'Westside Health Clinic',
      notes: 'Recommended for age 65+'
    },
    {
      id: 5,
      memberId: 4, // Robert Smith
      type: 'Influenza',
      date: addMonths(new Date(), 1),
      status: 'scheduled',
      location: 'Central Medical Center',
      notes: 'High-dose influenza vaccine for seniors'
    }
  ];
  
  // Get vaccination status badge
  const getVaccinationStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Calendar size={12} className="mr-1" />
            Scheduled
          </Badge>
        );
      case 'due':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertTriangle size={12} className="mr-1" />
            Due
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle size={12} className="mr-1" />
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Format date for easier reading
  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isPast(date)) return `${format(date, 'MMM d, yyyy')} (Completed)`;
    return format(date, 'MMM d, yyyy');
  };
  
  // Get member by ID
  const getMember = (id: number) => {
    return familyMembers.find(member => member.id === id) || { name: 'Unknown', relationship: '' };
  };
  
  // Group vaccinations by family member
  const vaccinationsByMember = vaccinations.reduce((acc, vaccination) => {
    const memberId = vaccination.memberId;
    if (!acc[memberId]) {
      acc[memberId] = [];
    }
    acc[memberId].push(vaccination);
    return acc;
  }, {} as Record<number, typeof vaccinations>);
  
  // Calculate upcoming vaccinations
  const upcomingVaccinations = vaccinations.filter(
    v => (v.status === 'scheduled' || v.status === 'due') && !isPast(v.date)
  ).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3);

  return (
    <div>
      <h3 className="text-sm font-medium flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Syringe className="h-4 w-4 mr-1 text-[#006D77]" />
          Vaccination Schedule
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </Button>
      </h3>
      
      {upcomingVaccinations.length > 0 && !expanded && (
        <div className="space-y-2 mb-3">
          {upcomingVaccinations.map((vaccination) => {
            const member = getMember(vaccination.memberId);
            return (
              <div key={vaccination.id} className="p-2 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{vaccination.type}</div>
                    <div className="text-xs">
                      <span className="text-gray-600">{member.name}</span> • 
                      <span className="ml-1">{formatDate(vaccination.date)}</span>
                    </div>
                  </div>
                  {getVaccinationStatus(vaccination.status)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {expanded && (
        <div className="space-y-4 mt-3">
          <div className="p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4]">
            <h4 className="font-medium mb-2">Family Vaccination Coverage</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Routine Vaccinations</span>
                  <span className="font-medium text-green-600">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Seasonal Vaccinations</span>
                  <span className="font-medium text-amber-600">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Travel Vaccinations</span>
                  <span className="font-medium text-blue-600">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(vaccinationsByMember).map(([memberId, memberVaccinations]) => {
              const member = getMember(parseInt(memberId));
              return (
                <div key={memberId} className="border rounded-md p-3">
                  <h4 className="font-medium mb-2">{member.name}</h4>
                  <div className="space-y-2">
                    {memberVaccinations.map(vaccination => (
                      <div key={vaccination.id} className="flex justify-between items-start p-2 bg-gray-50 rounded-md">
                        <div>
                          <div className="flex items-center">
                            <Syringe size={14} className="mr-1 text-gray-600" />
                            <span className="font-medium text-sm">{vaccination.type}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <Calendar size={12} className="inline mr-1" />
                            {formatDate(vaccination.date)}
                          </div>
                          {vaccination.notes && (
                            <div className="text-xs text-gray-600 mt-1">
                              <Info size={12} className="inline mr-1" />
                              {vaccination.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {getVaccinationStatus(vaccination.status)}
                          {vaccination.location && (
                            <div className="text-xs text-gray-500 mt-1">
                              {vaccination.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-[#006D77] text-[#006D77]"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Vaccination Record
          </Button>
        </div>
      )}
      
      {!expanded && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs h-7 mt-1"
          onClick={() => setExpanded(true)}
        >
          View Complete Schedule
        </Button>
      )}
    </div>
  );
};

export default VaccinationSchedule;
