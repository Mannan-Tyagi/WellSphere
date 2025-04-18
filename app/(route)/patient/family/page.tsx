"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Plus, Calendar, Pill, Activity, Brain, Ruler, 
  ArrowRight, Shield, AlertCircle, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import FamilyMembersManager from '@/modules/patient-pages/family/FamilyMembersManager';

export default function FamilyHealthPage() {
  const router = useRouter();
  
  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Family Health Management</h1>
          <p className="text-gray-600 mt-1">Coordinate care and manage medications for your entire family</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/patient/family/add">
            <Button className="bg-[#006D77] hover:bg-[#00585F]">
              <Plus size={16} className="mr-2" />
              Add Family Member
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Quick access feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card className="bg-[#F0F9FA] border-[#E8F3F4] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-12 w-12 rounded-full bg-[#E8F3F4] flex items-center justify-center text-[#006D77]">
                  <Pill size={24} />
                </div>
                <h2 className="text-lg font-bold mt-4 text-[#006D77]">Medication Management</h2>
                <p className="text-gray-600 mt-1">Unified medication tracking for all family members</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#006D77]"
                onClick={() => router.push('/patient/family/medications')}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
            <Button 
              className="w-full mt-4 bg-[#006D77] hover:bg-[#00585F]"
              onClick={() => router.push('/patient/family/medications')}
            >
              View Medication Schedule
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-[#F0F9FA] border-[#E8F3F4] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-12 w-12 rounded-full bg-[#E8F3F4] flex items-center justify-center text-[#006D77]">
                  <Brain size={24} />
                </div>
                <h2 className="text-lg font-bold mt-4 text-[#006D77]">Elderly Monitoring</h2>
                <p className="text-gray-600 mt-1">Fall detection and cognitive assessments</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#006D77]"
                onClick={() => router.push('/patient/family/elderly-monitoring')}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
            <Button 
              className="w-full mt-4 bg-[#006D77] hover:bg-[#00585F]"
              onClick={() => router.push('/patient/family/elderly-monitoring')}
            >
              Monitor Elderly Family
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-[#F0F9FA] border-[#E8F3F4] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-12 w-12 rounded-full bg-[#E8F3F4] flex items-center justify-center text-[#006D77]">
                  <Ruler size={24} />
                </div>
                <h2 className="text-lg font-bold mt-4 text-[#006D77]">Pediatric Tracking</h2>
                <p className="text-gray-600 mt-1">Growth charts and immunization records</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#006D77]"
                onClick={() => router.push('/patient/family/pediatric')}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
            <Button 
              className="w-full mt-4 bg-[#006D77] hover:bg-[#00585F]"
              onClick={() => router.push('/patient/family/pediatric')}
            >
              Track Child Development
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Important alerts and reminders */}
      <div className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
          <AlertCircle size={24} className="text-amber-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-amber-800">Family Health Alerts</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center">
                <Clock size={16} className="text-amber-600 mr-2" />
                <span>Rose Wilson has a vaccination due in 5 days</span>
                <Button 
                  variant="link" 
                  className="ml-2 p-0 h-auto text-amber-800"
                  onClick={() => router.push('/patient/family/elderly-monitoring')}
                >
                  View
                </Button>
              </li>
              <li className="flex items-center">
                <Pill size={16} className="text-amber-600 mr-2" />
                <span>John Cooper missed his morning medication</span>
                <Button 
                  variant="link" 
                  className="ml-2 p-0 h-auto text-amber-800"
                  onClick={() => router.push('/patient/family/medications')}
                >
                  Resolve
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Family members list */}
      <FamilyMembersManager />
    </div>
  );
}
