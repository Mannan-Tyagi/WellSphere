"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Shield, Download, Share2, Camera, QrCode, RefreshCw } from 'lucide-react';
import QRCode from 'react-qr-code';

const RecordsQRGenerator = () => {
  const [generatedQR, setGeneratedQR] = useState(false);
  const [accessDuration, setAccessDuration] = useState("24hr");
  const [accessLevel, setAccessLevel] = useState("partial");
  const [selectedRecords, setSelectedRecords] = useState({
    labs: true,
    medications: true,
    visits: true,
    imaging: false,
    allergies: true,
    vaccinations: false,
    surgeries: false,
  });

  // This would be replaced with actual data from API in a real implementation
  const recordTypes = {
    labs: { count: 12, recent: "Blood Panel (1 week ago)" },
    medications: { count: 5, recent: "Lisinopril (Current)" },
    visits: { count: 8, recent: "Cardiology Checkup (2 weeks ago)" },
    imaging: { count: 3, recent: "Chest X-Ray (3 months ago)" },
    allergies: { count: 2, recent: "Penicillin, Shellfish" },
    vaccinations: { count: 6, recent: "Flu Vaccine (6 months ago)" },
    surgeries: { count: 1, recent: "Appendectomy (5 years ago)" },
  };

  const toggleRecordType = (type) => {
    setSelectedRecords({
      ...selectedRecords,
      [type]: !selectedRecords[type],
    });
  };

  const handleGenerate = () => {
    // In a real implementation, this would generate a secure token
    // with encryption and store the access settings in a database
    setGeneratedQR(true);
  };

  const getQRValue = () => {
    // In a real implementation, this would be an encrypted token with access control info
    const recordsIncluded = Object.entries(selectedRecords)
      .filter(([_, included]) => included)
      .map(([type]) => type);
    
    const qrData = {
      patientId: "P12345",
      accessLevel,
      accessDuration,
      records: recordsIncluded,
      generatedAt: new Date().toISOString(),
      expiresAt: getExpirationDate(accessDuration),
    };
    
    return JSON.stringify(qrData);
  };
  
  const getExpirationDate = (duration) => {
    const now = new Date();
    switch (duration) {
      case "24hr":
        return new Date(now.setHours(now.getHours() + 24)).toISOString();
      case "7days":
        return new Date(now.setDate(now.getDate() + 7)).toISOString();
      case "30days":
        return new Date(now.setDate(now.getDate() + 30)).toISOString();
      default:
        return new Date(now.setHours(now.getHours() + 24)).toISOString();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#006D77] mb-4">Generate Access QR Code</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Access Level</h3>
              <RadioGroup value={accessLevel} onValueChange={setAccessLevel} className="flex flex-col space-y-2">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="full" className="font-medium">Full Access</Label>
                    <p className="text-sm text-gray-500">Share complete medical history with all details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="partial" className="font-medium">Custom Access</Label>
                    <p className="text-sm text-gray-500">Select specific records to share</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="emergency" id="emergency" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="emergency" className="font-medium">Emergency Only</Label>
                    <p className="text-sm text-gray-500">Critical information only (allergies, medications, conditions)</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {accessLevel === "partial" && (
              <div>
                <h3 className="text-sm font-medium mb-3">Select Records to Share</h3>
                <div className="space-y-3">
                  {Object.entries(recordTypes).map(([type, info]) => (
                    <div key={type} className="flex items-start space-x-2">
                      <Checkbox 
                        id={type} 
                        checked={selectedRecords[type]} 
                        onCheckedChange={() => toggleRecordType(type)}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={type} className="font-medium capitalize">{type} ({info.count})</Label>
                        <p className="text-xs text-gray-500">Most recent: {info.recent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-3">Access Duration</h3>
              <Select value={accessDuration} onValueChange={setAccessDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hr">24 hours</SelectItem>
                  <SelectItem value="7days">7 days</SelectItem>
                  <SelectItem value="30days">30 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Access will automatically expire after this period for security
              </p>
            </div>
            
            <Button onClick={handleGenerate} className="w-full bg-[#006D77] hover:bg-[#005A64]">
              <QrCode className="h-4 w-4 mr-2" />
              Generate Secure QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          {!generatedQR ? (
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No QR Code Generated</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Configure your access settings and generate a QR code to share your medical records securely
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4 border">
                <QRCode 
                  value={getQRValue()}
                  size={200}
                  level="H"
                />
              </div>
              
              <div className="flex items-center text-xs text-gray-600 mb-4">
                <Shield className="h-3 w-3 mr-1 text-[#006D77]" />
                Encrypted and expires in {accessDuration === "24hr" ? "24 hours" : 
                  accessDuration === "7days" ? "7 days" : "30 days"}
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" className="flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="mt-4 text-sm text-gray-500"
                onClick={() => setGeneratedQR(false)}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Configure New QR Code
              </Button>
              
              <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-100 w-full">
                <h4 className="font-medium text-sm flex items-center text-amber-800">
                  <Shield className="h-4 w-4 mr-1 text-amber-500" />
                  Security Notice
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  This QR code provides temporary access to your selected medical records. 
                  Only share with trusted healthcare providers.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordsQRGenerator;
