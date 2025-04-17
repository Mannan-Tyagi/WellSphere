import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Download, Camera, Share2, ShieldCheck } from 'lucide-react';

// In a real app, you would use a QR code library
// This is just a placeholder for demonstration
const QRCodeDisplay = () => (
  <div className="bg-white w-48 h-48 mx-auto border-2 border-[#006D77] rounded-md flex items-center justify-center">
    <div className="w-40 h-40 bg-[url('/qr-placeholder.svg')] bg-contain bg-no-repeat bg-center"></div>
  </div>
);

const QRCodeWidget = () => {
  const [activeTab, setActiveTab] = useState('generate');
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <QrCode className="mr-2 h-5 w-5" />
          Medical QR Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="scan">Scan QR</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="flex flex-col items-center">
            <div className="p-2 bg-[#F0F9FA] rounded-lg text-sm text-[#006D77] mb-4 text-center">
              <p className="flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 mr-1" />
                Secure, encrypted access to your medical records
              </p>
            </div>
            
            <QRCodeDisplay />
            
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Present this code to healthcare providers for quick, secure access to your medical records.</p>
            </div>
            
            <div className="mt-4 flex justify-center space-x-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA]"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA]"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 w-full">
              <h4 className="font-medium mb-1">This QR code provides access to:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Emergency contact information</li>
                <li>Current medications</li>
                <li>Allergies and conditions</li>
                <li>Recent lab results</li>
                <li>Insurance details</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs text-gray-400 italic text-center">
              Code expires in 24 hours for security. Generated on: {new Date().toLocaleString()}
            </div>
          </TabsContent>
          
          <TabsContent value="scan" className="flex flex-col items-center">
            <div className="p-2 bg-[#F0F9FA] rounded-lg text-sm text-[#006D77] mb-4 text-center">
              <p>Scan another patient's or doctor's QR code</p>
            </div>
            
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Camera access required</p>
            </div>
            
            <Button className="mt-4 bg-[#006D77] hover:bg-[#00585F]">
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>You can scan QR codes from:</p>
              <ul className="mt-2 space-y-1">
                <li>• Healthcare providers to quickly connect</li>
                <li>• Family members to access shared records</li>
                <li>• Medical documents for instant import</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QRCodeWidget;
