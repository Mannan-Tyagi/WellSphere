"use client";

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Filter, 
  Search, 
  Upload, 
  QrCode, 
  Share2, 
  Calendar,
  Download,
  Bookmark,
  Plus,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MedicalRecordsHub } from '@/modules/patient-pages/records/MedicalRecordsHub';

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [recordIdInput, setRecordIdInput] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingEmail, setSharingEmail] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanningStatus, setScanningStatus] = useState('idle'); // idle, scanning, success, error
  
  const fileInputRef = useRef(null);

  // Mock medical records data
  const records = [
    {
      id: 'MR12345',
      title: 'Blood Test Results',
      date: '2023-06-01',
      provider: 'General Hospital Lab',
      type: 'lab',
      format: 'pdf',
      size: '1.2 MB'
    },
    {
      id: 'MR12346',
      title: 'Chest X-Ray',
      date: '2023-05-15',
      provider: 'City Radiology',
      type: 'imaging',
      format: 'dicom',
      size: '8.7 MB'
    },
    {
      id: 'MR12347',
      title: 'Annual Physical Examination',
      date: '2023-04-22',
      provider: 'Dr. Johnson',
      type: 'report',
      format: 'pdf',
      size: '0.8 MB'
    },
    {
      id: 'MR12348',
      title: 'Lisinopril Prescription',
      date: '2023-06-05',
      provider: 'Dr. Smith',
      type: 'prescription',
      format: 'pdf',
      size: '0.3 MB'
    },
    {
      id: 'MR12349',
      title: 'Cardiac Assessment',
      date: '2023-03-12',
      provider: 'Cardiac Center',
      type: 'report',
      format: 'pdf',
      size: '2.1 MB'
    }
  ];

  // Filter records based on active tab, search term, and date
  const filteredRecords = records.filter(record => {
    const matchesTab = activeTab === 'all' || record.type === activeTab;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || record.date === filterDate;
    
    return matchesTab && matchesSearch && matchesDate;
  });

  // Handle record selection for sharing/downloading
  const toggleRecordSelection = (recordId) => {
    if (selectedRecords.includes(recordId)) {
      setSelectedRecords(selectedRecords.filter(id => id !== recordId));
    } else {
      setSelectedRecords([...selectedRecords, recordId]);
    }
  };

  // Simulate QR scanning process
  const handleQrScan = () => {
    setScanningStatus('scanning');
    setTimeout(() => {
      setScanningStatus('success');
      setTimeout(() => {
        setShowQrScanner(false);
        setScanningStatus('idle');
        // Add a new "discovered" record
        setRecordIdInput('');
      }, 1500);
    }, 2000);
  };

  // Handle manual record ID input
  const handleRecordIdSubmit = () => {
    if (!recordIdInput) return;
    // Simulate loading/fetching process
    setRecordIdInput('');
    // In a real app, we would fetch the record data here
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    // Simulate file upload
    // In a real app, we would upload the files to the server here
    console.log('Uploading files:', files);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle record share
  const handleShareRecords = () => {
    console.log('Sharing records with:', sharingEmail);
    console.log('Records shared:', selectedRecords);
    setSharingEmail('');
    setShowShareModal(false);
    setSelectedRecords([]);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#006D77]">Medical Records</h1>
          <p className="text-gray-600 mt-1">
            Access, manage, and share your medical records securely
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={() => setShowQrScanner(true)}
          >
            <QrCode size={16} className="mr-2" />
            Scan QR Code
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} className="mr-2" />
            Upload Records
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.dicom"
            />
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={() => setShowShareModal(true)}
            disabled={selectedRecords.length === 0}
          >
            <Share2 size={16} className="mr-2" />
            Share Records
          </Button>
          
          <Button className="bg-[#006D77] hover:bg-[#00585F]">
            <Plus size={16} className="mr-2" />
            Add Record Manually
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search records by title, provider, or ID..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="report">Reports</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <RecordsTable 
            records={filteredRecords} 
            selectedRecords={selectedRecords}
            toggleSelection={toggleRecordSelection}
          />
        </TabsContent>
        
        <TabsContent value="lab" className="mt-0">
          <RecordsTable 
            records={filteredRecords} 
            selectedRecords={selectedRecords}
            toggleSelection={toggleRecordSelection}
          />
        </TabsContent>
        
        <TabsContent value="imaging" className="mt-0">
          <RecordsTable 
            records={filteredRecords} 
            selectedRecords={selectedRecords}
            toggleSelection={toggleRecordSelection}
          />
        </TabsContent>
        
        <TabsContent value="report" className="mt-0">
          <RecordsTable 
            records={filteredRecords} 
            selectedRecords={selectedRecords}
            toggleSelection={toggleRecordSelection}
          />
        </TabsContent>
        
        <TabsContent value="prescription" className="mt-0">
          <RecordsTable 
            records={filteredRecords} 
            selectedRecords={selectedRecords}
            toggleSelection={toggleRecordSelection}
          />
        </TabsContent>
      </Tabs>

      {/* QR Scanner Modal */}
      <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code or Enter Record ID</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4">
            {scanningStatus === 'idle' && (
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Position the QR code within the frame</p>
                  <Button 
                    className="mt-3 bg-[#006D77] hover:bg-[#00585F]"
                    onClick={handleQrScan}
                  >
                    Start Scanning
                  </Button>
                </div>
              </div>
            )}
            
            {scanningStatus === 'scanning' && (
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="h-12 w-12 border-4 border-[#006D77] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Scanning...</p>
                </div>
              </div>
            )}
            
            {scanningStatus === 'success' && (
              <div className="h-64 bg-green-50 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Record found!</p>
                  <p className="text-green-600">Processing record...</p>
                </div>
              </div>
            )}
            
            {scanningStatus === 'error' && (
              <div className="h-64 bg-red-50 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 font-medium">QR code not recognized</p>
                  <p className="text-red-600">Please try again or enter the record ID manually</p>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Label htmlFor="recordId">Or enter a record ID manually:</Label>
              <div className="flex mt-1 gap-2">
                <Input 
                  id="recordId" 
                  placeholder="Enter record ID (e.g., MR12345)" 
                  value={recordIdInput}
                  onChange={(e) => setRecordIdInput(e.target.value)}
                />
                <Button 
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={handleRecordIdSubmit}
                  disabled={!recordIdInput}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Records Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Medical Records</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="shareEmail">Share with:</Label>
              <Input 
                id="shareEmail" 
                type="email" 
                placeholder="Enter email address" 
                className="mt-1"
                value={sharingEmail}
                onChange={(e) => setSharingEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Selected Records:</Label>
              <div className="mt-1 border rounded-md p-2">
                {selectedRecords.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRecords.map(id => {
                      const record = records.find(r => r.id === id);
                      return (
                        <div key={id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span>{record?.title}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleRecordSelection(id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-2">No records selected</p>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Recipients will receive a secure link to access these records. 
                You can set an expiration date for this link and revoke access at any time.
              </p>
            </div>
            
            <div className="pt-2 flex justify-between">
              <Button variant="outline" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#006D77] hover:bg-[#00585F]"
                onClick={handleShareRecords}
                disabled={!sharingEmail || selectedRecords.length === 0}
              >
                Share Records
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Records Table Component
function RecordsTable({ records, selectedRecords, toggleSelection }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-md">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No records found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left w-10">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={records.length > 0 && records.every(r => selectedRecords.includes(r.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    toggleSelection(records.map(r => r.id));
                  } else {
                    toggleSelection(records.map(r => r.id));
                  }
                }}
              />
            </th>
            <th className="px-4 py-3 text-left">Record</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Provider</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  checked={selectedRecords.includes(record.id)}
                  onChange={() => toggleSelection(record.id)}
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{record.title}</div>
                <div className="text-xs text-gray-500">{record.id}</div>
              </td>
              <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">{record.provider}</td>
              <td className="px-4 py-3">
                {record.type === 'lab' && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">Lab</Badge>
                )}
                {record.type === 'imaging' && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Imaging</Badge>
                )}
                {record.type === 'report' && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">Report</Badge>
                )}
                {record.type === 'prescription' && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">Prescription</Badge>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bookmark size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
