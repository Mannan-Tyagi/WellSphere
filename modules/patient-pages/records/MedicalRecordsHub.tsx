"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  FileText, 
  QrCode, 
  Search, 
  TimerReset, 
  Upload,
  Activity,
  Filter,
  ListFilter,
  Calendar,
  FlaskConical,
  Image as ImageIcon,
  Pill,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RecordsQRGenerator from './RecordsQRGenerator';
import RecordsCategorization from './RecordsCategorization';
import ChronicConditionTimeline from './ChronicConditionTimeline';
import SmartRecordsSearch from './SmartRecordsSearch';
import LabResultsVisualization from './LabResultsVisualization';
import RecordsAccessLog from './RecordsAccessLog';
import PDFViewer from './PDFViewer';

export function MedicalRecordsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expiringRecords, setExpiringRecords] = useState(3);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const openDocument = (document) => {
    setSelectedDocument(document);
    setIsPdfViewerOpen(true);
  };

  // Example document to view
  const sampleDocument = {
    title: 'Complete Blood Count - March 2024',
    url: '/sample-documents/cbc-report.pdf'
  };

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

      {/* Global filtering controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="All providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              <SelectItem value="citygeneral">City General Hospital</SelectItem>
              <SelectItem value="quest">Quest Diagnostics</SelectItem>
              <SelectItem value="family">Family Medical Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" className="h-9 ml-auto">
          <Upload size={16} className="mr-2" />
          Upload Records
        </Button>
        
        <Button variant="outline" size="sm" className="h-9">
          <Share2 size={16} className="mr-2" />
          Share Records
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="timeline">Conditions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="share">Share Records</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
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
                <RecordsCategorization onViewDocument={openDocument} />
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

        <TabsContent value="labs">
          <LabResultsVisualization />
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

        <TabsContent value="documents">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-[#006D77]">Medical Documents</h2>
                <div className="flex items-center bg-[#F0F9FA] px-3 py-1 rounded-full text-sm text-[#006D77]">
                  <FileText size={14} className="mr-1" />
                  42 documents
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter size={16} />
                  Categories
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter size={16} />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDocument(sampleDocument)}>
                <CardContent className="p-0">
                  <div className="bg-[#F0F9FA] p-3 flex items-center justify-center border-b">
                    <FlaskConical size={24} className="text-[#006D77]" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Complete Blood Count</h3>
                    <div className="mt-1 text-sm text-gray-500 flex justify-between">
                      <span>March 15, 2024</span>
                      <span>City General Hospital</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDocument(sampleDocument)}>
                <CardContent className="p-0">
                  <div className="bg-gray-100 p-3 flex items-center justify-center border-b">
                    <ImageIcon size={24} className="text-blue-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Chest X-Ray</h3>
                    <div className="mt-1 text-sm text-gray-500 flex justify-between">
                      <span>February 10, 2024</span>
                      <span>Westside Imaging</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDocument(sampleDocument)}>
                <CardContent className="p-0">
                  <div className="bg-pink-50 p-3 flex items-center justify-center border-b">
                    <Pill size={24} className="text-rose-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Prescription - Lisinopril</h3>
                    <div className="mt-1 text-sm text-gray-500 flex justify-between">
                      <span>January 22, 2024</span>
                      <span>Dr. Johnson</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* PDF Viewer Dialog */}
          {selectedDocument && (
            <PDFViewer 
              documentUrl={selectedDocument.url}
              documentTitle={selectedDocument.title}
              isOpen={isPdfViewerOpen}
              onClose={() => setIsPdfViewerOpen(false)}
            />
          )}
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
      
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold text-[#006D77] mb-4">Access Records History</h2>
        <Card>
          <CardContent className="p-6">
            <RecordsAccessLog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
