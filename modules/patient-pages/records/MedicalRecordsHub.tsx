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
  Share2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
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

  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedShareOptions, setSelectedShareOptions] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const openDocument = (document) => {
    setSelectedDocument(document);
    setIsPdfViewerOpen(true);
  };

  const handleQrScan = (result) => {
    if (result) {
      setQrValue(result);
      console.log('Fetching records with ID:', result);
      setShowQrScanner(false);
    }
  };

  const filterRecords = (records) => {
    if (!records) return [];
    
    return records.filter(record => {
      if (dateRange.from && record.date < dateRange.from) return false;
      if (dateRange.to && record.date > dateRange.to) return false;
      if (searchKeyword && !record.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
      return true;
    });
  };

  const toggleShareOption = (option) => {
    setSelectedShareOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleShareRecords = () => {
    console.log('Sharing records with options:', selectedShareOptions);
    setShowShareModal(false);
    setSelectedShareOptions([]);
  };

  const renderQrScanner = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Scan QR Code</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowQrScanner(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-gray-100 h-64 flex items-center justify-center rounded-md mb-4 relative">
          <div className="text-center">
            <QrCode className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Camera access required for scanning</p>
          </div>
          
          <div className="absolute inset-0 border-2 border-[#006D77] rounded-md">
            <div className="h-0.5 bg-[#006D77] w-full absolute top-1/2 animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Position the QR code within the scanner. The code will be detected automatically.
          </p>
          
          <p className="text-sm text-gray-600">
            Or enter the record ID manually:
          </p>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Enter record ID" 
              value={qrValue} 
              onChange={e => setQrValue(e.target.value)}
              className="bg-white"
            />
            <Button 
              className="bg-[#006D77] hover:bg-[#005A64]"
              onClick={() => setShowQrScanner(false)}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Share Medical Records</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Select Recipients</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="share-doctor" 
                  checked={selectedShareOptions.includes('doctor')}
                  onCheckedChange={() => toggleShareOption('doctor')}
                />
                <label htmlFor="share-doctor" className="ml-2 text-sm">
                  My Healthcare Providers
                </label>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="share-family" 
                  checked={selectedShareOptions.includes('family')}
                  onCheckedChange={() => toggleShareOption('family')}
                />
                <label htmlFor="share-family" className="ml-2 text-sm">
                  Family Members
                </label>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="share-other" 
                  checked={selectedShareOptions.includes('other')}
                  onCheckedChange={() => toggleShareOption('other')}
                />
                <label htmlFor="share-other" className="ml-2 text-sm">
                  Other (Email)
                </label>
              </div>
              
              {selectedShareOptions.includes('other') && (
                <Input 
                  placeholder="Enter email address" 
                  className="mt-2 bg-white"
                />
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Access Duration</h4>
            <Select defaultValue="7days">
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hr">24 hours</SelectItem>
                <SelectItem value="7days">7 days</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-3 border-t">
            <h4 className="text-sm font-medium mb-2">Select Records to Share</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="share-all" 
                  checked={selectedShareOptions.includes('all-records')}
                  onCheckedChange={() => toggleShareOption('all-records')}
                />
                <label htmlFor="share-all" className="ml-2 text-sm">
                  All Records
                </label>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="share-lab" 
                  checked={selectedShareOptions.includes('lab-results')}
                  onCheckedChange={() => toggleShareOption('lab-results')}
                />
                <label htmlFor="share-lab" className="ml-2 text-sm">
                  Lab Results Only
                </label>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="share-imaging" 
                  checked={selectedShareOptions.includes('imaging')}
                  onCheckedChange={() => toggleShareOption('imaging')}
                />
                <label htmlFor="share-imaging" className="ml-2 text-sm">
                  Imaging Results Only
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowShareModal(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#006D77] hover:bg-[#005A64]"
              onClick={handleShareRecords}
              disabled={selectedShareOptions.length === 0}
            >
              Share Records
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const sampleDocument = {
    title: 'Complete Blood Count - March 2024',
    url: '/sample-documents/cbc-report.pdf'
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
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
      
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          className="bg-white"
          onClick={() => setShowQrScanner(true)}
        >
          <QrCode size={16} className="mr-2" />
          Scan QR
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9"
        >
          <Upload size={16} className="mr-2" />
          Upload Records
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9"
          onClick={() => setShowShareModal(true)}
        >
          <Share2 size={16} className="mr-2" />
          Share Records
        </Button>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search records..." 
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="pl-9 bg-white" 
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start bg-white">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select defaultValue="citygeneral">
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="citygeneral">City General Hospital</SelectItem>
              <SelectItem value="quest">Quest Diagnostics</SelectItem>
              <SelectItem value="family">Family Medical Group</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Record Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lab">Lab Results</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
              <SelectItem value="prescriptions">Prescriptions</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

      {showQrScanner && renderQrScanner()}
      {showShareModal && renderShareModal()}
    </div>
  );
}
