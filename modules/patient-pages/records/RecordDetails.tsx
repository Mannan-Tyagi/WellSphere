"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  Download, 
  Share2, 
  QrCode, 
  Printer, 
  Copy, 
  Eye, 
  Lock,
  Shield,
  Building,
  User,
  Info
} from 'lucide-react';

interface RecordDetailsProps {
  recordId: string;
  recordData: any;
  onClose: () => void;
}

const RecordDetails = ({ recordId, recordData, onClose }: RecordDetailsProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showQR, setShowQR] = useState(false);

  // This would come from an API in a real implementation
  const accessHistory = [
    { 
      accessedBy: 'Dr. Sarah Reynolds',
      organization: 'City General Hospital',
      date: '2024-03-15',
      purpose: 'Treatment'
    },
    { 
      accessedBy: 'Quest Diagnostics Lab',
      organization: 'Quest Diagnostics',
      date: '2024-02-22',
      purpose: 'Lab Comparison'
    }
  ];

  const renderRecordContent = () => {
    if (!recordData) return <p>No record data available</p>;

    switch (recordData.type) {
      case 'lab':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Test Name</div>
                <div className="font-medium">{recordData.title}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="font-medium">{new Date(recordData.date).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Results</div>
              <div className="font-medium">{recordData.summary}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Related Conditions</div>
              <div className="flex flex-wrap gap-2">
                {recordData.relatedConditions.map((condition, index) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Provider</div>
              <div className="font-medium">{recordData.provider}</div>
            </div>
          </div>
        );
        
      case 'imaging':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-md flex items-center justify-center">
              <FileText className="h-16 w-16 text-gray-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Study Type</div>
                <div className="font-medium">{recordData.title}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="font-medium">{new Date(recordData.date).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Findings</div>
              <div className="font-medium">{recordData.summary}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Provider</div>
              <div className="font-medium">{recordData.provider}</div>
            </div>
          </div>
        );
        
      case 'visit':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Visit Type</div>
                <div className="font-medium">{recordData.title}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="font-medium">{new Date(recordData.date).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Provider</div>
              <div className="font-medium">{recordData.provider}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Summary</div>
              <div className="font-medium">{recordData.summary}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Related Conditions</div>
              <div className="flex flex-wrap gap-2">
                {recordData.relatedConditions.map((condition, index) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Follow-up</div>
              <div className="font-medium">Recommended in 3 months</div>
            </div>
          </div>
        );
        
      case 'medication':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Medication</div>
                <div className="font-medium">{recordData.title}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500 mb-1">Date Prescribed</div>
                <div className="font-medium">{new Date(recordData.date).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Dosage & Instructions</div>
              <div className="font-medium">{recordData.summary}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Provider</div>
              <div className="font-medium">{recordData.provider}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Related Conditions</div>
              <div className="flex flex-wrap gap-2">
                {recordData.relatedConditions.map((condition, index) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return <p>Record details not available for this type</p>;
    }
  };

  return (
    <Dialog open={!!recordData} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {recordData?.type === 'lab' && <FileText className="mr-2 h-5 w-5 text-purple-500" />}
            {recordData?.type === 'imaging' && <FileText className="mr-2 h-5 w-5 text-blue-500" />}
            {recordData?.type === 'visit' && <FileText className="mr-2 h-5 w-5 text-green-500" />}
            {recordData?.type === 'medication' && <FileText className="mr-2 h-5 w-5 text-rose-500" />}
            {recordData?.title}
          </DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>
              {recordData?.provider} • {recordData && new Date(recordData.date).toLocaleDateString()}
            </span>
            <Badge>
              {recordData?.category}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="access">Access History</TabsTrigger>
            <TabsTrigger value="share">Share Record</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            {renderRecordContent()}
          </TabsContent>
          
          <TabsContent value="access" className="space-y-4">
            <div className="text-sm text-gray-500 mb-2">
              This record has been accessed by the following:
            </div>
            
            <div className="space-y-3">
              {accessHistory.map((access, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        {access.accessedBy.includes('Dr.') ? (
                          <User className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Building className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{access.accessedBy}</div>
                        <div className="text-xs text-gray-500">{access.organization}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {access.date}
                    </div>
                  </div>
                  <div className="mt-2 text-xs flex items-center">
                    <Info className="h-3 w-3 mr-1 text-gray-400" />
                    Purpose: {access.purpose}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 flex items-center mt-2">
              <Lock className="h-3 w-3 mr-1" />
              All access to your medical records is logged for security and compliance purposes.
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-4">
            {showQR ? (
              <div className="flex flex-col items-center p-4">
                <div className="bg-white p-3 rounded-md mb-3 border">
                  <div className="w-48 h-48 bg-[#E8F3F4] flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-[#006D77]" />
                  </div>
                </div>
                
                <div className="text-sm text-center mb-4">
                  Scan this QR code to access this specific medical record securely.
                  <div className="text-xs text-gray-500 mt-1">
                    This temporary access expires in 24 hours.
                  </div>
                </div>
                
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs">
                    <Printer className="h-3 w-3 mr-1" />
                    Print
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Share Options</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setShowQR(true)}
                      className="bg-[#006D77] hover:bg-[#006D77]/90 justify-start"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share via Message
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Secure Link
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Record
                    </Button>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm">
                  <div className="flex items-center font-medium text-amber-800 mb-1">
                    <Shield className="h-4 w-4 mr-1 text-amber-500" />
                    Privacy Information
                  </div>
                  <p className="text-amber-700 text-xs">
                    All sharing options are secure and encrypted. Shared access can be revoked at any time 
                    from your access log. QR codes automatically expire after their set duration.
                  </p>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex sm:justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            Record ID: {recordId}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button className="bg-[#006D77] hover:bg-[#006D77]/90">
              <Printer className="h-4 w-4 mr-2" />
              Print Record
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordDetails;
