"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileText, QrCode, Search, TimerReset, Upload } from 'lucide-react';
import RecordsQRGenerator from './RecordsQRGenerator';
import RecordsCategorization from './RecordsCategorization';
import ChronicConditionTimeline from './ChronicConditionTimeline';
import SmartRecordsSearch from './SmartRecordsSearch';

export function MedicalRecordsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expiringRecords, setExpiringRecords] = useState(3);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Medical Records Hub</h1>
          <p className="text-gray-600 mt-1">Securely manage and share your medical information</p>
        </div>
        
        {expiringRecords > 0 && (
          <div className="mt-2 md:mt-0 flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-md border border-amber-200">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-sm">{expiringRecords} records with expiring access</span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="share">Share Records</TabsTrigger>
          <TabsTrigger value="timeline">Timelines</TabsTrigger>
          <TabsTrigger value="search">Smart Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <FileText className="mr-2 h-5 w-5" />
                  Recent Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecordsCategorization />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <QrCode className="mr-2 h-5 w-5" />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-[#F0F9FA] rounded-lg">
                    <h3 className="font-medium mb-2">Current Shared Records</h3>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center">
                        <TimerReset className="h-4 w-4 mr-1 text-[#006D77]" />
                        2 active record shares
                      </p>
                      <p className="mt-1">Last shared: Today at 10:23 AM</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertTriangle size={16} className="text-amber-500 mr-1" />
                      Expiring Access
                    </h3>
                    <p className="text-sm text-gray-700">
                      Dr. Smith's access to your lab results expires in 2 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                  <Activity className="mr-2 h-5 w-5" />
                  Health Conditions Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChronicConditionTimeline />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="share">
          <RecordsQRGenerator />
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Activity className="mr-2 h-5 w-5" />
                Condition Timelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ChronicConditionTimeline expanded={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Search className="mr-2 h-5 w-5" />
                Smart Records Search
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SmartRecordsSearch />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Missing import, let's add it
import { Activity } from 'lucide-react';
