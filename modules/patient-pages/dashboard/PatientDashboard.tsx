"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MessageSquare,
  FileText,
  Users,
  Plus,
  Bell,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import widgets
import HealthSummaryWidget from './HealthSummaryWidget';
import HealthRiskAssessment from './HealthRiskAssessment';
import MedicationTracker from './MedicationTracker';
import FamilyHealthOverview from './FamilyHealthOverview';
import AppointmentsWidget from './AppointmentsWidget';
import MessageNotificationsWidget from './MessageNotificationsWidget';
import MedicalRecordsWidget from './MedicalRecordsWidget';

export default function PatientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Refresh dashboard data
  const refreshDashboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006D77] to-[#2A9D8F] rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-serif">{greeting}, Emma</h1>
            <p className="text-white/80 mt-1">Here's your health summary</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link href="/patient/appointments/book">
              <Button className="bg-white/90 hover:bg-white text-[#006D77]">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
              onClick={refreshDashboard}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <QuickActionCard 
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
          title="Upcoming Appointment"
          description="Dr. Johnson, Tomorrow 10:00 AM"
          actionText="View Details"
          href="/patient/appointments"
          urgent={false}
        />
        <QuickActionCard 
          icon={<MessageSquare className="h-6 w-6 text-green-500" />}
          title="New Messages"
          description="3 unread messages from your healthcare team"
          actionText="Open Messages"
          href="/patient/messages"
          urgent={true}
        />
        <QuickActionCard 
          icon={<FileText className="h-6 w-6 text-purple-500" />}
          title="New Lab Results"
          description="Blood work results are available"
          actionText="View Report"
          href="/patient/records?tab=labs"
          urgent={false}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Primary Health Information */}
        <div className="lg:col-span-2 space-y-6">
          <HealthSummaryWidget />
          <MedicationTracker />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Appointments</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <AppointmentsWidget />
            </TabsContent>
            <TabsContent value="messages">
              <MessageNotificationsWidget />
            </TabsContent>
            <TabsContent value="records">
              <MedicalRecordsWidget />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Secondary Information and Alerts */}
        <div className="space-y-6">
          <HealthRiskAssessment />
          <FamilyHealthOverview />
          <Card className="border-[#E8F3F4] hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-[#006D77]" />
                  Notifications
                </h3>
                <PatientNotificationsList />
                <Link href="/patient/notifications" className="text-sm text-[#006D77] hover:underline flex items-center justify-end mt-2">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, title, description, actionText, href, urgent }) {
  return (
    <Link href={href}>
      <Card className={`hover:shadow-md transition-all ${urgent ? 'border-amber-300 bg-amber-50' : 'border-[#E8F3F4]'}`}>
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-white border flex-shrink-0 mr-3">
              {icon}
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
              <div className="mt-2">
                <span className="text-[#006D77] text-sm font-medium flex items-center">
                  {actionText} <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Patient Notifications List Component
function PatientNotificationsList() {
  const notifications = [
    {
      id: 1,
      title: 'Prescription Refill Ready',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Appointment Reminder: Dr. Johnson',
      time: 'Yesterday',
      read: true
    },
    {
      id: 3,
      title: 'Insurance Claim Processed',
      time: '2 days ago',
      read: true
    }
  ];

  return (
    <div className="space-y-3">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`p-3 rounded-md border text-sm ${notification.read ? 'bg-white' : 'bg-[#F0F9FA] border-[#006D77]/20'}`}
        >
          <div className="flex justify-between">
            <span className="font-medium">{notification.title}</span>
            <span className="text-xs text-gray-500">{notification.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
